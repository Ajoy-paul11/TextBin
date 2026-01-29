import React from "react";

interface LabeledTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export function LabeledTextarea({ label, className = "", ...props }: LabeledTextareaProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground ml-1">{label}</label>
            <textarea
                className={`w-full p-4 rounded-lg bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none font-mono text-sm transition-all ${className}`}
                {...props}
            />
        </div>
    );
}
