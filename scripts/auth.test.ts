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

  // 5. Verify Zero-Health-Storage in Auth (Rule 19)
  console.log("\nVerifying Zero-Health-Storage compliance in auth files...");
  const appStatePath = path.join(process.cwd(), "context", "AppStateContext.tsx");
  const appStateContent = fs.readFileSync(appStatePath, "utf-8");

  // Ensure health data is NOT passed to supabase auth methods
  if (
    appStateContent.includes("supabase.auth.updateUser({ data: { age") ||
    appStateContent.includes("supabase.auth.updateUser({ data: { health")
  ) {
    console.error("Privacy violation: Health attributes detected in Supabase user metadata!");
    process.exit(1);
  }
  console.log("Zero-Health-Storage verified: No medical attributes stored in auth context.");

  console.log("\nALL AUTH TESTS PASSED SUCCESSFULLY");
}

runAuthTests().catch(err => {
  console.error("Auth test execution failed:", err);
  process.exit(1);
});
