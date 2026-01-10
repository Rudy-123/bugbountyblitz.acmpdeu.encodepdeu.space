export type ChallengeEra = 'Past' | 'Present' | 'Future';

export type Challenge = {
  id: string;
  title: string;
  era: ChallengeEra;
  points: number;
  description: string;
  longDescription?: string;
  hints: { cost: number, text: string }[];
  flag: string;
  // Optional decoy flags (server-side use). Each decoy has the fake flag and an optional message to show when submitted.
  decoyFlags?: { flag: string; message?: string }[];
  // Note: isSolved is managed client-side and merged in at runtime.
  simulation?: 'sqli' | 'xss' | 'ssrf' | 'robots' | 'dns' | 'books_api' | 'real_dns' | 'ssti';
  extraData?: {
    [key: string]: any;
  };
};

export type TeamData = {
  teamName: string;
  startTime: number;
  endTime: number | null;
  totalScore: number;
  baseScore: number;
  penalty: number;
  challengesSolved: number;
  hintsUsed: number;
  timeTaken: number;
  status: 'in_progress' | 'completed' | 'timeout';
};

export type LeaderboardEntry = TeamData & {
  rank: number;
  timeRemaining?: number;
};