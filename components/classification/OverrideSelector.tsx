"use client";

import { useState } from "react";
import { ALL_CATEGORIES, type CategoryId } from "@/types/classification";

type OverrideSelectorProps = {
  currentCategory: CategoryId;
  currentProductType: string;
  onOverride: (category: CategoryId, productType: string) => void;
  onCancel: () => void;
};

export function OverrideSelector({
  currentCategory,
  currentProductType,
  onOverride,
  onCancel,
}: OverrideSelectorProps) {
  const [category, setCategory] = useState<CategoryId>(currentCategory);
  const [productType, setProductType] = useState(currentProductType);

  return (
    <div className="border border-accent/20 rounded-xl bg-accent-surface/50 p-5 space-y-4 animate-fade-in">
      <p className="text-sm font-medium text-text-primary">Override Classification</p>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryId)}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/50"
          >
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
            Product Type
          </label>
          <input
            type="text"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/50"
            placeholder="e.g., Vitamin C Serum"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onOverride(category, productType)}
          className="px-4 py-2 bg-accent text-void rounded-lg text-sm font-semibold hover:bg-accent-bright transition-colors"
        >
          Apply Override
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-elevated text-text-secondary rounded-lg text-sm hover:text-text-primary transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
