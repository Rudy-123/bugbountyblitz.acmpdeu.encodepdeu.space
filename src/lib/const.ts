/**
 * Google Sheets Configuration
 * 
 * Setup Instructions:
 * 1. Create a Google Cloud Project: https://console.cloud.google.com/
 * 2. Enable Google Sheets API for your project
 * 3. Create a Service Account and download the JSON key file
 * 4. Share your Google Sheet with the service account email (found in the key file)
 * 5. Set environment variables in .env.local:
 *    - GOOGLE_SHEETS_PRIVATE_KEY (from the key file)
 *    - GOOGLE_SHEETS_CLIENT_EMAIL (from the key file)
 *    - GOOGLE_SHEETS_SPREADSHEET_ID (from the Sheet URL)
 */

export const GOOGLE_SHEETS_CONFIG = {
  // Get the Spreadsheet ID from the URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
  spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '',
  // The name of the sheet tab (e.g., "Leaderboard")
  sheetName: 'Leaderboard',
  // Service account credentials (keep these in environment variables for security)
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL || '',
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  },
} as const;

// Time limit for the CTF in milliseconds (1 hour)
export const CTF_TIME_LIMIT = 150 * 60 * 1000;

// Scoring configuration
export const SCORING_CONFIG = {
  // Base points are from challenges
  // Hint penalties are defined per hint in challenges.ts
  // Time-based tiebreaker: faster completion = higher rank
} as const;

// Google Sheets column structure
export const SHEETS_COLUMNS = {
  TEAM_NAME: 0,
  START_TIME: 1,
  END_TIME: 2,
  TOTAL_SCORE: 3,
  BASE_SCORE: 4,
  PENALTY: 5,
  CHALLENGES_SOLVED: 6,
  HINTS_USED: 7,
  TIME_TAKEN: 8,
  STATUS: 9, // "in_progress" or "completed"
} as const;
