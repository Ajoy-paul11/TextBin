import React from "react";

interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function LabeledInput({ label, className = "", ...props }: LabeledInputProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground ml-1">{label}</label>
            <input
                className={`w-full p-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary outline-none text-sm ${className}`}
                {...props}
            />
        </div>
    );
}
