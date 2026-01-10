"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

interface TeamNameDialogProps {
  open: boolean;
  onSubmit: (teamName: string) => void;
}

export function TeamNameDialog({ open, onSubmit }: TeamNameDialogProps) {
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = teamName.trim();
    
    if (!trimmedName) {
      setError("Team name is required");
      return;
    }
    
    if (trimmedName.length < 2) {
      setError("Team name must be at least 2 characters");
      return;
    }
    
    if (trimmedName.length > 50) {
      setError("Team name must be less than 50 characters");
      return;
    }

    // Check if team name already exists
    setIsChecking(true);
    try {
      const response = await fetch('/api/team/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName: trimmedName }),
      });

      const data = await response.json();

      if (data.exists) {
        setError("Team name already exists. Please choose a different name.");
        setIsChecking(false);
        return;
      }

      onSubmit(trimmedName);
    } catch (err) {
      setError("Failed to verify team name. Please try again.");
      setIsChecking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Enter Your Team Name
          </DialogTitle>
          <DialogDescription>
            Each team uses one PC. You'll have <strong>1 hour</strong> to complete the challenges.
            Your progress will be tracked on the leaderboard!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="team-name">Team Name</Label>
            <Input
              id="team-name"
              placeholder="Enter your team name..."
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className={error ? "border-red-500" : ""}
              autoFocus
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
            <p className="font-semibold">Rules:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>1 hour time limit</li>
              <li>Points awarded for solved challenges</li>
              <li>Hint penalties deducted from score</li>
              <li>Faster completion = higher rank on ties</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full" disabled={isChecking}>
            {isChecking ? "Checking..." : "Start Challenge"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
