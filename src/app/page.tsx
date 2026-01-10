"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/hooks/use-player";
import { ArrowRight, Timer, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { TeamNameDialog } from "@/components/ctf/TeamNameDialog";

export default function Home() {
  const { teamName, setTeamName, startGame, hasStarted, timeRemaining, isTimeUp } = usePlayer();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = () => {
    if (!teamName) {
      setShowDialog(true);
    } else if (!hasStarted) {
      startGame();
      router.push("/challenges");
    } else {
      router.push("/challenges");
    }
  };

  const handleTeamNameSubmit = (name: string) => {
    setTeamName(name);
    setShowDialog(false);
    // Don't start timer yet - wait for user to click "Start Journey"
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}:${String(minutes % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  };

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full animate-fade-in text-blue-100">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]">
          Bug Bounty Blitz
        </h1>
        <p className="mt-4 text-lg md:text-xl text-blue-200/80 max-w-2xl drop-shadow">
          An adventure through time. Solve challenges from the past, present, and future to prove your skills.
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            className="bg-blue-600/80 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-900/40"
            disabled
          >
            <span>Loading...</span>
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <TeamNameDialog open={showDialog} onSubmit={handleTeamNameSubmit} />
      <div className="flex flex-col items-center justify-center text-center h-full animate-fade-in text-blue-100">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] animate-fade-in">
          Bug Bounty Blitz
        </h1>
        <p className="mt-4 text-lg md:text-xl text-blue-200/80 max-w-2xl drop-shadow-md">
          An adventure through time. Solve challenges from the past, present, and future to prove your skills.
        </p>

        {teamName && (
          <div className="mt-6 p-4 bg-blue-900/40 backdrop-blur-md rounded-xl border border-blue-400/30 shadow-md">
            <p className="text-sm text-blue-300/80">Team:</p>
            <p className="text-xl font-bold text-cyan-200">{teamName}</p>
            {hasStarted && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <Timer className="w-4 h-4 text-cyan-300" />
                <span
                  className={`font-mono text-lg ${
                    isTimeUp
                      ? "text-red-400"
                      : timeRemaining < 5 * 60 * 1000
                      ? "text-yellow-300"
                      : "text-green-300"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <Button
            onClick={handleStart}
            size="lg"
            // className="bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-lg shadow-blue-900/40 transition-all duration-300"
            className="bg-white text-blue-600 font-bold shadow-lg shadow-blue-500/50 hover:text-blue-700 hover:shadow-blue-600/50 transition-all duration-300"

            disabled={isTimeUp}
          >
            <span>
              {isTimeUp ? "Time's Up!" : hasStarted ? "Continue Journey" : "Start Journey"}
            </span>
            <ArrowRight className="ml-2" />
          </Button>
        </div>

        {isTimeUp && (
          <div className="mt-6 space-y-3">
            <p className="text-red-400 font-semibold drop-shadow-md">
              Your 1-hour session has ended. Check the scoreboard!
            </p>
            <Button
              onClick={() => router.push("/scoreboard")}
              size="lg"
              variant="default"
              className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-900/40"
            >
              <Trophy className="w-5 h-5 mr-2 text-yellow-300" />
              View Scoreboard
            </Button>
          </div>
        )}
      </div>
    </>
  );
}




// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { usePlayer } from "@/hooks/use-player";
// import { ArrowRight, Timer, Trophy } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { TeamNameDialog } from "@/components/ctf/TeamNameDialog";
// import { formatTimeHHMMSS } from "@/components/ctf/Timer";

// export default function Home() {
//   const { teamName, setTeamName, startGame, hasStarted, timeRemaining, isTimeUp } = usePlayer();
//   const router = useRouter();
//   const [showDialog, setShowDialog] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleStart = () => {
//     if (!teamName) {
//       // Show dialog to get team name
//       setShowDialog(true);
//     } else if (!hasStarted) {
//       // Start the game
//       startGame();
//       router.push("/challenges");
//     } else {
//       // Continue existing game
//       router.push("/challenges");
//     }
//   };

//   const handleTeamNameSubmit = (name: string) => {
//     setTeamName(name);
//     setShowDialog(false);
//     // Auto-start game after setting team name
//     setTimeout(() => {
//       startGame();
//       router.push("/challenges");
//     }, 100);
//   };

//   const formatTime = (ms: number) => {
//     const seconds = Math.floor(ms / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
//   };

//   // Prevent hydration mismatch by only showing dynamic content after mount
//   if (!mounted) {
//     return (
//       <div className="flex flex-col items-center justify-center text-center h-full animate-fade-in">
//         <h1 className="text-5xl md:text-7xl font-headline font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-2">
//           Evolution CTF
//         </h1>
//         <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
//           An adventure through time. Solve challenges from the past, present, and future to prove your skills.
//         </p>
//         <div className="mt-8">
//           <Button 
//             size="lg" 
//             className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
//             disabled
//           >
//             <span>Loading...</span>
//             <ArrowRight className="ml-2" />
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <TeamNameDialog open={showDialog} onSubmit={handleTeamNameSubmit} />
//       <div className="flex flex-col items-center justify-center text-center h-full animate-fade-in">
//         <h1 className="text-5xl md:text-7xl font-headline font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-2">
//           Evolution CTF
//         </h1>
//         <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
//           An adventure through time. Solve challenges from the past, present, and future to prove your skills.
//         </p>
        
//         {teamName && (
//           <div className="mt-6 p-4 bg-muted rounded-lg">
//             <p className="text-sm text-muted-foreground">Team:</p>
//             <p className="text-xl font-bold">{teamName}</p>
//             {hasStarted && (
//               <div className="mt-2 flex items-center justify-center gap-2">
//                 <Timer className="w-4 h-4" />
//                 <span className={`font-mono text-lg ${isTimeUp ? 'text-red-500' : timeRemaining < 5 * 60 * 1000 ? 'text-yellow-500' : 'text-green-500'}`}>
//                   {formatTime(timeRemaining)}
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
        
//         <div className="mt-8">
//           <Button 
//             onClick={handleStart} 
//             size="lg" 
//             className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
//             disabled={isTimeUp}
//           >
//             <span>
//               {isTimeUp ? "Time's Up!" : hasStarted ? "Continue Journey" : "Start Journey"}
//             </span>
//             <ArrowRight className="ml-2" />
//           </Button>
//         </div>
        
//         {isTimeUp && (
//           <div className="mt-6 space-y-3">
//             <p className="text-red-500 font-semibold">
//               Your 1-hour session has ended. Check the scoreboard!
//             </p>
//             <Button 
//               onClick={() => router.push('/scoreboard')} 
//               size="lg"
//               variant="default"
//             >
//               <Trophy className="w-5 h-5 mr-2" />
//               View Scoreboard
//             </Button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
