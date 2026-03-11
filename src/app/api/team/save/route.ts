import { NextRequest, NextResponse } from 'next/server';
import { saveTeamData} from '@/lib/sheets';
import {type TeamData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.teamName || typeof body.teamName !== 'string') {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      );
    }

    const teamData: TeamData = {
      teamName: body.teamName,
      startTime: body.startTime || Date.now(),
      endTime: body.endTime || null,
      totalScore: body.totalScore || 0,
      baseScore: body.baseScore || 0,
      penalty: body.penalty || 0,
      challengesSolved: body.challengesSolved || 0,
      hintsUsed: body.hintsUsed || 0,
      timeTaken: body.timeTaken || 0,
      status: body.status || 'in_progress',
    };

    await saveTeamData(teamData);

    return NextResponse.json(
      { success: true, message: 'Team data saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/team/save:', error);
    return NextResponse.json(
      { error: 'Failed to save team data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
