import type { ClassificationResult } from "@/types/classification";
import { ConfidenceBar } from "./ConfidenceBar";
import { Badge } from "@/components/ui/Badge";

type ClassificationCardProps = {
  classification: ClassificationResult;
  productTitle?: string | null;
};

export function ClassificationCard({ classification, productTitle }: ClassificationCardProps) {
  return (
    <div className="border border-border rounded-xl bg-surface p-6 space-y-5 animate-slide-up">
      <div className="space-y-3">
        {productTitle && (
          <p className="text-sm text-text-secondary line-clamp-2">{productTitle}</p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="accent">{classification.primary_category}</Badge>
          <span className="text-lg font-semibold text-text-primary">
            {classification.product_type}
          </span>
        </div>
        {classification.secondary_modifier && (
          <p className="text-sm text-text-muted">{classification.secondary_modifier}</p>
        )}
      </div>

      <ConfidenceBar
        confidence={classification.confidence}
        label={classification.confidence_label}
      />

      <p className="text-sm text-text-secondary leading-relaxed">
        {classification.reason}
      </p>

      {classification.competing_classification && (
        <div className="border-t border-border-subtle pt-4">
          <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Alternative classification</p>
          <div className="flex items-center gap-2">
            <Badge>{classification.competing_classification.category}</Badge>
            <span className="text-sm text-text-secondary">
              {classification.competing_classification.product_type}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            {classification.competing_classification.reason_rejected}
          </p>
        </div>
      )}
    </div>
  );
}
