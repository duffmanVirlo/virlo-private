import { generateSessionId } from "./utils";

export function createSession(): string {
  return generateSessionId();
}

// Session storage keys
export const SESSION_KEYS = {
  product: (id: string) => `virlo_product_${id}`,
  classification: (id: string) => `virlo_classification_${id}`,
  output: (id: string) => `virlo_output_${id}`,
  pipelineState: (id: string) => `virlo_pipeline_${id}`,
} as const;
