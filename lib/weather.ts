import { DEFAULT_HOURLY_APPARENT_TEMP, DEFAULT_HOURLY_UV_INDEX } from "./heatModel";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  hourlyApparent: number[];
  hourlyUv: number[];
  currentTemp: number;
  currentApparent: number;
  currentUv: number;
  relativeHumidity: number;
  isLive: boolean;
  fetchedAt: number;
}

export const CITY_COORDINATES: Record<string, Coordinates> = {
  Delhi: { latitude: 28.6139, longitude: 77.2090 },
  Mumbai: { latitude: 19.0760, longitude: 72.8777 },
  Kolkata: { latitude: 22.5726, longitude: 88.3639 },
  Chennai: { latitude: 13.0827, longitude: 80.2707 },
  Bengaluru: { latitude: 12.9716, longitude: 77.5946 },
  Hyderabad: { latitude: 17.3850, longitude: 78.4867 },
  Jaipur: { latitude: 26.9124, longitude: 75.7873 },
};

export const DEFAULT_WEATHER_DATA: WeatherData = {
  hourlyApparent: DEFAULT_HOURLY_APPARENT_TEMP,
  hourlyUv: DEFAULT_HOURLY_UV_INDEX,
  currentTemp: 38,
  currentApparent: 45,
  currentUv: 11.5,
  relativeHumidity: 45,
  isLive: false,
  fetchedAt: 0,
};

/**
 * Fetches real-time hourly apparent temperature and UV index from Open-Meteo.
 * Falls back to DEFAULT_WEATHER_DATA if the request fails or is offline.
 */
export async function fetchOpenMeteoWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,uv_index&hourly=temperature_2m,apparent_temperature,uv_index&timezone=auto&forecast_days=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return DEFAULT_WEATHER_DATA;
    }

    const data = await res.json();

    const hourlyApparentRaw: number[] = Array.isArray(data.hourly?.apparent_temperature)
      ? data.hourly.apparent_temperature.slice(0, 24).map(Number)
      : [];

    const hourlyUvRaw: number[] = Array.isArray(data.hourly?.uv_index)
      ? data.hourly.uv_index.slice(0, 24).map(Number)
      : [];

    // Ensure we always have 24 numbers
    const hourlyApparent: number[] =
      hourlyApparentRaw.length === 24
        ? hourlyApparentRaw
        : DEFAULT_HOURLY_APPARENT_TEMP;

    const hourlyUv: number[] =
      hourlyUvRaw.length === 24
        ? hourlyUvRaw
        : DEFAULT_HOURLY_UV_INDEX;

    return {
      hourlyApparent,
      hourlyUv,
      currentTemp: Number(data.current?.temperature_2m ?? hourlyApparent[14] ?? 38),
      currentApparent: Number(data.current?.apparent_temperature ?? hourlyApparent[14] ?? 45),
      currentUv: Number(data.current?.uv_index ?? hourlyUv[14] ?? 10),
      relativeHumidity: Number(data.current?.relative_humidity_2m ?? 45),
      isLive: true,
      fetchedAt: Date.now(),
    };
  } catch {
    return DEFAULT_WEATHER_DATA;
  }
}
