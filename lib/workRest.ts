/**
 * Outdoor Work-Rest Schedule Calculator (Step 4B).
 * 
 * NOTE: This table is a conservative placeholder to be reviewed against
 * occupational health and clinical heat strain guidelines (e.g., OSHA, NIOSH, NDMA).
 */

import { RiskLevel } from "./heatModel";

export type WorkIntensity = "Light" | "Moderate" | "Heavy";

export interface WorkRestSchedule {
  riskLevel: RiskLevel;
  intensity: WorkIntensity;
  workMinutes: number;
  restMinutes: number;
  canWork: boolean;
  messageEn: string;
  messageHi: string;
  hydrationReminderEn: string;
  hydrationReminderHi: string;
  restReminderEn: string;
  restReminderHi: string;
}

// Conservative placeholder table to be reviewed
export const WORK_REST_TABLE: Record<
  RiskLevel,
  Record<WorkIntensity, { workMinutes: number; restMinutes: number; canWork: boolean }>
> = {
  Low: {
    Light: { workMinutes: 60, restMinutes: 0, canWork: true },
    Moderate: { workMinutes: 50, restMinutes: 10, canWork: true },
    Heavy: { workMinutes: 45, restMinutes: 15, canWork: true },
  },
  Caution: {
    Light: { workMinutes: 50, restMinutes: 10, canWork: true },
    Moderate: { workMinutes: 40, restMinutes: 20, canWork: true },
    Heavy: { workMinutes: 30, restMinutes: 30, canWork: true },
  },
  Danger: {
    Light: { workMinutes: 30, restMinutes: 30, canWork: true },
    Moderate: { workMinutes: 20, restMinutes: 40, canWork: true },
    Heavy: { workMinutes: 15, restMinutes: 45, canWork: true },
  },
  Extreme: {
    Light: { workMinutes: 0, restMinutes: 60, canWork: false },
    Moderate: { workMinutes: 0, restMinutes: 60, canWork: false },
    Heavy: { workMinutes: 0, restMinutes: 60, canWork: false },
  },
};

/**
 * Pure deterministic function calculating recommended work/rest minutes per hour,
 * hydration instructions, and shaded rest reminders.
 * 
 * @param riskLevel Effective risk level (Low | Caution | Danger | Extreme), already including vulnerable group steps
 * @param intensity Work exertion intensity (Light | Moderate | Heavy)
 */
export function getWorkRestSchedule(
  riskLevel: RiskLevel,
  intensity: WorkIntensity
): WorkRestSchedule {
  const entry = WORK_REST_TABLE[riskLevel]?.[intensity] ?? {
    workMinutes: 30,
    restMinutes: 30,
    canWork: true,
  };

  const isExtreme = riskLevel === "Extreme";

  // Message for extreme vs normal
  const messageEn = isExtreme
    ? "Avoid outdoor work. Move to a cool indoor place."
    : `${entry.workMinutes} min work / ${entry.restMinutes} min rest per hour`;

  const messageHi = isExtreme
    ? "बाहरी काम से बचें। किसी ठंडे इनडोर स्थान पर जाएं।"
    : `प्रति घंटा ${entry.workMinutes} मिनट काम / ${entry.restMinutes} मिनट आराम`;

  // Drinking reminder: about one cup, roughly 250 ml, every 15 to 20 minutes when risk is Caution or above, ORS if sweating heavily
  const isCautionOrAbove = riskLevel === "Caution" || riskLevel === "Danger" || riskLevel === "Extreme";

  const hydrationReminderEn = isCautionOrAbove
    ? "Drink about one cup (roughly 250 ml) of water every 15 to 20 minutes. Drink ORS if sweating heavily."
    : "Drink about one cup (roughly 250 ml) of water every 30 to 45 minutes to stay hydrated.";

  const hydrationReminderHi = isCautionOrAbove
    ? "हर 15 से 20 मिनट में लगभग एक कप (लगभग 250 मिली) पानी पिएं। अत्यधिक पसीना आने पर ओआरएस (ORS) लें।"
    : "हाइड्रेटेड रहने के लिए हर 30 से 45 मिनट में लगभग एक कप (लगभग 250 मिली) पानी पिएं।";

  // Shaded rest reminder
  const restReminderEn = "Take rest breaks in shade.";
  const restReminderHi = "विश्राम के ब्रेक छाया में लें।";

  return {
    riskLevel,
    intensity,
    workMinutes: entry.workMinutes,
    restMinutes: entry.restMinutes,
    canWork: entry.canWork,
    messageEn,
    messageHi,
    hydrationReminderEn,
    hydrationReminderHi,
    restReminderEn,
    restReminderHi,
  };
}

// Alias for convenience
export const calculateWorkRest = getWorkRestSchedule;
