import * as cheerio from "cheerio";
import type { ExtractedProduct } from "@/types/product";
import { callClaudeWithRetry } from "@/lib/anthropic";
import { EXTRACT_SYSTEM_PROMPT, buildExtractPrompt } from "@/lib/prompts/extract";
import { truncateText } from "@/lib/utils";

const FETCH_TIMEOUT = 15000;
const REDIRECT_TIMEOUT = 10000;
const USER_AGENT = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// TikTok short URL patterns that need redirect resolution
const SHORT_URL_PATTERNS = [
  /^https?:\/\/vm\.tiktok\.com\//,
  /^https?:\/\/vt\.tiktok\.com\//,
  /^https?:\/\/www\.tiktok\.com\/t\//,
  /^https?:\/\/tiktok\.com\/t\//,
];

function isTikTokShortUrl(url: string): boolean {
  return SHORT_URL_PATTERNS.some((pattern) => pattern.test(url));
}

function isTikTokUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes("tiktok.com");
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// TikTok URL classification
// ---------------------------------------------------------------------------

type TikTokPageType = "product" | "homepage" | "video" | "profile" | "unknown";

function classifyTikTokUrl(url: string): TikTokPageType {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;

    // Product pages: /view/product/{id} or /@seller/product/{id}
    if (/\/view\/product\/\d+/.test(path) || /\/@[^/]+\/product\/\d+/.test(path)) {
      return "product";
    }
    // Legacy shop PDP pattern
    if (/\/shop\/pdp\//.test(path)) {
      return "product";
    }
    // Homepage or bare root
    if (path === "/" || path === "") {
      return "homepage";
    }
    // Video pages
    if (/\/@[^/]+\/video\/\d+/.test(path)) {
      return "video";
    }
    // Profile pages
    if (/^\/@[^/]+\/?$/.test(path)) {
      return "profile";
    }

    return "unknown";
  } catch {
    return "unknown";
  }
}

// ---------------------------------------------------------------------------
// og_info extraction from redirect URLs
// ---------------------------------------------------------------------------

type OgInfo = {
  title: string | null;
  image: string | null;
};

/**
 * TikTok embeds product metadata in the `og_info` query parameter of redirect URLs.
 * This is the highest-quality signal available from short URL resolution.
 */
function extractOgInfoFromUrl(url: string): OgInfo | null {
  try {
    const parsed = new URL(url);
    const ogInfoRaw = parsed.searchParams.get("og_info");
    if (!ogInfoRaw) return null;

    const ogInfo = JSON.parse(ogInfoRaw);
    return {
      title: typeof ogInfo.title === "string" ? ogInfo.title : null,
      image: typeof ogInfo.image === "string" ? ogInfo.image : null,
    };
  } catch {
    return null;
  }
}

/**
 * Extract the numeric product ID from a TikTok product URL.
 */
function extractProductId(url: string): string | null {
  // Standard: /view/product/{id} or /@seller/product/{id}
  const match = url.match(/\/(?:view\/)?product\/(\d+)/);
  if (match) return match[1];
  // PDP pattern: /shop/pdp/{slug}-i{id}
  const pdpMatch = url.match(/\/shop\/pdp\/.*-i(\d+)/);
  return pdpMatch ? pdpMatch[1] : null;
}

/**
 * Extract a human-readable product name from a TikTok PDP URL slug.
 * e.g. /shop/pdp/fruit-storage-container-with-lid-i12345 → "Fruit Storage Container With Lid"
 */
