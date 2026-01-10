"use server";

import { challengesWithFlags } from "./challenges-server";

export type FormState = {
  success: boolean;
  message: string;
  challengeId?: string;
  // decoy?: true when user submitted a known decoy flag
  decoy?: boolean;
};

export async function submitFlag(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const submittedFlag = formData.get("flag") as string;
  const challengeId = formData.get("challengeId") as string;

  if (!submittedFlag || !challengeId) {
    return { success: false, message: "Missing flag or challenge ID." };
  }

  const challenge = challengesWithFlags.find((c) => c.id === challengeId);

  if (!challenge) {
    return { success: false, message: "Challenge not found." };
  }

  // Case-sensitive check
  if (challenge.flag === submittedFlag.trim()) {
    return {
      success: true,
      message: `Correct! You earned ${challenge.points} points.`,
      challengeId: challenge.id,
    };
  } else {
    // Check for decoy flags
    const decoys = (challenge as any).decoyFlags as { flag: string; message?: string }[] | undefined;
    if (decoys && decoys.length) {
      const hit = decoys.find(d => d.flag === submittedFlag.trim());
      if (hit) {
        return {
          success: false,
          message: hit.message || 'This looks like a decoy flag.',
          decoy: true,
        };
      }
    }
    return { success: false, message: "Incorrect flag. Try again." };
  }
}

export async function fetchUrl(url: string): Promise<string> {

    try {
        // We only allow fetching from picsum.photos for safety, simulating an external fetch
        const parsedUrl = new URL(url);
        if (parsedUrl.hostname !== 'picsum.photos') {
            return "Error: This proxy can only access whitelisted domains for security reasons.";
        }
        const response = await fetch(url);
        if (!response.ok) {
            return `Error: Could not fetch URL. Status: ${response.status}`;
        }
        return `Successfully fetched ${url}. No flag here, though.`;
    } catch (error) {
        return "Error: Invalid URL or failed to connect.";
    }
}
