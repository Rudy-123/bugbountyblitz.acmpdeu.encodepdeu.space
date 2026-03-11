import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/sheets';

export async function GET() {
  try {
    const leaderboard = await getLeaderboard();

    return NextResponse.json(
      { success: true, data: leaderboard },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Force dynamic to prevent build-time pre-rendering (Google Sheets may not be configured)
export const dynamic = 'force-dynamic';
