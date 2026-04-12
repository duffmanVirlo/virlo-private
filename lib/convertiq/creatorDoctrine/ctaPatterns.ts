export type CTAPattern = {
  id: string;
  name: string;
  timing: string;
  framing: string;
  pressure_type: string | null;
  viewer_state_required: string;
  modality_affinity: string[] | "all";
};

export const CTA_PATTERNS: CTAPattern[] = [
  {
    id: "natural-continuation",
    name: "Natural Continuation",
    timing:
      "Immediately after the proof has landed and the viewer has had a beat to process the result. There is no separate 'CTA section'; the purchase suggestion flows from the demonstration as a natural next thought.",
    framing:
      "Frame the purchase as the logical next step the viewer is already considering, not as something the creator is asking them to do. 'Link is in bio' or 'it's in TikTok Shop' stated as information, not as an imperative. The creator shares where to find it the same way they would share where they bought it with a friend.",
    pressure_type: null,
    viewer_state_required:
      "The viewer has seen convincing proof and has independently formed a positive impression. They are already thinking about whether they want this. The CTA just removes the friction of figuring out where to get it.",
    modality_affinity: "all",
  },
  {
    id: "scarcity-earned",
    name: "Scarcity Earned",
    timing:
      "After the full proof sequence has been delivered and belief has been established. Scarcity is introduced only when the viewer already wants the product and just needs a reason to act now rather than later.",
    framing:
      "Reference genuine scarcity signals: a sale price with a visible end date, limited inventory shown on screen, or seasonal availability. The scarcity must be real and verifiable within the video, not manufactured pressure. Frame it as sharing helpful timing information, not as pressuring a decision.",
    pressure_type:
      "Time-bound or supply-bound scarcity that is genuine and observable. The pressure comes from external reality, not from the creator's urgency.",
    viewer_state_required:
      "Full belief in the product has been established. The viewer wants it but might bookmark and forget. The scarcity converts the 'I should get this eventually' viewer into 'I should get this now' without creating resentment.",
    modality_affinity: [
      "creator-to-camera",
      "voiceover-led",
      "text-led",
    ],
  },
  {
    id: "identity-aligned",
    name: "Identity Aligned",
    timing:
      "After the proof section, when the video transitions to closing. The identity framing works as both a CTA and a retention closer because it gives the viewer a self-concept to attach to the product.",
    framing:
      "Connect the product to a type of person the viewer identifies as or aspires to be. 'If you are the kind of person who...' or 'for anyone who actually cares about...' The product becomes an expression of identity rather than a purchase. The CTA is implicit: people who are this identity buy this product.",
    pressure_type:
      "Social identity pressure. The viewer is not pressured by scarcity but by alignment with their self-image. This is softer than scarcity but can be more durable because it creates ongoing identification.",
    viewer_state_required:
      "The viewer has seen the proof and has connected the product to a value or lifestyle they care about. They see themselves as the kind of person who would use this product.",
    modality_affinity: [
      "creator-to-camera",
      "routine-integration",
      "voiceover-led",
    ],
  },
  {
    id: "problem-resolution",
    name: "Problem Resolution",
    timing:
      "Directly after demonstrating that the product solves the problem established in the hook. The CTA is the answer to the question the hook planted. The viewer has been waiting for this resolution since the first second.",
    framing:
      "Tie the CTA back to the original problem. 'If you have been dealing with [exact problem from hook], this is the one that actually fixed it for me.' The product is positioned as the resolution to a story arc, not as a purchase to be made. The viewer has been on a journey from problem to solution and the CTA is the destination.",
    pressure_type: null,
    viewer_state_required:
      "The viewer identified with the problem in the hook, watched the proof with personal investment, and now sees the product as their specific solution. The emotional journey from frustration to resolution creates natural motivation to act.",
    modality_affinity: [
      "creator-to-camera",
      "voiceover-led",
      "problem-reveal-led",
    ],
  },
];
