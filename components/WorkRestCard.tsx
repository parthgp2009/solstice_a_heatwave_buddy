"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Briefcase01Icon,
  GlassWaterIcon,
  Alert02Icon,
  ArrowRight01Icon,
  Sun01Icon
} from "@hugeicons/core-free-icons";
import GlideSelect, { GlideSelectOption } from "@/components/GlideSelect";
import { useAppState } from "@/context/AppStateContext";
import {
  adjustedFeelsLikeForHour,
  isVulnerableUser
} from "@/lib/heatModel";
import {
  getWorkRestSchedule,
  WorkIntensity
} from "@/lib/workRest";

const INTENSITY_OPTIONS_EN: GlideSelectOption[] = [
  {
    value: "Light",
    label: "Light Work (sitting, inspecting, minimal exertion)"
  },
  {
    value: "Moderate",
    label: "Moderate Work (walking, lifting light items, cleaning)"
  },
  {
    value: "Heavy",
    label: "Heavy Work (construction, digging, intense physical labor)"
  }
];

const INTENSITY_OPTIONS_HI: GlideSelectOption[] = [
  {
    value: "Light",
    label: "हल्का काम (निरीक्षण, बैठकर काम, हल्के उपकरण)"
  },
  {
    value: "Moderate",
    label: "मध्यम काम (चलना, हल्का वजन उठाना, सफाई)"
  },
  {
    value: "Heavy",
    label: "भारी काम (निर्माण, खुदाई, भारी शारीरिक श्रम)"
  }
];

