import { CopyButton } from "@/components/ui/CopyButton";

type CaptionBlockProps = {
  caption: string;
};

export function CaptionBlock({ caption }: CaptionBlockProps) {
  return (
    <div className="border border-border rounded-lg bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted uppercase tracking-wider">Caption</p>
        <CopyButton text={caption} />
      </div>
      <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{caption}</p>
    </div>
  );
}
