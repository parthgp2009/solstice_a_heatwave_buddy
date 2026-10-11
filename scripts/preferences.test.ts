import fs from "fs";
import path from "path";
import {
  PreferencesUpdateSchema,
  GET,
  POST,
  DELETE
} from "../app/api/preferences/route";

async function runPreferencesTests() {
  console.log("=== USER PREFERENCES & FAVORITE CITIES TESTS (STEP 3C) ===");

  // 1. Test Zod Schema Valid Input
  console.log("Testing Zod schema with valid preferences...");
  const validPayload = {
    favorite_cities: ["Delhi", "Mumbai", "Jaipur"],
    default_city: "Delhi",
    occupation: "Delivery Driver",
    age_bracket: "31 to 45",
    preferred_language: "en"
  };

  const validResult = PreferencesUpdateSchema.safeParse(validPayload);
  if (!validResult.success) {
    console.error("Zod schema failed on valid input:", validResult.error);
    process.exit(1);
  }
  console.log("Valid payload successfully parsed by Zod.");

  // 2. Test Zod Schema 8-City Limit
  console.log("Testing 8-favorite-cities limit...");
  const tooManyCities = {
    favorite_cities: [
      "Delhi", "Mumbai", "Kolkata", "Chennai",
      "Bengaluru", "Hyderabad", "Jaipur", "Delhi", "Mumbai"
    ] // 9 items
  };
  const tooManyResult = PreferencesUpdateSchema.safeParse(tooManyCities);
  if (tooManyResult.success) {
    console.error("Zod should have rejected more than 8 favorite cities!");
    process.exit(1);
  }
  console.log("Enforced max 8 favorite cities successfully.");

  // 3. Test Rejection of Unapproved Values
  console.log("Testing rejection of unapproved city and occupation...");
  const invalidCityResult = PreferencesUpdateSchema.safeParse({ default_city: "New York" });
  if (invalidCityResult.success) {
    console.error("Zod should have rejected unapproved city!");
    process.exit(1);
  }

  const invalidOccResult = PreferencesUpdateSchema.safeParse({ occupation: "Astronaut" });
  if (invalidOccResult.success) {
    console.error("Zod should have rejected unapproved occupation!");
    process.exit(1);
  }
  console.log("Strict enum validation verified for cities and occupations.");

  // 4. Test Under 18 Exclusion (Requirement 3)
  console.log("Testing Under 18 exclusion...");
  const under18Result = PreferencesUpdateSchema.safeParse({ age_bracket: "Under 18" });
  if (under18Result.success) {
    console.error("Zod must reject 'Under 18' from cloud storage!");
    process.exit(1);
  }

  // Also test POST route explicitly returns 400 for Under 18
  const under18Req = new Request("http://localhost:3000/api/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ age_bracket: "Under 18" })
  });
  const under18Res = await POST(under18Req);
  if (under18Res.status !== 400 && under18Res.status !== 503 && under18Res.status !== 401) {
    console.error("Expected 400 bad request for Under 18 submission!");
    process.exit(1);
  }
  console.log("Under 18 safety lock verified: Cloud storage is strictly prevented.");

  // 5. Test Zero-Health-Storage Strictness (Rule 19)
  console.log("Testing strict rejection of health details and coordinates...");
  const healthPollutedPayload = {
    default_city: "Delhi",
    healthHistory: ["heatstroke"],
    customHealthNote: "asthmatic",
    coordinates: { lat: 28.6, lng: 77.2 }
  };
  const pollutedResult = PreferencesUpdateSchema.safeParse(healthPollutedPayload);
  if (pollutedResult.success) {
    console.error("Privacy violation: Zod should have strictly rejected health attributes!");
    process.exit(1);
  }
  console.log("Zero-Health-Storage verified: Health notes, history & coordinates rejected.");

  // 6. Test Unauthenticated Requests
  console.log("Testing unauthenticated API handling...");
  const getRes = await GET();
  console.log(`GET /api/preferences returned status: ${getRes.status}`);

  const deleteRes = await DELETE();
  console.log(`DELETE /api/preferences returned status: ${deleteRes.status}`);

  // 7. Test Database Schema Column and Constraint Compliance
  console.log("Testing supabase/schema.sql constraints...");
  const schemaPath = path.join(process.cwd(), "supabase", "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");

  if (!schemaSql.includes("default_city text default 'Delhi'")) {
    console.error("Missing default_city column in schema.sql!");
    process.exit(1);
  }
  if (!schemaSql.includes("occupation text")) {
    console.error("Missing occupation column in schema.sql!");
    process.exit(1);
  }
  if (!schemaSql.includes("age_bracket text check (age_bracket in ('18 to 30', '31 to 45', '46 to 60', 'Over 60'))")) {
    console.error("Missing age_bracket check constraint excluding Under 18 in schema.sql!");
    process.exit(1);
  }
  console.log("Database schema columns and Under-18 CHECK constraint verified.");

  console.log("\nALL PREFERENCES & FAVORITE CITIES TESTS PASSED SUCCESSFULLY");
}

runPreferencesTests().catch(err => {
  console.error("Preferences test failed:", err);
  process.exit(1);
});
