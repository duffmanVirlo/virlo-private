import { NextRequest, NextResponse } from "next/server";
import { runExtraction } from "@/lib/convertiq/stages/extract";
import { isValidUrl, sanitizeUrl } from "@/lib/utils";
import { checkRateLimit, EXTRACT_LIMIT } from "@/lib/rateLimit";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const block = checkRateLimit(request, EXTRACT_LIMIT);
  if (block) return block;

  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "Please provide a product URL." },
        { status: 400 },
      );
    }

    const cleanUrl = sanitizeUrl(url);

    if (!isValidUrl(cleanUrl)) {
      return NextResponse.json(
        { error: "Please provide a valid product URL." },
        { status: 400 },
      );
    }

    const result = await runExtraction(cleanUrl);

    if (result.success && result.product) {
      // Full extraction succeeded
      return NextResponse.json({
        success: true,
        product: result.product,
        resolvedUrl: result.resolvedUrl,
      });
    }

    // Extraction failed — return partial data for manual fallback
    return NextResponse.json({
      success: false,
      partial: result.partial || { url: result.resolvedUrl },
      resolvedUrl: result.resolvedUrl,
      error: result.error || "Could not fully read the product page.",
    });
    // Note: returning 200 even on partial failure — the client handles the fallback UX
  } catch (error) {
    console.error("Extraction error:", error);
    // Even on total crash, return a structured response the client can work with
    return NextResponse.json({
      success: false,
      partial: { url: "" },
      resolvedUrl: "",
      error: "Could not reach the product page. Please check the link and try again.",
    });
  }
}
