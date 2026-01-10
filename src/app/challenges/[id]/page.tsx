import { challenges } from "@/lib/challenges";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HintManager } from "@/components/ctf/HintManager";
import { FlagForm } from "@/components/ctf/FlagForm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Suspense } from "react";
import { DynamicCipher } from "@/components/ctf/DynamicCipher";
import { UnixTimeFooter } from "@/components/ctf/UnixTimeDisplay";
import { BooksApi } from "@/components/ctf/BooksApi";
import { XssSimulation } from "@/components/ctf/XssSimulation";
import { SstiChallenge } from "@/components/ctf/SstiChallenge";

type ChallengePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function ChallengeContent({ challenge, searchParams }: { challenge: (typeof challenges)[0], searchParams: { [key: string]: string | string[] | undefined } }) {
    // Challenge 1: Ancient Cipher with dynamic time-based Caesar cipher
    if (challenge.id === '1') {
        return (
          <div>
            <p className="text-muted-foreground mb-4">{challenge.longDescription || challenge.description}</p>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-accent">The Temporal Codex</CardTitle>
                <CardDescription className="text-muted-foreground/80">
                  "Where time itself becomes the key to ancient secrets"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicCipher />
                <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                  <p className="text-sm text-muted-foreground italic text-center">
                    "Time flows like a river, carrying different truths at each moment. 
                    The universal clock holds the key to Caesar's shifting riddle. 
                    Look beneath for the sacred count that began when digital time was born..."
                  </p>
                </div>
                <UnixTimeFooter syncWithCipher={true} />
              </CardContent>
            </Card>
          </div>
        );
    }
    
    // Challenge 2: Hidden Papyrus with 69 nested divs
    if (challenge.id === '2') {
        // Generate 69 nested divs with depth 5, flag hidden in div 42 (with misdirection)
        const generateNestedDivs = () => {
            const divs = [];
            for (let i = 1; i <= 69; i++) {
                const isActualFlag = i === 42; // Real flag location
                const isMisdirection = [15, 23, 35, 51, 67].includes(i); // Misdirection locations
                
                const createNested = (depth: number): string => {
                    if (depth === 0) {
                        if (isActualFlag) {
                            return 'Savdhan&amp;Sathark!1 - Your Destiny !';
                        } else if (isMisdirection) {
                            const misdirections: Record<number, string> = {
                                15: 'Arey bhai, yahan kya dhund rahe ho? Flag to kahin aur hai! ',
                                23: 'Bas kar bhai, time waste mat kar. Ye galat jagah hai! ',
                                35: 'Haha! Phir se galat! Kya kar rahe ho yaar? Math check karo! ',
                                51: 'Oye hoye! Ab bhi nahi mila? Thoda aur explore karo na! ',
                                67: 'Congratulations! Tumne math perfect kiya... lekin flag yahan nahi hai! Time to explore ALL blocks now! 🎉'
                            };
                            return misdirections[i] || '';
                        }
                        return '';
                    }
                    return `<div class="chamber-${depth}">${createNested(depth - 1)}</div>`;
                };
                
                divs.push(
                    <div key={i} className={`ancient-scroll-${i} hidden`} dangerouslySetInnerHTML={{
                        __html: createNested(5)
                    }} />
                );
            }
            return divs;
        };
        
        return (
          <div>
            <p className="text-muted-foreground mb-4">{challenge.longDescription || challenge.description}</p>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-accent">The Sacred Chambers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6">
                  <p className="italic text-lg mb-4">"The master builders constructed 69 chambers, each with exactly 5 levels of depth. The divine mathematics whispers of ancient secrets."</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                      <p className="text-sm font-medium text-accent mb-2">Mathematical Guidance:</p>
                      <p className="text-xs text-muted-foreground italic">
                        "When the trinity is squared and multiplied by the sacred seven, then blessed with the four winds of earth, 
                        the chamber of truth reveals itself among the multitude."
                      </p>
                      <p className="text-xs text-accent-foreground mt-2 font-mono">
                        3² × 7 + 4 = ?
                      </p>
                    </div>
                    <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                      <p className="text-sm font-medium text-primary mb-2">Seeker's Warning:</p>
                      <p className="text-xs text-muted-foreground italic">
                        "Beware the false chambers that mock the wise. The true treasure lies not where mathematics first points, 
                        but where ancient wisdom and modern patience converge."
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Hidden nested div structure - visible only in source */}
            <div className="archaeological-site" style={{display: 'none'}}>
              {generateNestedDivs()}
            </div>
          </div>
        );
    }
    
    // Simulated SQLi for challenge 4
    if (challenge.simulation === 'sqli') {
        const userId = searchParams?.userId;
        if (userId === "1' OR '1'='1") {
            return (
                <div className="p-4 border-2 border-dashed border-accent rounded-lg bg-accent/10">
                    <h3 className="font-bold text-accent">SYSTEM BYPASSED</h3>
                    <p className="mt-2 text-accent-foreground">Access granted! All user records retrieved:</p>
                    <div className="font-mono mt-2 text-sm text-accent-foreground bg-accent/20 p-2 rounded">
                        <div>User ID: 1 | Name: Admin | Secret: FLAG{'{'}SQL_HACK{'}'}</div>
                        <div>User ID: 2 | Name: Alice | Secret: [REDACTED]</div>
                        <div>User ID: 3 | Name: Bob | Secret: [REDACTED]</div>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <p className="text-muted-foreground mb-4">{challenge.longDescription || challenge.description}</p>
                <BooksApi />
            </div>
        );
    }

    // Simulated Stored XSS for challenge 5
    if (challenge.simulation === 'xss') {
        return (
        <div>
          <p className="text-muted-foreground mb-4">{challenge.longDescription || challenge.description}</p>
          <XssSimulation />
        </div>
        )
    }

    // Steganography image for challenge 7
    if (challenge.id === '7') {
      const image = PlaceHolderImages.find(img => img.id === 'steganography-image');
      const searchParamFlag = searchParams?.flag?.toString() || '';

      return (
        <div>
           <p className="text-muted-foreground mb-4">{challenge.longDescription || challenge.description}</p>
          {/* {image && <Image src={image.imageUrl} alt={image.description} width={800} height={600} className="rounded-lg shadow-md" data-ai-hint={image.imageHint} />} */} 
          <Link href="https://drive.google.com/file/d/1aMpLRCUNPguScCYnAOuWVNYRhjf7nPE-/view" target="_blank">Click here and find the flag!</Link>
        </div>
      );
    }

    

    // SSTI challenge for template engine probe
    if (challenge.simulation === 'ssti') {
      return (
        <div>
          <p className="text-muted-foreground mb-4">{challenge.longDescription || challenge.description}</p>
          <SstiChallenge />
        </div>
      )
    }
    
    // Default description
    return <p className="text-muted-foreground">{challenge.longDescription || challenge.description}</p>
}


