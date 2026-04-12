export type QAResult = {
  passed: boolean;
  overall_score: number;
  scores: {
    hook_strength: number;
    belief_loop_completeness: number;
    proof_authenticity: number;
    generic_language: number;
    filming_feasibility: number;
    cta_naturalness: number;
  };
  flags: {
    component: string;
    issue: string;
    severity: "blocking" | "warning";
  }[];
  regeneration_targets: string[];
};

export type ComplianceResult = {
  category_requires_compliance: boolean;
  modifications_made: {
    original: string;
    replacement: string;
    reason: string;
  }[];
  creator_note: string | null;
  cleared: boolean;
};
