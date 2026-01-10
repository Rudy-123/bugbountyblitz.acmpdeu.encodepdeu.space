import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Challenge } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

type ChallengeCardProps = {
  challenge: Omit<Challenge, 'flag'> & { isSolved: boolean };
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <Link href={`/challenges/${challenge.id}`} className="block group">
      <Card className={cn(
        "h-full flex flex-col transition-all duration-300 ease-in-out",
        challenge.isSolved 
          ? "border-green-500/50 bg-green-500/10" 
          : "hover:border-primary hover:shadow-lg hover:-translate-y-1"
      )}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-xl">{challenge.title}</CardTitle>
            {challenge.isSolved && (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            )}
          </div>
          <CardDescription>{challenge.description}</CardDescription>
          {/* here is the desc mait */}
        </CardHeader>
        <CardContent className="flex-grow"></CardContent>
        <CardFooter className="flex justify-between items-center">
          <Badge variant="secondary">{`${challenge.points} Points`}</Badge>
          {challenge.isSolved ? (
            <Badge className="bg-green-600 text-white">Solved</Badge>
          ) : (
            <Badge variant="outline">{challenge.era}</Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
