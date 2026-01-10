"use client";

import { useEffect, useState } from "react";
import { usePlayer } from "@/hooks/use-player";
import { challenges } from "@/lib/challenges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer } from "@/components/ctf/Timer";
import { formatDistance } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LeaderboardEntry } from "@/lib/types";

export default function ScoreboardPage() {
  const { teamName, startTime, solvedChallenges, getTotalPenalty, timeRemaining, isTimeUp } = usePlayer();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isTimeUp) return;
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isTimeUp]);

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/leaderboard', {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setLeaderboard(data.data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. Make sure Google Sheets is configured.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchLeaderboard();
    }
  }, [mounted]);

  const [score, setScore] = useState({ total: 0, base: 0, penalty: 0 });

  useEffect(() => {
    const baseScore = solvedChallenges.reduce((acc, solved) => {
      const challenge = challenges.find((c) => c.id === solved.id);
      return acc + (challenge?.points || 0);
    }, 0);
    
    const penalty = getTotalPenalty();
    const totalScore = Math.max(0, baseScore - penalty);
    
    setScore({ total: totalScore, base: baseScore, penalty });
  }, [solvedChallenges, getTotalPenalty]);

  const lastSolveTime = Math.max(...solvedChallenges.map(s => s.timestamp), startTime || 0);
  const totalTimeReadable = startTime ? formatDistance(startTime, lastSolveTime, { includeSeconds: true }) : "Not started";

  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const solvedCount = solvedChallenges.length;
  const totalChallenges = challenges.length;
  const progressPercentage = totalChallenges > 0 ? (solvedCount / totalChallenges) * 100 : 0;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'timeout':
        return <Badge variant="destructive">Time Up</Badge>;
      case 'in_progress':
      default:
        return <Badge variant="secondary">In Progress</Badge>;
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-headline font-bold">Scoreboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">Your progress so far.</p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Net Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary" suppressHydrationWarning>{score.total}</p>
            {score.penalty > 0 && (
              <p className="text-sm text-muted-foreground mt-1" suppressHydrationWarning>
                {score.base} - {score.penalty} penalty
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hints Used</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-600" suppressHydrationWarning>-{score.penalty}</p>
            <p className="text-sm text-muted-foreground">Point penalty</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-3xl font-bold">
                <Timer startTime={startTime} endTime={lastSolveTime} />
              </p>
              <p className="text-sm text-muted-foreground mt-1" suppressHydrationWarning>({totalTimeReadable})</p>
            </div>
            <p className="text-sm text-muted-foreground">Time to last solve.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Running Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-3xl font-bold">
                <Timer startTime={startTime} />
              </p>
              <p className="text-sm text-muted-foreground mt-1" suppressHydrationWarning>
                ({startTime ? formatDistance(startTime, currentTime, { includeSeconds: true }) : "Not started"})
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Live timer.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
            <CardTitle>Completion Progress</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex justify-between items-center mb-2">
                <p className="text-muted-foreground">Challenges Solved</p>
                <p className="font-bold" suppressHydrationWarning>
                  {isClient ? `${solvedCount} / ${totalChallenges}` : '...'}
                </p>
            </div>
            <Progress 
              value={isClient ? progressPercentage : 0} 
              className="w-full" 
              suppressHydrationWarning
            />
        </CardContent>
      </Card>

      {/* Global Leaderboard */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-headline font-semibold">🏆 Global Leaderboard</h2>
          <Button onClick={fetchLeaderboard} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading && leaderboard.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                Loading leaderboard...
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                {error}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No teams have started yet. Be the first!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Rank</TableHead>
                      <TableHead>Team Name</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Solved</TableHead>
                      <TableHead className="text-center">Hints</TableHead>
                      <TableHead className="text-center">Time</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((entry) => (
                      <TableRow 
                        key={entry.teamName} 
                        className={entry.teamName === teamName ? 'bg-accent/20 font-semibold' : ''}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getRankIcon(entry.rank)}
                            <span>#{entry.rank}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {entry.teamName}
                          {entry.teamName === teamName && (
                            <Badge variant="outline" className="ml-2">You</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-primary">{entry.totalScore}</span>
                            {entry.penalty > 0 && (
                              <span className="text-xs text-muted-foreground">
                                ({entry.baseScore} - {entry.penalty})
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center" suppressHydrationWarning>
                          {isClient ? `${entry.challengesSolved} / ${challenges.length}` : '...'}
                        </TableCell>
                        <TableCell className="text-center">{entry.hintsUsed}</TableCell>
                        <TableCell className="text-center font-mono text-sm">
                          {formatTime(entry.timeTaken)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(entry.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
