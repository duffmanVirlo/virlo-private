import { v4 as uuidv4 } from "uuid";

export function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeUrl(input: string): string {
  let url = input.trim();

  // Handle TikTok mobile share format: may start with just "vm.tiktok.com/..."
  if (
    url.match(/^(vm|vt)\.tiktok\.com\//) ||
    url.match(/^www\.tiktok\.com\/t\//) ||
    url.match(/^tiktok\.com\/t\//)
  ) {
    url = "https://" + url;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    const parsed = new URL(url);
    // Don't strip params from short URLs — they may be needed for redirect resolution
    const isShortUrl =
      parsed.hostname === "vm.tiktok.com" ||
      parsed.hostname === "vt.tiktok.com" ||
      parsed.pathname.startsWith("/t/");

    if (!isShortUrl) {
      const trackingParams = [
        "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
        "fbclid", "gclid", "is_copy_url", "is_from_webapp", "sender_device",
      ];
      trackingParams.forEach((p) => parsed.searchParams.delete(p));
    }

    return parsed.toString();
  } catch {
    return url;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

export function generateSessionId(): string {
  return uuidv4();
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}
