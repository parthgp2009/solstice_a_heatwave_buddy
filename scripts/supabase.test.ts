import fs from "fs";
import path from "path";
import { isSupabaseConfigured, createClient } from "../lib/supabase/client";
import { createBrowserClient } from "@supabase/ssr";

function runSupabaseTests() {
  console.log("=== SUPABASE INTEGRATION & RLS VERIFICATION TESTS ===");

  // 1. Verify unconfigured fallback behavior
  console.log("Testing client behavior without environment variables...");
  const isConfigured = isSupabaseConfigured();
  console.log(`isSupabaseConfigured(): ${isConfigured}`);

  const client = createClient();
  if (isConfigured) {
    console.log("Supabase is configured with live environment variables.");
    if (!client) {
      console.error("Expected client to be created when configured!");
      process.exit(1);
    }
  } else {
    console.log("Supabase unconfigured -> Gracefully returned null client without throwing.");
    if (client !== null) {
      console.error("Expected null client when unconfigured!");
      process.exit(1);
    }
  }

  // 2. Test mock client creation with dummy URL & Key (testing @supabase/ssr compatibility)
  console.log("\nTesting @supabase/ssr browser client creation with valid URL format...");
  const dummyClient = createBrowserClient(
    "https://xyzcompany.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_test"
  );

  if (!dummyClient || typeof dummyClient.auth?.signInWithOAuth !== "function") {
    console.error("Browser client failed to instantiate with @supabase/ssr!");
    process.exit(1);
  }
  console.log("Browser client instantiated successfully with auth methods available.");

  // 3. Verify Database Schema File & Security Policies (Rules 12 & 19)
  console.log("\nVerifying supabase/schema.sql policies & compliance...");
  const schemaPath = path.join(process.cwd(), "supabase", "schema.sql");
  if (!fs.existsSync(schemaPath)) {
    console.error(`schema.sql not found at ${schemaPath}!`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(schemaPath, "utf-8");

  // Check 1: Row Level Security enabled
  if (!sqlContent.includes("alter table public.user_preferences enable row level security;")) {
    console.error("Missing RLS enablement in schema.sql!");
    process.exit(1);
  }

  // Check 2: All 4 CRUD policies present
  const requiredPolicies = [
    "create policy \"Users can view own preferences\"",
    "create policy \"Users can insert own preferences\"",
    "create policy \"Users can update own preferences\"",
    "create policy \"Users can delete own preferences\""
  ];

  for (const policy of requiredPolicies) {
    if (!sqlContent.includes(policy)) {
      console.error(`Missing required RLS policy: ${policy}`);
      process.exit(1);
    }
  }

  // Check 3: ZERO-HEALTH-STORAGE verification (Rule 19)
  const storesForbiddenHealthData =
    /\bage\s+text\b/i.test(sqlContent) ||
    /\bhealth_?history\s+text\b/i.test(sqlContent) ||
    /\bcustom_?note\s+text\b/i.test(sqlContent);

  if (!sqlContent.includes("ZERO-HEALTH-STORAGE") || storesForbiddenHealthData) {
    console.error("Schema violates Rule 19 by attempting to store health attributes!");
    process.exit(1);
  }

  console.log("Row Level Security (RLS) policies verified: 4/4 present.");
  console.log("Rule 19 Zero-Health-Storage compliance verified: Health data strictly excluded.");

  console.log("\nALL SUPABASE TESTS PASSED SUCCESSFULLY");
}

runSupabaseTests();
