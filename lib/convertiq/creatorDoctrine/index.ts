import type { CategoryId } from "@/types/classification";
import type { FunctionalRole } from "@/types/analysis";
import type { ContentModality } from "@/types/modality";

import {
  type ConversionPrinciple,
  MASTER_PRINCIPLES,
} from "./masterPrinciples";
import { type HookArchetype, HOOK_ARCHETYPES } from "./hookPatterns";
import {
  type RetentionPattern,
  RETENTION_PATTERNS,
} from "./retentionMechanics";
import {
  type ProofSequencePattern,
  PROOF_SEQUENCES,
} from "./proofSequencing";
import {
  type ObjectionPattern,
  OBJECTION_PATTERNS,
} from "./objectionHandling";
import { type CTAPattern, CTA_PATTERNS } from "./ctaPatterns";
import {
  type VisualSequencePattern,
  VISUAL_SEQUENCES,
} from "./visualSequencing";
import { type TrustStyle, TRUST_STYLES } from "./trustBuildingStyles";
import {
  type DeliveryRegister,
  DELIVERY_REGISTERS,
} from "./deliveryMechanics";

import {
  type CreatorPatternProfile,
  BELUSH_PROFILE,
} from "./creators/belush";
import { DEALSWITHTY_PROFILE } from "./creators/dealswithty";
import { MATTKAHLA_PROFILE } from "./creators/mattkahla";
import { IAMSK8BORDB_PROFILE } from "./creators/iamsk8bordb";

// Re-export all types
export type {
  ConversionPrinciple,
  HookArchetype,
  RetentionPattern,
  ProofSequencePattern,
  ObjectionPattern,
  CTAPattern,
  VisualSequencePattern,
  TrustStyle,
  DeliveryRegister,
  CreatorPatternProfile,
};

// Re-export all constants
export {
  MASTER_PRINCIPLES,
  HOOK_ARCHETYPES,
  RETENTION_PATTERNS,
  PROOF_SEQUENCES,
  OBJECTION_PATTERNS,
  CTA_PATTERNS,
  VISUAL_SEQUENCES,
  TRUST_STYLES,
  DELIVERY_REGISTERS,
};

const ALL_CREATOR_PROFILES: CreatorPatternProfile[] = [
  BELUSH_PROFILE,
  DEALSWITHTY_PROFILE,
  MATTKAHLA_PROFILE,
  IAMSK8BORDB_PROFILE,
];

/**
 * Returns principles that apply to any of the given pipeline stages.
 */
export function getRelevantPrinciples(stages: string[]): ConversionPrinciple[] {
  return MASTER_PRINCIPLES.filter((p) =>
    p.applies_to.some((s) => stages.includes(s))
  );
}

/**
 * Returns all hook archetypes.
 */
export function getHookPatterns(): HookArchetype[] {
  return HOOK_ARCHETYPES;
}

/**
 * Returns retention mechanics, optionally filtered by category affinity.
 */
export function getRetentionMechanics(
  category?: CategoryId
): RetentionPattern[] {
  if (!category) return RETENTION_PATTERNS;
  return RETENTION_PATTERNS.filter(
    (p) =>
      p.category_affinity === "all" ||
      (p.category_affinity as string[]).includes(category)
  );
}

/**
 * Returns proof sequences whose best_for_proof_type overlaps with the given proof types.
 */
export function getProofSequences(
  proofTypes: string[]
): ProofSequencePattern[] {
  if (proofTypes.length === 0) return PROOF_SEQUENCES;
  return PROOF_SEQUENCES.filter((seq) =>
    seq.best_for_proof_type.some((t) => proofTypes.includes(t))
  );
}

/**
 * Returns all objection handling patterns.
 */
export function getObjectionPatterns(): ObjectionPattern[] {
  return OBJECTION_PATTERNS;
}

/**
 * Returns CTA patterns, optionally filtered by modality affinity.
 */
