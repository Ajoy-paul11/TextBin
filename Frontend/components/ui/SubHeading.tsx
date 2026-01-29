import React from "react";

export function SubHeading({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            {children}
        </p>
    );
}
