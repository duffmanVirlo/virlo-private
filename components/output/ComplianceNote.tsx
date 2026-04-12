import type { ComplianceResult } from "@/types/score";

type ComplianceNoteProps = {
  compliance: ComplianceResult;
};

export function ComplianceNote({ compliance }: ComplianceNoteProps) {
  if (!compliance.category_requires_compliance || compliance.modifications_made.length === 0) {
    return null;
  }

  return (
    <div className="border border-warning/20 rounded-lg bg-warning/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-warning flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-xs font-semibold text-warning uppercase tracking-wider">
          Compliance Protection Applied
        </p>
      </div>

      {compliance.creator_note && (
        <p className="text-sm text-text-secondary">{compliance.creator_note}</p>
      )}

      <div className="space-y-2">
        {compliance.modifications_made.map((mod, i) => (
          <div key={i} className="text-xs text-text-muted space-y-0.5">
            <p><span className="line-through text-error/60">{mod.original}</span></p>
            <p><span className="text-success/80">{mod.replacement}</span></p>
            <p className="italic">{mod.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
