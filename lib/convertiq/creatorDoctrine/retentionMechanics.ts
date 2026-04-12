export type RetentionPattern = {
  id: string;
  name: string;
  mechanic: string;
  placement: string;
  effect_on_viewer: string;
  category_affinity: string[] | "all";
};

export const RETENTION_PATTERNS: RetentionPattern[] = [
  {
    id: "pacing-shift",
    name: "Pacing Shift",
    mechanic:
      "Abruptly change the speed, energy, or rhythm of the content at a strategic point. This can be a sudden slowdown after fast cuts, a pause after rapid speech, or a speed ramp in the edit. The shift itself is the retention mechanism because it resets the viewer's attention clock.",
    placement:
      "Between the hook resolution and the main proof segment, typically 5-8 seconds in on short-form content. A second pacing shift can occur just before the CTA to re-engage viewers who have been watching passively.",
    effect_on_viewer:
      "The brain adapts to consistent stimuli and begins to tune out. A pacing shift forces re-engagement by breaking the rhythm the viewer's brain had started to predict. It creates a micro-moment of novelty without introducing new content.",
    category_affinity: "all",
  },
  {
    id: "information-gap",
    name: "Information Gap",
    mechanic:
      "Introduce a piece of information that is incomplete, creating a question the viewer needs answered. This is not clickbait withholding; it is a natural gap that emerges from the content structure. The viewer has enough context to care about the answer but not enough to guess it.",
    placement:
      "Planted in the first 3 seconds as part of the hook and resolved in the final third of the video. Can also be introduced at the midpoint as a 're-hook' to sustain viewers through the proof section.",
    effect_on_viewer:
      "An open question creates psychological tension that the brain seeks to resolve. The viewer continues watching specifically to close the loop. The gap must be genuine and the resolution must be satisfying, or the viewer feels manipulated and will not convert.",
    category_affinity: "all",
  },
  {
    id: "re-hook",
    name: "Re-Hook",
    mechanic:
      "Insert a secondary hook at the midpoint of the video that introduces a new dimension of interest. This is not a repetition of the original hook but an escalation or pivot that gives viewers a new reason to stay. It often takes the form of 'but here is what I did not expect' or an unexpected visual shift.",
    placement:
      "At approximately 40-60% of the video duration, where analytics typically show the steepest drop-off. The re-hook must arrive before the viewer decides to leave, not after they have already mentally checked out.",
    effect_on_viewer:
      "Viewers who were considering leaving are given a new contract: 'Stay for this new thing you did not know was coming.' It resets the value proposition of continuing to watch and can recover viewers who were passively watching without full attention.",
    category_affinity: "all",
  },
  {
    id: "proof-escalation",
    name: "Proof Escalation",
    mechanic:
      "Structure the proof so each successive demonstration is more impressive, more specific, or more challenging than the last. The viewer's expectations are met and then exceeded in a staircase pattern. Each step builds on the credibility established by the previous one.",
    placement:
      "Throughout the proof section of the video, with each escalation step separated by 3-5 seconds. The strongest proof point is reserved for the final position, immediately before the CTA or closing.",
    effect_on_viewer:
      "Each escalation triggers a 'wait, it does that too?' response that compounds interest. The viewer's belief in the product grows with each step, and the escalating structure creates momentum that carries them through to the end of the video.",
    category_affinity: [
      "TECH",
      "AUTO",
      "KITCHEN",
      "HOME",
      "OUTDOOR",
      "FITNESS",
    ],
  },
  {
    id: "tension-hold",
    name: "Tension Hold",
    mechanic:
      "Deliberately delay the resolution of the core promise by inserting a natural obstacle, complication, or moment of uncertainty. The delay must feel organic to the content, not artificially padded. A brief complication before the payoff makes the payoff more satisfying.",
    placement:
      "Immediately before the key reveal or result moment, typically in the final third of the video. The tension hold should last 2-4 seconds maximum in short-form content; longer and it feels like stalling.",
    effect_on_viewer:
      "The viewer has invested attention and now wants the resolution. A brief delay at the moment of maximum anticipation intensifies the emotional impact of the reveal. The viewer cannot leave because they are too close to the payoff to abandon the investment.",
    category_affinity: "all",
  },
];
