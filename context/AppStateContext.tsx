"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, DICTIONARY, TranslationDictionary } from "@/lib/dictionary";
import { ExposureBucket } from "@/lib/heatModel";
import {
  WeatherData,
  Coordinates,
  CITY_COORDINATES,
  DEFAULT_WEATHER_DATA,
  fetchOpenMeteoWeather
} from "@/lib/weather";

export interface AppState {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: TranslationDictionary;

  // Personalisation inputs
  city: string;
  setCity: (city: string) => void;
  customCity: string;
  setCustomCity: (c: string) => void;

  age: string;
  setAge: (age: string) => void;

  occupation: string;
  setOccupation: (occ: string) => void;

  sunHours: ExposureBucket;
  setSunHours: (hrs: ExposureBucket) => void;

  healthHistory: string[];
  setHealthHistory: (hist: string[]) => void;
  toggleHealthCondition: (id: string) => void;

  customHealthNote: string;
  setCustomHealthNote: (note: string) => void;

  rememberDevice: boolean;
  setRememberDevice: (rem: boolean) => void;

  selectedHour: number;
  setSelectedHour: (hour: number) => void;

  // Live Weather state
  weatherData: WeatherData;
  isLoadingWeather: boolean;
  selectedCityCoords: Coordinates | null;
  setSelectedCityCoords: (coords: Coordinates | null) => void;

  // Modal & UI state
  activeModal: "privacy" | "terms" | "how_we_calc" | null;
  setActiveModal: (m: "privacy" | "terms" | "how_we_calc" | null) => void;

  planSubmitted: boolean;
  setPlanSubmitted: (submitted: boolean) => void;
}

const STORAGE_KEY = "heatwave_buddy_local_state_v1";

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [city, setCity] = useState<string>("Delhi");
  const [customCity, setCustomCity] = useState<string>("");
  const [age, setAge] = useState<string>("31 to 45");
  const [occupation, setOccupation] = useState<string>("Delivery Driver");
  const [sunHours, setSunHours] = useState<ExposureBucket>("2 to 6 hours");
  const [healthHistory, setHealthHistory] = useState<string[]>([]);
  const [customHealthNote, setCustomHealthNote] = useState<string>("");
  const [rememberDevice, setRememberDevice] = useState<boolean>(false);
  const [selectedHour, setSelectedHour] = useState<number>(14);
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | "how_we_calc" | null>(null);
  const [planSubmitted, setPlanSubmitted] = useState<boolean>(false);
  const [selectedCityCoords, setSelectedCityCoords] = useState<Coordinates | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData>(DEFAULT_WEATHER_DATA);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // Live weather fetch on city or selected coordinates change
  useEffect(() => {
    let isCancelled = false;

    async function loadWeather() {
      let coords: Coordinates;
      if (selectedCityCoords) {
        coords = selectedCityCoords;
      } else if (CITY_COORDINATES[city]) {
        coords = CITY_COORDINATES[city];
      } else {
        coords = CITY_COORDINATES["Delhi"];
      }

      setIsLoadingWeather(true);
      try {
        const data = await fetchOpenMeteoWeather(coords.latitude, coords.longitude);
        if (!isCancelled) {
          setWeatherData(data);
        }
      } catch {
        if (!isCancelled) {
          setWeatherData(DEFAULT_WEATHER_DATA);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingWeather(false);
        }
      }
    }

    loadWeather();

    return () => {
      isCancelled = true;
    };
  }, [city, selectedCityCoords]);

  // Load from localStorage only if rememberDevice was previously turned on AND not under 18
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.rememberDevice && parsed.age !== "Under 18") {
            if (parsed.city) setCity(parsed.city);
            if (parsed.customCity) setCustomCity(parsed.customCity);
            if (parsed.age) setAge(parsed.age);
            if (parsed.occupation) setOccupation(parsed.occupation);
            if (parsed.sunHours) setSunHours(parsed.sunHours);
            if (Array.isArray(parsed.healthHistory)) setHealthHistory(parsed.healthHistory);
            if (parsed.customHealthNote) setCustomHealthNote(parsed.customHealthNote);
            setRememberDevice(true);
          }
        }
      } catch {
        // Ignore localStorage errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync to localStorage only if rememberDevice is true and age is NOT Under 18
  useEffect(() => {
    try {
      if (rememberDevice && age !== "Under 18") {
        const toSave = {
          city,
          customCity,
          age,
          occupation,
          sunHours,
          healthHistory,
          customHealthNote,
          rememberDevice: true
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore localStorage write failures
    }
  }, [city, customCity, age, occupation, sunHours, healthHistory, customHealthNote, rememberDevice]);

  const toggleLang = () => {
    setLangState(prev => (prev === "en" ? "hi" : "en"));
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleHealthCondition = (id: string) => {
    if (id === "none") {
      setHealthHistory(["none"]);
      return;
    }
    setHealthHistory(prev => {
      const filtered = prev.filter(x => x !== "none");
      if (filtered.includes(id)) {
        return filtered.filter(x => x !== id);
      } else {
        return [...filtered, id];
      }
    });
  };

  const t = DICTIONARY[lang];

  return (
    <AppStateContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        city,
        setCity,
        customCity,
        setCustomCity,
        age,
        setAge,
        occupation,
        setOccupation,
        sunHours,
        setSunHours,
        healthHistory,
        setHealthHistory,
        toggleHealthCondition,
        customHealthNote,
        setCustomHealthNote,
        rememberDevice,
        setRememberDevice,
        selectedHour,
        setSelectedHour,
        activeModal,
        setActiveModal,
        planSubmitted,
        setPlanSubmitted,
        weatherData,
        isLoadingWeather,
        selectedCityCoords,
        setSelectedCityCoords
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppState {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
