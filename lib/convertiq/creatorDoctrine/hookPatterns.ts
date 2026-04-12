export type HookArchetype = {
  id: string;
  name: string;
  structure: string;
  why_it_works: string;
  best_for: string[];
  modality_affinity: string[];
  example_structure: string;
  anti_pattern: string;
  priority: "primary" | "secondary" | "conditional";
};

export const HOOK_ARCHETYPES: HookArchetype[] = [
  // ── PRIMARY ARCHETYPES (strongest defaults) ──────────────────────────

  {
    id: "curiosity-gap",
    name: "Curiosity Gap",
    structure: "Open with a statement or visual that creates an information gap the viewer must resolve. The gap must be specific enough to feel answerable, not so vague it feels clickbait.",
    why_it_works: "The brain cannot leave an open loop unresolved. A specific curiosity gap creates a 'I need to see what happens' response that holds attention through the payoff beat.",
    best_for: ["TECH", "HOME", "KITCHEN", "AUTO", "OUTDOOR"],
    modality_affinity: ["demo-first", "silent-visual-first", "voiceover-led"],
    example_structure: "[Specific unexpected action or claim that raises a question] -> viewer stays to see what happens",
    anti_pattern: "Vague curiosity like 'wait for it' or 'you won't believe this' without a specific visual or claim. The gap must be concrete.",
    priority: "primary",
  },
  {
    id: "disbelief-reveal",
    name: "Disbelief / Reveal",
    structure: "Open with a visual or claim that seems too good to be true, or that contradicts what the viewer expects. The product then proves the claim within seconds.",
    why_it_works: "Disbelief creates involuntary attention — the viewer watches to either confirm or disprove what they just saw. When the proof lands, belief is stronger because the viewer arrived at it themselves.",
    best_for: ["AUTO", "TECH", "HOME", "KITCHEN", "OUTDOOR", "FITNESS"],
    modality_affinity: ["demo-first", "silent-visual-first", "comparison-led"],
    example_structure: "[Visual that defies expectation] -> brief hold -> proof or explanation",
    anti_pattern: "Staging a fake disbelief moment. The visual must be genuinely surprising and the proof must be real.",
    priority: "primary",
  },
  {
    id: "correction",
    name: "Correction / You've Been Doing This Wrong",
    structure: "Open by identifying a common behavior or method the viewer currently uses, then frame it as suboptimal. Spoken tone should be helpful, not condescending.",
    why_it_works: "People are loss-averse — learning they've been doing something wrong is more motivating than learning a new option exists. It creates urgency to fix the behavior, which the product solves.",
    best_for: ["BEAUTY", "WELLNESS", "KITCHEN", "HOME", "FITNESS", "PET"],
    modality_affinity: ["creator-to-camera", "voiceover-led", "problem-reveal-led"],
    example_structure: "[Identify the common wrong way — spoken naturally] -> show why it's wrong -> show the better way with product",
    anti_pattern: "Being preachy or condescending. The correction should feel like a friend sharing a discovery, not a lecture.",
    priority: "primary",
  },
  {
    id: "bold-statement",
    name: "Bold Statement / Contrarian",
    structure: "Open with a strong, specific opinion or claim that challenges conventional thinking in the category. Must be genuinely defensible, not shock for shock's sake.",
    why_it_works: "A bold claim creates cognitive friction — the viewer either agrees strongly or disagrees strongly, but either way they stay to see the evidence.",
    best_for: ["AUTO", "TECH", "WELLNESS", "FITNESS", "OUTDOOR"],
    modality_affinity: ["creator-to-camera", "voiceover-led", "comparison-led"],
    example_structure: "[Strong specific claim, spoken with casual confidence] -> evidence that supports it",
    anti_pattern: "Forced 'hot takes' that the creator clearly doesn't believe. The statement must feel genuinely held.",
    priority: "primary",
  },
  {
    id: "transformation",
    name: "Transformation / Before-After",
    structure: "Open by showing the 'before' state or the problem state, then quickly cut to or reveal the 'after' state with the product as the mechanism of change.",
    why_it_works: "Transformation is the most visceral form of proof. When the viewer sees the delta, they don't need to be told the product works — they can see it.",
    best_for: ["BEAUTY", "HOME", "AUTO", "KITCHEN", "FITNESS", "FASHION"],
    modality_affinity: ["demo-first", "silent-visual-first", "comparison-led", "problem-reveal-led"],
    example_structure: "[Before state shown clearly] -> product applied/used -> [after state revealed]",
    anti_pattern: "Fake or filtered transformations. The before must be real and the after must be achieved with the product, not editing.",
    priority: "primary",
  },
  {
    id: "utility-interruption",
    name: "Utility-Led Interruption",
    structure: "Open by showing the product doing something immediately useful or solving a visible problem in the first 1-2 seconds. No preamble. The utility IS the hook.",
    why_it_works: "When the viewer instantly sees a problem being solved, they don't need persuasion — they need to understand how. The demo itself creates the hook.",
    best_for: ["HOME", "KITCHEN", "AUTO", "TECH", "OUTDOOR", "OFFICE"],
    modality_affinity: ["demo-first", "silent-visual-first"],
    example_structure: "[Product solving problem in first frame — no setup, no talking] -> viewer watches to understand the mechanism",
    anti_pattern: "Starting with the product sitting on a table or showing packaging. The utility must be in-action from frame one.",
    priority: "primary",
  },

  // ── SECONDARY ARCHETYPES (strong when context supports) ──────────────

  {
    id: "relatable-struggle",
    name: "Relatable Struggle",
    structure: "Open by naming a specific, narrow frustration that the target viewer experiences regularly. Must be spoken naturally — like a creator venting to the camera, not reading copy.",
    why_it_works: "Shared frustration creates instant rapport. When the viewer thinks 'that's literally me,' they trust the creator's subsequent recommendation because it comes from shared experience.",
    best_for: ["HOME", "KITCHEN", "BABY", "PET", "BEAUTY", "WELLNESS"],
    modality_affinity: ["creator-to-camera", "voiceover-led", "problem-reveal-led"],
    example_structure: "[Specific frustration stated as lived experience, spoken casually] -> 'so I tried this' transition",
    anti_pattern: "Naming a frustration that sounds researched rather than lived. The struggle must feel like the creator's own experience.",
    priority: "secondary",
  },
  {
    id: "i-was-wrong",
    name: "\"I Was Wrong\" Discovery",
    structure: "Open by admitting a prior wrong assumption about the product or category. The vulnerability of admitting error creates credibility, and the correction creates curiosity.",
    why_it_works: "Admitting you were wrong is psychologically disarming. It signals honesty and makes the subsequent recommendation feel more credible because the creator isn't blindly positive.",
    best_for: ["WELLNESS", "BEAUTY", "TECH", "FITNESS", "AUTO"],
    modality_affinity: ["creator-to-camera", "voiceover-led"],
    example_structure: "[Admission of prior skepticism or wrong assumption] -> 'but then I actually tried it' -> proof",
    anti_pattern: "Fake skepticism. If the creator never actually doubted it, the 'I was wrong' framing feels manufactured.",
    priority: "secondary",
  },
  {
    id: "recommendation-gratitude",
    name: "Recommendation Gratitude",
    structure: "Open by crediting someone else — TikTok, a friend, a comment, a viewer — for the recommendation. Frames the product as a discovery, not a promotion. Only use when the product genuinely creates a 'where has this been' response and the attribution feels natural, not forced.",
    why_it_works: "Third-party attribution reduces commercial suspicion. The creator is sharing something they received, not selling something they were paid to promote.",
    best_for: ["BEAUTY", "KITCHEN", "HOME"],
    modality_affinity: ["creator-to-camera", "voiceover-led"],
    example_structure: "[Credit the source of the recommendation] -> 'and they were right because...' -> proof",
    anti_pattern: "Overusing this framing across products. It should feel like a genuine discovery moment, not a default opening. If the phrasing feels repetitive or the gratitude feels performative, choose a different entry.",
    priority: "conditional",
  },
  {
    id: "mid-sentence-entry",
    name: "Mid-Sentence Interruption",
    structure: "Open mid-thought, mid-sentence, or mid-action — as if the video caught the creator already talking. Skips all preamble and drops the viewer into a conversation already happening.",
    why_it_works: "Starting mid-sentence bypasses the 'content starting' signal that triggers scroll. It mimics organic content and creates immediate immersion.",
    best_for: ["HOME", "KITCHEN", "BEAUTY", "FASHION", "BABY", "PET"],
    modality_affinity: ["creator-to-camera", "voiceover-led", "routine-integration"],
    example_structure: "[Mid-sentence or mid-thought — no greeting, no setup] -> natural continuation into product",
    anti_pattern: "Starting with 'so anyway...' or fake mid-sentence that feels scripted. It must genuinely feel caught mid-flow.",
    priority: "secondary",
  },

  // ── CONDITIONAL ARCHETYPES (use sparingly, only when authentic) ──────

  {
    id: "vulnerability",
    name: "Vulnerability / Confessional",
    structure: "Open with a genuine personal admission, insecurity, or honest reaction. Only use when the product connects to a real emotional need, not when forced onto a utility product.",
    why_it_works: "Authentic vulnerability creates deep trust. When used correctly, it makes the product recommendation feel like genuine help rather than promotion.",
    best_for: ["BEAUTY", "WELLNESS", "FASHION", "BABY"],
    modality_affinity: ["creator-to-camera"],
    example_structure: "[Genuine personal admission — understated, not dramatic] -> product as honest solution",
    anti_pattern: "Forced emotional framing on products that don't warrant it. A magnetic tool mat does not need a vulnerability hook. Reserve for products that genuinely connect to identity, confidence, or health.",
    priority: "conditional",
  },
  {
    id: "reaction-reveal",
    name: "Reaction Reveal",
    structure: "Open with the creator's genuine live reaction to a specific product mechanism or result — not a generic unboxing reaction. The reaction must be grounded in a visible demo moment, not just holding the product. Only use when the product has a true visual or functional surprise that warrants a genuine reaction.",
    why_it_works: "Genuine reactions are infectious. When a creator is visibly surprised or delighted by a specific mechanism, the viewer wants to understand what caused that reaction.",
    best_for: ["TECH", "HOME", "KITCHEN"],
    modality_affinity: ["demo-first"],
    example_structure: "[Product does something visually unexpected during demo] -> [genuine reaction grounded in what just happened] -> explanation",
    anti_pattern: "Generic 'wait until you see this' energy. Exaggerated reactions to mediocre products. Unboxing-style reactions without a specific mechanism moment. The reaction must be proportional and tied to a concrete demo beat, not generalized excitement.",
    priority: "conditional",
  },
];
