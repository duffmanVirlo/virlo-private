import type { GeneratedScript } from "@/types/script";

type ProblemSolutionBlockProps = {
  logic: GeneratedScript["problem_solution_logic"];
};

export function ProblemSolutionBlock({ logic }: ProblemSolutionBlockProps) {
  return (
    <div className="space-y-3">
      <div className="bg-elevated rounded-lg p-4 space-y-1">
        <p className="text-xs text-text-muted uppercase tracking-wider">Problem Framing</p>
        <p className="text-sm text-text-primary">{logic.problem_framing}</p>
        <p className="text-xs text-text-muted mt-2">{logic.why_this_framing}</p>
      </div>
      <div className="bg-elevated rounded-lg p-4 space-y-1">
        <p className="text-xs text-text-muted uppercase tracking-wider">Solution Positioning</p>
        <p className="text-sm text-text-primary">{logic.solution_positioning}</p>
      </div>
    </div>
  );
}
