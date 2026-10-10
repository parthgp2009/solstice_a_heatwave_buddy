/**
 * Heat Model - Pure functions for heat index adjustments, offsets, and safety risk levels.
 * All thresholds are configured as named constants at the top.
 */

// PLACEHOLDER REVIEW NOTE:
// These risk thresholds (in °C) are preliminary biomedical placeholders to be reviewed against clinical guidelines.
export const RISK_THRESHOLD_LOW = 32;       // below 32 => Low
export const RISK_THRESHOLD_CAUTION = 38;   // 32 to below 38 => Caution
export const RISK_THRESHOLD_DANGER = 46;    // 38 to below 46 => Danger
                                            // 46 and above => Extreme

// UV Offset Thresholds
export const UV_OFFSET_MODERATE_LIMIT = 6;  // < 6 => 0
export const UV_OFFSET_HIGH_LIMIT = 10;     // 6 to 10 => +1, > 10 => +1.5

// Sun Exposure Buckets & Offsets
export type ExposureBucket = 'Up to 2 hours' | '2 to 6 hours' | 'More than 6 hours';

export const EXPOSURE_OFFSETS: Record<ExposureBucket, number> = {
  'Up to 2 hours': 0,
  '2 to 6 hours': 1,
  'More than 6 hours': 2,
};

// Default Hourly Profile (Open-Meteo matching shape - 24 fake values)
export const DEFAULT_HOURLY_APPARENT_TEMP: number[] = [
  28, 27, 27, 26, 26, 28, 30, 32, 34, 37, 39, 41,
  43, 45, 45, 44, 43, 41, 38, 35, 33, 31, 30, 29
];

export const DEFAULT_HOURLY_UV_INDEX: number[] = [
  0, 0, 0, 0, 0, 0, 0.5, 1.5, 3, 5, 7, 9,
  11, 11.5, 10, 8, 5, 2, 0.5, 0, 0, 0, 0, 0
];

export type RiskLevel = 'Low' | 'Caution' | 'Danger' | 'Extreme';

export type UvLabel = 'Low' | 'Moderate' | 'High' | 'Very high' | 'Extreme';

/**
 * Calculates UV offset based on UV index.
 * UV below 6 -> 0
 * 6 to 10 -> 1
 * above 10 -> 1.5
 */
export function uvOffset(uv: number): number {
  if (uv < UV_OFFSET_MODERATE_LIMIT) return 0;
  if (uv <= UV_OFFSET_HIGH_LIMIT) return 1;
  return 1.5;
}

/**
 * Calculates exposure offset based on daily sun hours bucket.
 * up to 2h -> 0
 * 2 to 6h -> 1
 * more than 6h -> 2
 */
export function exposureOffset(bucket: ExposureBucket | string): number {
  if (!bucket) return 0;
  const str = String(bucket).toLowerCase();
  if (str.includes('more than 6') || str.includes('> 6') || str.includes('>6') || str.includes('more than 6h')) return 2;
  if (str.includes('2 to 6') || str.includes('2-6') || str.includes('2 to 6h')) return 1;
  return 0; // 'up to 2h', 'up to 2 hours', etc.
}

/**
 * Computes adjusted feels-like temperature.
 * adjustedFeelsLike = apparent_temperature + uvOffset + exposureOffset
 */
export function adjustedFeelsLike(
  apparentTemp: number,
  uv: number,
  bucket: ExposureBucket | string
): number {
  const uOff = uvOffset(uv);
  const eOff = exposureOffset(bucket);
  return apparentTemp + uOff + eOff;
}

/**
 * Checks if a user profile is considered vulnerable.
 * Under 18, Over 60, or a history of heatstroke or heat exhaustion.
 * Flexible and case-insensitive.
 */
export function isVulnerableUser(
  age?: string | null,
  healthHistory?: string[] | string | null
): boolean {
  if (!age && !healthHistory) return false;

  const normalizedAge = String(age || '').trim().toLowerCase();
  const isVulnerableAge =
    normalizedAge.includes('under 18') ||
    normalizedAge.includes('< 18') ||
    normalizedAge.includes('over 60') ||
    normalizedAge.includes('> 60') ||
    normalizedAge.includes('46 to 60');

  // If age field itself contains a heat condition keyword (e.g. "Heatstroke" passed as first param)
  const isHeatInAgeParam =
    normalizedAge.includes('heatstroke') ||
    normalizedAge.includes('exhaustion') ||
    normalizedAge.includes('migraine') ||
    normalizedAge.includes('fatigue') ||
    normalizedAge.includes('skin');

  let hasHeatHistory = false;
  if (Array.isArray(healthHistory)) {
    hasHeatHistory = healthHistory.some(item => {
      const s = String(item).trim().toLowerCase();
      return s !== '' && s !== 'none' && s !== 'no';
    });
  } else if (typeof healthHistory === 'string') {
    const s = healthHistory.trim().toLowerCase();
    hasHeatHistory = s !== '' && s !== 'none' && s !== 'no' && s !== 'false';
  }

  return Boolean(isVulnerableAge || isHeatInAgeParam || hasHeatHistory);
}

