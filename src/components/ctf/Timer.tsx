"use client";

import { useEffect, useState } from "react";

function padNumber(num: number): string {
    return num.toString().padStart(2, '0');
}

export function formatTimeHHMMSS(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
}

type TimerProps = {
    startTime: number | null;
    endTime?: number;
    className?: string;
}

export function Timer({ startTime, endTime, className = "" }: TimerProps) {
    const [mounted, setMounted] = useState(false);
    const [timeDisplay, setTimeDisplay] = useState("00:00:00");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !startTime) return;

        const updateTime = () => {
            const displayTime = endTime || Date.now();
            const duration = displayTime - startTime;
            setTimeDisplay(formatTimeHHMMSS(duration));
        };

        // Initial update
        updateTime();

        // Only set up interval if we're not showing a fixed end time
        if (!endTime) {
            const timer = setInterval(updateTime, 1000);
            return () => clearInterval(timer);
        }
    }, [mounted, startTime, endTime]);

    // During SSR or before mount, show initial state
    if (!mounted) {
        return <span className={className}>00:00:00</span>;
    }

    return (
        <span className={className} suppressHydrationWarning>
            {timeDisplay}
        </span>
    );
}