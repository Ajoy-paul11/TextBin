"use client";

import { useState } from "react";
import { createPaste } from "@/lib/api";
import { Heading } from "@/components/ui/Heading";
import { SubHeading } from "@/components/ui/SubHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LabeledTextarea } from "@/components/ui/LabeledTextarea";
import { LabeledInput } from "@/components/ui/LabeledInput";
import { TtlSelect } from "@/components/ui/TtlSelect";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { UrlBar } from "@/components/ui/UrlBar";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState<number | undefined>(undefined);
  const [maxViews, setMaxViews] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const data = await createPaste(content, ttl, maxViews);
      setResultUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (resultUrl) {
      navigator.clipboard.writeText(resultUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setContent("");
    setTtl(undefined);
    setMaxViews(undefined);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 h-full overflow-auto custom-scrollbar flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-3">
          <Heading>Share Code Instantly</Heading>
          <SubHeading>Secure, temporary text storage.</SubHeading>
        </div>

        {resultUrl ? (
          <Card className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-500"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Paste Created!</h2>

            <UrlBar url={resultUrl} copied={copied} onCopy={handleCopy} />

            <a
              href={resultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-1/3 mx-auto text-center py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-800 text-primary-foreground font-bold text-base shadow-md transition-all"
            >
              Visit Paste
            </a>

            <Button variant="link" onClick={resetForm}>
              Create another paste
            </Button>
          </Card>
        ) : (
          <Card>
            <form onSubmit={handleSubmit} className="space-y-5">
              <LabeledTextarea
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your code or text here..."
                className="h-52"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TtlSelect value={ttl} onChange={setTtl} />

                <LabeledInput
                  label="Max Views"
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  value={maxViews ?? ""}
                  onChange={(e) =>
                    setMaxViews(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </div>

              <ErrorAlert message={error || ""} />

              <Button
                type="submit"
                isLoading={loading}
                disabled={!content.trim()}
              >
                Create Paste
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
