"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { fetchUrl } from "@/lib/actions";

export function SsrfClient() {
    const [url, setUrl] = useState("https://picsum.photos/200");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetchUrl(url);
        setResult(response);
        setLoading(false);
    }
    
    return (
        <Card>
            <CardHeader><CardTitle>Web Fetcher Utility</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                        <Input 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="http://..."
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? "Fetching..." : "Fetch"}
                        </Button>
                    </div>
                </form>
                {result && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="font-bold text-sm mb-2">Response:</p>
                        <p className="font-code text-sm break-all">{result}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
