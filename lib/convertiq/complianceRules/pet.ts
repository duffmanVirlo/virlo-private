import type { ComplianceRule } from "./wellness";

export const PET_COMPLIANCE: ComplianceRule = {
  category: "PET",
  blocked_phrases: [
    {
      phrase: "vet-recommended",
      reason:
        "Requires documented veterinary endorsement. Unsubstantiated vet authority claims are misleading and may lead pet owners to skip professional consultation.",
      replacement_guidance:
        'If genuinely vet-recommended, name the vet or clinic. Otherwise use "I mentioned this to our vet and they didn\'t have concerns" or remove the claim entirely.',
    },
    {
      phrase: "cures",
      reason:
        "Curative claims for pet products constitute veterinary drug claims, which are regulated by the FDA.",
      replacement_guidance:
        'Use "supports" or "helps with". E.g., "this supplement supports my dog\'s joint mobility" NOT "cures hip dysplasia".',
    },
    {
      phrase: "treats illness",
      reason:
        "Treatment claims are reserved for approved veterinary medications and therapies.",
      replacement_guidance:
        'Use "helps manage" or "I noticed improvement in". E.g., "since starting this, I\'ve noticed my cat\'s coat looks healthier".',
    },
    {
      phrase: "guaranteed results",
      reason:
        "Pet responses to products vary enormously by breed, size, age, and health status. Guarantees are inherently misleading.",
      replacement_guidance:
        'Use "this has worked really well for my [breed/size]" with honest caveats about individual variation.',
    },
    {
      phrase: "safe for all breeds",
      reason:
        "Breed-specific sensitivities and size differences make universal safety claims dangerous. Some ingredients safe for dogs are toxic to cats, and vice versa.",
      replacement_guidance:
        'Specify your pet\'s breed and size: "I use this for my 60-pound golden retriever" and recommend checking with a vet for other breeds.',
    },
    {
      phrase: "eliminates anxiety",
      reason:
        "Pet anxiety is a behavioral/medical condition. Elimination claims are therapeutic claims requiring veterinary backing.",
      replacement_guidance:
        'Use "my dog seems calmer during storms since we started using this" or "this has been part of our routine for managing his nervousness".',
    },
    {
      phrase: "no side effects",
      reason:
        "Any ingestible or topical product can potentially cause side effects. Claiming none is irresponsible.",
      replacement_guidance:
        'Use "my pet hasn\'t had any issues with this" and recommend introducing new products gradually.',
    },
    {
      phrase: "replaces veterinary care",
      reason:
        "No consumer product replaces professional veterinary care. This claim is dangerous.",
      replacement_guidance:
        'Use "this is a great supplement to our regular vet visits" or "this is part of our overall care routine, alongside regular checkups".',
    },
  ],
  required_framing: [
    {
      rule: "Always include breed and/or size context for the pet shown or referenced.",
      example:
        '"I have a 3-year-old medium-sized labradoodle, about 45 pounds" NOT just "my dog loves this".',
    },
    {
      rule: "Frame all observations as personal pet-owner experience.",
      example:
        '"Since adding this to Bella\'s meals, I\'ve noticed her coat looks shinier and she seems to have more energy on walks" NOT "This improves coat health and energy levels".',
    },
    {
      rule: "Use gradual improvement language rather than instant transformation claims.",
      example:
        '"After about two weeks of daily use, I started to see a real difference" NOT "Instant results from the first serving".',
    },
    {
      rule: "Acknowledge that pet needs vary and recommend consulting a vet for specific conditions.",
      example:
        '"This has been great for us, but if your pet has specific health issues, definitely check with your vet first".',
    },
    {
      rule: "Name the specific product use case rather than making broad health claims.",
      example:
        '"I started using this hip and joint chew because my older dog was slowing down on walks" NOT "This fixes joint problems".',
    },
  ],
  disclaimer_requirements: [
    "Every pet is different. Results may vary based on breed, size, age, and individual health conditions.",
    "Consult your veterinarian before introducing new supplements, foods, or health products to your pet's routine.",
    "This content reflects my personal experience with my own pet and is not veterinary advice.",
    "If your pet shows any adverse reaction, discontinue use and contact your vet immediately.",
  ],
};
