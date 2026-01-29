import React from "react";
import { Button } from "./Button";

interface UrlBarProps {
    url: string;
    copied: boolean;
    onCopy: () => void;
}

export function UrlBar({ url, copied, onCopy }: UrlBarProps) {
    return (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
            <input
                readOnly
                value={url}
                className="bg-transparent flex-1 outline-none text-sm font-mono text-muted-foreground"
            />
            <Button variant="secondary" onClick={onCopy}>
                {copied ? "Copied!" : "Copy"}
            </Button>
        </div>
    );
}
