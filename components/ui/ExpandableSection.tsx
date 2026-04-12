"use client";

import { useState } from "react";

type ExpandableSectionProps = {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function ExpandableSection({
  title,
  badge,
  defaultOpen = false,
  children,
  className = "",
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface hover:bg-elevated transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-text-primary tracking-wide uppercase">
            {title}
          </span>
          {badge && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-accent-surface text-accent border border-accent/20">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 py-4 border-t border-border bg-surface/50 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}
