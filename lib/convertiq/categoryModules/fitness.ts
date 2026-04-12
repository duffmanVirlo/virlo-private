import type { CategoryId } from "@/types/classification";
import type { CategoryModule } from "./auto";

export const FITNESS_MODULE: CategoryModule = {
  id: "FITNESS",
  name: "Fitness & Recovery",
  buyer_psychology: {
    primary_motivation:
      "Performance improvement — buyers want something that makes their workouts more effective, recovery faster, or training more convenient. They already have routines and need convincing this adds real value.",
    purchase_anxiety:
      "Is this actually better than what I already do, or is it fitness marketing hype? Buyers are wary of products that look good on influencers but add nothing to a real training program.",
    trust_threshold:
      "High — requires seeing the product used in a genuine workout or recovery context. Gym-bro hype language without real demonstration is an instant turn-off. Credibility comes from showing real use, not physique flexing.",
    impulse_vs_considered: "considered",
  },
  proof_hierarchy: [
    "real-use demonstration during actual exercise or recovery",
    "comparison with existing method or equipment",
    "result documentation over time with honest timeline",
    "form and technique context showing proper use",
    "portability or convenience proof for home/travel use",
  ],
  proof_destroyers: [
    "Using unrealistic physiques as the only social proof",
    "Gym-bro hype language — 'bro this pump is insane' — without substance",
    "No real workout context — just holding the product in a gym",
    "Claiming dramatic results without timeline or training context",
    "Showing only the product, never the person using it during real exercise",
  ],
  conversion_patterns: [
    {
      name: "The Real Workout Integration",
      description:
        "Film yourself using the product during an actual training session — not a staged demo but real sets, real sweat, real effort. Show how it fits into exercises viewers already do.",
      when_to_use:
        "Equipment, bands, accessories, wearables — anything used during active exercise.",
    },
    {
      name: "The Recovery Reveal",
      description:
        "Show the product in a real post-workout recovery context — soreness, fatigue, the actual moment you'd reach for it. Demonstrate the sensation and relief honestly.",
      when_to_use:
        "Massage guns, foam rollers, recovery supplements, compression gear, cold/heat therapy.",
    },
    {
      name: "The Upgrade Comparison",
      description:
        "Show your old method side-by-side with the new product. Let the viewer see the specific improvement — more range of motion, less setup time, better portability.",
      when_to_use:
        "Products replacing existing equipment or methods — home gym gear, portable equipment, upgraded versions of common tools.",
    },
  ],
  anti_patterns: [
    "Leading with shirtless physique shots instead of product demonstration",
    "Using aggressive hype language that sounds like a pre-workout commercial",
    "Claiming 'you need this' without showing what problem it actually solves",
    "Showing the product in packaging or on a shelf but never in use during exercise",
    "Implying the product alone creates results without acknowledging training and diet",
  ],
  content_rules: [
    "Show the product being used during real exercise or recovery — not just held or displayed",
    "Include proper form guidance when demonstrating exercise equipment",
    "Be honest about what the product does and doesn't replace in a training program",
    "If showing results over time, include the full context — training frequency, diet, timeline",
    "Never imply a product substitutes for consistent training and nutrition",
    "Show the product in a realistic setting — home gym, apartment, park — not just a commercial gym",
  ],
  demonstration_priority:
    "Show the product being used during a real exercise or recovery session. The viewer should see sweat, effort, and genuine integration into a workout — not a posed demonstration in clean gym clothes.",
} as const;
