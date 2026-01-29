import React from "react";

export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary to-emerald-600 bg-clip-text text-transparent pb-1">
      {children}
    </h1>
  );
}
