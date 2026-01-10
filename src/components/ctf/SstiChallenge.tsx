"use client";
// hello
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Terminal, AlertTriangle } from "lucide-react";

export function SstiChallenge() {
  const [payload, setPayload] = useState("");
  const [responseHtml, setResponseHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseHtml("");

    try {
      // Send the payload to the vulnerable endpoint on your Flask server
      const response = await fetch(`http://3.109.93.48:5000/ssti-challenge?name=${encodeURIComponent(payload)}`);
      const data = await response.text();
      setResponseHtml(data);
    } catch (error) {
      setResponseHtml("<p class='text-destructive'>Failed to connect to the server.</p>");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal />
          Template Engine Probe
        </CardTitle>
      </CardHeader>
      
      <p className="m-9">http://3.109.93.48:5000/ssti-challenge?name=$</p>
    </Card>
  );
}

