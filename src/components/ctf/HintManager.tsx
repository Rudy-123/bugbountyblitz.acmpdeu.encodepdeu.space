"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { usePlayer } from "@/hooks/use-player";

type Hint = {
  cost: number;
  text: string;
};

type HintManagerProps = {
  hints: Hint[];
  challengeId: string;
};

export function HintManager({ hints, challengeId }: HintManagerProps) {
    const { useHint, isHintUsed } = usePlayer();
    const [revealedCount, setRevealedCount] = useState(0);

    useEffect(() => {
        // Count how many hints are already revealed for this challenge
        let count = 0;
        for (let i = 0; i < hints.length; i++) {
            if (isHintUsed(challengeId, i)) {
                count++;
            }
        }
        setRevealedCount(count);
    }, [challengeId, hints.length, isHintUsed]);

    const revealNextHint = () => {
        if (revealedCount < hints.length) {
            const nextHint = hints[revealedCount];
            useHint(challengeId, revealedCount, nextHint.cost);
            setRevealedCount(revealedCount + 1);
        }
    };

  if (!hints || hints.length === 0) {
    return <p className="text-muted-foreground">No hints available for this challenge.</p>;
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {hints.slice(0, revealedCount).map((hint, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Hint #{index + 1}
              </div>
            </AccordionTrigger>
            <AccordionContent>{hint.text}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {revealedCount < hints.length && (
        <Button onClick={revealNextHint} variant="outline">
          Reveal Hint ({revealedCount + 1}/{hints.length})
          {hints[revealedCount].cost > 0 && (
            <span className="ml-2 text-yellow-600 font-semibold">-{hints[revealedCount].cost} pts</span>
          )}
        </Button>
      )}
      {revealedCount === hints.length && (
        <p className="text-sm text-muted-foreground">All hints have been revealed.</p>
      )}
    </div>
  );
}