function extractProductNameFromSlug(url: string): string | null {
  // Match PDP slug: /shop/pdp/{slug}-i{id}
  const pdpMatch = url.match(/\/shop\/pdp\/([a-z0-9-]+?)(?:-i\d+)/i);
  if (pdpMatch) {
    return pdpMatch[1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }
  // Match @seller/product paths that sometimes include slugs
  const sellerMatch = url.match(/\/@[^/]+\/product\/[^/]+\/([a-z0-9-]+)/i);
  if (sellerMatch) {
    return sellerMatch[1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }
  return null;
}

// ---------------------------------------------------------------------------
// Redirect resolution
// ---------------------------------------------------------------------------

/**
 * Resolve a short/redirect URL to its final destination.
 * Uses HEAD requests with manual redirect following to capture the full redirect URL
 * (which may contain og_info and other metadata).
 */
async function resolveRedirects(url: string, maxHops = 5): Promise<string> {
  let currentUrl = url;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REDIRECT_TIMEOUT);

  try {
    for (let i = 0; i < maxHops; i++) {
      const response = await fetch(currentUrl, {
        method: "HEAD",
        headers: {
          "User-Agent": USER_AGENT,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        redirect: "manual",
        signal: controller.signal,
      });

      const location = response.headers.get("location");
      if (!location) {
        return currentUrl;
      }

      // Handle relative redirects
      if (location.startsWith("/")) {
        const base = new URL(currentUrl);
        currentUrl = `${base.protocol}//${base.host}${location}`;
      } else {
        currentUrl = location;
      }

      // If we've reached a TikTok product URL, stop immediately.
      // TikTok product URLs are long (1000+ chars with params) and HEAD requests
      // to them stall/timeout. We already have all the data we need from the
      // redirect Location header (product path + og_info params).
      if (/\/view\/product\/\d+/.test(currentUrl) || /\/@[^/]+\/product\/\d+/.test(currentUrl)) {
        return currentUrl;
      }
    }

    return currentUrl;
  } catch {
    // If HEAD fails, try GET with redirect: follow using the CURRENT url
    // (not the original) so we don't restart the chain
    const fallbackUrl = currentUrl !== url ? currentUrl : url;
    try {
      const fallbackController = new AbortController();
      const fallbackTimeout = setTimeout(() => fallbackController.abort(), REDIRECT_TIMEOUT);
      try {
        const response = await fetch(fallbackUrl, {
          headers: { "User-Agent": USER_AGENT, "Accept": "text/html" },
          redirect: "follow",
          signal: fallbackController.signal,
        });
        return response.url || fallbackUrl;
      } finally {
        clearTimeout(fallbackTimeout);
      }
    } catch {
      return fallbackUrl;
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

// ---------------------------------------------------------------------------
// URL normalization
// ---------------------------------------------------------------------------

/**
 * Normalize a TikTok URL: strip pure tracking params but PRESERVE
 * product-carrying params like og_info.
 */
function normalizeTikTokUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Pure tracking params safe to strip — these carry no product data
    const trackingParams = [
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "fbclid", "gclid", "_t", "tt_from", "refer", "channel", "is_copy_url",
      "is_from_webapp", "sender_device", "sender_web_id", "source",
      "sec_uid", "share_app_id", "share_author_id", "share_link_id",
      "region", "priority_region", "uniqueId",
      "social_share_type", "timestamp", "u_code", "ug_btm", "unique_id",
      "user_id", "sec_user_id", "share_region",
    ];
    trackingParams.forEach((p) => parsed.searchParams.delete(p));

    // Explicitly DO NOT strip: og_info, encode_params, checksum, _svg, chain_key, trackParams
    // These are either product-carrying or required for page rendering

    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Build a clean product URL for storage (strip everything except path + product ID).
 */
function buildCleanProductUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const productId = extractProductId(url);
    if (productId) {
      return `https://${parsed.hostname}/view/product/${productId}`;
    }
    // Fallback: just protocol + host + path
    return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`;
  } catch {
    return url;
  }
}

// ---------------------------------------------------------------------------
// Page fetching
// ---------------------------------------------------------------------------

async function fetchPageHtml(url: string): Promise<{ html: string; finalUrl: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "identity",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    const finalUrl = response.url || url;

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return { html, finalUrl };
  } finally {
    clearTimeout(timeoutId);
  }
}

// ---------------------------------------------------------------------------
// HTML parsing
// ---------------------------------------------------------------------------

function cleanHtml(html: string): string {
  const $ = cheerio.load(html);

  $("script, style, nav, header, footer, iframe, noscript, svg, [role='navigation'], [role='banner'], [role='contentinfo']").remove();
  $("[style*='display: none'], [style*='display:none'], [hidden], .hidden").remove();

  const text = $("body").text()
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();

  return truncateText(text, 5000);
}

function extractMetadata(html: string): {
  title: string | null;
  description: string | null;
  price: number | null;
  images: string[];
  siteName: string | null;
} {
  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="title"]').attr("content") ||
    null;

  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    null;

  const siteName =
    $('meta[property="og:site_name"]').attr("content") || null;

  let price: number | null = null;
  const priceStr =
    $('meta[property="product:price:amount"]').attr("content") ||
    $('meta[property="og:price:amount"]').attr("content");
  if (priceStr) {
    const parsed = parseFloat(priceStr);
    if (!isNaN(parsed)) price = parsed;
  }

  const images: string[] = [];
  $('meta[property="og:image"]').each((_, el) => {
    const content = $(el).attr("content");
    if (content) images.push(content);
  });

  return {
    title: title?.trim() || null,
    description: description?.trim() || null,
    price,
    images: images.slice(0, 10),
    siteName: siteName?.trim() || null,
  };
}

function extractStructuredData(html: string): Record<string, unknown> | null {
  const $ = cheerio.load(html);
  let structured: Record<string, unknown> | null = null;

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || "");
      if (data["@type"] === "Product" || data["@type"]?.includes?.("Product")) {
        structured = data;
      }
    } catch {
      // Ignore
    }
  });

  return structured;
}

// ---------------------------------------------------------------------------
// Extraction quality assessment
// ---------------------------------------------------------------------------

/**
 * Determine whether we have enough product signals to skip Claude extraction
 * and build the product directly from metadata. This avoids sending garbage
 * boilerplate from SPA shells to Claude.
 */
function hasStrongMetadata(
  ogInfo: OgInfo | null,
  metadata: { title: string | null; description: string | null; price: number | null; images: string[] },
): boolean {
  const title = ogInfo?.title || metadata.title;
  const desc = metadata.description;
  // Strong = we have a real product title (not a generic page title) and a description
  if (!title) return false;
  const genericTitles = ["tiktok", "tiktok - make your day", "tiktok shop"];
  if (genericTitles.includes(title.toLowerCase())) return false;
  return !!(title && desc);
}

/**
 * Detect whether fetched HTML is a TikTok captcha/security challenge page.
 * TikTok returns a ~5KB "Security Check" captcha page from data center IPs
 * instead of real product content. This is the primary blocker for
 * server-side extraction on hosted platforms (Vercel, AWS, etc.).
 */
function isCaptchaPage(html: string): boolean {
  if (!html || html.length < 50) return false;
  // TikTok captcha pages have <title>Security Check</title> and a captcha container
  return (
    html.includes("<title>Security Check</title>") ||
    html.includes("captcha_container") ||
    html.includes("oec-ttweb-captcha")
  );
}

/**
 * Check whether cleaned HTML is actually product content vs. SPA boilerplate.
 * TikTok SPA shells return 500KB+ of HTML but the visible text is mostly
 * cookie banners, nav labels, and framework noise.
 */
function isProductContent(cleanedText: string, pageType: TikTokPageType): boolean {
  if (pageType === "homepage") return false;

  // If the cleaned text is >100 chars but doesn't contain any product-like signals,
  // it's boilerplate
  if (cleanedText.length < 100) return false;

  // For TikTok pages specifically, check if the text has product signals
  // beyond generic framework noise
  const productSignals = [
    /\$\d+/, /USD/, /price/i, /add to cart/i, /buy now/i,
    /reviews?/i, /rating/i, /sold/i, /shipping/i, /delivery/i,
    /in stock/i, /quantity/i,
  ];

  const signalCount = productSignals.filter((p) => p.test(cleanedText)).length;
  return signalCount >= 2;
}

// ---------------------------------------------------------------------------
// Main extraction
// ---------------------------------------------------------------------------

export type ExtractionResult = {
  success: boolean;
  product: ExtractedProduct | null;
  partial: Partial<ExtractedProduct> | null;
  resolvedUrl: string;
  error?: string;
};

export async function runExtraction(url: string): Promise<ExtractionResult> {
  let resolvedUrl = url;
  let ogInfo: OgInfo | null = null;

  // ── Step 1: Resolve redirects for TikTok URLs ──────────────────────────
  if (isTikTokShortUrl(url) || isTikTokUrl(url)) {
    try {
      const rawResolvedUrl = await resolveRedirects(url);

      // Extract og_info from the redirect URL BEFORE normalizing
      ogInfo = extractOgInfoFromUrl(rawResolvedUrl);

      // Now normalize (strips tracking but preserves product params)
      resolvedUrl = normalizeTikTokUrl(rawResolvedUrl);
    } catch {
      resolvedUrl = url;
    }
  }

  // ── Step 2: Classify the resolved URL ──────────────────────────────────
  const pageType = classifyTikTokUrl(resolvedUrl);

  // If the short URL resolved to the homepage, it's a dead/invalid link.
  // Don't waste time fetching a 800KB homepage.
  if (pageType === "homepage") {
    const partial: Partial<ExtractedProduct> = {
      url: resolvedUrl,
      title: ogInfo?.title || null,
      images: ogInfo?.image ? [ogInfo.image] : [],
    };

    // If we got og_info from the redirect chain despite landing on homepage,
    // the link was valid but TikTok redirected to homepage anyway.
    // Use the og_info to still provide a useful partial.
    if (ogInfo?.title) {
      return {
        success: false,
        product: null,
        partial,
        resolvedUrl,
        error: "The link redirected to TikTok's homepage, but we captured the product name. You can continue with manual entry.",
      };
    }

    return {
      success: false,
      product: null,
      partial,
      resolvedUrl,
      error: "This link resolved to TikTok's homepage — it may be expired or invalid.",
    };
  }

  // ── Step 3: Fetch the page HTML ────────────────────────────────────────
  let rawHtml = "";
  let fetchSuccess = false;
  let wasCaptchaBlocked = false;

  try {
    const result = await fetchPageHtml(resolvedUrl);
    rawHtml = result.html;
    fetchSuccess = true;

    if (result.finalUrl !== resolvedUrl) {
      // Check if the fetch itself redirected us to homepage
      const fetchPageType = classifyTikTokUrl(result.finalUrl);
      if (fetchPageType === "homepage") {
        // The page redirected us away — use og_info/metadata we already have
        fetchSuccess = false;
        rawHtml = "";
      }
    }

    // Detect TikTok captcha/security challenge page
    // Data center IPs (Vercel, AWS, etc.) get a ~5KB captcha wall instead of
    // real product HTML. When detected, discard the HTML and fall through to
    // URL-based extraction so we can still extract from the product ID.
    if (fetchSuccess && isCaptchaPage(rawHtml)) {
      fetchSuccess = false;
      rawHtml = "";
      wasCaptchaBlocked = true;
    }

    // Detect TikTok SPA shell with unresolved template placeholders.
    // e.g. OG description = "Buy {product_name} on TikTok Shop" — SSR failed.
    // The HTML is 30-50KB of framework boilerplate with no real product data.
    if (fetchSuccess && isTikTokUrl(resolvedUrl) && rawHtml.includes("{product_name}")) {
      fetchSuccess = false;
      rawHtml = "";
      wasCaptchaBlocked = true; // treat same as captcha — need URL-based fallback
    }
  } catch {
    fetchSuccess = false;
  }

  // ── Step 4: Extract metadata from HTML + og_info + structured data ─────
  const metadata = rawHtml
    ? extractMetadata(rawHtml)
    : { title: null, description: null, price: null, images: [], siteName: null };
  const structuredData = rawHtml ? extractStructuredData(rawHtml) : null;
  const cleanedText = rawHtml ? cleanHtml(rawHtml) : "";
  const productId = extractProductId(resolvedUrl);
  const cleanProductUrl = isTikTokUrl(resolvedUrl)
    ? buildCleanProductUrl(resolvedUrl)
    : resolvedUrl;

  // Merge all metadata sources: og_info (from redirect) > OG tags (from HTML) > structured data
  // Detect TikTok template placeholders — OG tags that contain unresolved {variable} tokens
  // e.g. "Buy {product_name} on TikTok Shop" — these are SSR template failures
  const isTemplateGarbage = (text: string | null): boolean => {
    if (!text) return false;
    return /\{[a-z_]+\}/.test(text);
  };

  const mergedTitle = ogInfo?.title || (isTemplateGarbage(metadata.title) ? null : metadata.title) || null;
  const mergedDescription = isTemplateGarbage(metadata.description) ? null : metadata.description || null;
  const mergedPrice = metadata.price || null;
  const mergedImages: string[] = [];
  if (ogInfo?.image) mergedImages.push(ogInfo.image);
  mergedImages.push(...metadata.images);

  // Enrich from structured data
  let enrichedTitle = mergedTitle;
  let enrichedDescription = mergedDescription;
  let enrichedPrice = mergedPrice;

  if (structuredData) {
    if (!enrichedTitle && typeof structuredData.name === "string") {
      enrichedTitle = structuredData.name;
    }
    if (!enrichedDescription && typeof structuredData.description === "string") {
      enrichedDescription = structuredData.description;
    }
    if (!enrichedPrice && structuredData.offers) {
      const offers = structuredData.offers as Record<string, unknown>;
      const priceVal = offers.price || (Array.isArray(offers) ? offers[0]?.price : null);
      if (typeof priceVal === "number") enrichedPrice = priceVal;
      if (typeof priceVal === "string") {
        const p = parseFloat(priceVal);
        if (!isNaN(p)) enrichedPrice = p;
      }
    }
  }

  // ── Step 5: Decide extraction strategy ─────────────────────────────────
  const strong = hasStrongMetadata(ogInfo, {
    title: enrichedTitle,
    description: enrichedDescription,
    price: enrichedPrice,
    images: mergedImages,
  });
  const textIsUseful = isProductContent(cleanedText, pageType);

  // Build the best context string for Claude extraction
  let extractionContext: string;

  if (strong) {
    // We have strong metadata — build a focused context from it rather than
    // feeding SPA boilerplate to Claude
    const parts: string[] = [
      `Product: ${enrichedTitle}`,
    ];
    if (enrichedDescription) parts.push(`Description: ${enrichedDescription}`);
    if (enrichedPrice) parts.push(`Price: $${enrichedPrice}`);
    if (productId) parts.push(`TikTok Shop Product ID: ${productId}`);
    parts.push(`URL: ${cleanProductUrl}`);
    if (metadata.siteName) parts.push(`Source: ${metadata.siteName}`);

    // If the cleaned HTML also has real product content, append it
    if (textIsUseful) {
      parts.push(`\nPage content:\n${cleanedText}`);
    }

    extractionContext = parts.join("\n");
  } else if (textIsUseful) {
    // Cleaned HTML has real product signals — use it
    extractionContext = cleanedText;
  } else if (enrichedTitle) {
    // We have a title but not enough for "strong" — build minimal context
    const parts: string[] = [`Product: ${enrichedTitle}`];
    if (enrichedDescription) parts.push(`Description: ${enrichedDescription}`);
    if (enrichedPrice) parts.push(`Price: $${enrichedPrice}`);
    parts.push(`URL: ${cleanProductUrl}`);
    extractionContext = parts.join("\n");
  } else if (wasCaptchaBlocked && (productId || isTikTokUrl(resolvedUrl))) {
    // TikTok captcha blocked the page, but we can extract from URL structure.
    // Try to get a product name from the URL slug (common in /shop/pdp/ URLs).
    const slugName = extractProductNameFromSlug(resolvedUrl);
    const parts: string[] = [
      `TikTok Shop Product (page was not accessible — extract from URL structure)`,
    ];
    if (slugName) {
      parts.push(`Product Name (from URL): ${slugName}`);
      // Also set as enrichedTitle so partial fallback has it
      if (!enrichedTitle) enrichedTitle = slugName;
    }
    if (productId) parts.push(`Product ID: ${productId}`);
    parts.push(`URL: ${cleanProductUrl}`);
    parts.push(`Source: TikTok Shop`);
    parts.push(`Note: The product page returned a security challenge. Use the product name from the URL slug and any other available signals to extract product details. Infer the likely product category, description, and key features from the product name.`);
    extractionContext = parts.join("\n");
  } else {
    extractionContext = "";
  }

  // ── Step 6: Run Claude extraction if we have anything to work with ─────
  if (extractionContext.length > 20) {
    try {
      const extracted = await callClaudeWithRetry<ExtractedProduct>({
        prompt: buildExtractPrompt(cleanProductUrl, extractionContext),
        systemPrompt: EXTRACT_SYSTEM_PROMPT,
        maxTokens: 2048,
        temperature: 0.1,
        stage: "extract",
      });

      const product: ExtractedProduct = {
        ...extracted,
        url: cleanProductUrl,
        title: extracted.title || enrichedTitle,
        description: extracted.description || enrichedDescription,
        price: extracted.price ?? enrichedPrice,
        images: extracted.images.length > 0 ? extracted.images : mergedImages,
        raw_text: truncateText(extractionContext, 2000),
      };

      // Final quality gate: reject if Claude returned a generic/empty product.
      // When captcha-blocked, relax the gate — a non-generic title from URL
      // context is enough to proceed because the classification stage will
      // validate independently. This avoids dumping users into manual entry
      // when we have a perfectly good product name from the URL slug.
      if (isExtractedProductUseful(product) || (wasCaptchaBlocked && product.title && !isGenericTitle(product.title))) {
        return { success: true, product, partial: null, resolvedUrl: cleanProductUrl };
      }

      // Claude returned garbage — fall through to partial
    } catch {
      // Claude failed — fall through to partial
    }
  }

  // ── Step 7: Partial / fallback ─────────────────────────────────────────
  const partial: Partial<ExtractedProduct> = {
    url: cleanProductUrl,
    title: enrichedTitle,
    description: enrichedDescription,
    price: enrichedPrice,
    images: mergedImages,
  };

  if (enrichedTitle) {
    return {
      success: false,
      product: null,
      partial,
      resolvedUrl: cleanProductUrl,
      error: "We read the product name but couldn't extract full details.",
    };
  }

  return {
    success: false,
    product: null,
    partial: { ...partial, url: cleanProductUrl },
    resolvedUrl: cleanProductUrl,
    error: wasCaptchaBlocked
      ? "TikTok blocked automatic reading of this product page. Please enter the product details manually."
      : fetchSuccess
        ? "The page loaded but didn't contain readable product data."
        : "Could not reach the product page. The link may be expired or restricted.",
  };
}

// ---------------------------------------------------------------------------
// Extraction quality gate
// ---------------------------------------------------------------------------

const GENERIC_TITLES = [
  "tiktok", "tiktok - make your day", "tiktok shop", "product",
  "unknown", "untitled", "n/a",
];

function isGenericTitle(title: string): boolean {
  return GENERIC_TITLES.includes(title.toLowerCase().trim());
}

/**
 * Check whether a Claude-extracted product has real content
 * vs. generic/hallucinated filler.
 */
function isExtractedProductUseful(product: ExtractedProduct): boolean {
  if (!product.title) return false;
  if (isGenericTitle(product.title)) return false;

  // Must have title + at least one other signal
  const hasDescription = !!product.description && product.description.length > 10;
  const hasClaims = product.claims.length > 0;
  const hasPrice = product.price !== null;

  return hasDescription || hasClaims || hasPrice;
}