export default async function ChallengePage({ params, searchParams }: ChallengePageProps) {
  const { id } = await params;
  const searchParamsResolved = await searchParams;
  const currentIndex = challenges.findIndex((c) => c.id === id);
  const challenge = challenges[currentIndex];
  const nextChallenge = challenges[currentIndex + 1];
  const previousChallenge = challenges[currentIndex - 1];

  if (!challenge) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
            <Link href="/challenges">
                <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Challenges
                </Button>
            </Link>
            <Badge variant="secondary" className="text-lg">{challenge.points} Points</Badge>
        </div>
        <h1 className="text-4xl font-headline font-bold mb-2">{challenge.title}</h1>
        <div className="flex items-center gap-2">
            <Badge variant="outline">{challenge.era}</Badge>
            <Badge variant="outline" className="text-xs">Challenge {currentIndex + 1} of {challenges.length}</Badge>
        </div>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p>Loading challenge...</p>}>
            <ChallengeContent challenge={challenge} searchParams={searchParamsResolved}/>
          </Suspense>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
            <h2 className="text-2xl font-headline font-semibold">Hints</h2>
            <HintManager hints={challenge.hints} challengeId={challenge.id} />
        </div>
        <div className="space-y-6">
            <h2 className="text-2xl font-headline font-semibold">Submit Flag</h2>
            <FlagForm challengeId={challenge.id} />
        </div>
      </div>

      {/* Challenge Navigation */}
      <div className="flex justify-center items-center gap-4 mt-12 mb-8">
        {previousChallenge && (
          <Link href={`/challenges/${previousChallenge.id}`}>
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous Challenge
            </Button>
          </Link>
        )}
        {nextChallenge && (
          <Link href={`/challenges/${nextChallenge.id}`}>
            <Button variant="outline" size="lg">
              Next Challenge
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}