export function getCTAPatterns(modality?: ContentModality): CTAPattern[] {
  if (!modality) return CTA_PATTERNS;
  return CTA_PATTERNS.filter(
    (p) =>
      p.modality_affinity === "all" ||
      (p.modality_affinity as string[]).includes(modality)
  );
}

/**
 * Returns visual sequence patterns, optionally filtered by modality affinity.
 */
export function getVisualSequences(
  modality?: ContentModality
): VisualSequencePattern[] {
  if (!modality) return VISUAL_SEQUENCES;
  return VISUAL_SEQUENCES.filter((p) =>
    p.modality_affinity.includes(modality)
  );
}

/**
 * Returns trust styles, optionally filtered by category affinity.
 */
export function getTrustStyles(category?: CategoryId): TrustStyle[] {
  if (!category) return TRUST_STYLES;
  return TRUST_STYLES.filter((s) => s.category_affinity.includes(category));
}

/**
 * Returns delivery registers, optionally filtered by modality affinity.
 */
export function getDeliveryRegister(
  modality?: ContentModality
): DeliveryRegister[] {
  if (!modality) return DELIVERY_REGISTERS;
  return DELIVERY_REGISTERS.filter(
    (r) =>
      r.category_affinity === "all" ||
      r.best_for_modality.includes(modality)
  );
}

/**
 * Returns creator profiles that have strength in the given category.
 * When a functional role is provided, profiles are sorted by relevance:
 * creators whose hook archetype and proof preferences align with the role
 * are ranked higher.
 */
export function getMatchingCreatorProfiles(
  category: CategoryId,
  role: FunctionalRole
): CreatorPatternProfile[] {
  const categoryMatches = ALL_CREATOR_PROFILES.filter((p) =>
    p.primary_category_strength.includes(category)
  );

  if (categoryMatches.length === 0) return ALL_CREATOR_PROFILES;

  const roleToProofAffinity: Record<FunctionalRole, string[]> = {
    "demonstration-led": ["live-demonstration", "unexpected-mechanism"],
    "transformation-led": ["result-display", "personal-testimony"],
    "utility-led": ["live-demonstration", "quantity-scale"],
    "curiosity-led": ["unexpected-mechanism", "live-demonstration"],
    "fear-led": ["problem-framing", "personal-testimony"],
    "convenience-led": ["live-demonstration", "quantity-scale"],
    "identity-led": ["personal-testimony", "third-party-signal"],
    "relief-led": ["result-display", "problem-framing"],
  };

  const affinityProofs = roleToProofAffinity[role] ?? [];

  return categoryMatches.sort((a, b) => {
    const aScore = a.proof_preference.filter((p) =>
      affinityProofs.includes(p)
    ).length;
    const bScore = b.proof_preference.filter((p) =>
      affinityProofs.includes(p)
    ).length;
    return bScore - aScore;
  });
}

/**
 * Identifies which creator archetype best matches the given category and role
 * combination. Returns a descriptive string that can be used in prompt injection
 * to guide content generation toward the right creator pattern.
 */
export function identifyCreatorArchetype(
  category: CategoryId,
  role: FunctionalRole
): string {
  const profiles = getMatchingCreatorProfiles(category, role);

  if (profiles.length === 0) {
    return "general-creator: Use casual-direct delivery with live demonstration proof and natural-continuation CTA. Apply proof-before-claim and viewer-conclusion principles.";
  }

  const best = profiles[0];

  const archetypeDescription = [
    `${best.creator_id}-pattern:`,
    `Hook with ${best.hook_archetype} archetype.`,
    `Primary proof via ${best.proof_preference.join(" and ")}.`,
    `Deliver in ${best.delivery_register} register.`,
    `Build trust through ${best.trust_mechanic}.`,
    `Handle objections via ${best.objection_style}.`,
    `Close with ${best.cta_approach} CTA.`,
    `Pacing: ${best.pacing_signature.split(".")[0]}.`,
  ].join(" ");

  const categoryAdaptation = best.category_adaptations[category];
  if (categoryAdaptation) {
    return `${archetypeDescription} Category note: ${categoryAdaptation}`;
  }

  return archetypeDescription;
}
