"use client";

import { useState, useEffect, useRef, forwardRef } from "react";

type ProductLinkInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
};

export const ProductLinkInput = forwardRef<HTMLInputElement, ProductLinkInputProps>(
  function ProductLinkInput({ value, onChange, error, disabled }, ref) {
    const [isFocused, setIsFocused] = useState(false);
    const internalRef = useRef<HTMLInputElement>(null);

    // Merge forwarded ref with internal ref
    const setRefs = (el: HTMLInputElement | null) => {
      (internalRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    };

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // Native 'input' event listener — catches iOS Safari paste/autofill that
    // React's synthetic onChange misses. Best-effort state sync.
    useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      const handleNativeInput = () => {
        onChangeRef.current(el.value);
      };

      el.addEventListener("input", handleNativeInput);
      return () => el.removeEventListener("input", handleNativeInput);
    }, []);

    return (
      <div className="w-full space-y-1.5">
        <div
          className={`relative rounded-xl transition-all duration-200 ${
            error
              ? "border border-error/40 bg-error/5 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
              : isFocused
                ? "border border-accent/30 bg-void shadow-[0_0_0_3px_rgba(245,158,11,0.06)]"
                : "border border-border-subtle bg-void/80 hover:border-border"
          }`}
        >
          <input
            ref={setRefs}
            type="text"
            inputMode="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder="https://www.tiktok.com/t/..."
            className="w-full bg-transparent px-4 py-3.5 text-[15px] text-text-primary placeholder:text-text-faint outline-none disabled:opacity-40 font-mono tracking-tight"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        {error && (
          <p className="text-xs text-error pl-1 animate-fade-in">{error}</p>
        )}
      </div>
    );
  },
);
