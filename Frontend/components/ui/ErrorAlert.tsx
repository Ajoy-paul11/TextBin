import React from "react";

export function ErrorAlert({ message }: { message: string }) {
    if (!message) return null;
    return (
        <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs text-center">
            {message}
        </div>
    );
}