const formatHour = (h: number) => {
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:00 ${period}`;
};

export default function WorkRestCard() {
  const {
    lang,
    city,
    customCity,
    age,
    healthHistory,
    selectedHour,
    sunHours,
    weatherData,
    planSubmitted
  } = useAppState();

  // In-memory component state only (Zero-Storage Guarantee, no client-side persistence)
  const [intensity, setIntensity] = useState<WorkIntensity>("Moderate");

  const displayCity = customCity || (city === "OTHER_SEARCH" ? "Delhi" : city);

  // Compute live reading with strictness tier (+1 for vulnerable users)
  const isVulnerable = isVulnerableUser(age, healthHistory);
  const reading = adjustedFeelsLikeForHour(
    selectedHour,
    weatherData.hourlyApparent,
    weatherData.hourlyUv,
    sunHours,
    isVulnerable
  );
  const effectiveRiskLevel = reading.riskLevel;

  // Pure rule-based work-rest schedule
  const schedule = getWorkRestSchedule(effectiveRiskLevel, intensity);

  const intensityOptions = lang === "hi" ? INTENSITY_OPTIONS_HI : INTENSITY_OPTIONS_EN;

  const scrollToPlanBuilder = () => {
    const el = document.getElementById("plan-builder-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getRiskBadgeStyles = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-[#EAF6EE] text-[#2E9E5B] border-[#2E9E5B]/30";
      case "Caution":
        return "bg-[#FEF6EE] text-[#F5B83D] border-[#F5B83D]/40";
      case "Danger":
        return "bg-[#FDF2E9] text-[#F47A1F] border-[#F47A1F]/40";
      case "Extreme":
        return "bg-[#FDECEA] text-[#D92D20] border-[#D92D20]/40";
      default:
        return "bg-[#FBEBD9] text-[#1E2A44] border-[#1E2A44]/15";
    }
  };

  return (
    <div
      id="work-rest-card"
      className="w-full bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-5 sm:p-7 card-shadow flex flex-col gap-5 text-[#1E2A44]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1E2A44]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FBEBD9] text-[#F47A1F] flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={Clock01Icon} size={22} strokeWidth={2.4} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#1E2A44] leading-tight">
              {lang === "hi" ? "कार्य-विश्राम योजनाकार" : "Work-Rest Planner"}
            </h2>
            <p className="text-xs text-[#5B6577] font-medium mt-0.5">
              {lang === "hi"
                ? "गर्मी के तनाव से बचने के लिए प्रति घंटा कार्य और आराम की गणना"
                : "Calculate hourly outdoor work and shaded rest intervals"}
            </p>
          </div>
        </div>

        {planSubmitted && (
          <div
            className={`px-2.5 py-1 rounded-full border text-[11px] font-extrabold shrink-0 ${getRiskBadgeStyles(
              effectiveRiskLevel
            )}`}
          >
            <span>{effectiveRiskLevel}</span>
          </div>
        )}
      </div>

      {/* Conditional State: Friendly Prompt if Plan Not Built Yet */}
      {!planSubmitted ? (
        <div className="bg-[#FBEBD9]/50 border border-[#F47A1F]/25 rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#FBEBD9] text-[#F47A1F] flex items-center justify-center">
            <HugeiconsIcon icon={Briefcase01Icon} size={24} strokeWidth={2.3} />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="text-sm sm:text-base font-extrabold text-[#1E2A44]">
              {lang === "hi"
                ? "पहले अपनी सुरक्षा योजना तैयार करें"
                : "Build Your Safety Plan First"}
            </h3>
            <p className="text-xs text-[#5B6577] font-medium leading-relaxed">
              {lang === "hi"
                ? "व्यक्तिगत कार्य-विश्राम चक्र की गणना करने के लिए कृपया बाईं ओर दिए गए फॉर्म से अपनी योजना बनाएं। यह आपके शहर, कार्य और धूप के समय पर आधारित होगी।"
                : "Please build your plan first using the form on the left. We will then calculate personalized work and rest intervals based on your city, occupation, and heat exposure."}
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToPlanBuilder}
            className="mt-1 px-4 py-2 rounded-xl text-xs font-extrabold bg-[#F47A1F] text-[#FFFAF4] hover:bg-[#E06912] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>{lang === "hi" ? "योजना फॉर्म पर जाएं" : "Go to Plan Builder"}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2.4} />
          </button>
        </div>
      ) : (
        /* Active State: Work Intensity Selector and Computed Work-Rest Schedule */
        <div className="flex flex-col gap-4">
          {/* Active Conditions Summary Pill */}
          <div className="bg-[#FBEBD9]/40 border border-[#1E2A44]/10 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#5B6577] font-semibold">
              <HugeiconsIcon icon={Sun01Icon} size={15} strokeWidth={2.2} className="text-[#F47A1F]" />
              <span>
                {displayCity} • {formatHour(selectedHour)} ({selectedHour}:00)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#1E2A44]">
              <span>{reading.adjusted}°C Feels Like</span>
              {isVulnerable && (
                <span className="text-[#D92D20] text-[10px]">(+1 Strictness)</span>
              )}
            </div>
          </div>

          {/* Work Intensity GlideSelect */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1E2A44] flex items-center justify-between">
              <span>{lang === "hi" ? "काम की शारीरिक तीव्रता:" : "Work Intensity:"}</span>
              <span className="text-[11px] font-normal text-[#5B6577]">
                {lang === "hi" ? "श्रम का स्तर चुनें" : "Select exertion level"}
              </span>
            </label>
            <GlideSelect
              options={intensityOptions}
              value={intensity}
              onChange={(val: string) => setIntensity(val as WorkIntensity)}
              placeholder={lang === "hi" ? "काम की तीव्रता" : "Work Intensity"}
              accentColor="#F47A1F"
              surfaceColor="#FBEBD9"
              highlightColor="#F9D9B8"
              textColor="#1E2A44"
              size="lg"
              radius={14}
            />
          </div>

          {/* Outcome Breakdown */}
          {schedule.riskLevel === "Extreme" ? (
            /* Extreme Risk Alert: No outdoor work */
            <div className="bg-[#FDECEA] border-2 border-[#D92D20] rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#D92D20] text-[#FFFAF4] shrink-0 mt-0.5">
                  <HugeiconsIcon icon={Alert02Icon} size={22} strokeWidth={2.4} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm sm:text-base font-black text-[#D92D20] uppercase tracking-tight">
                    {lang === "hi" ? schedule.messageHi : schedule.messageEn}
                  </h3>
                  <p className="text-xs text-[#1E2A44] font-medium leading-relaxed">
                    {lang === "hi"
                      ? "अत्यधिक गर्मी में बाहरी शारीरिक काम जानलेवा हो सकता है। तुरंत ठंडे कमरे या छायादार इनडोर जगह पर जाएं।"
                      : "In extreme heat, heavy exertion can quickly trigger fatal heatstroke. Suspend all outdoor tasks and remain indoors."}
                  </p>
                </div>
              </div>

              <div className="bg-[#FFFAF4] border border-[#D92D20]/30 rounded-xl p-3 text-xs font-bold text-[#D92D20] flex items-center justify-between">
                <span>{lang === "hi" ? "कार्य समय: 0 मिनट" : "Work: 0 min"}</span>
                <span>{lang === "hi" ? "विश्राम समय: 60 मिनट" : "Rest: 60 min"}</span>
              </div>
            </div>
          ) : (
            /* Standard Work/Rest Minutes Breakdown */
            <div className="flex flex-col gap-3">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Work Minutes */}
                <div className="bg-[#FEF6EE] border border-[#F47A1F]/30 rounded-2xl p-4 flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-[#5B6577] uppercase tracking-wider">
                    {lang === "hi" ? "कार्य समय" : "Work Time"}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-[#F47A1F]">
                      {schedule.workMinutes}
                    </span>
                    <span className="text-xs font-bold text-[#1E2A44]">
                      {lang === "hi" ? "मिनट / घंटा" : "min / hr"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#5B6577] font-medium">
                    {lang === "hi" ? "सुरक्षित सक्रिय अवधि" : "Active work limit"}
                  </span>
                </div>

                {/* Rest Minutes */}
                <div className="bg-[#EAF6EE] border border-[#2E9E5B]/30 rounded-2xl p-4 flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-[#5B6577] uppercase tracking-wider">
                    {lang === "hi" ? "विश्राम समय" : "Rest Break"}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-[#2E9E5B]">
                      {schedule.restMinutes}
                    </span>
                    <span className="text-xs font-bold text-[#1E2A44]">
                      {lang === "hi" ? "मिनट / घंटा" : "min / hr"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#5B6577] font-medium">
                    {lang === "hi" ? "छाया में सुस्ताएं" : "Mandatory shaded rest"}
                  </span>
                </div>
              </div>

              {/* Hourly Split Bar Visual */}
              <div className="flex flex-col gap-1">
                <div className="w-full h-3 rounded-full bg-[#E5E7EB] overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${(schedule.workMinutes / 60) * 100}%` }}
                    className="bg-[#F47A1F] h-full transition-all duration-300"
                    title={`Work: ${schedule.workMinutes}m`}
                  />
                  <div
                    style={{ width: `${(schedule.restMinutes / 60) * 100}%` }}
                    className="bg-[#2E9E5B] h-full transition-all duration-300"
                    title={`Rest: ${schedule.restMinutes}m`}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-[#5B6577]">
                  <span className="text-[#F47A1F]">
                    {lang === "hi"
                      ? `${schedule.workMinutes} मिनट काम`
                      : `${schedule.workMinutes}m work`}
                  </span>
                  <span className="text-[#2E9E5B]">
                    {lang === "hi"
                      ? `${schedule.restMinutes} मिनट आराम`
                      : `${schedule.restMinutes}m rest`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hydration and Rest Reminders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Hydration Reminder */}
            <div className="bg-[#EBF5FB] border border-[#3498DB]/25 rounded-xl p-3 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#3498DB] text-[#FFFAF4] shrink-0 mt-0.5">
                <HugeiconsIcon icon={GlassWaterIcon} size={15} strokeWidth={2.4} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-extrabold text-[#1E2A44]">
                  {lang === "hi" ? "जलपान स्मरण:" : "Drinking Reminder:"}
                </span>
                <p className="text-xs text-[#1E2A44] font-medium leading-relaxed">
                  {lang === "hi"
                    ? schedule.hydrationReminderHi
                    : schedule.hydrationReminderEn}
                </p>
              </div>
            </div>

            {/* Rest Break Location */}
            <div className="bg-[#FEF6EE] border border-[#F47A1F]/25 rounded-xl p-3 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#F47A1F] text-[#FFFAF4] shrink-0 mt-0.5">
                <HugeiconsIcon icon={Sun01Icon} size={15} strokeWidth={2.4} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-extrabold text-[#1E2A44]">
                  {lang === "hi" ? "विश्राम स्थल:" : "Rest Location:"}
                </span>
                <p className="text-xs text-[#1E2A44] font-medium leading-relaxed">
                  {lang === "hi" ? schedule.restReminderHi : schedule.restReminderEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer Footer & Zero-Storage Notice */}
      <div className="pt-3 border-t border-[#1E2A44]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#5B6577]">
        <span className="font-semibold italic">
          {lang === "hi"
            ? "⚠️ सामान्य मार्गदर्शन, चिकित्सकीय सलाह नहीं।"
            : "⚠️ General guidance, not medical advice."}
        </span>
        <span className="text-[10px] text-[#5B6577]/80">
          {lang === "hi" ? "🔒 कोई डेटा सहेजा नहीं जाता" : "🔒 Zero data stored"}
        </span>
      </div>
    </div>
  );
}
