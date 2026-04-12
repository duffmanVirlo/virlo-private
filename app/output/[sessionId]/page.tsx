"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import type { OutputPackage } from "@/types/output";
import { OutputShell } from "@/components/output/OutputShell";

type OutputPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default function OutputPage({ params }: OutputPageProps) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [output, setOutput] = useState<OutputPackage | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem(`virlo_output_${sessionId}`);
    if (!data) {
      router.push("/");
      return;
    }
    setOutput(JSON.parse(data));
  }, [sessionId, router]);

  if (!output) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-text-muted">Loading output...</p>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="sticky top-0 z-10 bg-void/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-text-muted hover:text-text-secondary transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            New Analysis
          </button>
          <span className="font-display text-sm font-semibold text-text-primary">Virlo</span>
        </div>
      </div>
      <OutputShell output={output} />
    </main>
  );
}
