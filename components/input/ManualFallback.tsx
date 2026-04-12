"use client";

import { useState } from "react";
import { ALL_CATEGORIES, type CategoryId } from "@/types/classification";
import type { ExtractedProduct } from "@/types/product";
import { LoadingDots } from "@/components/ui/LoadingDots";

type ManualFallbackProps = {
  partialData: Partial<ExtractedProduct> | null;
  errorMessage: string;
  submitError: string | null;
  isSubmitting: boolean;
  onSubmit: (product: ExtractedProduct) => Promise<void> | void;
  onBack: () => void;
};

export function ManualFallback({
  partialData,
  errorMessage,
  submitError,
  isSubmitting,
  onSubmit,
  onBack,
}: ManualFallbackProps) {
  const [name, setName] = useState(partialData?.title || "");
  const [description, setDescription] = useState(partialData?.description || "");
  const [category, setCategory] = useState<CategoryId | "">(
    (partialData?.category_tags?.[0]?.toUpperCase() as CategoryId) || "",
  );
  const [productType, setProductType] = useState("");
  const [price, setPrice] = useState(partialData?.price?.toString() || "");
  const [notes, setNotes] = useState("");
  const [attempted, setAttempted] = useState(false);

  const nameValid = name.trim().length > 0;
  const categoryValid = category !== "";
  const canSubmit = nameValid && categoryValid;

  const handleSubmit = async () => {
    setAttempted(true);

    if (!canSubmit || isSubmitting) {
      return;
    }

    const product: ExtractedProduct = {
      url: partialData?.url || "",
      title: name.trim(),
      description: description.trim() || null,
      price: price ? parseFloat(price) : null,
      currency: "USD",
      images: partialData?.images || [],
      category_tags: category ? [category.toLowerCase()] : [],
      ingredients_or_materials: null,
      claims: notes
        ? notes
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
        : [],
      review_signals: {
        rating: partialData?.review_signals?.rating || null,
        review_count: partialData?.review_signals?.review_count || null,
        recurring_phrases: partialData?.review_signals?.recurring_phrases || [],
      },
      badges: partialData?.badges || [],
      sold_count: partialData?.sold_count || null,
      raw_text: [name, description, notes].filter(Boolean).join(" "),
    };

    await onSubmit(product);
  };

  return (
    <div className="max-w-lg w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-surface border border-accent/20 text-accent text-xs font-medium mb-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Manual Entry
        </div>
        <h2 className="font-display text-2xl font-bold text-text-primary">
          Tell us about the product
        </h2>
        <p className="text-sm text-text-secondary max-w-sm mx-auto">
          {errorMessage} Add the product details below and ConvertIQ will build your strategy from there.
        </p>
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error animate-fade-in">
          {submitError}
        </div>
      )}

      {/* Form */}
      <div className="space-y-4">
        {/* Product Name — required */}
        <div>
          <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
            Product Name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., MagGrip Pro Magnetic Tool Mat"
            disabled={isSubmitting}
            className={`w-full bg-surface border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors disabled:opacity-50 ${
              attempted && !nameValid
                ? "border-error/50 focus:border-error/70"
                : "border-border focus:border-accent/50"
            }`}
          />
          {attempted && !nameValid && (
            <p className="text-xs text-error mt-1 pl-1">Product name is required.</p>
          )}
        </div>

        {/* Category — required */}
        <div>
          <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
            Category <span className="text-accent">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryId)}
            disabled={isSubmitting}
            className={`w-full bg-surface border rounded-xl px-4 py-3 text-sm text-text-primary outline-none transition-colors disabled:opacity-50 ${
              attempted && !categoryValid
                ? "border-error/50 focus:border-error/70"
                : "border-border focus:border-accent/50"
            }`}
          >
            <option value="">Select category</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {attempted && !categoryValid && (
            <p className="text-xs text-error mt-1 pl-1">Please select a category.</p>
          )}
        </div>

        {/* Product Type */}
        <div>
          <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
            Product Type
          </label>
          <input
            type="text"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            placeholder="e.g., Magnetic Tool Organization, Vitamin C Serum"
            disabled={isSubmitting}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-colors disabled:opacity-50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does the product do? What problem does it solve? Key features?"
            rows={3}
            disabled={isSubmitting}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-colors resize-none disabled:opacity-50"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
            Price
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 29.99"
            disabled={isSubmitting}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-colors disabled:opacity-50"
          />
        </div>

        {/* Notes / Claims */}
        <div>
          <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
            Product Claims or Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Key selling points, claims, or anything else that would help (one per line)"
            rows={3}
            disabled={isSubmitting}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-colors resize-none disabled:opacity-50"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 ${
            isSubmitting
              ? "bg-accent/70 text-void cursor-wait"
              : canSubmit
                ? "bg-accent text-void hover:bg-accent-bright active:scale-[0.98] shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                : "bg-elevated text-text-muted cursor-not-allowed border border-border"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              Analyzing <LoadingDots />
            </span>
          ) : (
            "Continue with ConvertIQ"
          )}
        </button>
        {!isSubmitting && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            Try a different link
          </button>
        )}
      </div>
    </div>
  );
}
