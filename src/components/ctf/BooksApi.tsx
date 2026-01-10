"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BookOpen, ExternalLink } from "lucide-react";

export function BooksApi() {
  const baseUrl = 'http://3.109.93.48:5000';
  
  // Sample book IDs for demonstration
  const sampleBookIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Library Database System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-4">
              Click on the links below to interact with the API directly in your browser.
            </p>
          </div>

          {/* Get All Books Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Get All Books</h3>
            <p className="text-sm text-muted-foreground">
              Fetch the complete list of books in the library database.
            </p>
            <a
              href={`${baseUrl}/getAll`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              {baseUrl}/getAll
            </a>
          </div>

          {/* Get Book by ID Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Get Book by ID</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Click on any book ID below to fetch its detailed information.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {sampleBookIds.map((id) => (
                <a
                  key={id}
                  href={`${baseUrl}/get?id=${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Book {id}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

          {/* API Endpoint Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <h4 className="font-semibold text-sm">API Endpoint Format</h4>
            <div className="space-y-1 text-sm font-mono">
              <p className="text-muted-foreground">
                GET {baseUrl}/get?id=<span className="text-primary font-bold">[BOOK_ID]</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Try different ID values to explore the database. You can modify the ID parameter directly in the URL.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
