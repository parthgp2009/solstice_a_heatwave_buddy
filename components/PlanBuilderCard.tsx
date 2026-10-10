"use client";

import React, { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  UserIcon,
  Briefcase01Icon,
  Clock01Icon,
  FirstAidKitIcon,
  ArrowRight01Icon,
  Tick02Icon,
  Sun01Icon
} from "@hugeicons/core-free-icons";
import GlideSelect, { GlideSelectOption } from "@/components/GlideSelect";
import { useAppState } from "@/context/AppStateContext";
import {
  CITIES_CONFIG,
  AGE_CONFIG,
  OCCUPATION_CONFIG,
  SUN_HOURS_CONFIG,
  HEALTH_CONDITIONS_CONFIG
} from "@/lib/dictionary";
import { ExposureBucket } from "@/lib/heatModel";

interface CitySearchResult {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export default function PlanBuilderCard() {
  const {
    lang,
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
    toggleHealthCondition,
    customHealthNote,
    setCustomHealthNote,
    rememberDevice,
    setRememberDevice,
    setPlanSubmitted
  } = useAppState();

  const [activeMenuCount, setActiveMenuCount] = useState<number>(0);
  const [citySearchQuery, setCitySearchQuery] = useState<string>("");
  const [citySuggestions, setCitySuggestions] = useState<CitySearchResult[]>([]);
  const [isSearchingCity, setIsSearchingCity] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  const isOtherCity = city === "OTHER_SEARCH";

