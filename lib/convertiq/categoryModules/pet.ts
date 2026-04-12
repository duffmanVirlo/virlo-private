import type { CategoryId } from "@/types/classification";
import type { CategoryModule } from "./auto";

export const PET_MODULE: CategoryModule = {
  id: "PET",
  name: "Pet Care & Supplies",
  buyer_psychology: {
    primary_motivation:
      "Emotional love and responsibility — pet parents buy to improve their pet's health, happiness, or comfort. The purchase is driven by the desire to be a good pet parent, not personal utility.",
    purchase_anxiety:
      "Will my pet actually use/eat/tolerate this? Is it safe? Pet owners have been burned by products their pets rejected, and they deeply fear anything that could harm their animal. Safety and genuine pet acceptance are non-negotiable.",
    trust_threshold:
      "Very high — requires genuine pet interaction footage. Forced or staged pet reactions are immediately obvious and destroy trust. Credibility comes from honest pet responses, including hesitation or gradual acceptance, not instant love.",
    impulse_vs_considered: "hybrid",
  },
  proof_hierarchy: [
    "genuine pet reaction and voluntary interaction",
    "live demonstration with real pet engagement",
    "before/after health or behavior improvement",
    "safety evidence — ingredients, vet mentions, certifications",
    "multi-pet demonstration showing different reactions",
    "owner testimony with specific pet context (breed, age, condition)",
  ],
  proof_destroyers: [
    "Forced pet interaction — holding pet in place, restraining to show 'enjoyment'",
    "Ignoring safety entirely — no mention of ingredients, age appropriateness, or vet guidance",
    "Human-centric framing that talks about convenience for the owner instead of benefit for the pet",
    "Using only human excitement without ever showing the pet's actual response",
    "Claiming universal pet acceptance — 'every dog loves this' — without acknowledging individual variation",
    "Showing a perfectly groomed show-quality pet that doesn't represent real pet owners' animals",
  ],
  conversion_patterns: [
    {
      name: "The Pet Verdict",
      description:
        "Let the pet decide on camera. Place the product near the pet and film their genuine first reaction — curiosity, sniffing, tasting, playing. The pet's authentic response IS the review.",
      when_to_use:
        "Treats, toys, beds, food — any product where the pet's acceptance is the primary purchase concern.",
    },
    {
      name: "The Parent Worry Solve",
      description:
        "Open with a real pet-parent concern (itchy skin, picky eating, anxiety during storms, destructive chewing), show the product being introduced, and document the genuine response over time.",
      when_to_use:
        "Health supplements, calming products, dental care, specialty food — products that solve a specific pet health or behavior concern.",
    },
    {
      name: "The Daily Routine Integration",
      description:
        "Show the product as part of your actual daily pet care routine — feeding time, walk prep, grooming session. Demonstrate how it fits naturally into the life you already live with your pet.",
      when_to_use:
        "Recurring-use products like supplements, food toppers, grooming tools, leash accessories.",
    },
    {
      name: "The Safety-First Frame",
      description:
        "Lead with ingredients, safety certifications, or vet guidance before showing the product. For pet parents, knowing it's safe must come before knowing it works.",
      when_to_use:
        "Supplements, food products, dental treatments, flea/tick solutions — anything the pet ingests or that affects their health directly.",
    },
    {
      name: "The Multi-Pet Test",
      description:
        "If you have multiple pets, show each one's individual reaction. Different pets responding differently adds authenticity — it proves the footage isn't staged.",
      when_to_use:
        "Treats, toys, communal products — anything where showing varied reactions increases credibility.",
    },
  ],
  anti_patterns: [
    "Holding the product up and talking about it without ever showing it near a pet",
    "Forcing a pet to interact with the product for the camera",
    "Using only human reactions — 'I love this for my dog!' — with no pet footage",
    "Ignoring breed, size, or age relevance — a product for large dogs shown with a chihuahua",
    "Claiming health benefits without any mention of vet consultation or ingredient transparency",
    "Making medical claims — 'cures hip dysplasia' — instead of describing observed improvements",
    "Showing only the cute moment without context about the pet's actual needs",
    "Using baby-talk or excessive anthropomorphization that undermines product credibility",
  ],
  content_rules: [
    "Always show genuine pet interaction — the pet's response is the centerpiece of every piece of content",
    "Mention your pet's breed, age, and relevant health context so viewers can assess applicability",
    "Never restrain or force a pet to interact with a product on camera",
    "For ingestible products, always mention ingredients or safety considerations",
    "Show the realistic timeline — if a supplement takes 2 weeks, say that, don't imply instant results",
    "Include honest moments — if the pet was hesitant at first, show that journey",
    "Frame benefits from the pet's perspective, not the owner's convenience",
  ],
  demonstration_priority:
    "Genuine pet reaction is the proof. The first shot should be the pet voluntarily engaging with the product — sniffing, eating, playing, settling into it. The pet decides if this product is worth buying, not the creator.",
} as const;
