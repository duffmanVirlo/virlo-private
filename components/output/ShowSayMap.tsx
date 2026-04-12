import type { ShowSayMap as ShowSayMapType } from "@/types/showSay";

type ShowSayMapProps = {
  showSay: ShowSayMapType;
};

export function ShowSayMapDisplay({ showSay }: ShowSayMapProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Must Show */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-beat-show" />
          <p className="text-xs font-semibold text-text-primary uppercase tracking-wider">Must Show</p>
        </div>
        <div className="space-y-2">
          {showSay.must_show.map((item, i) => (
            <div key={i} className="bg-elevated rounded-lg p-3 border border-border-subtle">
              <p className="text-sm text-text-primary">{item.instruction}</p>
              <p className="text-xs text-text-muted mt-1">{item.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Can Say */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-beat-spoken" />
          <p className="text-xs font-semibold text-text-primary uppercase tracking-wider">Can Say</p>
        </div>
        <div className="space-y-2">
          {showSay.can_say.map((item, i) => (
            <div key={i} className="bg-elevated rounded-lg p-3 border border-border-subtle">
              <p className="text-sm text-text-primary">&ldquo;{item.line}&rdquo;</p>
              <p className="text-xs text-text-muted mt-1">{item.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Never Say */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-error" />
          <p className="text-xs font-semibold text-text-primary uppercase tracking-wider">Never Say</p>
        </div>
        <div className="space-y-2">
          {showSay.never_say.map((item, i) => (
            <div key={i} className="bg-elevated rounded-lg p-3 border border-error/10">
              <p className="text-sm text-error/80">{item.blocked_phrase_type}</p>
              <p className="text-xs text-text-muted mt-1">Instead: {item.instead}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
