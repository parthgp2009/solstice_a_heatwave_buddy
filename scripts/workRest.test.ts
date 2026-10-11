import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  getWorkRestSchedule,
  WorkIntensity,
  WorkRestSchedule
} from "../lib/workRest";
import { RiskLevel } from "../lib/heatModel";

console.log("=== Running Step 4B Work-Rest Calculator Tests ===");

// 1. Verify file comment contains conservative placeholder notice
const workRestFilePath = path.join(process.cwd(), "lib", "workRest.ts");
const workRestSource = fs.readFileSync(workRestFilePath, "utf-8");
assert(
  workRestSource.includes("conservative placeholder to be reviewed"),
  "lib/workRest.ts must include comment marking the table as a conservative placeholder to be reviewed"
);
console.log("✓ Found conservative placeholder review note in lib/workRest.ts");

// 2. Test every single (RiskLevel, WorkIntensity) combination
const riskLevels: RiskLevel[] = ["Low", "Caution", "Danger", "Extreme"];
const intensities: WorkIntensity[] = ["Light", "Moderate", "Heavy"];

const EXPECTED_SCHEDULES: Record<
  RiskLevel,
  Record<WorkIntensity, { work: number; rest: number; canWork: boolean }>
> = {
  Low: {
    Light: { work: 60, rest: 0, canWork: true },
    Moderate: { work: 50, rest: 10, canWork: true },
    Heavy: { work: 45, rest: 15, canWork: true },
  },
  Caution: {
    Light: { work: 50, rest: 10, canWork: true },
    Moderate: { work: 40, rest: 20, canWork: true },
    Heavy: { work: 30, rest: 30, canWork: true },
  },
  Danger: {
    Light: { work: 30, rest: 30, canWork: true },
    Moderate: { work: 20, rest: 40, canWork: true },
    Heavy: { work: 15, rest: 45, canWork: true },
  },
  Extreme: {
    Light: { work: 0, rest: 60, canWork: false },
    Moderate: { work: 0, rest: 60, canWork: false },
    Heavy: { work: 0, rest: 60, canWork: false },
  },
};

for (const risk of riskLevels) {
  for (const intensity of intensities) {
    const expected = EXPECTED_SCHEDULES[risk][intensity];
    const schedule: WorkRestSchedule = getWorkRestSchedule(risk, intensity);

    assert.strictEqual(
      schedule.workMinutes,
      expected.work,
      `[${risk} - ${intensity}] Expected ${expected.work} work minutes, got ${schedule.workMinutes}`
    );
    assert.strictEqual(
      schedule.restMinutes,
      expected.rest,
      `[${risk} - ${intensity}] Expected ${expected.rest} rest minutes, got ${schedule.restMinutes}`
    );
    assert.strictEqual(
      schedule.canWork,
      expected.canWork,
      `[${risk} - ${intensity}] Expected canWork=${expected.canWork}, got ${schedule.canWork}`
    );

    // Sum of work + rest must equal 60 minutes per hour
    assert.strictEqual(
      schedule.workMinutes + schedule.restMinutes,
      60,
      `[${risk} - ${intensity}] Total minutes per hour must equal 60`
    );

    // Extreme risk verification
    if (risk === "Extreme") {
      assert.strictEqual(
        schedule.messageEn,
        "Avoid outdoor work. Move to a cool indoor place.",
        "Extreme risk must state: Avoid outdoor work. Move to a cool indoor place."
      );
      assert(
        schedule.messageHi.includes("बाहरी काम से बचें"),
        "Extreme risk must state avoidance of outdoor work in Hindi"
      );
    }

    // Hydration reminder verification
    if (risk === "Caution" || risk === "Danger" || risk === "Extreme") {
      assert(
        schedule.hydrationReminderEn.includes("250 ml") &&
        schedule.hydrationReminderEn.includes("15 to 20 minutes") &&
        schedule.hydrationReminderEn.includes("ORS"),
        `[${risk}] Must include drinking reminder with ~250 ml, 15-20 mins, and ORS`
      );
      assert(
        schedule.hydrationReminderHi.includes("250") &&
        schedule.hydrationReminderHi.includes("15 से 20") &&
        schedule.hydrationReminderHi.includes("ओआरएस"),
        `[${risk}] Hindi reminder must include ~250ml, 15-20 mins, and ORS`
      );
    }

    // Shaded rest break reminder
    assert(
      schedule.restReminderEn.includes("shade"),
      `[${risk} - ${intensity}] Rest reminder must mention shade`
    );
    assert(
      schedule.restReminderHi.includes("छाया"),
      `[${risk} - ${intensity}] Hindi rest reminder must mention shade`
    );

    console.log(`✓ Tested [${risk.padEnd(7)} + ${intensity.padEnd(8)}] => ${schedule.workMinutes}m work / ${schedule.restMinutes}m rest`);
  }
}

// 3. Test Zero Storage & Non-Medical Advice in the Work-Rest Card Component
const cardPath = path.join(process.cwd(), "components", "WorkRestCard.tsx");
if (fs.existsSync(cardPath)) {
  const cardSource = fs.readFileSync(cardPath, "utf-8");
  assert(
    !cardSource.includes("localStorage"),
    "WorkRestCard must not persist to localStorage"
  );
  assert(
    !cardSource.includes("sessionStorage"),
    "WorkRestCard must not persist to sessionStorage"
  );
  assert(
    !cardSource.includes("supabase"),
    "WorkRestCard must not communicate with Supabase"
  );
  assert(
    !cardSource.includes("fetch("),
    "WorkRestCard must not send external network requests"
  );
  assert(
    cardSource.includes("General guidance, not medical advice.") ||
    cardSource.includes("General guidance, not medical advice"),
    "WorkRestCard must include 'General guidance, not medical advice.' disclaimer"
  );
  console.log("✓ WorkRestCard privacy & non-medical advice disclaimer verified");
}

console.log("\n=== ALL 12 WORK-REST COMBINATIONS & CRITERIA PASSED ===");
