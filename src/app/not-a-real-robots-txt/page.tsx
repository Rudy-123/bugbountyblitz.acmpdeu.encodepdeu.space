import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function NotRobotsPage() {
    return (
        <div className="container mx-auto text-center py-10">
            <h1 className="text-3xl font-headline font-bold">CLASSIFIED</h1>
            <Card className="max-w-xl mx-auto mt-6 bg-muted">
                <CardContent className="pt-6">
                    <pre className="font-code text-left p-4 bg-background rounded text-sm overflow-x-auto">
                        <code>
                            User-agent: *<br />
                            Disallow: /admin/<br />
                            Disallow: /secrets/<br />
                            # Well done, explorer. You weren't supposed to find this.<br />
                            # Your reward: FLAG{'{'}ROBOT_X{'}'}<br />
                        </code>
                    </pre>
                </CardContent>
            </Card>
            <Link href="/challenges" className="mt-8 inline-block text-primary hover:underline">
                &larr; Back to Challenges
            </Link>
        </div>
    );
}
