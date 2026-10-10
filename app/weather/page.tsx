"use client";

import React from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import LiveReadingCard from "@/components/LiveReadingCard";
import GlideSelect from "@/components/GlideSelect";
import { useAppState } from "@/context/AppStateContext";
import { CITIES_CONFIG } from "@/lib/dictionary";
import {
  DEFAULT_HOURLY_APPARENT_TEMP,
  DEFAULT_HOURLY_UV_INDEX,
  adjustedFeelsLike,
  getRiskLevel,
  getUvLabel
} from "@/lib/heatModel";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Sun01Icon,
  ArrowRight01Icon,
  Clock01Icon
} from "@hugeicons/core-free-icons";

export default function WeatherPage() {
  const { lang, city, setCity, customCity, setCustomCity, sunHours } = useAppState();

  const cityOptions = CITIES_CONFIG.map(c => ({
    value: c.value,
    label: lang === "hi" ? c.labelHi : c.labelEn,
    tag: lang === "hi" ? c.tagHi : c.tagEn
  }));

  const displayCity = customCity || (city === "OTHER_SEARCH" ? "Delhi" : city);

  const formatHour = (h: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const d = h % 12 === 0 ? 12 : h % 12;
    return `${d}:00 ${ampm}`;
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#F47A1F] selection:text-[#FFFAF4] pb-24 bg-[#FDF3E7]">
      <TopBar />

      <main className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#F47A1F]">
              {lang === "hi" ? "लाइव मौसम व हीट इंडेक्स" : "Live Weather & Thermal Stress Monitor"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A44] tracking-tight">
              {lang === "hi" ? `${displayCity} का लाइव तापमान` : `Live Heat Conditions in ${displayCity}`}
            </h1>
            <p className="text-xs sm:text-sm text-[#5B6577] font-medium leading-relaxed">
              {lang === "hi"
                ? "ओपन-मेटियो उपग्रह डेटा द्वारा समर्थित वास्तविक समय तापमान, यूवी इंडेक्स और समायोजित हीट इंडेक्स।"
                : "Real-time temperature, solar UV radiation, and adjusted heat indices powered by Open-Meteo."}
            </p>
          </div>

          {/* Quick City Switcher */}
          <div className="shrink-0 w-full sm:w-60">
            <label className="text-[11px] font-bold text-[#1E2A44] mb-1 flex items-center gap-1">
              <HugeiconsIcon icon={Location01Icon} size={13} strokeWidth={2.2} className="text-[#F47A1F]" />
              <span>{lang === "hi" ? "शहर बदलें:" : "Switch City:"}</span>
            </label>
            <GlideSelect
              options={cityOptions}
              value={city}
              onChange={(val: string) => {
                setCity(val);
                if (val !== "OTHER_SEARCH") setCustomCity("");
              }}
              size="lg"
              radius={14}
              accentColor="#F47A1F"
              surfaceColor="#FBEBD9"
              highlightColor="#F9D9B8"
              textColor="#1E2A44"
              className="w-full"
            />
          </div>
        </div>

        {/* Live Reading Card Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7">
            <LiveReadingCard />
          </div>

          <div className="md:col-span-5 bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-6 card-shadow flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#F47A1F]">
              <HugeiconsIcon icon={Sun01Icon} size={22} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "सुरक्षा योजना तैयार करें" : "Ready For Your Plan?"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "मौसम की यह स्थिति आपके काम और स्वास्थ्य पर कैसे प्रभाव डालती है? अपनी आयु और कार्य के अनुसार व्यक्तिगत सुरक्षा योजना बनाएं।"
                : "Weather data is only step one. Generate an hourly schedule, hydration reminders, and safety advice tailored to your exact occupation and health profile."}
            </p>
            <Link
              href="/plan"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm bg-[#F47A1F] text-[#FFFAF4] hover:bg-[#E06912] transition-colors shadow-sm"
            >
              <span>{lang === "hi" ? "व्यक्तिगत सुरक्षा योजना बनाएं" : "Create Personal Safety Plan"}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.4} />
            </Link>
          </div>
        </div>

        {/* 24-Hour Timeline Forecast Table */}
        <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-5 sm:p-6 card-shadow flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#1E2A44]/10 pb-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Clock01Icon} size={18} strokeWidth={2.2} className="text-[#F47A1F]" />
              <h3 className="font-extrabold text-sm sm:text-base text-[#1E2A44]">
                {lang === "hi" ? "24-घंटे का संपूर्ण हीट इंडेक्स विवरण" : "24-Hour Hourly Forecast Breakdown"}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#5B6577]">
              {displayCity} · Open-Meteo
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1E2A44]">
              <thead>
                <tr className="border-b border-[#1E2A44]/10 text-[#5B6577] text-[11px]">
                  <th className="py-2.5 px-3 font-extrabold">Time</th>
                  <th className="py-2.5 px-3 font-extrabold">Raw Feels-Like</th>
                  <th className="py-2.5 px-3 font-extrabold">UV Index</th>
                  <th className="py-2.5 px-3 font-extrabold">Adjusted Temp</th>
                  <th className="py-2.5 px-3 font-extrabold">Risk Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2A44]/10">
                {DEFAULT_HOURLY_APPARENT_TEMP.map((raw, h) => {
                  const uv = DEFAULT_HOURLY_UV_INDEX[h];
                  const adj = adjustedFeelsLike(raw, uv, sunHours);
                  const risk = getRiskLevel(adj);

                  const badgeClass =
                    risk === "Extreme"
                      ? "bg-[#FDECEA] text-[#D92D20] border-[#D92D20]/30"
                      : risk === "Danger"
                      ? "bg-[#FDEFE3] text-[#F47A1F] border-[#F47A1F]/30"
                      : risk === "Caution"
                      ? "bg-[#FDF3E7] text-[#D98200] border-[#F5B83D]/40"
                      : "bg-[#EAF6EE] text-[#2E9E5B] border-[#2E9E5B]/30";

                  return (
                    <tr key={h} className="hover:bg-[#FBEBD9]/40 transition-colors">
                      <td className="py-2 px-3 font-bold">{formatHour(h)}</td>
                      <td className="py-2 px-3">{raw}°C</td>
                      <td className="py-2 px-3">
                        UV {uv} ({getUvLabel(uv)})
                      </td>
                      <td className="py-2 px-3 font-extrabold text-[#1E2A44]">
                        {adj}°C
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold border ${badgeClass}`}
                        >
                          {risk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
