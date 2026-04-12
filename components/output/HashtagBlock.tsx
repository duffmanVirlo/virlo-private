"use client";

import type { GeneratedScript } from "@/types/script";
import { CopyButton } from "@/components/ui/CopyButton";

type HashtagBlockProps = {
  hashtags: GeneratedScript["hashtags"];
};

export function HashtagBlock({ hashtags }: HashtagBlockProps) {
  const allTags = [...hashtags.broad, ...hashtags.mid, ...hashtags.specific]
    .map((t) => (t.startsWith("#") ? t : `#${t}`))
    .join(" ");

  const tierData = [
    { label: "Broad", tags: hashtags.broad },
    { label: "Mid", tags: hashtags.mid },
    { label: "Specific", tags: hashtags.specific },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted uppercase tracking-wider">Hashtags</p>
        <CopyButton text={allTags} label="Copy All" />
      </div>

      <div className="space-y-3">
        {tierData.map(({ label, tags }) => (
          <div key={label} className="space-y-1.5">
            <p className="text-xs text-text-muted">{label}</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs bg-elevated text-text-secondary rounded-md border border-border"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
