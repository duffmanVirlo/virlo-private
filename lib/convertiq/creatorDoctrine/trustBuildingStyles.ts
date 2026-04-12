export type TrustStyle = {
  id: string;
  name: string;
  approach: string;
  credibility_source: string;
  category_affinity: string[];
  anti_pattern: string;
};

export const TRUST_STYLES: TrustStyle[] = [
  {
    id: "casual-authority",
    name: "Casual Authority",
    approach:
      "The creator demonstrates deep knowledge of the category through offhand specificity rather than credentials. They mention details only someone genuinely experienced would know, but they do it casually, as if it is obvious. The authority comes from the depth of their knowledge, not from claiming expertise.",
    credibility_source:
      "Domain-specific knowledge demonstrated through natural conversation. References to past experience, comparisons to other products in the category, and technical details mentioned without explanation signal that the creator lives in this category, not that they were briefed for a video.",
    category_affinity: [
      "TECH",
      "AUTO",
      "FITNESS",
      "OUTDOOR",
      "BEAUTY",
      "WELLNESS",
    ],
    anti_pattern:
      "Listing credentials or qualifications to establish authority. 'As someone who has been in skincare for ten years...' feels like a setup for a pitch. The authority should be apparent from what the creator knows, not from what they claim about themselves.",
  },
  {
    id: "real-use-evidence",
    name: "Real Use Evidence",
    approach:
      "Trust is built by showing evidence of genuine, sustained use of the product. This includes a product that is visibly partially used, a product sitting among the creator's real belongings, packaging that has been opened and resealed, or the creator referencing specific experiences over time with the product.",
    credibility_source:
      "Physical evidence of real ownership and use that cannot be easily faked. A half-empty bottle, a worn product, or a product already sitting on the creator's shelf when the video starts. Time-based references like 'I have been using this for three weeks and here is what I noticed' that suggest longitudinal experience.",
    category_affinity: [
      "BEAUTY",
      "WELLNESS",
      "KITCHEN",
      "HOME",
      "FITNESS",
      "PET",
    ],
    anti_pattern:
      "Product is clearly brand new, still perfectly packaged, or being shown for the obviously first time. The creator handles it like they just received it rather than like they have lived with it. This signals paid sponsorship rather than genuine recommendation.",
  },
  {
    id: "honest-limitation",
    name: "Honest Limitation",
    approach:
      "The creator proactively shares what the product does not do well, who it is not for, or where it falls short compared to alternatives. This honesty is brief and matter-of-fact, not dramatic or apologetic. It is delivered as useful information from someone who wants the viewer to make a good decision, not as a critique.",
    credibility_source:
      "Willingness to lose a potential sale by being honest. When a creator says 'this is not for you if...' they signal that their recommendation is conditional and therefore credible. The viewer trusts the positive claims more because the creator has demonstrated they are willing to share negative ones.",
    category_affinity: [
      "BEAUTY",
      "TECH",
      "AUTO",
      "WELLNESS",
      "FITNESS",
      "OUTDOOR",
    ],
    anti_pattern:
      "Framing limitations as positives ('the only downside is it works too well!') or mentioning only trivial limitations that do not actually affect the purchase decision. The limitation must be real and relevant, or the honesty reads as a sales technique rather than genuine candor.",
  },
  {
    id: "peer-recommendation",
    name: "Peer Recommendation",
    approach:
      "The creator positions themselves as a peer who discovered something and is sharing it with their community, not as an authority recommending from above. The framing is 'I found this and thought you should know' rather than 'I recommend this.' The enthusiasm is personal and specific rather than professional and polished.",
    credibility_source:
      "Social proximity and shared identity with the viewer. The creator's excitement feels genuine because it is expressed the way a friend would express it: slightly disorganized, highly specific about their personal experience, and focused on how it fits into their actual life rather than on the product's feature list.",
    category_affinity: [
      "HOME",
      "KITCHEN",
      "BABY",
      "PET",
      "FASHION",
      "OFFICE",
    ],
    anti_pattern:
      "Using polished language or marketing-style superlatives that no one would use in a real conversation with a friend. Saying 'I am obsessed with this revolutionary product' instead of 'okay so I found this thing and it actually works way better than I expected.' The peer frame breaks the moment the language becomes too produced.",
  },
];
