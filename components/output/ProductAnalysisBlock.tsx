import type { ProductAnalysis } from "@/types/analysis";

type ProductAnalysisBlockProps = {
  analysis: ProductAnalysis;
};

export function ProductAnalysisBlock({ analysis }: ProductAnalysisBlockProps) {
  const roleLabels: Record<string, string> = {
    "demonstration-led": "Demonstration-Led",
    "transformation-led": "Transformation-Led",
    "utility-led": "Utility-Led",
    "curiosity-led": "Curiosity-Led",
    "fear-led": "Fear-Led",
    "convenience-led": "Convenience-Led",
    "identity-led": "Identity-Led",
    "relief-led": "Relief-Led",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {analysis.functional_role.map((role) => (
          <span
            key={role}
            className={`px-2.5 py-0.5 text-xs rounded-full border ${
              role === analysis.primary_role
                ? "bg-accent-surface text-accent border-accent/20"
                : "bg-elevated text-text-muted border-border"
            }`}
          >
            {roleLabels[role] || role}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Buyer Motivation</p>
          <div className="grid gap-2">
            {(["surface", "deep", "avoidance", "identity"] as const).map((key) => (
              <div
                key={key}
                className={`text-sm ${
                  key === analysis.buyer_motivation.weighted_primary
                    ? "text-text-primary font-medium"
                    : "text-text-muted"
                }`}
              >
                <span className="text-xs uppercase tracking-wider mr-2">
                  {key === analysis.buyer_motivation.weighted_primary ? ">" : " "} {key}:
                </span>
                {analysis.buyer_motivation[key]}
              </div>
            ))}
          </div>
        </div>

        {analysis.belief_barriers.length > 0 && (
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Belief Barriers</p>
            {analysis.belief_barriers.map((barrier, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-text-secondary py-1">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${
                    barrier.weight === "high"
                      ? "bg-error/10 text-error"
                      : barrier.weight === "medium"
                        ? "bg-warning/10 text-warning"
                        : "bg-elevated text-text-muted"
                  }`}
                >
                  {barrier.weight}
                </span>
                <span>{barrier.statement}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
