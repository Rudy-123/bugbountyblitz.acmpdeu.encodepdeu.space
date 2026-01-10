"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitFlag, type FormState } from "@/lib/actions";
// @ts-ignore -- TODO: Update to useActionState when Next.js upgrades to React 19
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePlayer } from "@/hooks/use-player";
import { challenges } from "@/lib/challenges";

function SubmitButton({ isSolved }: { isSolved: boolean }) {
  const { pending } = useFormStatus();
  
  // Force disabled to be a boolean value
  const isDisabled = Boolean(pending || isSolved);
  
  // Pre-compute button text to ensure consistent rendering
  const buttonText = pending ? "Submitting..." : isSolved ? "Already Solved" : "Submit";
  
  return (
    <Button 
      type="submit" 
      disabled={isDisabled} 
      className="w-full"
      suppressHydrationWarning
    >
      {buttonText}
    </Button>
  );
}

export function FlagForm({ challengeId }: { challengeId: string }) {
  const { toast } = useToast();
  const { addSolvedChallenge, isChallengeSolved, endGame, solvedChallenges } = usePlayer();
  const isSolved = isChallengeSolved(challengeId);

  const initialState: FormState = { success: false, message: "" };
  const [state, formAction] = useActionState(submitFlag, initialState);

  useEffect(() => {
    if (state.message) {
      // If server marks the submission as a decoy, show a special message/variant
      if ((state as any).decoy) {
        toast({
          title: "Oops!!",
          description: state.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: state.success ? "Success!" : "Incorrect",
          description: state.message,
          variant: state.success ? "default" : "destructive",
        });
      }

      if (state.success && state.challengeId) {
        // Add the solved challenge
        addSolvedChallenge(state.challengeId);
        
        // Check if all challenges are now solved
        const newTotalSolved = solvedChallenges.length + 1; // Include the one just solved
        if (newTotalSolved === challenges.length) {
          // Show completion message
          toast({
            title: "🎉 Congratulations!",
            description: "You've solved all challenges! Recording final score...",
            variant: "default",
          });
          
          // Wait for state updates and give time for syncing
          setTimeout(async () => {
            try {
              // Force a final score sync
              await fetch('/api/team/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  status: 'completed',
                  endTime: Date.now()
                }),
              });
              
              // Show completion message and end game
              toast({
                title: "✨ Final Score Recorded!",
                description: "All your points have been saved. The game will now end.",
                variant: "default",
              });
              
              // End the game after ensuring score is saved
              setTimeout(() => {
                endGame();
              }, 1000);
            } catch (error) {
              console.error('Error recording final score:', error);
              toast({
                title: "Error Recording Score",
                description: "There was an issue saving your final score. Please wait a moment before ending the game.",
                variant: "destructive",
              });
            }
          }, 2000);
        }
      }
    }
  }, [state, toast, addSolvedChallenge, solvedChallenges.length, endGame]);

  return (
    <form action={formAction} className="space-y-4">
      <Input
        name="flag"
        placeholder="FLAG{...}"
        required
        disabled={Boolean(isSolved)}
        className="font-code"
        suppressHydrationWarning
      />
      <input type="hidden" name="challengeId" value={challengeId} />
      <SubmitButton isSolved={isSolved} />
    </form>
  );
}
