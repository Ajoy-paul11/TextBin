"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 glass-card border-b-0 border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold bg-linear-to-r from-primary to-emerald-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          TextBin
        </Link>
      </div>
    </header>
  );
}
