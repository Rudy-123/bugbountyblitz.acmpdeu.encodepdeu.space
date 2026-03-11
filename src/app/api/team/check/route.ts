import { NextRequest, NextResponse } from 'next/server';
import { getTeamData } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.teamName || typeof body.teamName !== 'string') {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      );
    }

    const existingTeam = await getTeamData(body.teamName);
    
    if (existingTeam) {
      return NextResponse.json(
        { exists: true, message: 'Team name already exists. Please choose a different name.' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { exists: false, message: 'Team name is available' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/team/check:', error);
    return NextResponse.json(
      { error: 'Failed to check team name', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
