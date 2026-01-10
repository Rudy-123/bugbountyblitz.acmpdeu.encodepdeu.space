'use client';

import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

interface EndGameButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export function EndGameButton({ isVisible, onClick }: EndGameButtonProps) {
  if (!isVisible) return null;

  return (
    <Button 
      onClick={onClick} 
      variant="destructive"
      size="sm"
    >
      <Flag className="w-4 h-4 mr-2" />
      End Game
    </Button>
  );
}