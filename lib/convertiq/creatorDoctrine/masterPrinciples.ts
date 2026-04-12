export type ConversionPrinciple = {
  id: string;
  name: string;
  principle: string;
  applies_to: string[];
  category_affinity: string[] | "all";
  modality_affinity: string[] | "all";
  proof_structure: string;
  failure_mode: string;
};

export const MASTER_PRINCIPLES: ConversionPrinciple[] = [
  {
    id: "proof-before-claim",
    name: "Proof Before Claim",
    principle:
      "Never state an outcome before showing the evidence that supports it. The viewer must see the proof first so the claim feels like a conclusion they reached, not a pitch they were sold.",
    applies_to: ["showSay", "script", "qa", "angle"],
    category_affinity: "all",
    modality_affinity: "all",
    proof_structure:
      "Show evidence (visual, demonstration, or data) -> allow beat for viewer processing -> then verbalize the outcome as a natural observation rather than a sales claim.",
    failure_mode:
      "Creator opens with 'This product is incredible' before any evidence. Viewer pattern-matches to ad and scrolls. The claim becomes noise because it has no evidential anchor.",
  },
  {
    id: "specificity-over-superlative",
    name: "Specificity Over Superlative",
    principle:
      "Replace every subjective adjective with a concrete, observable detail. 'Amazing results' converts at zero; 'cleared my texture in eleven days' converts because it is verifiable and specific.",
    applies_to: ["showSay", "script", "qa"],
    category_affinity: "all",
    modality_affinity: "all",
    proof_structure:
      "Identify the superlative the creator would naturally use -> replace it with a measurable observation, a specific timeframe, a count, or a named scenario the viewer can picture.",
    failure_mode:
      "Script is filled with 'best ever', 'game changer', 'so good'. Viewer has heard these words in every ad and they carry zero informational weight. No mental image forms.",
  },
  {
    id: "viewer-conclusion",
    name: "Viewer Conclusion",
    principle:
      "Structure the content so the viewer reaches the buying conclusion independently. The creator provides evidence and context; the viewer connects the dots. A conclusion the viewer forms themselves is far more persuasive than one they are told.",
    applies_to: ["showSay", "script", "angle", "analyze"],
    category_affinity: "all",
    modality_affinity: "all",
    proof_structure:
      "Present a relatable problem -> show the mechanism or product in action -> let the result speak without narrator editorializing. The gap between evidence and explicit conclusion is where belief forms.",
    failure_mode:
      "Creator over-explains why the product is great, leaving nothing for the viewer to discover. The content feels like a lecture instead of an experience. Viewer disengages because there is no cognitive participation.",
  },
  {
    id: "native-not-produced",
    name: "Native Not Produced",
    principle:
      "Content must feel like it belongs in the creator's organic feed, not like a brand inserted it. Production value that exceeds the creator's normal standard triggers ad-detection in the viewer's brain.",
    applies_to: ["showSay", "script", "modality", "qa"],
    category_affinity: "all",
    modality_affinity: "all",
    proof_structure:
      "Match the creator's typical lighting, framing, speech cadence, and edit style. The product enters the frame the way any object would in their normal content, not with special treatment.",
    failure_mode:
      "Overly polished lighting, scripted-sounding delivery, product centered on a pedestal. Viewer immediately flags it as sponsored. Engagement drops because the social contract of authentic content is broken.",
  },
  {
    id: "single-proof-vehicle",
    name: "Single Proof Vehicle",
    principle:
      "Each video should have one dominant proof mechanism that carries the conversion weight. Stacking multiple proof types dilutes each one and overwhelms the viewer's processing.",
    applies_to: ["angle", "showSay", "analyze"],
    category_affinity: "all",
    modality_affinity: "all",
    proof_structure:
      "Choose the single strongest proof type for this product and category -> build the entire video arc around delivering that proof convincingly. Secondary proof elements can exist but must not compete for attention.",
    failure_mode:
      "Video tries to show a live demo, read reviews, display before/after, and cite a statistic all in 30 seconds. Each proof point gets 5 seconds and none lands with enough weight to shift belief.",
  },
  {
    id: "objection-inside-proof",
    name: "Objection Inside Proof",
    principle:
      "The main viewer objection should be addressed within the proof demonstration itself, not in a separate defensive segment. When proof naturally absorbs the objection, it feels like evidence rather than damage control.",
    applies_to: ["showSay", "script", "qa", "angle"],
    category_affinity: "all",
    modality_affinity: "all",
    proof_structure:
      "Identify the primary belief barrier -> design the demonstration so the objection is visually or experientially answered as part of showing the product working, not as a separate rebuttal.",
    failure_mode:
      "Creator pauses the demo to say 'Now I know what you're thinking...' and launches into a defensive explanation. This signals that the objection is valid and serious enough to require a disclaimer, actually strengthening the doubt.",
  },
  {
    id: "tension-before-reveal",
    name: "Tension Before Reveal",
    principle:
      "Build anticipation before showing the key result or product benefit. The viewer must feel the gap between their current state and the resolution before the reveal has emotional impact.",
    applies_to: ["showSay", "script", "modality"],
    category_affinity: "all",
    modality_affinity: [
      "creator-to-camera",
      "demo-first",
      "voiceover-led",
      "problem-reveal-led",
    ],
    proof_structure:
      "Establish the problem or challenge with enough detail that the viewer feels the friction -> pause or build at the moment of maximum uncertainty -> then deliver the reveal. The delay between problem and solution is where desire forms.",
    failure_mode:
      "Creator rushes to the payoff. Shows the problem for one second then immediately shows the result. There is no emotional arc, so the result feels flat. The viewer never experienced the tension that makes the resolution satisfying.",
  },
  {
    id: "real-scenario-grounding",
    name: "Real Scenario Grounding",
    principle:
      "Every claim must be anchored in a specific, filmable, real-life scenario the viewer can picture themselves in. Abstract benefits do not convert; situated experiences do.",
    applies_to: ["showSay", "script", "angle", "qa"],
    category_affinity: "all",
    modality_affinity: "all",
    proof_structure:
      "Translate the product benefit into a concrete moment: a place, a time of day, a specific activity. 'Great for travel' becomes 'I used this in my carry-on on a red-eye to LAX and it fit in the seat pocket.'",
    failure_mode:
      "Creator lists benefits in abstract terms: 'versatile', 'convenient', 'perfect for on-the-go'. Viewer cannot form a mental image and the benefit remains theoretical. No scenario means no projection of self into the product experience.",
  },
  {
    id: "earned-not-forced-urgency",
    name: "Earned Not Forced Urgency",
    principle:
      "Urgency to act must emerge naturally from the proof and desire built throughout the video. Artificial scarcity or pressure applied before belief is established creates resistance, not action.",
    applies_to: ["script", "qa", "angle"],
    category_affinity: "all",
    modality_affinity: "all",
    proof_structure:
      "Build genuine desire through proof and scenario -> only then introduce a reason to act now (limited stock, seasonal relevance, price window). The urgency amplifies existing desire rather than trying to create it from nothing.",
    failure_mode:
      "Creator opens with 'HURRY this deal ends tonight' before establishing any reason the viewer should care. The urgency has no foundation, so it reads as manipulation. Viewer scrolls because they have not been given a reason to want the product yet.",
  },
  {
    id: "pattern-interrupt-authenticity",
    name: "Pattern Interrupt Authenticity",
    principle:
      "The first two seconds must break the viewer's scroll pattern with something genuinely unusual, not with manufactured shock. The interrupt must be authentic to the creator and relevant to the content that follows.",
    applies_to: ["showSay", "script", "modality"],
    category_affinity: "all",
    modality_affinity: "all",
    proof_structure:
      "Open with a visual, sound, or statement that is unexpected within the context of the viewer's feed -> immediately connect it to the content topic so the interrupt earns its place rather than feeling like clickbait.",
    failure_mode:
      "Creator uses a generic attention grab ('STOP SCROLLING') that has no connection to the content. Viewer stops but feels tricked when the content does not match the energy of the hook. Trust drops before the proof even begins.",
  },
];
