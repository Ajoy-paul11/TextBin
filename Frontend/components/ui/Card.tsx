import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className = "" }: CardProps) {
    return (
        <div className={`glass-card p-6 md:p-8 rounded-xl shadow-xl transition-all duration-300 ${className}`}>
            {children}
        </div>
    );
}
