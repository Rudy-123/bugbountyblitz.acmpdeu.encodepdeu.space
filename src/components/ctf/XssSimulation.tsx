"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, AlertTriangle } from "lucide-react";

// Extend the Window interface to declare our global variable for TypeScript
declare global {
  interface Window {
    ENCODED_SECRET: string;
  }
}

export function XssSimulation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [inputQuery, setInputQuery] = useState("");

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // --- HIDE THE ENCODED FLAG IN A GLOBAL VARIABLE ---
  useEffect(() => {
    // The flag is encoded in Base64. It's visible to an inspector,
    // but not human-readable. It requires JS execution to decode.
    const flag = "CTF{D3c0d3_M3_If_Y0u_C4n}";
    window.ENCODED_SECRET = btoa(flag); // btoa() is the Base64 encoding function
  }, []);
  // --------------------------------------------------

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/xss-challenge?q=${encodeURIComponent(inputQuery)}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search />
          Vulnerable Book Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Search for a book title..."
          />
          <Button type="submit">Search</Button>
        </form>

        <div id="flag-container">
          {searchTerm && (
            <div
              id="searchResults"
              className="p-4 border rounded-lg bg-muted/50"
            >
              <h3
                className="text-lg font-semibold"
                dangerouslySetInnerHTML={{
                  __html: `Search results for: ${searchTerm}`,
                }}
              ></h3>
            </div>
          )}
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="h-5 w-5" />
            CTF Challenge Hint
          </div>
          <p className="mt-2 text-sm">
            Sometimes secrets are hidden in plain sight, just in a different
            language. Check the global scope.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

