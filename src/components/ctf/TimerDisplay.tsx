"use client";

import { Timer, AlertTriangle } from "lucide-react";

interface TimerDisplayProps {
  timeRemaining: number;
  isTimeUp: boolean;
}

export function TimerDisplay({ timeRemaining, isTimeUp }: TimerDisplayProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  };

  if (isTimeUp) {
    return (
      <div className="mt-4 inline-flex items-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-950 border border-red-500 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <span className="text-red-600 font-semibold">Time&apos;s Up! No more submissions accepted.</span>
      </div>
    );
  }

  if (timeRemaining > 0) {
    return (
      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
        <Timer className="w-4 h-4" />
        <span className={`font-mono text-lg font-semibold ${timeRemaining < 5 * 60 * 1000 ? 'text-yellow-500' : 'text-green-600'}`} suppressHydrationWarning>
          {formatTime(timeRemaining)}
        </span>
        <span className="text-sm text-muted-foreground">remaining</span>
      </div>
    );
  }

  return null;
}