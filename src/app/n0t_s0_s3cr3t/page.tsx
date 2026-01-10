import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function MisdirectionPage() {
    return (
        <div className="container mx-auto text-center py-10">
            <h1 className="text-4xl font-headline font-bold">🌙 The Chamber of Echoes 🌙</h1>
            <div className="text-lg text-accent mt-2 mb-6">
                <em>"Where whispers become riddles"</em>
            </div>
            <Card className="max-w-2xl mx-auto mt-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-2 border-purple-500">
                <CardHeader>
                    <CardTitle className="text-purple-500">🔮 THE ORACLE SPEAKS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground italic">
                        The seeker arrives at the mirror's edge, yet the reflection holds no treasure...
                    </p>
                    <div className="p-6 bg-background rounded border-2 border-dashed border-purple-500">
                        <div className="font-mono text-sm text-purple-500 leading-relaxed">
                            "This place is only an echo — a mirror of the path you seek. The token in the address is wearing a costume; stop the dance of its letters in the URL, watch the way they twist and turn. Let some rest quietly, while others stand tall — only when the rhythm is right will the hidden path awakens."
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-2">
                        <p className="italic">
                            The ancient scroll speaks in riddles. Decipher the meaning within the words, 
                            for the path forward lies hidden in plain sight.
                        </p>
                        <p className="text-xs opacity-40">
                            पहेली में ही उत्तर छुपा है... <br/>
                            <em>(The answer lies hidden within the riddle...)</em>
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