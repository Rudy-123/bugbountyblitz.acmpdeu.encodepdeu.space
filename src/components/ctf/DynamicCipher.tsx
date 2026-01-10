"use client";

import { useEffect, useState } from "react";

interface DynamicCipherProps {
  onTimeUpdate?: (timestamp: number) => void;
}

export function DynamicCipher({ onTimeUpdate }: DynamicCipherProps) {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));
  const [cipherData, setCipherData] = useState({ text: "", shift: 0, timestamp: 0 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = Math.floor(Date.now() / 1000);
      setCurrentTime(newTime);
      onTimeUpdate?.(newTime); // Notify parent of time updates
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [onTimeUpdate]);
  
  // Caesar cipher function for ENCRYPTION (addition logic)
  const caesarCipher = (text: string, shift: number) => {
    return text.split('').map(char => {
      if (char >= 'A' && char <= 'Z') {
        // Add the shift to each character (wrapping around) for encryption
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      return char;
    }).join('');
  };
  
  // Calculate shift by summing all digits in timestamp and applying modulo 26
  const calculateShift = (timestamp: number) => {
    const digits = timestamp.toString().split('').map(Number);
    const digitSum = digits.reduce((sum, digit) => sum + digit, 0);
    return digitSum % 26;
  };
  
  // Base message to encode
  const baseMessage = "WELCOMETOENCODEANDACMCTF";
  
  // Generate cipher text with validation to prevent plaintext revelation
  const generateValidCipher = (timestamp: number, prevCipherData: typeof cipherData) => {
    const shift = calculateShift(timestamp);
    let cipherText = caesarCipher(baseMessage, shift);
    
    // If cipher text equals plain text (shift = 0), use a fallback shift
    if (cipherText === baseMessage) {
      const fallbackShift = 1; // Minimum shift to avoid plaintext
      cipherText = caesarCipher(baseMessage, fallbackShift);
      return { text: cipherText, shift: fallbackShift, timestamp };
    }
    
    return { text: cipherText, shift, timestamp };
  };
  
  // Update cipher data when time changes
  useEffect(() => {
    setCipherData(prevData => {
      const newCipherData = generateValidCipher(currentTime, prevData);
      return newCipherData;
    });
  }, [currentTime]); // Removed cipherData.text dependency to prevent infinite loops
  
  // Initialize cipher data on first render
  useEffect(() => {
    const initialCipherData = generateValidCipher(currentTime, { text: "", shift: 0, timestamp: 0 });
    setCipherData(initialCipherData);
  }, []); // Only run on mount
  
  return (
    <div className="space-y-4">
      <div className="font-mono text-center text-lg p-4 bg-muted rounded-lg border-2 border-dashed transition-all duration-500">
        {cipherData.text}
      </div>
      <div className="text-xs text-center text-muted-foreground">
        <span className="opacity-60">Last updated: {new Date((cipherData.timestamp || currentTime) * 1000).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}