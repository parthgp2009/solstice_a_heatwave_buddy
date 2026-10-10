import { generateFallbackPlan, generateGeminiPlan } from "../lib/aiPlan";

async function runAiPlanTests() {
  console.log("=== AI SAFETY PLAN ADVISORY TESTS ===");

  // 1. Test English Fallback for Delivery Driver with Over 60 and Heatstroke
  console.log("Testing English fallback for Delivery Driver, Over 60, Heatstroke...");
  const enPlan = generateFallbackPlan({
    city: "Delhi",
    age: "Over 60",
    occupation: "Delivery Driver",
    sunHours: "More than 6 hours",
    healthHistory: ["heatstroke"],
    lang: "en",
    adjustedTemp: 44,
    riskLevel: "Danger"
  });

  console.log(`Source: ${enPlan.source}`);
  console.log(`Age Advice: ${enPlan.ageAdvice}`);
  console.log(`Occupation Advice: ${enPlan.occupationAdvice}`);
  console.log(`Health Advice: ${enPlan.healthAdvice.join("; ")}`);
  console.log(`Actionable Tips count: ${enPlan.actionableTips.length}`);

  if (
    enPlan.source !== "rule-based" ||
    !enPlan.ageAdvice ||
    !enPlan.occupationAdvice ||
    enPlan.healthAdvice.length === 0 ||
    enPlan.actionableTips.length === 0
  ) {
    console.error("English fallback plan test failed!");
    process.exit(1);
  }

  // 2. Test Hindi Fallback for Farmer with Under 18 and Migraine
  console.log("\nTesting Hindi fallback for Farmer, Under 18, Migraine...");
  const hiPlan = generateFallbackPlan({
    city: "Jaipur",
    age: "Under 18",
    occupation: "Farmer",
    sunHours: "2 to 6 hours",
    healthHistory: ["migraine"],
    lang: "hi",
    adjustedTemp: 46,
    riskLevel: "Extreme"
  });

  console.log(`Source: ${hiPlan.source}`);
  console.log(`Age Advice (Hi): ${hiPlan.ageAdvice}`);
  console.log(`Occupation Advice (Hi): ${hiPlan.occupationAdvice}`);
  console.log(`Health Advice (Hi): ${hiPlan.healthAdvice.join("; ")}`);

  if (!hiPlan.ageAdvice.includes("खेलकूद") && !hiPlan.ageAdvice.includes("दोपहर")) {
    console.error("Hindi fallback age advice missing expected keywords!");
    process.exit(1);
  }

  // 3. Test generateGeminiPlan with no API key (should gracefully fallback without throwing)
  console.log("\nTesting generateGeminiPlan without API key (fallback resilience)...");
  const fallbackRes = await generateGeminiPlan(
    {
      city: "Mumbai",
      age: "31 to 45",
      occupation: "Traffic Police",
      sunHours: "2 to 6 hours",
      healthHistory: ["fatigue"],
      lang: "en",
      adjustedTemp: 39,
      riskLevel: "Caution"
    },
    ""
  );

  console.log(`Source without key: ${fallbackRes.source} (expected: rule-based)`);
  if (fallbackRes.source !== "rule-based") {
    console.error("Expected source to be rule-based when key is empty!");
    process.exit(1);
  }

  // 4. Test generateGeminiPlan with dummy/invalid API key (should gracefully catch and return fallback)
  console.log("\nTesting generateGeminiPlan with invalid API key (network error resilience)...");
  const invalidKeyRes = await generateGeminiPlan(
    {
      city: "Chennai",
      age: "18 to 30",
      occupation: "Student",
      sunHours: "Up to 2 hours",
      healthHistory: ["none"],
      lang: "en",
      adjustedTemp: 35,
      riskLevel: "Caution"
    },
    "INVALID_DUMMY_KEY_FOR_TESTING"
  );

  console.log(`Source with invalid key: ${invalidKeyRes.source} (gracefully caught, expected: rule-based)`);
  if (invalidKeyRes.source !== "rule-based" || !invalidKeyRes.ageAdvice) {
    console.error("Invalid key resilience test failed!");
    process.exit(1);
  }

  console.log("\nALL AI PLAN ADVISORY TESTS PASSED SUCCESSFULLY");
}

runAiPlanTests().catch(err => {
  console.error("AI Plan test error:", err);
  process.exit(1);
});
