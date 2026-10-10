import {
  adjustedFeelsLike,
  getRiskLevel,
  computeSafeWindows,
  DEFAULT_HOURLY_APPARENT_TEMP,
  DEFAULT_HOURLY_UV_INDEX
} from "../lib/heatModel";

console.log("=== HEAT MODEL TESTS ===");

// 1. Four Worked Examples with actual computed values
const ex1 = adjustedFeelsLike(38, 4, "up to 2h");
console.log(`feels 38, UV 4, up to 2h -> ${ex1}`);

const ex2 = adjustedFeelsLike(38, 7, "2 to 6h");
console.log(`feels 38, UV 7, 2 to 6h -> ${ex2}`);

const ex3 = adjustedFeelsLike(41, 12, "more than 6h");
console.log(`feels 41, UV 12, more than 6h -> ${ex3}`);

const ex4 = adjustedFeelsLike(44, 10, "2 to 6h");
const ex4Risk = getRiskLevel(ex4);
console.log(`feels 44, UV 10, 2 to 6h -> ${ex4} and risk ${ex4Risk}`);

// Assertions for worked examples
if (ex1 !== 38 || ex2 !== 40 || ex3 !== 44.5 || ex4 !== 46 || ex4Risk !== "Extreme") {
  console.error("Worked examples verification failed!");
  process.exit(1);
}

// 2. Three Vulnerability & Strictness Test Cases (Per Spec & User Request)
console.log("\n=== 3 SPECIFIED VULNERABILITY TEST CASES ===");

// Test Case 1: Over 60 with feels 36 gives Danger instead of Caution
const tc1BaseRisk = getRiskLevel(36);
const tc1ActualRisk = getRiskLevel(36, "Over 60");
console.log(`Test Case 1: Over 60 with feels 36 gives ${tc1ActualRisk} instead of ${tc1BaseRisk}`);
if (tc1BaseRisk !== "Caution" || tc1ActualRisk !== "Danger") {
  console.error("Test Case 1 failed: Expected Caution -> Danger");
  process.exit(1);
}

// Test Case 2: Heatstroke with feels 30 gives Caution instead of Low
const tc2BaseRisk = getRiskLevel(30);
const tc2ActualRisk = getRiskLevel(30, null, ["Heatstroke"]);
console.log(`Test Case 2: Heatstroke with feels 30 gives ${tc2ActualRisk} instead of ${tc2BaseRisk}`);
if (tc2BaseRisk !== "Low" || tc2ActualRisk !== "Caution") {
  console.error("Test Case 2 failed: Expected Low -> Caution");
  process.exit(1);
}

// Test Case 3: age 18 to 30 with no history changes nothing
const tc3BaseRisk = getRiskLevel(36);
const tc3ActualRisk = getRiskLevel(36, "18 to 30", []);
console.log(`Test Case 3: age 18 to 30 with no history gives ${tc3ActualRisk} (base: ${tc3BaseRisk}) - changes nothing`);
if (tc3ActualRisk !== tc3BaseRisk) {
  console.error("Test Case 3 failed: age 18 to 30 with no history modified the risk");
  process.exit(1);
}

// 3. Additional Health Conditions & Age Brackets Verification
console.log("\n=== HEALTH CONDITIONS & AGE TESTS ===");
const ageUnder18Risk = getRiskLevel(36, "Under 18");
console.log(`Under 18 with feels 36: ${ageUnder18Risk} (expected Danger)`);

const age46to60Risk = getRiskLevel(36, "46 to 60");
console.log(`46 to 60 with feels 36: ${age46to60Risk} (expected Danger)`);

const exhaustionRisk = getRiskLevel(30, "18 to 30", ["exhaustion"]);
console.log(`Heat exhaustion with feels 30: ${exhaustionRisk} (expected Caution)`);

const migraineRisk = getRiskLevel(30, "18 to 30", ["migraine"]);
console.log(`Migraine with feels 30: ${migraineRisk} (expected Caution)`);

const fatigueRisk = getRiskLevel(30, "18 to 30", ["fatigue"]);
console.log(`Physical fatigue with feels 30: ${fatigueRisk} (expected Caution)`);

const noneConditionRisk = getRiskLevel(36, "18 to 30", ["none"]);
console.log(`None condition with feels 36: ${noneConditionRisk} (expected Caution)`);

if (
  ageUnder18Risk !== "Danger" ||
  age46to60Risk !== "Danger" ||
  exhaustionRisk !== "Caution" ||
  migraineRisk !== "Caution" ||
  fatigueRisk !== "Caution" ||
  noneConditionRisk !== "Caution"
) {
  console.error("Additional condition verification failed!");
  process.exit(1);
}

// 4. Safe Windows under standard vs stricter vulnerability
console.log("\n=== COMPUTE SAFE WINDOWS ===");
const standardWindows = computeSafeWindows(DEFAULT_HOURLY_APPARENT_TEMP, DEFAULT_HOURLY_UV_INDEX, "2 to 6 hours", false);
console.log("Standard safe windows (Low/Caution):", standardWindows.saferRanges.join(", "));

const vulnWindows = computeSafeWindows(DEFAULT_HOURLY_APPARENT_TEMP, DEFAULT_HOURLY_UV_INDEX, "2 to 6 hours", true);
console.log("Vulnerable safe windows (+1 stricter):", vulnWindows.saferRanges.join(", "));

console.log("\nALL TESTS PASSED SUCCESSFULLY");
