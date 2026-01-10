"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getChallengesWithFlags, getDnsChallenge } from "@/lib/admin-actions";
import { Badge } from "@/components/ui/badge";
import type { Challenge } from "@/lib/types";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "evolution_admin_password";

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [dnsQuery, setDnsQuery] = useState("");
  const [dnsResult, setDnsResult] = useState("");
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const loadChallenges = async () => {
      if (isAuthenticated) {
        const data = await getChallengesWithFlags();
        setChallenges(data);
      }
    };
    loadChallenges();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      sessionStorage.setItem("admin_auth", "true");
    } else {
      setError("Incorrect password.");
    }
  };

  const handleDnsLookup = async () => {
    if (dnsQuery.trim().toLowerCase() === 'evolution-ctf.local') {
      const dnsChallenge = await getDnsChallenge();
      setDnsResult(dnsChallenge?.flag || 'Record not found.');
    } else {
      setDnsResult('Record not found. Try "evolution-ctf.local".');
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Admin Access Required</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Authenticate
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>All Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Era</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Flag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((challenge: Challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell>{challenge.id}</TableCell>
                  <TableCell>{challenge.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{challenge.era}</Badge>
                  </TableCell>
                  <TableCell>{challenge.points}</TableCell>
                  <TableCell className="font-code">{challenge.flag}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>DNS Lookup Tool</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex gap-2">
              <Input 
                placeholder="evolution-ctf.local"
                value={dnsQuery}
                onChange={(e) => setDnsQuery(e.target.value)}
              />
              <Button onClick={handleDnsLookup}>Query TXT</Button>
            </div>
            {dnsResult && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="font-code">{dnsResult}</p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