/**
 * Moves risk one step stricter (Low -> Caution -> Danger -> Extreme, never above Extreme).
 */
export function getStricterRiskLevel(level: RiskLevel, applyStrictness: boolean = true): RiskLevel {
  if (!applyStrictness) return level;
  switch (level) {
    case 'Low':
      return 'Caution';
    case 'Caution':
      return 'Danger';
    case 'Danger':
      return 'Extreme';
    case 'Extreme':
      return 'Extreme';
  }
}

/**
 * Determines Risk Level from adjusted temperature:
 * below 32 Low
 * 32 to below 38 Caution
 * 38 to below 46 Danger
 * 46 and above Extreme
 *
 * Optionally accepts vulnerability (boolean, age string, or healthHistory array)
 * to move the risk one step stricter (Low->Caution->Danger->Extreme).
 */
export function getRiskLevel(
  adjustedTemp: number,
  isVulnerableOrAge?: boolean | string | null,
  healthHistory?: string[] | string | null
): RiskLevel {
  let base: RiskLevel = 'Extreme';
  if (adjustedTemp < RISK_THRESHOLD_LOW) base = 'Low';
  else if (adjustedTemp < RISK_THRESHOLD_CAUTION) base = 'Caution';
  else if (adjustedTemp < RISK_THRESHOLD_DANGER) base = 'Danger';
  else base = 'Extreme';

  let isVulnerable = false;
  if (typeof isVulnerableOrAge === 'boolean') {
    isVulnerable = isVulnerableOrAge;
  } else if (typeof isVulnerableOrAge === 'string' || healthHistory) {
    isVulnerable = isVulnerableUser(isVulnerableOrAge, healthHistory);
  }

  if (isVulnerable) {
    return getStricterRiskLevel(base);
  }
  return base;
}

/**
 * UV index display label.
 * 0-2 Low
 * 3-5 Moderate
 * 6-7 High
 * 8-10 Very high
 * 11+ Extreme
 */
export function getUvLabel(uv: number): UvLabel {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very high';
  return 'Extreme';
}

/**
 * Computes adjusted feels-like for a specific hour (0-23) from hourly arrays.
 * Accepts optional riskStep / age & healthHistory to apply vulnerability tier strictness.
 */
export function adjustedFeelsLikeForHour(
  hour: number,
  apparentTemps: number[] = DEFAULT_HOURLY_APPARENT_TEMP,
  uvIndices: number[] = DEFAULT_HOURLY_UV_INDEX,
  bucket: ExposureBucket | string = '2 to 6 hours',
  riskStepOrAge?: boolean | string | null,
  healthHistory?: string[] | string | null
): {
  hour: number;
  rawFeelsLike: number;
  uv: number;
  uvOff: number;
  expOff: number;
  adjusted: number;
  baseRiskLevel: RiskLevel;
  riskLevel: RiskLevel;
  uvLabel: UvLabel;
  isStricter: boolean;
} {
  const h = Math.max(0, Math.min(23, hour));
  const rawFeelsLike = apparentTemps[h] ?? 38;
  const uv = uvIndices[h] ?? 5;
  const uvOff = uvOffset(uv);
  const expOff = exposureOffset(bucket);
  const adjusted = rawFeelsLike + uvOff + expOff;

  let isVulnerable = false;
  if (typeof riskStepOrAge === 'boolean') {
    isVulnerable = riskStepOrAge;
  } else if (typeof riskStepOrAge === 'string' || healthHistory) {
    isVulnerable = isVulnerableUser(riskStepOrAge, healthHistory);
  }

  const baseRiskLevel = getRiskLevel(adjusted, false);
  const riskLevel = getRiskLevel(adjusted, isVulnerable);
  const uvLabel = getUvLabel(uv);

  return {
    hour: h,
    rawFeelsLike,
    uv,
    uvOff,
    expOff,
    adjusted,
    baseRiskLevel,
    riskLevel,
    uvLabel,
    isStricter: isVulnerable
  };
}

