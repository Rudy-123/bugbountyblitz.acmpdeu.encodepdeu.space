import { google } from 'googleapis';
import { GOOGLE_SHEETS_CONFIG, SHEETS_COLUMNS, CTF_TIME_LIMIT } from './const';
import { TeamData, LeaderboardEntry } from './types';


/**
 * Initialize Google Sheets API client
 */
function getGoogleSheetsClient() {
  // Validate configuration
  if (!GOOGLE_SHEETS_CONFIG.spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is not configured in environment variables');
  }
  if (!GOOGLE_SHEETS_CONFIG.credentials.client_email) {
    throw new Error('GOOGLE_SHEETS_CLIENT_EMAIL is not configured in environment variables');
  }
  if (!GOOGLE_SHEETS_CONFIG.credentials.private_key) {
    throw new Error('GOOGLE_SHEETS_PRIVATE_KEY is not configured in environment variables');
  }

  const auth = new google.auth.JWT({
    email: GOOGLE_SHEETS_CONFIG.credentials.client_email,
    key: GOOGLE_SHEETS_CONFIG.credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Create or get the header row in the sheet
 */
async function ensureHeaders() {
  const sheets = getGoogleSheetsClient();
  
  try {
    // Check if headers exist
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
      range: `${GOOGLE_SHEETS_CONFIG.sheetName}!A1:J1`,
    });

    // If no data or empty, create headers
    if (!response.data.values || response.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
        range: `${GOOGLE_SHEETS_CONFIG.sheetName}!A1:J1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            'Team Name',
            'Start Time',
            'End Time',
            'Total Score',
            'Base Score',
            'Penalty',
            'Challenges Solved',
            'Hints Used',
            'Time Taken (ms)',
            'Status'
          ]]
        }
      });
    }
  } catch (error) {
    console.error('Error ensuring headers:', error);
    throw new Error('Failed to initialize sheet headers');
  }
}

/**
 * Save or update team data in Google Sheets
 */
export async function saveTeamData(teamData: TeamData): Promise<void> {
  const sheets = getGoogleSheetsClient();
  
  try {
    await ensureHeaders();

    // Get all existing data to find if team already exists
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
      range: `${GOOGLE_SHEETS_CONFIG.sheetName}!A:J`,
    });

    const rows = response.data.values || [];
    const teamRowIndex = rows.findIndex((row, idx) => idx > 0 && row[SHEETS_COLUMNS.TEAM_NAME] === teamData.teamName);

    const rowData = [
      teamData.teamName,
      teamData.startTime,
      teamData.endTime || '',
      teamData.totalScore,
      teamData.baseScore,
      teamData.penalty,
      teamData.challengesSolved,
      teamData.hintsUsed,
      teamData.timeTaken,
      teamData.status
    ];

    if (teamRowIndex > 0) {
      // Update existing row (teamRowIndex is 0-based, but sheets are 1-based and we skip header)
      const rowNumber = teamRowIndex + 1;
      await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
        range: `${GOOGLE_SHEETS_CONFIG.sheetName}!A${rowNumber}:J${rowNumber}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [rowData]
        }
      });
    } else {
      // Append new row
      await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
        range: `${GOOGLE_SHEETS_CONFIG.sheetName}!A:J`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [rowData]
        }
      });
    }
  } catch (error) {
    console.error('Error saving team data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to save team data to Google Sheets: ${errorMessage}`);
  }
}

/**
 * Fetch leaderboard data from Google Sheets
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const sheets = getGoogleSheetsClient();
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
      range: `${GOOGLE_SHEETS_CONFIG.sheetName}!A:J`,
    });

    const rows = response.data.values || [];
    
    // Skip header row
    const dataRows = rows.slice(1);
    
    const teams: TeamData[] = dataRows
      .filter(row => row[SHEETS_COLUMNS.TEAM_NAME]) // Filter out empty rows
      .map(row => ({
        teamName: row[SHEETS_COLUMNS.TEAM_NAME] || '',
        startTime: parseInt(row[SHEETS_COLUMNS.START_TIME]) || 0,
        endTime: row[SHEETS_COLUMNS.END_TIME] ? parseInt(row[SHEETS_COLUMNS.END_TIME]) : null,
        totalScore: parseInt(row[SHEETS_COLUMNS.TOTAL_SCORE]) || 0,
        baseScore: parseInt(row[SHEETS_COLUMNS.BASE_SCORE]) || 0,
        penalty: parseInt(row[SHEETS_COLUMNS.PENALTY]) || 0,
        challengesSolved: parseInt(row[SHEETS_COLUMNS.CHALLENGES_SOLVED]) || 0,
        hintsUsed: parseInt(row[SHEETS_COLUMNS.HINTS_USED]) || 0,
        timeTaken: parseInt(row[SHEETS_COLUMNS.TIME_TAKEN]) || 0,
        status: (row[SHEETS_COLUMNS.STATUS] || 'in_progress') as TeamData['status'],
      }));

    // Sort by: 1. Total Score (descending), 2. Time Taken (ascending)
    const sortedTeams = teams.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      return a.timeTaken - b.timeTaken;
    });

    // Add rank and time remaining
    const currentTime = Date.now();
    const leaderboard: LeaderboardEntry[] = sortedTeams.map((team, index) => {
      const timeRemaining = team.status === 'in_progress' 
        ? Math.max(0, CTF_TIME_LIMIT - (currentTime - team.startTime))
        : 0;
      
      return {
        ...team,
        rank: index + 1,
        timeRemaining,
      };
    });

    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw new Error('Failed to fetch leaderboard from Google Sheets');
  }
}

/**
 * Get specific team data
 */
export async function getTeamData(teamName: string): Promise<TeamData | null> {
  const sheets = getGoogleSheetsClient();
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
      range: `${GOOGLE_SHEETS_CONFIG.sheetName}!A:J`,
    });

    const rows = response.data.values || [];
    const teamRow = rows.find((row, idx) => idx > 0 && row[SHEETS_COLUMNS.TEAM_NAME] === teamName);

    if (!teamRow) {
      return null;
    }

    return {
      teamName: teamRow[SHEETS_COLUMNS.TEAM_NAME] || '',
      startTime: parseInt(teamRow[SHEETS_COLUMNS.START_TIME]) || 0,
      endTime: teamRow[SHEETS_COLUMNS.END_TIME] ? parseInt(teamRow[SHEETS_COLUMNS.END_TIME]) : null,
      totalScore: parseInt(teamRow[SHEETS_COLUMNS.TOTAL_SCORE]) || 0,
      baseScore: parseInt(teamRow[SHEETS_COLUMNS.BASE_SCORE]) || 0,
      penalty: parseInt(teamRow[SHEETS_COLUMNS.PENALTY]) || 0,
      challengesSolved: parseInt(teamRow[SHEETS_COLUMNS.CHALLENGES_SOLVED]) || 0,
      hintsUsed: parseInt(teamRow[SHEETS_COLUMNS.HINTS_USED]) || 0,
      timeTaken: parseInt(teamRow[SHEETS_COLUMNS.TIME_TAKEN]) || 0,
      status: (teamRow[SHEETS_COLUMNS.STATUS] || 'in_progress') as TeamData['status'],
    };
  } catch (error) {
    console.error('Error fetching team data:', error);
    throw new Error('Failed to fetch team data from Google Sheets');
  }
}
