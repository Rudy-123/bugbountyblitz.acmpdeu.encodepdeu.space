"use client";

import { Button } from "@/components/ui/button";
import { usePlayer } from "@/hooks/use-player";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function StartButton() {
  const { startGame, hasStarted } = usePlayer();
  const router = useRouter();

  const handleStart = () => {
    if (!hasStarted) {
      startGame();
    }
    router.push("/challenges");
  };

  return (
    <Button onClick={handleStart} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
      {hasStarted ? "Continue Journey" : "Start Journey"}
      <ArrowRight className="ml-2" />
    </Button>
  );
}