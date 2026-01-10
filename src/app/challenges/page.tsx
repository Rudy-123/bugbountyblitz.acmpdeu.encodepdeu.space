"use client";

import { ChallengeCard } from "@/components/ctf/ChallengeCard";
import { challenges as allChallengesData } from "@/lib/challenges";
import type { Challenge, ChallengeEra } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/hooks/use-player";
import { Laptop, Rocket, Scroll } from "lucide-react";
import dynamic from 'next/dynamic';
import { TimerDisplay } from "@/components/ctf/TimerDisplay";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { TeamNameDialog } from "@/components/ctf/TeamNameDialog";

const eraIcons: Record<ChallengeEra, React.ReactNode> = {
  Past: <Scroll className="w-8 h-8 text-primary" />,
  Present: <Laptop className="w-8 h-8 text-primary" />,
  Future: <Rocket className="w-8 h-8 text-primary" />,
};

const EndGameButton = dynamic(
  () => import('@/components/ctf/EndGameButton').then(mod => mod.EndGameButton),
  { ssr: false }
);

export default function ChallengesPage() {
  const { isChallengeSolved, isTimeUp, timeRemaining, endGame, hasStarted, teamName, setTeamName, startGame } = usePlayer();
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(!teamName);
  const router = useRouter();

  const challenges = useMemo(() => {
    return allChallengesData.map(c => ({
      ...c,
      isSolved: isChallengeSolved(c.id),
    }));
  }, [isChallengeSolved]);
  
  const challengesByEra = {
    Past: challenges.filter((c) => c.era === "Past"),
    Present: challenges.filter((c) => c.era === "Present"),
    Future: challenges.filter((c) => c.era === "Future"),
  };



  const handleEndGame = () => {
    endGame();
    setShowEndDialog(false);
    router.push('/scoreboard');
  };

  const handleTeamSubmit = (name: string) => {
    setTeamName(name);
    setShowTeamDialog(false);
    startGame(name);
  };

  return (
    <>
      <TeamNameDialog 
        open={showTeamDialog} 
        onSubmit={handleTeamSubmit}
      />
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Game Early?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end your session? This will stop the timer and finalize your score. You won't be able to submit any more answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndGame}>Yes, End Game</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-12">
        <header className="text-center">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-headline font-bold flex-1">Challenges</h1>
            <div className="flex-1 flex justify-end">
              <EndGameButton
                isVisible={hasStarted && !isTimeUp}
                onClick={() => setShowEndDialog(true)}
              />
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Select a challenge to begin.
          </p>
          <TimerDisplay timeRemaining={timeRemaining} isTimeUp={isTimeUp} />
      </header>

        {(Object.keys(challengesByEra) as ChallengeEra[]).map((era) => (
          <section key={era} className="animate-fade-in" style={{ animationDelay: `${era === 'Past' ? 0.1 : era === 'Present' ? 0.2 : 0.3}s` }}>
            <div className="flex items-center gap-4 mb-6">
              {eraIcons[era]}
              <h2 className="text-3xl font-headline font-semibold">{era}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challengesByEra[era].map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
