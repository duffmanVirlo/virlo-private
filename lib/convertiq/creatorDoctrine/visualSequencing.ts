export type VisualSequencePattern = {
  id: string;
  name: string;
  shot_flow: string[];
  why_this_flow: string;
  modality_affinity: string[];
  category_affinity: string[] | "all";
};

export const VISUAL_SEQUENCES: VisualSequencePattern[] = [
  {
    id: "wide-to-detail",
    name: "Wide to Detail",
    shot_flow: [
      "Wide or medium shot establishing context: the environment, the creator, or the situation the product fits into",
      "Mid shot that introduces the product within that context, showing scale and relationship to surroundings",
      "Close-up on the key feature, texture, mechanism, or detail that carries the proof",
      "Return to medium or wide shot showing the product in use within the original context, now with the detail understood",
    ],
    why_this_flow:
      "The wide-to-detail progression mirrors how humans naturally investigate objects: first context, then focus. Starting wide grounds the product in reality and prevents it from feeling like a studio product shot. The close-up delivers the proof detail. Returning to wide at the end reconnects the detail to the real-world scenario, making the proof feel situated and practical rather than clinical.",
    modality_affinity: [
      "silent-visual-first",
      "demo-first",
      "voiceover-led",
    ],
    category_affinity: "all",
  },
  {
    id: "problem-to-solution-visual",
    name: "Problem to Solution Visual",
    shot_flow: [
      "Show the problem state visually: the mess, the frustration, the broken item, the bad result. Linger long enough for the viewer to feel it.",
      "Show the product entering the frame naturally, not presented on a pedestal but picked up and used",
      "Show the product in action addressing the problem, with enough real-time footage that the viewer trusts the process",
      "Show the resolved state in the same framing and lighting as the problem state, allowing direct visual comparison",
    ],
    why_this_flow:
      "The visual contrast between problem and resolution is the proof itself. By showing both states in comparable conditions, the product's impact becomes undeniable to the viewer's own eyes. The middle steps showing the product in use prevent the before-after from feeling like two unrelated shots, which is the most common criticism viewers have of transformation content.",
    modality_affinity: [
      "demo-first",
      "silent-visual-first",
      "problem-reveal-led",
    ],
    category_affinity: [
      "HOME",
      "KITCHEN",
      "AUTO",
      "BEAUTY",
      "PET",
    ],
  },
  {
    id: "hands-in-use",
    name: "Hands in Use",
    shot_flow: [
      "Hands picking up or unboxing the product, showing real scale against fingers and palms",
      "Hands operating the product: pressing buttons, applying it, assembling it, or using its key feature",
      "Close-up of the product performing its function, with hands guiding or holding it",
      "Hands setting the product down in its final context or showing the completed result of using it",
    ],
    why_this_flow:
      "Hands-in-frame content performs at the highest level for product demonstration because it creates vicarious physical experience. The viewer's mirror neurons activate when they see hands using an object, creating a sense of what it would feel like to use it themselves. Hands also signal authenticity: this is a real person using a real product, not a rendered advertisement.",
    modality_affinity: [
      "silent-visual-first",
      "demo-first",
      "routine-integration",
    ],
    category_affinity: [
      "TECH",
      "KITCHEN",
      "BEAUTY",
      "HOME",
      "OFFICE",
      "BABY",
    ],
  },
  {
    id: "environment-to-product",
    name: "Environment to Product",
    shot_flow: [
      "Establish the environment or scenario where the product will be used: the kitchen during meal prep, the car interior, the bathroom counter, the garage workspace",
      "Show the need or gap within that environment: the moment where the product would be useful",
      "Introduce the product being pulled from a drawer, shelf, or bag within that environment, showing it belongs there",
      "Show the product fulfilling the need within the environment, with the surroundings visible to maintain context",
    ],
    why_this_flow:
      "Starting with environment rather than product avoids the 'here is a product' framing that triggers ad-detection. The viewer enters a relatable space and sees a relatable need before the product appears. When the product emerges from within the environment rather than being presented to the camera, it feels like a natural part of that space rather than a featured item. This sequence is the visual embodiment of the native-not-produced principle.",
    modality_affinity: [
      "routine-integration",
      "demo-first",
      "voiceover-led",
    ],
    category_affinity: [
      "HOME",
      "KITCHEN",
      "AUTO",
      "OUTDOOR",
      "OFFICE",
      "BABY",
      "PET",
    ],
  },
];
