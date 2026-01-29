import Link from "next/link";
import React from "react";

interface PasteErrorProps {
  message: string;
}

export function PasteError({ message }: PasteErrorProps) {
  return (
    <div className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="max-w-md w-full glass-card p-8 rounded-xl text-center space-y-6">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Paste Unavailable</h2>
        <p className="text-muted-foreground">
          {message || "This paste may have expired or does not exist."}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-emerald-600 text-primary-foreground font-medium hover:bg-emerald-800 transition-colors"
        >
          Create New Paste
        </Link>
      </div>
    </div>
  );
}
