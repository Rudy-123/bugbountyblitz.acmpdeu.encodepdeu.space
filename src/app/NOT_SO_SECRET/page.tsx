import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SuperSecretPage() {
    return (
        <div className="container mx-auto text-center py-10">
            <h1 className="text-4xl font-headline font-bold">🎉 TREASURE CHAMBER DISCOVERED! 🎉</h1>
            <div className="text-lg text-accent mt-2 mb-6">
                <em>"The Digital Archaeologist's Reward"</em>
            </div>
            <Card className="max-w-2xl mx-auto mt-6 bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent">
                <CardHeader>
                    <CardTitle className="text-accent">🏴 FLAG DISCOVERED</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm">
                        Congratulations! You successfully decoded the riddle of the dancing letters and found the true path!
                    </p>
                    <div className="p-6 bg-background rounded border-2 border-dashed border-accent">
                        <div className="font-mono text-2xl text-accent font-bold">
                            FLAG&#123;PRO_BHAIII_!&#125;
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <p>
                            The sacred scroll spoke in riddles - the first path was merely an echo, a mirror reflection. 
                            You looked beyond the chaotic dance and found where the letters found their true form.
                        </p>
                        <p className="mt-2">
                            <strong>Lesson:</strong> Sometimes the answer lies not in the path itself, but in understanding 
                            the hidden meaning within the Oracle's words. The rhythm was right, and the path awakened!
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Link href="/challenges" className="mt-8 inline-block text-primary hover:underline">
                ← Return to Quest Archive
            </Link>
        </div>
    );
}