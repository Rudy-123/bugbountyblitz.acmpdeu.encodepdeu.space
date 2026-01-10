"use client";

import type { Challenge } from "@/lib/types";
import React, { createContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { CTF_TIME_LIMIT } from "@/lib/const";

const isServer = typeof window === "undefined";

type SolvedChallenge = {
  id: string;
  timestamp: number;
};

type HintUsage = {
  challengeId: string;
  hintIndex: number;
  cost: number;
};

type PlayerContextType = {
  teamName: string | null;
  startTime: number | null;
  solvedChallenges: SolvedChallenge[];
  hintsUsed: HintUsage[];
  hasStarted: boolean;
  timeRemaining: number;
  isTimeUp: boolean;
  setTeamName: (name: string) => void;
  startGame: (name?: string) => void;
  endGame: () => void;
  addSolvedChallenge: (challengeId: string) => void;
  isChallengeSolved: (challengeId: string) => boolean;
  getSolveTimestamp: (challengeId: string) => number | undefined;
  useHint: (challengeId: string, hintIndex: number, cost: number) => void;
  isHintUsed: (challengeId: string, hintIndex: number) => boolean;
  getTotalPenalty: () => number;
  syncToSheets: () => Promise<void>;
};

export const PlayerContext = createContext<PlayerContextType | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [teamName, setTeamNameState] = useState<string | null>(() => {
    if (isServer) return null;
    const savedName = localStorage.getItem("ctf_teamName");
    return savedName ? JSON.parse(savedName) : null;
  });

  const [startTime, setStartTime] = useState<number | null>(() => {
    if (isServer) return null;
    const savedTime = localStorage.getItem("ctf_startTime");
    return savedTime ? JSON.parse(savedTime) : null;
  });

  const [solvedChallenges, setSolvedChallenges] = useState<SolvedChallenge[]>(() => {
    if (isServer) return [];
    const savedSolves = localStorage.getItem("ctf_solvedChallenges");
    return savedSolves ? JSON.parse(savedSolves) : [];
  });

  const [hintsUsed, setHintsUsed] = useState<HintUsage[]>(() => {
    if (isServer) return [];
    const savedHints = localStorage.getItem("ctf_hintsUsed");
    return savedHints ? JSON.parse(savedHints) : [];
  });

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isSyncing, setIsSyncing] = useState(false);
  const lastSyncRef = useRef<number>(0);
  const hasInitialSyncRef = useRef(false);
  const timeUpNotifiedRef = useRef(false);
  const warningShownRef = useRef(false);
  const finalSyncDoneRef = useRef(false);

  // Update current time every second for timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isServer) {
      if (teamName) {
        localStorage.setItem("ctf_teamName", JSON.stringify(teamName));
      } else {
        localStorage.removeItem("ctf_teamName");
      }
    }
  }, [teamName]);

  useEffect(() => {
    if (!isServer) {
      if (startTime) {
        localStorage.setItem("ctf_startTime", JSON.stringify(startTime));
      } else {
        localStorage.removeItem("ctf_startTime");
      }
    }
  }, [startTime]);

  useEffect(() => {
    if (!isServer) {
      localStorage.setItem("ctf_solvedChallenges", JSON.stringify(solvedChallenges));
    }
  }, [solvedChallenges]);

  useEffect(() => {
    if (!isServer) {
      localStorage.setItem("ctf_hintsUsed", JSON.stringify(hintsUsed));
    }
  }, [hintsUsed]);

  const setTeamName = useCallback((name: string) => {
    setTeamNameState(name);
  }, []);

  const startGame = useCallback((name?: string) => {
    const currentTeamName = name || teamName;
    if (!startTime && currentTeamName) {
      const now = Date.now();
      setStartTime(now);
      // Reset notification flags for new game
      timeUpNotifiedRef.current = false;
      warningShownRef.current = false;
      finalSyncDoneRef.current = false;
      toast({
        title: "CTF Started!",
        description: `Team ${currentTeamName}, your 1-hour timer has begun. Good luck!`,
      });
    }
  }, [startTime, teamName, toast]);

  const endGame = useCallback(() => {
    if (startTime && teamName && !timeUpNotifiedRef.current) {
      // Mark as notified to prevent duplicate toast from isTimeUp effect
      timeUpNotifiedRef.current = true;
      
      toast({
        title: "Game Ended!",
        description: `Team ${teamName}, you have ended your session. Check the scoreboard for final rankings!`,
      });
      
      // Force time to expire - this will trigger the isTimeUp effect which handles sync
      // The effect will see timeUpNotifiedRef is true, so won't show another toast, but will still sync
      setStartTime(Date.now() - CTF_TIME_LIMIT - 1000);
    }
  }, [startTime, teamName, toast]);

  const addSolvedChallenge = useCallback((challengeId: string) => {
    if (!solvedChallenges.some(c => c.id === challengeId)) {
      const newSolve: SolvedChallenge = { id: challengeId, timestamp: Date.now() };
      setSolvedChallenges(prev => [...prev, newSolve]);
    }
  }, [solvedChallenges]);

  const isChallengeSolved = useCallback((challengeId: string) => {
    return solvedChallenges.some(c => c.id === challengeId);
  }, [solvedChallenges]);

  const getSolveTimestamp = useCallback((challengeId: string) => {
    return solvedChallenges.find(c => c.id === challengeId)?.timestamp;
  }, [solvedChallenges]);

  const useHint = useCallback((challengeId: string, hintIndex: number, cost: number) => {
    const alreadyUsed = hintsUsed.some(h => h.challengeId === challengeId && h.hintIndex === hintIndex);
    if (!alreadyUsed) {
      setHintsUsed(prev => [...prev, { challengeId, hintIndex, cost }]);
    }
  }, [hintsUsed]);

  const isHintUsed = useCallback((challengeId: string, hintIndex: number) => {
    return hintsUsed.some(h => h.challengeId === challengeId && h.hintIndex === hintIndex);
  }, [hintsUsed]);

  const getTotalPenalty = useCallback(() => {
    return hintsUsed.reduce((total, hint) => total + hint.cost, 0);
  }, [hintsUsed]);

  // Calculate time remaining and check if time is up
  const timeRemaining = useMemo(() => {
    if (!startTime) return CTF_TIME_LIMIT;
    const elapsed = currentTime - startTime;
    return Math.max(0, CTF_TIME_LIMIT - elapsed);
  }, [startTime, currentTime]);

  const isTimeUp = useMemo(() => {
    return startTime !== null && timeRemaining === 0;
  }, [startTime, timeRemaining]);

  // Sync data to Google Sheets with deduplication
  const syncToSheets = useCallback(async (forceStatus?: 'timeout' | 'completed' | 'in_progress') => {
    if (!teamName || !startTime || isSyncing) return;

    // If timeout sync and already done, skip
    if (forceStatus === 'timeout' && finalSyncDoneRef.current) {
      console.log('Final timeout sync already completed');
      return;
    }

    // Prevent syncs within 3 seconds of each other (unless forced timeout)
    const now = Date.now();
    const timeSinceLastSync = now - lastSyncRef.current;
    if (timeSinceLastSync < 3000 && forceStatus !== 'timeout') {
      console.log('Sync skipped - too soon after last sync');
      return;
    }

    lastSyncRef.current = now;
    setIsSyncing(true);
    try {
      const baseScore = solvedChallenges.reduce((acc, solved) => {
        const challengeModule = require('@/lib/challenges');
        const challenge = challengeModule.challenges.find((c: any) => c.id === solved.id);
        return acc + (challenge?.points || 0);
      }, 0);

      const penalty = getTotalPenalty();
      const totalScore = Math.max(0, baseScore - penalty);
      const lastSolveTime = Math.max(...solvedChallenges.map(s => s.timestamp), startTime);
      const timeTaken = lastSolveTime - startTime;

      // Calculate timeUp status locally to avoid circular dependency
      const elapsed = Date.now() - startTime;
      const timeUp = elapsed >= CTF_TIME_LIMIT;
      const status = forceStatus || (timeUp ? 'timeout' : solvedChallenges.length === 8 ? 'completed' : 'in_progress');

      const response = await fetch('/api/team/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          startTime,
          endTime: status !== 'in_progress' ? Date.now() : null,
          totalScore,
          baseScore,
          penalty,
          challengesSolved: solvedChallenges.length,
          hintsUsed: hintsUsed.length,
          timeTaken,
          status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Sync failed:', errorData);
        toast({
          title: "Sync Error",
          description: errorData.details || "Failed to sync data to leaderboard. Your progress is saved locally.",
          variant: "destructive",
        });
        throw new Error(errorData.details || 'Failed to sync data');
      }
      
      // Mark final sync as done if this was a timeout sync
      if (forceStatus === 'timeout') {
        finalSyncDoneRef.current = true;
        console.log('Final timeout sync completed successfully');
      }
    } catch (error) {
      console.error('Error syncing to sheets:', error);
      // Silently fail for subsequent syncs to avoid spamming errors
    } finally {
      setIsSyncing(false);
    }
  }, [teamName, startTime, solvedChallenges, hintsUsed, getTotalPenalty, isSyncing, toast]);

  // Initial sync when game starts
  useEffect(() => {
    if (startTime && teamName && !hasInitialSyncRef.current) {
      hasInitialSyncRef.current = true;
      lastSyncRef.current = Date.now(); // Initialize last sync time
      syncToSheets();
    }
  }, [startTime, teamName]);

  // Auto-sync every 30 seconds while game is active
  useEffect(() => {
    if (!startTime || !teamName || isTimeUp) return;

    const syncInterval = setInterval(() => {
      // Additional check before syncing
      const timeSinceLastSync = Date.now() - lastSyncRef.current;
      if (timeSinceLastSync >= 30000) {
        syncToSheets();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(syncInterval);
  }, [startTime, teamName, isTimeUp]);

  // Sync when challenge is solved or hint is used (debounced to once every 5 seconds)
  useEffect(() => {
    if (!startTime || !teamName) return;
    
    // Check if time is up locally to avoid dependency
    const elapsed = Date.now() - startTime;
    if (elapsed >= CTF_TIME_LIMIT) return;

    const now = Date.now();
    const timeSinceLastSync = now - lastSyncRef.current;
    
    // Only sync if at least 5 seconds have passed since last sync
    if (timeSinceLastSync >= 5000) {
      syncToSheets();
    }
  }, [solvedChallenges.length, hintsUsed.length]);

  // Show warning when 5 minutes remaining (only once)
  useEffect(() => {
    if (timeRemaining <= 5 * 60 * 1000 && timeRemaining > 4 * 60 * 1000 && startTime && !warningShownRef.current) {
      warningShownRef.current = true;
      toast({
        title: "⏰ 5 Minutes Remaining!",
        description: "Hurry up and solve the remaining challenges!",
        variant: "destructive",
      });
    }
  }, [timeRemaining, startTime, toast]);

  // Handle time up - sync and optionally show notification
  useEffect(() => {
    if (isTimeUp && startTime && !finalSyncDoneRef.current) {
      // Show notification only if not already shown
      if (!timeUpNotifiedRef.current) {
        timeUpNotifiedRef.current = true;
        toast({
          title: "⏱️ Time's Up!",
          description: "The 1-hour CTF session has ended. Check the scoreboard for final rankings!",
          variant: "destructive",
        });
      }
      
      // Final sync with forced timeout status
      // syncToSheets will set finalSyncDoneRef when successful
      syncToSheets('timeout');
    }
  }, [isTimeUp, startTime, toast]);

  const hasStarted = useMemo(() => startTime !== null, [startTime]);

  const value = {
    teamName,
    startTime,
    solvedChallenges,
    hintsUsed,
    hasStarted,
    timeRemaining,
    isTimeUp,
    setTeamName,
    startGame,
    endGame,
    addSolvedChallenge,
    isChallengeSolved,
    getSolveTimestamp,
    useHint,
    isHintUsed,
    getTotalPenalty,
    syncToSheets
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
