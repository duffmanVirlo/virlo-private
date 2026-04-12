import { NextRequest, NextResponse } from "next/server";
import { runClassification } from "@/lib/convertiq/stages/classify";
import type { ExtractedProduct } from "@/types/product";
import { checkRateLimit, CLASSIFY_LIMIT } from "@/lib/rateLimit";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const block = checkRateLimit(request, CLASSIFY_LIMIT);
  if (block) return block;

  try {
    const body = await request.json();
    const product = body.product as ExtractedProduct;

    if (!product || (!product.url && !product.title)) {
      return NextResponse.json(
        { error: "Product data is required for classification." },
        { status: 400 },
      );
    }

    const classification = await runClassification(product);

    return NextResponse.json(classification);
  } catch (error) {
    console.error("Classification error:", error);
    return NextResponse.json(
      { error: "Unable to classify product. Please try again." },
      { status: 500 },
    );
  }
}
