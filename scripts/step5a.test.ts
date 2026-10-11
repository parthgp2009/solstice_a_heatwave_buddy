import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import manifestFn from "../app/manifest";

console.log("=== Running Step 5A Verification Test Suite ===");

// 1. Verify Manifest (app/manifest.ts)
const manifest = manifestFn();
assert.strictEqual(
  manifest.name,
  "Solstice: Heatwave Buddy",
  "Manifest name must be 'Solstice: Heatwave Buddy'"
);
assert.strictEqual(
  manifest.short_name,
  "Solstice",
  "Manifest short_name must be 'Solstice'"
);
assert.strictEqual(
  manifest.display,
  "standalone",
  "Manifest display must be 'standalone'"
);
assert.strictEqual(
  manifest.start_url,
  "/plan",
  "Manifest start_url must be '/plan'"
);
assert.strictEqual(
  manifest.background_color,
  "#FDF3E7",
  "Manifest background_color must be '#FDF3E7' (cream)"
);
assert.strictEqual(
  manifest.theme_color,
  "#1E2A44",
  "Manifest theme_color must be '#1E2A44' (navy)"
);

// Check icons at 192x192 and 512x512
assert(manifest.icons && manifest.icons.length >= 2, "Manifest must declare icons");
const icon192 = manifest.icons.find(i => i.sizes === "192x192");
const icon512 = manifest.icons.find(i => i.sizes === "512x512");
assert(icon192, "Manifest must have a 192x192 icon");
assert(icon512, "Manifest must have a 512x512 icon");

// Verify icon files physically exist in public/icons
assert(
  fs.existsSync(path.join(process.cwd(), "public", "icons", "icon-192.png")),
  "public/icons/icon-192.png must physically exist"
);
assert(
  fs.existsSync(path.join(process.cwd(), "public", "icons", "icon-512.png")),
  "public/icons/icon-512.png must physically exist"
);
console.log("✓ Step 1: Web App Manifest and icons at 192x192 and 512x512 verified");

// 2. Verify Service Worker (public/sw.js)
const swPath = path.join(process.cwd(), "public", "sw.js");
assert(fs.existsSync(swPath), "public/sw.js must exist");
const swCode = fs.readFileSync(swPath, "utf-8");

assert(swCode.includes("/offline"), "SW must pre-cache or handle offline page");
assert(swCode.includes("/plan"), "SW must pre-cache or handle /plan emergency check");
assert(swCode.includes("req.method !== 'GET'"), "SW must only intercept GET requests");

// Verify strict privacy guards (never cache API, weather, audio, supabase, personal data)
assert(
  swCode.includes("url.pathname.startsWith('/api/')") || swCode.includes("pathname.startsWith('/api')"),
  "SW must exclude /api/* routes"
);
assert(
  swCode.includes("open-meteo.com"),
  "SW must not cache live weather queries"
);
assert(
  swCode.includes("supabase.co"),
  "SW must not cache user database/auth requests"
);
assert(
  swCode.includes("/speak") || swCode.includes("audio/"),
  "SW must not cache dynamic audio synthesis"
);
console.log("✓ Step 2: Hand-written Service Worker and strict privacy filters verified");

// 3. Verify Service Worker Register component (production only)
const swRegPath = path.join(process.cwd(), "components", "ServiceWorkerRegister.tsx");
assert(fs.existsSync(swRegPath), "ServiceWorkerRegister.tsx must exist");
const swRegCode = fs.readFileSync(swRegPath, "utf-8");
assert(
  swRegCode.includes('process.env.NODE_ENV === "production"'),
  "ServiceWorkerRegister must only register in production"
);
assert(
  swRegCode.includes("navigator.serviceWorker") && swRegCode.includes(".register("),
  "ServiceWorkerRegister must call navigator.serviceWorker.register"
);
console.log("✓ Step 3: Production-only Service Worker registration verified");

// 4. Verify Offline Banner (Hindi & English)
const bannerPath = path.join(process.cwd(), "components", "OfflineBanner.tsx");
assert(fs.existsSync(bannerPath), "OfflineBanner.tsx must exist");
const bannerCode = fs.readFileSync(bannerPath, "utf-8");

const expectedEnBanner = "You are offline. Live weather and AI plans need internet. The emergency check and call 108 still work.";
assert(
  bannerCode.includes(expectedEnBanner),
  `Offline banner must include English message: "${expectedEnBanner}"`
);
assert(
  bannerCode.includes("आप ऑफलाइन हैं") && bannerCode.includes("108"),
  "Offline banner must include Hindi translation"
);
assert(
  bannerCode.includes('href="tel:108"'),
  "Offline banner must provide tap-to-call link for tel:108"
);
assert(
  bannerCode.includes("/plan#emergency-check-card"),
  "Offline banner must link to emergency check"
);
console.log("✓ Step 4: Bilingual offline banner verified");

// 5. Verify Heatstroke Emergency Check and Call 108 work offline
const emergencyCardPath = path.join(process.cwd(), "components", "HeatstrokeEmergencyCard.tsx");
const emergencyCode = fs.readFileSync(emergencyCardPath, "utf-8");
assert(!emergencyCode.includes("fetch("), "Emergency check must not make network requests");
assert(emergencyCode.includes('href="tel:108"'), "Emergency check must have tel:108 link");

const offlinePagePath = path.join(process.cwd(), "app", "offline", "page.tsx");
assert(fs.existsSync(offlinePagePath), "app/offline/page.tsx must exist");
const offlinePageCode = fs.readFileSync(offlinePagePath, "utf-8");
assert(offlinePageCode.includes('href="tel:108"'), "Offline page must have tel:108 link");
assert(offlinePageCode.includes("/plan#emergency-check-card"), "Offline page must link to emergency check");
console.log("✓ Step 5: Fully offline emergency check and Call 108 verified");

// 6. Verify consistent site name spelling
const layoutPath = path.join(process.cwd(), "app", "layout.tsx");
const layoutCode = fs.readFileSync(layoutPath, "utf-8");
assert(
  layoutCode.includes('title: "Solstice: Heatwave Buddy | Real-Time Personalised Heat Safety"'),
  "app/layout.tsx title must be 'Solstice: Heatwave Buddy | Real-Time Personalised Heat Safety'"
);

const privacyCode = fs.readFileSync(path.join(process.cwd(), "app", "privacy", "page.tsx"), "utf-8");
assert(
  privacyCode.includes("Solstice: Heatwave Buddy"),
  "Privacy page must use 'Solstice: Heatwave Buddy'"
);

const termsCode = fs.readFileSync(path.join(process.cwd(), "app", "terms", "page.tsx"), "utf-8");
assert(
  termsCode.includes("Solstice: Heatwave Buddy"),
  "Terms page must use 'Solstice: Heatwave Buddy'"
);

const readmeCode = fs.readFileSync(path.join(process.cwd(), "README.md"), "utf-8");
assert(
  readmeCode.includes("# Solstice: Heatwave Buddy"),
  "README must include '# Solstice: Heatwave Buddy'"
);
console.log("✓ Step 6: Site name spelled consistently across title, metadata, privacy, terms, and README");

console.log("\n=== ALL STEP 5A TESTS PASSED SUCCESSFULLY ===");
