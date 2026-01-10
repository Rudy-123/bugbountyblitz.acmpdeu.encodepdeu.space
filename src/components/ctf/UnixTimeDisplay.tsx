"use client";

import { useEffect, useState } from "react";

interface UnixTimeFooterProps {
  syncWithCipher?: boolean;
}

export function UnixTimeFooter({ syncWithCipher = false }: UnixTimeFooterProps) {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));
  
  useEffect(() => {
    // Sync with cipher updates (every 5 seconds) or update every second
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, syncWithCipher ? 5000 : 1000);
    
    return () => clearInterval(interval);
  }, [syncWithCipher]);
  
  return (
    <footer className="mt-6 border-t border-dashed border-muted-foreground/10 pt-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground/40">
        <div className="flex items-center space-x-2">
          <span className="opacity-30">•</span>
          <span className="font-mono tracking-wider text-[10px]">
            epoch: {currentTime}
          </span>
          <span className="opacity-30">•</span>
        </div>
        <div className="text-[9px] italic opacity-50">
          "...since the beginning of digital time"
        </div>
      </div>
    </footer>
  );
}