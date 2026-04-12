import { NextRequest, NextResponse } from "next/server";
import { runPipeline } from "@/lib/convertiq/pipeline";
import { isValidUrl, sanitizeUrl, generateSessionId } from "@/lib/utils";
import { checkRateLimit, GENERATE_LIMIT, GENERATE_BURST_LIMIT } from "@/lib/rateLimit";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  // Rate limit checks — burst first, then daily
  const burstBlock = checkRateLimit(request, GENERATE_BURST_LIMIT);
  if (burstBlock) return burstBlock;

  const dailyBlock = checkRateLimit(request, GENERATE_LIMIT);
  if (dailyBlock) return dailyBlock;

  try {
    const body = await request.json();
    const { url, sessionId, overrideCategory, overrideProductType, product, classification } = body;

    if (!url || !isValidUrl(sanitizeUrl(url))) {
      return NextResponse.json(
        { error: "Please provide a valid product URL." },
        { status: 400 },
      );
    }

    const cleanUrl = sanitizeUrl(url);
    const id = sessionId || generateSessionId();

    const result = await runPipeline({
      url: cleanUrl,
      sessionId: id,
      overrideCategory,
      overrideProductType,
      preExtractedProduct: product,
      preClassification: classification,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Generation failed. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(result.output);
  } catch (error) {
    console.error("Pipeline error:", error);
    return NextResponse.json(
      { error: "Content generation is currently busy. Please try again in a moment." },
      { status: 500 },
    );
  }
}
