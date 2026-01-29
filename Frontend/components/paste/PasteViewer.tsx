"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { detectLanguage } from "@/lib/utils";

interface PasteViewerProps {
    content: string;
}

export function PasteViewer({ content }: PasteViewerProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const detectedLanguage = detectLanguage(content);

    return (
        <div className="relative group text-sm h-[calc(100vh-12rem)] overflow-auto custom-scrollbar">
            <div className="absolute top-4 right-4 z-10 opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 shadow-sm backdrop-blur-sm text-xs font-medium transition-all text-white"
                >
                    {copied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Copied
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            Copy
                        </>
                    )}
                </button>
            </div>
            <SyntaxHighlighter
                language={detectedLanguage}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    paddingTop: '3rem',
                    background: 'transparent',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    minHeight: '100%'
                }}
                wrapLongLines={true}
            >
                {content}
            </SyntaxHighlighter>
        </div>
    );
}
