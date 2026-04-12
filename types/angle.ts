export type AngleScore = {
  scroll_stop: number;
  retention_arc: number;
  belief_formation: number;
  filming_feasibility: number;
  cta_naturalness: number;
  proof_concentration: number;
  composite: number;
};

export type AngleSelection = {
  selected: {
    name: string;
    conversion_hypothesis: string;
    entry_mechanism: string;
    proof_vehicle: string;
    belief_formation_path: string;
    cta_setup: string;
    score: AngleScore;
    creator_pattern_source: string;
  };
  rejected: {
    name: string;
    score: AngleScore;
    primary_rejection_reason: string;
  }[];
};
