import type { CategoryId } from "@/types/classification";

export type ProductTypeDefinition = {
  category: CategoryId;
  type_name: string;
  primary_conversion_mechanism: string;
  dominant_objection: string;
  required_proof: string;
  content_style_affinity: string[];
  anti_patterns: string[];
};

export const autoProductTypes: ProductTypeDefinition[] = [
  {
    category: "AUTO",
    type_name: "Magnetic tool mat",
    primary_conversion_mechanism: "Frustration elimination — viewers who have lost bolts mid-repair buy instantly when they see the magnet grip demo",
    dominant_objection: "Will the magnets actually hold heavy sockets and not slide off on angled surfaces?",
    required_proof: "Overhead POV of bolts, nuts, and sockets clinging to the mat while tilted at 45+ degrees during a real repair",
    content_style_affinity: ["garage POV repair", "tool organization ASMR", "before-after workspace", "mechanic tip format"],
    anti_patterns: ["Studio-only demos with no real vehicle context", "Listing magnetic strength specs without visual proof", "Clean-room aesthetics that feel disconnected from actual garage use"],
  },
  {
    category: "AUTO",
    type_name: "Phone mount",
    primary_conversion_mechanism: "Safety anxiety — shaky phone footage on a dashboard triggers the need for a stable, vibration-free mount",
    dominant_objection: "Will it actually stay put on bumpy roads and not block my vents or windshield view?",
    required_proof: "Dashcam-style clip showing the phone rock-solid over potholes, speed bumps, and highway driving",
    content_style_affinity: ["drive-along POV", "road trip vlog", "rideshare driver setup", "installation speed demo"],
    anti_patterns: ["Stationary desk demos that ignore real road vibration", "Over-produced studio shots with no driving footage", "Focusing on aesthetics over stability proof"],
  },
  {
    category: "AUTO",
    type_name: "Trim restorer",
    primary_conversion_mechanism: "Vanity transformation — the dramatic before-after of faded black trim returning to factory finish triggers impulse purchases",
    dominant_objection: "How long does the restored look actually last before it fades again?",
    required_proof: "Split-screen before-after on sun-faded trim with a follow-up clip showing the same trim 30+ days later",
    content_style_affinity: ["satisfying restoration", "detail transformation", "split-screen before-after", "wipe-on reveal"],
    anti_patterns: ["Indoor-only application with no sun exposure context", "No durability follow-up or longevity claim", "Using brand-new trim as the demo surface"],
  },
  {
    category: "AUTO",
    type_name: "Detailing kit",
    primary_conversion_mechanism: "Aspirational identity — viewers want to feel like professional detailers and the full kit provides instant credibility",
    dominant_objection: "Are these actually pro-grade products or just repackaged dollar-store cleaners in a nice bag?",
    required_proof: "Full exterior or interior detail using only kit contents on a visibly dirty vehicle with clear transformation",
    content_style_affinity: ["full detail timelapse", "dirty car transformation", "product lineup walkthrough", "detailer routine"],
    anti_patterns: ["Showing individual products without a complete workflow", "Using already-clean vehicles", "Unboxing without any application footage"],
  },
  {
    category: "AUTO",
    type_name: "Dash cam",
    primary_conversion_mechanism: "Fear of loss — viral crash and insurance-fraud clips make viewers realize they need evidence protection",
    dominant_objection: "Will the video quality actually be clear enough to read license plates and hold up for insurance claims?",
    required_proof: "Real daytime and nighttime footage showing readable plates, clear timestamps, and parking-mode capture",
    content_style_affinity: ["caught on camera", "close call compilation", "night vision demo", "installation walkthrough"],
    anti_patterns: ["Only showing daytime footage", "Spec-sheet overlays without real-world clips", "Skipping the parking-mode and night-mode demos"],
  },
  {
    category: "AUTO",
    type_name: "Air freshener system",
    primary_conversion_mechanism: "Sensory aspiration — viewers cannot smell through the screen, so the conversion relies on luxury car interior aesthetics and social proof reactions",
    dominant_objection: "Does it actually last more than a few days or is it just another weak air freshener?",
    required_proof: "Passenger reaction clips plus a timeline showing scent longevity over weeks, not days",
    content_style_affinity: ["luxury car interior tour", "passenger reaction", "car aesthetic setup", "scent tier list"],
    anti_patterns: ["Only showing the product packaging", "No social proof or reaction from others", "Making scent claims without any longevity evidence"],
  },
  {
    category: "AUTO",
    type_name: "Seat organizer",
    primary_conversion_mechanism: "Chaos relief — messy backseat or console footage triggers an immediate organizational impulse buy",
    dominant_objection: "Will it actually fit my specific car model and not look bulky or cheap?",
    required_proof: "Installation across 2-3 different vehicle types showing universal fit and loaded compartments in use",
    content_style_affinity: ["messy car transformation", "road trip packing", "mom car organization", "rideshare driver setup"],
    anti_patterns: ["Empty organizer beauty shots without real items loaded", "Single vehicle demo that does not prove universal fit", "Ignoring the messy before state"],
  },
  {
    category: "AUTO",
    type_name: "Tire inflator",
    primary_conversion_mechanism: "Emergency preparedness — flat tire fear and roadside breakdown anxiety drive preventive purchases",
    dominant_objection: "Is it powerful enough to actually inflate a full-size tire and not just pool floats?",
    required_proof: "Real-time inflation of a fully flat car tire with PSI gauge visible, showing time to full inflation",
    content_style_affinity: ["roadside rescue scenario", "trunk emergency kit", "speed test inflation", "compact size reveal"],
    anti_patterns: ["Only inflating small items like balls or bike tires", "Skipping the PSI readout and time measurement", "No real flat tire scenario"],
  },
];
