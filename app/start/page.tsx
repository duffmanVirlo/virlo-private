"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProductLinkInput } from "@/components/input/ProductLinkInput";
import { AnalyzeButton } from "@/components/input/AnalyzeButton";
import { ManualFallback } from "@/components/input/ManualFallback";
import type { ExtractedProduct } from "@/types/product";
import { isValidUrl, sanitizeUrl, generateSessionId } from "@/lib/utils";

export default function StartPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"input" | "fallback">("input");
  const [partialData, setPartialData] = useState<Partial<ExtractedProduct> | null>(null);
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [fallbackSubmitting, setFallbackSubmitting] = useState(false);
  const [fallbackError, setFallbackError] = useState<string | null>(null);

  // Ref to the actual DOM input — source of truth for the URL value,
  // because iOS Safari paste can update the DOM without firing React onChange.
  const inputRef = useRef<HTMLInputElement>(null);

  const proceedWithProduct = useCallback(
    async (product: ExtractedProduct, sourceUrl: string) => {
      const classifyRes = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      if (!classifyRes.ok) {
        const data = await classifyRes.json();
        throw new Error(data.error || "Failed to classify product.");
      }
      const classification = await classifyRes.json();
      const sessionId = generateSessionId();
      sessionStorage.setItem(`virlo_product_${sessionId}`, JSON.stringify(product));
      sessionStorage.setItem(`virlo_classification_${sessionId}`, JSON.stringify(classification));
      sessionStorage.setItem(`virlo_url_${sessionId}`, product.url || sanitizeUrl(sourceUrl));
      router.push(`/analyze?session=${sessionId}`);
    },
    [router],
  );

  const handleAnalyze = useCallback(async () => {
    setError(null);

    // Read the ACTUAL DOM input value — not React state.
    // iOS Safari paste can put text in the DOM without updating React state.
    const rawValue = inputRef.current?.value ?? url;
    const cleanUrl = sanitizeUrl(rawValue);

    if (!isValidUrl(cleanUrl)) {
      setError("Please enter a valid product URL.");
      return;
    }

    // Sync React state with the DOM value we're using
    setUrl(rawValue);
    setLoading(true);

    try {
      const extractRes = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });
      const data = await extractRes.json();
      if (data.success && data.product) {
        await proceedWithProduct(data.product, rawValue);
        return;
      }
      setPartialData(data.partial || { url: data.resolvedUrl || cleanUrl });
      setFallbackMessage(data.error || "We couldn't fully read the product page.");
      setPhase("fallback");
      setLoading(false);
    } catch (err) {
      if (phase === "input") {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setLoading(false);
        return;
      }
      setPartialData({ url: cleanUrl });
      setFallbackMessage("We couldn't reach the product page.");
      setPhase("fallback");
      setLoading(false);
    }
  }, [url, proceedWithProduct, phase]);

  const handleManualSubmit = useCallback(
    async (product: ExtractedProduct) => {
      setFallbackSubmitting(true);
      setFallbackError(null);
      try {
        await proceedWithProduct(product, url);
      } catch (err) {
        setFallbackError(err instanceof Error ? err.message : "Something went wrong.");
        setFallbackSubmitting(false);
      }
    },
    [proceedWithProduct, url],
  );

  if (phase === "fallback") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <ManualFallback partialData={partialData} errorMessage={fallbackMessage} submitError={fallbackError} isSubmitting={fallbackSubmitting} onSubmit={handleManualSubmit}
          onBack={() => { setPhase("input"); setError(null); setLoading(false); setFallbackSubmitting(false); setFallbackError(null); }} />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-5 py-20 min-h-screen relative">
      {/* Background consistency with landing page */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_40%,rgba(232,168,48,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <a href="/" className="inline-block font-display text-lg font-bold text-text-primary tracking-tight hover:text-accent transition-colors">
            Virlo
          </a>
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Start with a product
            </h1>
            <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
              Paste a product link and ConvertIQ will build your filming-ready strategy.
            </p>
          </div>
        </div>

        {/* Input card */}
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-4 shadow-[0_4px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)_inset]">
          <ProductLinkInput
            ref={inputRef}
            value={url}
            onChange={(v) => { setUrl(v); if (error) setError(null); }}
            error={error}
            disabled={loading}
          />
          <AnalyzeButton onClick={handleAnalyze} loading={loading} disabled={!url.trim()} />
        </div>

        {/* Supporting text */}
        <div className="text-center space-y-1.5">
          <p className="text-[11px] text-text-faint">
            Powered by ConvertIQ &middot; Strategy ready in minutes
          </p>
          <a href="/" className="text-[11px] text-text-faint hover:text-text-muted transition-colors">
            &larr; Back to Virlo
          </a>
        </div>
      </div>
    </main>
  );
}
