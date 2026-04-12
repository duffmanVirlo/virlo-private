/**
 * Founder testing startup script.
 * Loads .env.local (overriding any existing system env vars) and starts
 * the Next.js production server on port 3001.
 *
 * Usage: node scripts/start-test.js
 */
const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx);
    const val = trimmed.slice(eqIdx + 1);
    process.env[key] = val;
  }
  console.log("[start-test] Loaded .env.local");
} else {
  console.warn("[start-test] WARNING: .env.local not found");
}

console.log("[start-test] ANTHROPIC_API_KEY loaded:", !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.length > 0);
console.log("[start-test] Starting production server on port 3001...\n");

try {
  execSync("npx next start --port 3001", { stdio: "inherit", env: process.env });
} catch {
  process.exit(1);
}
