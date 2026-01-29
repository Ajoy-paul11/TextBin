import React from "react";

interface TtlSelectProps {
    value: number | undefined;
    onChange: (val: number | undefined) => void;
}

export function TtlSelect({ value, onChange }: TtlSelectProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground ml-1">Expiration (Seconds)</label>
            <div className="flex gap-2">
                <input
                    type="number"
                    min="1"
                    placeholder="Custom"
                    className="w-1/2 p-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary outline-none text-sm"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
                <select
                    className="w-1/2 p-2.5 rounded-lg bg-muted/50 border border-border focus:border-primary outline-none appearance-none cursor-pointer text-sm"
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === "never") onChange(undefined);
                        else if (val) onChange(Number(val));
                    }}
                    value={value === undefined ? "never" : (value && [15, 30, 45, 60, 300, 600, 900, 1800, 3600, 86400, 604800].includes(value) ? value : "")}
                >
                    <option value="" disabled className="bg-gray-950 text-white">Presets...</option>
                    <option value="never" className="bg-gray-950 text-white">Never</option>
                    <option value="15" className="bg-gray-950 text-white">15s (15 Seconds)</option>
                    <option value="30" className="bg-gray-950 text-white">30s (30 Seconds)</option>
                    <option value="45" className="bg-gray-950 text-white">45s (45 Seconds)</option>
                    <option value="60" className="bg-gray-950 text-white">60s (1 Minute)</option>
                    <option value="300" className="bg-gray-950 text-white">300s (5 Minutes)</option>
                    <option value="600" className="bg-gray-950 text-white">600s (10 Minutes)</option>
                    <option value="900" className="bg-gray-950 text-white">900s (15 Minutes)</option>
                    <option value="1800" className="bg-gray-950 text-white">1800s (30 Minutes)</option>
                    <option value="3600" className="bg-gray-950 text-white">3600s (1 Hour)</option>
                    <option value="86400" className="bg-gray-950 text-white">86400s (1 Day)</option>
                </select>
            </div>
        </div>
    );
}