export type SafeWindowsResult = string[] & {
  saferRanges: string[];
  avoidRanges: string[];
  hourlyAdjusted: number[];
};

/**
 * Computes safe windows for outdoor activity:
 * Returns the hours of the day that are Low or Caution, as readable ranges like "6 AM to 9 AM".
 */
export function computeSafeWindows(
  hourlyApparent: number[] = DEFAULT_HOURLY_APPARENT_TEMP,
  hourlyUv: number[] = DEFAULT_HOURLY_UV_INDEX,
  exposureHours: ExposureBucket | string = '2 to 6 hours',
  riskStepOrAge?: boolean | string | null,
  healthHistory?: string[] | string | null
): SafeWindowsResult {
  const hourlyAdjusted: number[] = [];
  const isSaferHour: boolean[] = [];

  let isVulnerable = false;
  if (typeof riskStepOrAge === 'boolean') {
    isVulnerable = riskStepOrAge;
  } else if (typeof riskStepOrAge === 'string' || healthHistory) {
    isVulnerable = isVulnerableUser(riskStepOrAge, healthHistory);
  }

  for (let h = 0; h < 24; h++) {
    const raw = hourlyApparent[h] ?? 30;
    const uv = hourlyUv[h] ?? 0;
    const adj = adjustedFeelsLike(raw, uv, exposureHours);
    hourlyAdjusted.push(adj);

    const effRisk = getRiskLevel(adj, isVulnerable);
    // An hour is safe when effective risk is Low or Caution
    const isSafe = effRisk === 'Low' || effRisk === 'Caution';
    isSaferHour.push(isSafe);
  }

  // Format hour (e.g. 6 -> "6 AM", 12 -> "12 PM", 0 -> "12 AM")
  const toTime = (h: number): string => {
    const normalized = ((h % 24) + 24) % 24;
    const ampm = normalized >= 12 ? 'PM' : 'AM';
    const d = normalized % 12 === 0 ? 12 : normalized % 12;
    return `${d} ${ampm}`;
  };

  const formatRange = (start: number, end: number): string => {
    return `${toTime(start)} to ${toTime((end + 1) % 24)}`;
  };

  const saferRanges: string[] = [];
  const avoidRanges: string[] = [];

  let curState: boolean | null = null;
  let startH = 0;

  for (let h = 0; h < 24; h++) {
    const safe = isSaferHour[h];
    if (curState === null) {
      curState = safe;
      startH = h;
    } else if (safe !== curState) {
      const r = formatRange(startH, h - 1);
      if (curState) saferRanges.push(r);
      else avoidRanges.push(r);
      curState = safe;
      startH = h;
    }
  }

  if (curState !== null) {
    const r = formatRange(startH, 23);
    if (curState) saferRanges.push(r);
    else avoidRanges.push(r);
  }

  const result = Object.assign([...saferRanges], {
    saferRanges,
    avoidRanges,
    hourlyAdjusted
  }) as SafeWindowsResult;

  return result;
}

/**
 * Standard verification cases defined in the project specification.
 */
export const WORKED_EXAMPLES_TESTS = [
  {
    id: 1,
    label: "Example 1 (Light Sun & Moderate UV)",
    apparentTemp: 38,
    uv: 4,
    bucket: "Up to 2 hours" as ExposureBucket,
    expectedAdjusted: 38,
    expectedRisk: "Danger" as RiskLevel
  },
  {
    id: 2,
    label: "Example 2 (High UV + Moderate Exposure)",
    apparentTemp: 38,
    uv: 7,
    bucket: "2 to 6 hours" as ExposureBucket,
    expectedAdjusted: 40,
    expectedRisk: "Danger" as RiskLevel
  },
  {
    id: 3,
    label: "Example 3 (Extreme UV + Extended Sun)",
    apparentTemp: 41,
    uv: 12,
    bucket: "More than 6 hours" as ExposureBucket,
    expectedAdjusted: 44.5,
    expectedRisk: "Danger" as RiskLevel
  },
  {
    id: 4,
    label: "Example 4 (UV 10 Peak Boundary => Extreme)",
    apparentTemp: 44,
    uv: 10,
    bucket: "2 to 6 hours" as ExposureBucket,
    expectedAdjusted: 46,
    expectedRisk: "Extreme" as RiskLevel
  }
];
