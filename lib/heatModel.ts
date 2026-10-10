/**
 * Heat Model - Pure functions for heat index adjustments, offsets, and safety risk levels.
 * All thresholds are configured as named constants at the top.
 */

// Risk Level Thresholds (Adjusted Feels-Like in °C)
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

// Default Hourly Profile (Open-Meteo matching shape)
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
 * uv < 6 => 0
 * uv >= 6 and <= 10 => 1
 * uv > 10 => 1.5
 */
export function uvOffset(uv: number): number {
  if (uv < UV_OFFSET_MODERATE_LIMIT) return 0;
  if (uv <= UV_OFFSET_HIGH_LIMIT) return 1;
  return 1.5;
}

/**
 * Calculates exposure offset based on daily sun hours bucket.
 */
export function exposureOffset(bucket: ExposureBucket | string): number {
  if (bucket === 'More than 6 hours') return 2;
  if (bucket === '2 to 6 hours') return 1;
  return 0; // 'Up to 2 hours' or default
}

/**
 * Computes adjusted feels-like temperature.
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
 * Computes adjusted feels-like for a specific hour (0-23) from hourly arrays.
 */
export function adjustedFeelsLikeForHour(
  hour: number,
  apparentTemps: number[] = DEFAULT_HOURLY_APPARENT_TEMP,
  uvIndices: number[] = DEFAULT_HOURLY_UV_INDEX,
  bucket: ExposureBucket | string = '2 to 6 hours'
): {
  hour: number;
  rawFeelsLike: number;
  uv: number;
  uvOff: number;
  expOff: number;
  adjusted: number;
  riskLevel: RiskLevel;
  uvLabel: UvLabel;
} {
  const h = Math.max(0, Math.min(23, hour));
  const rawFeelsLike = apparentTemps[h] ?? 38;
  const uv = uvIndices[h] ?? 5;
  const uvOff = uvOffset(uv);
  const expOff = exposureOffset(bucket);
  const adjusted = rawFeelsLike + uvOff + expOff;
  const riskLevel = getRiskLevel(adjusted);
  const uvLabel = getUvLabel(uv);

  return {
    hour: h,
    rawFeelsLike,
    uv,
    uvOff,
    expOff,
    adjusted,
    riskLevel,
    uvLabel
  };
}

/**
 * Determines Risk Level from adjusted temperature.
 */
export function getRiskLevel(adjustedTemp: number): RiskLevel {
  if (adjustedTemp < RISK_THRESHOLD_LOW) return 'Low';
  if (adjustedTemp < RISK_THRESHOLD_CAUTION) return 'Caution';
  if (adjustedTemp < RISK_THRESHOLD_DANGER) return 'Danger';
  return 'Extreme';
}

/**
 * UV index display label.
 * 0 to 2: Low
 * 3 to 5: Moderate
 * 6 to 7: High
 * 8 to 10: Very high
 * 11+: Extreme
 */
export function getUvLabel(uv: number): UvLabel {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very high';
  return 'Extreme';
}

/**
 * Computes safer hours ranges and peak avoid hours.
 * An hour is safer when adjustedFeelsLike < RISK_THRESHOLD_DANGER (46) AND uv < 6, or it is night (uv == 0).
 */
export function computeSafeWindows(
  apparentTemps: number[] = DEFAULT_HOURLY_APPARENT_TEMP,
  uvIndices: number[] = DEFAULT_HOURLY_UV_INDEX,
  bucket: ExposureBucket | string = '2 to 6 hours'
): {
  saferRanges: string[];
  avoidRanges: string[];
  hourlyAdjusted: number[];
} {
  const hourlyAdjusted: number[] = [];
  const isSaferHour: boolean[] = [];

  for (let h = 0; h < 24; h++) {
    const raw = apparentTemps[h] ?? 30;
    const uv = uvIndices[h] ?? 0;
    const adj = adjustedFeelsLike(raw, uv, bucket);
    hourlyAdjusted.push(adj);

    // Safer when adjusted is below Danger (38) or below 46 with low UV, or at night
    const isSafe = adj < RISK_THRESHOLD_DANGER && (uv < 6 || uv === 0 || h < 7 || h >= 18);
    isSaferHour.push(isSafe);
  }

  // Merge consecutive hours into ranges
  const formatRange = (start: number, end: number): string => {
    const toTime = (h: number) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const d = h % 12 === 0 ? 12 : h % 12;
      return `${d} ${ampm}`;
    };
    return `${toTime(start)} – ${toTime((end + 1) % 24)}`;
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

  return { saferRanges, avoidRanges, hourlyAdjusted };
}

/**
 * Standard verification cases defined in the project specification.
 */
export const WORKED_EXAMPLES_TESTS = [
  {
    id: 1,
    apparentTemp: 38,
    uv: 4,
    bucket: "Up to 2 hours" as ExposureBucket,
    expectedAdjusted: 38,
    expectedRisk: "Danger" as RiskLevel
  },
  {
    id: 2,
    apparentTemp: 38,
    uv: 7,
    bucket: "2 to 6 hours" as ExposureBucket,
    expectedAdjusted: 40,
    expectedRisk: "Danger" as RiskLevel
  },
  {
    id: 3,
    apparentTemp: 41,
    uv: 12,
    bucket: "More than 6 hours" as ExposureBucket,
    expectedAdjusted: 44.5,
    expectedRisk: "Danger" as RiskLevel
  },
  {
    id: 4,
    apparentTemp: 44,
    uv: 10,
    bucket: "2 to 6 hours" as ExposureBucket,
    expectedAdjusted: 46,
    expectedRisk: "Extreme" as RiskLevel
  }
];