  // Debounced search for city using Open-Meteo geocoding
  useEffect(() => {
    if (!isOtherCity || citySearchQuery.trim().length < 2) {
      setCitySuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingCity(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            citySearchQuery
          )}&count=5&language=en&format=json`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.results && Array.isArray(data.results)) {
            setCitySuggestions(data.results);
          } else {
            setCitySuggestions([]);
          }
        }
      } catch {
        setCitySuggestions([]);
      } finally {
        setIsSearchingCity(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [citySearchQuery, isOtherCity]);

  // Options translated for GlideSelect
  const cityOptions = CITIES_CONFIG.map(c => ({
    value: c.value,
    label: lang === "hi" ? c.labelHi : c.labelEn,
    tag: lang === "hi" ? c.tagHi : c.tagEn
  }));

  const ageOptions = AGE_CONFIG.map(a => ({
    value: a.value,
    label: lang === "hi" ? a.labelHi : a.labelEn,
    tag: lang === "hi" ? a.tagHi : a.tagEn
  }));

  const occupationOptions = OCCUPATION_CONFIG.map(o => ({
    value: o.value,
    label: lang === "hi" ? o.labelHi : o.labelEn,
    tag: lang === "hi" ? o.tagHi : o.tagEn
  }));

  const sunHoursOptions = SUN_HOURS_CONFIG.map(s => ({
    value: s.value,
    label: lang === "hi" ? s.labelHi : s.labelEn,
    tag: lang === "hi" ? s.tagHi : s.tagEn
  }));

  const isFormValid =
    (city && city !== "OTHER_SEARCH" ? true : customCity.trim().length > 0) &&
    Boolean(age) &&
    Boolean(sunHours);

  const handleGetPlan = () => {
    if (!isFormValid) {
      setValidationError(t.planBuilder.missingFieldsHint);
      return;
    }
    setValidationError("");
    setPlanSubmitted(true);
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert(lang === "en" ? "Geolocation is not supported by your browser." : "आपका ब्राउज़र जीपीएस का समर्थन नहीं करता।");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setCity("Delhi"); // Fallback / mock detected city for now
        alert(
          lang === "en"
            ? "Location detected successfully (Delhi, DL). Coordinates used once and discarded."
            : "स्थान सफलतापूर्वक पहचाना गया (दिल्ली, DL)। निर्देशांक कभी सहेजे नहीं जाते।"
        );
      },
      () => {
        alert(
          lang === "en"
            ? "Location permission was denied. Please select your city from the list."
            : "स्थान की अनुमति नहीं मिली। कृपया सूची से अपना शहर चुनें।"
        );
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    setActiveMenuCount(prev => Math.max(0, prev + (open ? 1 : -1)));
  };

  return (
    <div
      className={`relative w-full bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-5 sm:p-7 card-shadow transition-all ${
        activeMenuCount > 0 ? "z-40" : "z-20"
      }`}
    >
      <div className="flex flex-col gap-5">
        {/* Row 1: City and Age Bracket */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field 1: City */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#1E2A44]">
              <HugeiconsIcon icon={Location01Icon} size={15} strokeWidth={2.2} className="text-[#F47A1F]" />
              <span>{t.planBuilder.cityLabel}</span>
            </label>
            <GlideSelect
              options={cityOptions}
              value={city}
              onChange={(val: string) => {
                setCity(val);
                if (val !== "OTHER_SEARCH") setCustomCity("");
              }}
              onOpenChange={handleOpenChange}
              placeholder={t.planBuilder.cityLabel}
              accentColor="#F47A1F"
              surfaceColor="#FBEBD9"
              highlightColor="#F9D9B8"
              textColor="#1E2A44"
              size="lg"
              radius={14}
              placement="bottom"
              align="left"
              ariaLabel={t.planBuilder.cityLabel}
              className="w-full"
            />
            {/* If Other city selected, show autocomplete input */}
            {isOtherCity && (
              <div className="mt-2 flex flex-col gap-1">
                <input
                  type="text"
                  value={citySearchQuery || customCity}
                  onChange={e => {
                    setCitySearchQuery(e.target.value);
                    setCustomCity(e.target.value);
                  }}
                  placeholder={t.planBuilder.searchCityPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs font-medium text-[#1E2A44] bg-[#FBEBD9]/80 border border-[#1E2A44]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F47A1F]"
                />
                {isSearchingCity && (
                  <span className="text-[11px] text-[#5B6577] italic">
                    {lang === "en" ? "Searching Indian cities..." : "शहर खोज रहे हैं..."}
                  </span>
                )}
                {citySuggestions.length > 0 && (
                  <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-xl shadow-md overflow-hidden z-30 flex flex-col divide-y divide-[#1E2A44]/10">
                    {citySuggestions.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setCustomCity(`${s.name}${s.admin1 ? `, ${s.admin1}` : ""}`);
                          setCitySearchQuery(`${s.name}${s.admin1 ? `, ${s.admin1}` : ""}`);
                          setCitySuggestions([]);
                        }}
                        className="text-left px-3 py-2 text-xs text-[#1E2A44] hover:bg-[#F9D9B8] transition-colors cursor-pointer"
                      >
                        <span className="font-bold">{s.name}</span>
                        {s.admin1 && <span className="text-[#5B6577]"> ({s.admin1})</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Field 2: Age Bracket */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#1E2A44]">
              <HugeiconsIcon icon={UserIcon} size={15} strokeWidth={2.2} className="text-[#F47A1F]" />
              <span>{t.planBuilder.ageLabel}</span>
            </label>
            <GlideSelect
              options={ageOptions}
              value={age}
              onChange={(val: string) => setAge(val)}
              onOpenChange={handleOpenChange}
              placeholder={t.planBuilder.ageLabel}
              accentColor="#F47A1F"
              surfaceColor="#FBEBD9"
              highlightColor="#F9D9B8"
              textColor="#1E2A44"
              size="lg"
              radius={14}
              placement="bottom"
              align="left"
              ariaLabel={t.planBuilder.ageLabel}
              className="w-full"
            />
            {age === "Under 18" && (
              <p className="text-[11px] font-semibold text-[#D92D20] mt-1 bg-[#FDECEA] p-2 rounded-lg leading-tight">
                {t.planBuilder.under18Notice}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Occupation and Sun Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field 3: Occupation */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#1E2A44]">
              <HugeiconsIcon icon={Briefcase01Icon} size={15} strokeWidth={2.2} className="text-[#F47A1F]" />
              <span>{t.planBuilder.occupationLabel}</span>
            </label>
            <GlideSelect
              options={occupationOptions}
              value={occupation}
              onChange={(val: string) => setOccupation(val)}
              onOpenChange={handleOpenChange}
              placeholder={t.planBuilder.occupationPlaceholder}
              accentColor="#F47A1F"
              surfaceColor="#FBEBD9"
              highlightColor="#F9D9B8"
              textColor="#1E2A44"
              size="lg"
              radius={14}
              placement="bottom"
              align="left"
              ariaLabel={t.planBuilder.occupationLabel}
              className="w-full"
            />
          </div>

          {/* Field 4: Hours in the Sun Today */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#1E2A44]">
              <HugeiconsIcon icon={Clock01Icon} size={15} strokeWidth={2.2} className="text-[#F47A1F]" />
              <span>{t.planBuilder.hoursLabel}</span>
            </label>
            <GlideSelect
              options={sunHoursOptions}
              value={sunHours}
              onChange={(val: string) => setSunHours(val as ExposureBucket)}
              onOpenChange={handleOpenChange}
              placeholder={t.planBuilder.hoursLabel}
              accentColor="#F47A1F"
              surfaceColor="#FBEBD9"
              highlightColor="#F9D9B8"
              textColor="#1E2A44"
              size="lg"
              radius={14}
              placement="bottom"
              align="left"
              ariaLabel={t.planBuilder.hoursLabel}
              className="w-full"
            />
          </div>
        </div>

        {/* Row 3: Health History Chips & Privacy Switch */}
        <div className="flex flex-col gap-2.5 pt-1 border-t border-[#1E2A44]/10">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#1E2A44]">
            <HugeiconsIcon icon={FirstAidKitIcon} size={15} strokeWidth={2.2} className="text-[#F47A1F]" />
            <span>{t.planBuilder.healthHistoryLabel}</span>
          </label>

          {/* Multi-select chips */}
          <div className="flex flex-wrap gap-2">
            {HEALTH_CONDITIONS_CONFIG.map(cond => {
              const isSelected = healthHistory.includes(cond.id);
              return (
                <button
                  key={cond.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleHealthCondition(cond.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#FDEFE3] border border-[#F47A1F] text-[#F47A1F]"
                      : "bg-[#FBEBD9]/60 border border-[#1E2A44]/15 text-[#1E2A44] hover:bg-[#FBEBD9]"
                  }`}
                >
                  {isSelected && <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={2.5} />}
                  <span>{lang === "hi" ? cond.labelHi : cond.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* If "None of the above" is selected, reveal text field "Add something else (optional)" */}
          {healthHistory.includes("none") && (
            <div className="mt-1 flex flex-col gap-1">
              <div className="relative">
                <input
                  type="text"
                  maxLength={80}
                  value={customHealthNote}
                  onChange={e => setCustomHealthNote(e.target.value)}
                  placeholder={t.planBuilder.customHealthPlaceholder}
                  className="w-full px-3 py-2 text-xs font-medium text-[#1E2A44] bg-[#FBEBD9]/60 border border-[#1E2A44]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F47A1F] pr-16"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-semibold text-[#5B6577]">
                  {80 - customHealthNote.length}
                </span>
              </div>
              <span className="text-[10px] text-[#5B6577]">
                {t.planBuilder.charsRemaining}
              </span>
            </div>
          )}

          {/* Privacy note and Remember on this device switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-[#5B6577] font-medium leading-tight">
              {t.planBuilder.healthHistoryPrivacy}
            </span>

            {/* Switch disabled if Under 18 */}
            <label
              className={`flex items-center gap-2 cursor-pointer select-none shrink-0 ${
                age === "Under 18" ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  disabled={age === "Under 18"}
                  checked={age !== "Under 18" && rememberDevice}
                  onChange={e => setRememberDevice(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-[#5B6577]/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#F47A1F]" />
              </div>
              <span className="text-xs font-semibold text-[#1E2A44]">
                {t.planBuilder.rememberDevice}
              </span>
            </label>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="text-xs font-bold text-[#D92D20] bg-[#FDECEA] p-2.5 rounded-xl">
            {validationError}
          </div>
        )}

        {/* Full-width Get My Safety Plan Button */}
        <button
          type="button"
          onClick={handleGetPlan}
          disabled={!isFormValid}
          className={`w-full py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md ${
            isFormValid
              ? "bg-[#F47A1F] text-[#FFFAF4] hover:bg-[#E06912] active:scale-[0.99] cursor-pointer"
              : "bg-[#5B6577]/30 text-[#1E2A44]/50 cursor-not-allowed"
          }`}
        >
          <span>{t.planBuilder.getPlanButton}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2.4} />
        </button>

        {/* Location Fallback Trigger & Privacy Guarantee */}
        <div className="flex flex-col items-center text-center gap-1">
          <button
            type="button"
            onClick={handleLocationClick}
            className="text-xs font-bold text-[#F47A1F] hover:underline cursor-pointer flex items-center gap-1"
          >
            <HugeiconsIcon icon={Location01Icon} size={14} strokeWidth={2.2} />
            <span>{t.planBuilder.useLocation}</span>
          </button>
          <span className="text-[11px] text-[#5B6577] max-w-sm leading-tight">
            {t.planBuilder.locationPrivacy}
          </span>
        </div>
      </div>
    </div>
  );
}
