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
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

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

  // Supabase Auth state (Rule 19: zero health data stored or attached)
  user: User | null;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;

  // Cloud Favorites & Preferences (Step 3C)
  favoriteCities: string[];
  toggleFavoriteCity: (cityToToggle: string) => Promise<void>;
  removeFavoriteCity: (cityToRemove: string) => Promise<void>;
  isCityFavorite: (c: string) => boolean;
  saveAccountPreferences: boolean;
  setSaveAccountPreferences: (val: boolean) => Promise<void>;
  deleteAccountData: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(() => isSupabaseConfigured());
  const [favoriteCities, setFavoriteCities] = useState<string[]>(["Delhi"]);
  const [saveAccountPreferences, setSaveAccountPreferencesState] = useState<boolean>(false);

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

  // Supabase Auth listener (initial session + real-time changes)
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      return;
    }

    let isMounted = true;

    // 1. Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setIsAuthLoading(false);
      }
    });

    // 2. Listen to real-time auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setIsAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      alert(
        lang === "hi"
          ? "गूगल साइन-इन के लिए .env.local में Supabase सेटिंग्स आवश्यक हैं।"
          : "Supabase credentials are not configured yet in .env.local. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable Google Sign-In."
      );
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    try {
      const returnPath =
        typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(returnPath)}`
        }
      });
      if (error) {
        console.error("Supabase OAuth error:", error.message);
        alert(error.message);
      }
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    if (!supabase) {
      setUser(null);
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setSaveAccountPreferencesState(false);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Load Cloud Preferences from Supabase when user signs in
  useEffect(() => {
    if (!user) {
      return;
    }

    let isCancelled = false;

    async function loadCloudPreferences() {
      try {
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.preferences) {
            if (Array.isArray(data.preferences.favorite_cities) && data.preferences.favorite_cities.length > 0) {
              setFavoriteCities(data.preferences.favorite_cities);
            }
            if (data.preferences.default_city) {
              setCity(data.preferences.default_city);
            }
            if (data.preferences.occupation) {
              setOccupation(data.preferences.occupation);
            }
            if (data.preferences.age_bracket && data.preferences.age_bracket !== "Under 18") {
              setAge(data.preferences.age_bracket);
              setSaveAccountPreferencesState(true);
            }
          }
        }
      } catch {
        // Fall back gracefully if offline or unconfigured
      }
    }

    loadCloudPreferences();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  // Sync preferences to cloud when city, occupation, or age changes and saveAccountPreferences is ON
  useEffect(() => {
    if (!user || !saveAccountPreferences || age === "Under 18") {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await fetch("/api/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            default_city: city,
            occupation: occupation,
            age_bracket: age,
            favorite_cities: favoriteCities
          })
        });
      } catch {
        // Silently ignore network failures
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [city, occupation, age, user, saveAccountPreferences, favoriteCities]);

  const toggleFavoriteCity = async (cityToToggle: string) => {
    if (!user) {
      if (typeof window !== "undefined" && window.confirm(t.planBuilder.signInToSavePrompt)) {
        await signInWithGoogle();
      }
      return;
    }

    let updated: string[];
    if (favoriteCities.includes(cityToToggle)) {
      updated = favoriteCities.filter(c => c !== cityToToggle);
    } else {
      if (favoriteCities.length >= 8) {
        if (typeof window !== "undefined") {
          window.alert(t.planBuilder.maxFavoritesNotice);
        }
        return;
      }
      updated = [...favoriteCities, cityToToggle];
    }

    setFavoriteCities(updated);

    try {
      await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          favorite_cities: updated
        })
      });
    } catch {
      // Ignore network errors
    }
  };

  const removeFavoriteCity = async (cityToRemove: string) => {
    const updated = favoriteCities.filter(c => c !== cityToRemove);
    setFavoriteCities(updated);

    if (user) {
      try {
        await fetch("/api/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            favorite_cities: updated
          })
        });
      } catch {
        // Ignore network errors
      }
    }
  };

  const isCityFavorite = (c: string) => favoriteCities.includes(c);

  const setSaveAccountPreferences = async (val: boolean) => {
    if (val) {
      if (age === "Under 18") {
        if (typeof window !== "undefined") {
          window.alert(t.planBuilder.under18AccountNotice);
        }
        return;
      }
      if (!user) {
        if (typeof window !== "undefined" && window.confirm(t.planBuilder.signInToSavePrompt)) {
          await signInWithGoogle();
        }
        return;
      }
      setSaveAccountPreferencesState(true);
      try {
        await fetch("/api/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            default_city: city,
            occupation: occupation,
            age_bracket: age,
            favorite_cities: favoriteCities
          })
        });
      } catch {
        // Ignore
      }
    } else {
      setSaveAccountPreferencesState(false);
    }
  };

  const deleteAccountData = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/preferences", { method: "DELETE" });
      if (res.ok) {
        setFavoriteCities(["Delhi"]);
        setSaveAccountPreferencesState(false);
        if (typeof window !== "undefined") {
          window.alert(t.planBuilder.deleteAccountDataSuccess);
        }
      }
    } catch {
      if (typeof window !== "undefined") {
        window.alert("Failed to delete saved data. Please check your connection.");
      }
    }
  };

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
        setSelectedCityCoords,
        user,
        isAuthLoading,
        signInWithGoogle,
        signOut,
        favoriteCities,
        toggleFavoriteCity,
        removeFavoriteCity,
        isCityFavorite,
        saveAccountPreferences,
        setSaveAccountPreferences,
        deleteAccountData
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
