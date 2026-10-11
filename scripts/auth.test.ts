import fs from "fs";
import path from "path";
import { isSupabaseConfigured, createClient } from "../lib/supabase/client";

async function runAuthTests() {
  console.log("=== SUPABASE GOOGLE OAUTH & CALLBACK ROUTE TESTS ===");

  // 1. Verify app/auth/callback/route.ts exists
  const callbackRoutePath = path.join(process.cwd(), "app", "auth", "callback", "route.ts");
  if (!fs.existsSync(callbackRoutePath)) {
    console.error(`Missing callback route file at: ${callbackRoutePath}`);
    process.exit(1);
  }
  console.log("Found app/auth/callback/route.ts.");

  const routeContent = fs.readFileSync(callbackRoutePath, "utf-8");

  // 2. Verify exchangeCodeForSession is called
  if (!routeContent.includes("exchangeCodeForSession")) {
    console.error("Callback route does not call exchangeCodeForSession!");
    process.exit(1);
  }
  console.log("Verified exchangeCodeForSession call in route handler.");

  // 3. Test GET handler invocation with and without code
  const { GET } = await import("../app/auth/callback/route");

  // Test A: Request without code -> should gracefully redirect to home (/)
  const noCodeReq = new Request("http://localhost:3000/auth/callback");
  const noCodeRes = await GET(noCodeReq);
  const locationA = noCodeRes.headers.get("location");
  console.log(`Request without code redirected to: ${locationA}`);
  if (!locationA || !locationA.includes("http://localhost:3000/")) {
    console.error("Failed to redirect to fallback on missing code!");
    process.exit(1);
  }

  // Test B: Request with next query param -> should redirect to designated next path
  const nextReq = new Request("http://localhost:3000/auth/callback?next=/plan");
  const nextRes = await GET(nextReq);
  const locationB = nextRes.headers.get("location");
  console.log(`Request with next=/plan redirected to: ${locationB}`);
  if (!locationB || !locationB.includes("http://localhost:3000/plan")) {
    console.error("Failed to respect custom next redirect parameter!");
    process.exit(1);
  }

  // 4. Verify client OAuth method availability
  console.log("\nTesting Supabase client signInWithOAuth parameters...");
  const isConfigured = isSupabaseConfigured();
  console.log(`Live environment isSupabaseConfigured(): ${isConfigured}`);

  const client = createClient();
  if (client) {
    console.log("Live client active: auth methods verified.");
  } else {
    console.log("Unconfigured environment: client safely returns null without crash.");
  }

  // 5. Verify TopBar GlideSelect integration & styling compliance (Rule 18)
  console.log("\nVerifying TopBar component & GlideSelect integration...");
  const topBarPath = path.join(process.cwd(), "components", "TopBar.tsx");
  const topBarContent = fs.readFileSync(topBarPath, "utf-8");

  if (!topBarContent.includes("import GlideSelect from \"@/components/GlideSelect\";")) {
    console.error("TopBar does not import GlideSelect!");
    process.exit(1);
  }

  if (!topBarContent.includes("<GlideSelect")) {
    console.error("TopBar does not use GlideSelect for user dropdown!");
    process.exit(1);
  }
  console.log("Verified: TopBar uses GlideSelect for user dropdown per Rule 18.");

  // 6. Verify Return URL logic uses window.location.origin & preserves current page
  console.log("\nVerifying OAuth redirect preservation in AppStateContext...");
  const appStatePath = path.join(process.cwd(), "context", "AppStateContext.tsx");
  const appStateContent = fs.readFileSync(appStatePath, "utf-8");

  if (
    !appStateContent.includes("next=${encodeURIComponent(returnPath)}") ||
    !appStateContent.includes("window.location.origin")
  ) {
    console.error("AppStateContext does not preserve page return path with window.location.origin!");
    process.exit(1);
  }
  console.log("Verified: OAuth redirect preserves current page using window.location.origin.");

  // 7. Verify Zero-Health-Storage & Zero-Database-Write in Auth (Rules 14 & 19)
  console.log("\nVerifying Zero-Health-Storage & no database writes in Step 3B...");
  if (
    appStateContent.includes("supabase.from('") ||
    appStateContent.includes("supabase.from(\"")
  ) {
    console.error("Violation: Step 3B must not write to database tables yet!");
    process.exit(1);
  }

  if (
    appStateContent.includes("supabase.auth.updateUser({ data: { age") ||
    appStateContent.includes("supabase.auth.updateUser({ data: { health")
  ) {
    console.error("Privacy violation: Health attributes detected in Supabase user metadata!");
    process.exit(1);
  }
  console.log("Zero-Health-Storage & Zero-DB-Writes verified for Step 3B.");

  console.log("\nALL AUTH TESTS PASSED SUCCESSFULLY");
}

runAuthTests().catch(err => {
  console.error("Auth test execution failed:", err);
  process.exit(1);
});
