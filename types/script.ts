export type BeatType = "SHOW" | "SPOKEN" | "TEXT" | "HOLD" | "CREATOR_NOTE";

export type ScriptBeat = {
  start_seconds: number;
  end_seconds: number;
  type: BeatType;
  content: string;
  spoken: string | null;
  text_overlay: string | null;
  filming_note: string | null;
};

export type HookOption = {
  rank: 1 | 2 | 3;
  hook_text: string;
  hook_format: "spoken" | "visual" | "text-overlay";
  rationale: string;
  performance_note: string;
};

export type GeneratedScript = {
  beats: ScriptBeat[];
  total_duration_seconds: number;
  hook_options: HookOption[];
  problem_solution_logic: {
    problem_framing: string;
    why_this_framing: string;
    solution_positioning: string;
  };
  cta_logic: {
    proof_beat_echoed: string;
    viewer_state_at_cta: string;
    cta_text: string;
    pressure_mechanism: string | null;
    why_it_works: string;
  };
  caption: string;
  hashtags: {
    broad: string[];
    mid: string[];
    specific: string[];
  };
  content_structure_note: string;
  filming_instructions: {
    location: string;
    shots: {
      label: string;
      instructions: string[];
    }[];
    lighting: string;
    equipment_note: string;
  };
};
