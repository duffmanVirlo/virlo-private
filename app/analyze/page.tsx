"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ExtractedProduct } from "@/types/product";
import type { ClassificationResult, CategoryId } from "@/types/classification";
import type { PipelineStage, PipelineStageStatus } from "@/types/pipeline";
import { STAGE_LABELS } from "@/types/pipeline";
import { ClassificationCard } from "@/components/classification/ClassificationCard";
import { OverrideSelector } from "@/components/classification/OverrideSelector";
import { ProcessingShell } from "@/components/processing/ProcessingShell";
import { UsageBadge } from "@/components/usage/UsageBadge";
import { UsageGate } from "@/components/usage/UsageGate";
import { useUsage } from "@/lib/usage/hooks";
import { isFounderMode } from "@/lib/usage/founderMode";

export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <p className="text-text-muted">Loading...</p>
        </main>
      }
    >
      <AnalyzeContent />
    </Suspense>
  );
}

type Phase = "classification" | "override" | "generating" | "complete" | "error" | "usage_blocked";

function AnalyzeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const usage = useUsage();

  const [phase, setPhase] = useState<Phase>("classification");
  const [product, setProduct] = useState<ExtractedProduct | null>(null);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [overrideCategory, setOverrideCategory] = useState<CategoryId | undefined>();
  const [overrideProductType, setOverrideProductType] = useState<string | undefined>();
  const [currentStage, setCurrentStage] = useState<PipelineStage>("extracting");
  const [stageStatuses, setStageStatuses] = useState<Record<string, PipelineStageStatus>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    const productData = sessionStorage.getItem(`virlo_product_${sessionId}`);
    const classData = sessionStorage.getItem(`virlo_classification_${sessionId}`);

    if (!productData || !classData) {
      router.push("/");
      return;
    }

    setProduct(JSON.parse(productData));
    setClassification(JSON.parse(classData));
  }, [sessionId, router]);

  const handleConfirm = useCallback(async () => {
    if (!sessionId) return;

    const url = sessionStorage.getItem(`virlo_url_${sessionId}`);
    if (!url) return;

    // ── Usage check: gate BEFORE generation (check only, don't consume) ──
    // Belt-and-suspenders: directly check founder mode at gate time.
    // This catches any case where useUsage's state hasn't fully propagated
    // the founder flag after a route transition.
    if (!isFounderMode()) {
      const checkResult = usage.check;
      if (!checkResult.allowed) {
        usage.refresh();
        setPhase("usage_blocked");
        return;
      }
    }
    // Check passed — generation will proceed.
    // Usage is consumed AFTER successful completion (not before).
    // ─────────────────────────────────────────────────────────────────

    setPhase("generating");

    const initialStatuses: Record<string, PipelineStageStatus> = {};
    STAGE_LABELS.forEach(({ stage }) => {
      initialStatuses[stage] = "pending";
    });
    setStageStatuses(initialStatuses);

    try {
      // Send already-extracted product and classification to skip redundant
      // extraction + classification in the pipeline (~15-25s savings).
      const productData = sessionStorage.getItem(`virlo_product_${sessionId}`);
      const classData = sessionStorage.getItem(`virlo_classification_${sessionId}`);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          sessionId,
          overrideCategory,
          overrideProductType,
          product: productData ? JSON.parse(productData) : undefined,
          classification: classData ? JSON.parse(classData) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed.");
      }

      const output = await res.json();
      sessionStorage.setItem(`virlo_output_${sessionId}`, JSON.stringify(output));

      // ── Usage: consume ONLY after successful generation ────────────
      // Failed runs, parse errors, and pipeline crashes do NOT decrement.
      // Founder mode is exempt — consumeRun() already returns true without
      // modifying state when founder mode is active.
      usage.consumeRun();

      const completeStatuses: Record<string, PipelineStageStatus> = {};
      STAGE_LABELS.forEach(({ stage }) => {
        completeStatuses[stage] = "complete";
      });
      setStageStatuses(completeStatuses);
      setCurrentStage("complete");

      // Refresh usage state to reflect the consumed run in the badge
      usage.refresh();

      setTimeout(() => {
        router.push(`/output/${sessionId}`);
      }, 800);
    } catch (err) {
      setPhase("error");
      setErrorMessage(err instanceof Error ? err.message : "Generation failed. Please try again.");
      setCurrentStage("failed");
    }
  }, [sessionId, overrideCategory, overrideProductType, router, usage]);

  useEffect(() => {
    if (phase !== "generating") return;

    const stages = STAGE_LABELS.map((s) => s.stage);
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx >= stages.length - 1) {
        clearInterval(interval);
        return;
      }

      setStageStatuses((prev) => {
        const next = { ...prev };
        next[stages[currentIdx]] = "complete";
        if (currentIdx + 1 < stages.length) {
          next[stages[currentIdx + 1]] = "active";
          setCurrentStage(stages[currentIdx + 1]);
        }
        return next;
      });

      currentIdx++;
    }, 4000 + Math.random() * 3000);

    setStageStatuses((prev) => ({
      ...prev,
      [stages[0]]: "active",
    }));
    setCurrentStage(stages[0]);

    pollRef.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, [phase]);

  if (!product || !classification) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-text-muted">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      {/* ── Usage blocked state ──────────────────────────────────────── */}
      {phase === "usage_blocked" && (
        <UsageGate
          check={usage.check}
          onStartOver={() => router.push("/")}
        />
      )}

      {/* ── Classification confirmation ──────────────────────────────── */}
      {phase === "classification" && (
        <div className="max-w-lg w-full space-y-6 animate-fade-in">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            <span aria-hidden="true">&larr;</span> Back to Virlo
          </button>

          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              Product Identified
            </h2>
            <p className="text-sm text-text-muted">
              Confirm the classification to generate your strategy.
            </p>
            <p className="text-xs text-text-faint">
              ConvertIQ will analyze this product and build your filming-ready strategy.
            </p>
          </div>

          <ClassificationCard
            classification={classification}
            productTitle={product.title}
          />

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleConfirm}
              className="w-full sm:w-auto px-8 py-3.5 bg-accent text-void rounded-xl text-base font-semibold hover:bg-accent-bright transition-colors active:scale-[0.98] shadow-[0_1px_12px_rgba(245,158,11,0.2)]"
            >
              Generate Strategy
            </button>

            {classification.requires_override_prompt && phase === "classification" && (
              <button
                onClick={() => setPhase("override")}
                className="text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                Override classification
              </button>
            )}

            {!classification.requires_override_prompt && (
              <button
                onClick={() => setPhase("override")}
                className="text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                Override
              </button>
            )}
          </div>

          {/* Usage badge */}
          <div className="flex justify-center pt-2">
            <UsageBadge
              planName={usage.planName}
              planId={usage.state.plan_id}
              runsRemaining={usage.runsRemaining}
              dailyLimit={usage.dailyLimit}
            />
          </div>
        </div>
      )}

      {/* ── Override ─────────────────────────────────────────────────── */}
      {phase === "override" && (
        <div className="max-w-lg w-full space-y-6 animate-fade-in">
          <ClassificationCard
            classification={classification}
            productTitle={product.title}
          />

          <OverrideSelector
            currentCategory={classification.primary_category}
            currentProductType={classification.product_type}
            onOverride={(cat, type) => {
              setOverrideCategory(cat);
              setOverrideProductType(type);
              setPhase("classification");
              setClassification({
                ...classification,
                primary_category: cat,
                product_type: type,
                confidence: 100,
                confidence_label: "high",
                requires_override_prompt: false,
                reason: `Manually set to ${cat} / ${type}`,
              });
            }}
            onCancel={() => setPhase("classification")}
          />
        </div>
      )}

      {/* ── Generating ───────────────────────────────────────────────── */}
      {phase === "generating" && (
        <ProcessingShell
          currentStage={currentStage}
          stageStatuses={stageStatuses}
        />
      )}

      {/* ── Error ────────────────────────────────────────────────────── */}
      {phase === "error" && (
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              Something went wrong
            </h2>
            <p className="text-sm text-text-secondary">
              {errorMessage}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => {
                setPhase("classification");
                setErrorMessage(null);
              }}
              className="px-6 py-2.5 bg-accent text-void rounded-xl text-sm font-semibold hover:bg-accent-bright transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-text-muted hover:text-text-secondary transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
