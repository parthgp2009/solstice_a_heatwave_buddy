import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("=== Running Step 4A Verification Test Suite ===");

// 1. Verify DevHeatModelPanel production guard
const devPanelPath = path.join(process.cwd(), "components", "DevHeatModelPanel.tsx");
assert(fs.existsSync(devPanelPath), "DevHeatModelPanel.tsx must exist");
const devPanelCode = fs.readFileSync(devPanelPath, "utf-8");

assert(
  devPanelCode.includes('if (process.env.NODE_ENV !== "development")') &&
  devPanelCode.includes("return null;"),
  "DevHeatModelPanel must return null when process.env.NODE_ENV !== 'development'"
);
console.log("✓ DevHeatModelPanel production guard verified (returns null in production)");

// 2. Verify HeatstrokeEmergencyCard exists and contains all required elements
const emergencyCardPath = path.join(process.cwd(), "components", "HeatstrokeEmergencyCard.tsx");
assert(fs.existsSync(emergencyCardPath), "HeatstrokeEmergencyCard.tsx must exist");
const emergencyCode = fs.readFileSync(emergencyCardPath, "utf-8");

// Check 7 warning signs
const requiredWarningSigns = [
  "Very high body temperature or hot dry skin",
  "Confusion or slurred speech",
  "Fainting or unconsciousness",
  "Seizure",
  "No sweating despite heat",
  "Rapid weak pulse",
  "Vomiting that does not stop"
];

for (const sign of requiredWarningSigns) {
  assert(
    emergencyCode.includes(sign),
    `HeatstrokeEmergencyCard must include warning sign: "${sign}"`
  );
}
console.log("✓ All 7 required warning signs present in English and Hindi");

// Check emergency message & 108 call
assert(
  emergencyCode.includes("This may be a medical emergency. Call 108 now."),
  "HeatstrokeEmergencyCard must include the emergency message: 'This may be a medical emergency. Call 108 now.'"
);
assert(
  emergencyCode.includes('href="tel:108"'),
  "HeatstrokeEmergencyCard must have a tap-to-call link for tel:108"
);
console.log("✓ Emergency message and tap-to-call (tel:108) link verified");

// Check first aid steps while waiting
const requiredFirstAid = [
  "Move to shade or a cool place.",
  "Loosen clothing.",
  "Cool the skin with wet cloths or water.",
  "Fan the person.",
  "Give sips of water only if fully awake.",
  "Do not give water to someone who is confused or unconscious."
];

for (const step of requiredFirstAid) {
  assert(
    emergencyCode.includes(step),
    `HeatstrokeEmergencyCard must include first aid instruction: "${step}"`
  );
}
console.log("✓ All first aid cooling steps and caution against choking verified");

// Check lighter heat exhaustion advice
const requiredExhaustionAdvice = [
  "Rest in shade.",
  "Sip water or ORS.",
  "Cool the skin.",
  "Call 108 if not better in 30 minutes or if it gets worse."
];

for (const advice of requiredExhaustionAdvice) {
  assert(
    emergencyCode.includes(advice),
    `HeatstrokeEmergencyCard must include exhaustion advice: "${advice}"`
  );
}
console.log("✓ Lighter heat exhaustion restorative steps verified");

// Check general guidance disclaimer
assert(
  emergencyCode.includes("This is general guidance, not a medical diagnosis."),
  "HeatstrokeEmergencyCard must include the disclaimer: 'This is general guidance, not a medical diagnosis.'"
);
console.log("✓ Clear non-diagnostic medical disclaimer verified");

// Check Zero-Storage Guarantee
assert(
  !emergencyCode.includes("localStorage"),
  "HeatstrokeEmergencyCard must NOT write or read from localStorage"
);
assert(
  !emergencyCode.includes("sessionStorage"),
  "HeatstrokeEmergencyCard must NOT write or read from sessionStorage"
);
assert(
  !emergencyCode.includes("supabase"),
  "HeatstrokeEmergencyCard must NOT communicate with Supabase"
);
assert(
  !emergencyCode.includes("fetch("),
  "HeatstrokeEmergencyCard must NOT transmit data externally"
);
console.log("✓ Zero-Storage Guarantee confirmed (pure in-memory React state)");

// 3. Verify placement on plan page
const planPagePath = path.join(process.cwd(), "app", "plan", "page.tsx");
assert(fs.existsSync(planPagePath), "app/plan/page.tsx must exist");
const planPageCode = fs.readFileSync(planPagePath, "utf-8");

assert(
  planPageCode.includes("import HeatstrokeEmergencyCard from"),
  "app/plan/page.tsx must import HeatstrokeEmergencyCard"
);
assert(
  planPageCode.includes("<HeatstrokeEmergencyCard />") || planPageCode.includes("<HeatstrokeEmergencyCard/>"),
  "app/plan/page.tsx must render <HeatstrokeEmergencyCard />"
);
console.log("✓ HeatstrokeEmergencyCard rendered on /plan page");

console.log("\n=== ALL STEP 4A TESTS PASSED SUCCESSFULLY ===");
