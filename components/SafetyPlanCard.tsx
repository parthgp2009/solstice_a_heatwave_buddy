"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Sun01Icon,
  Briefcase01Icon,
  GlassWaterIcon,
  Alert02Icon
} from "@hugeicons/core-free-icons";
import { useAppState } from "@/context/AppStateContext";
import {
  adjustedFeelsLikeForHour,
  computeSafeWindows,
  isVulnerableUser
} from "@/lib/heatModel";
import { PlanAIResponse, generateFallbackPlan } from "@/lib/aiPlan";
import AudioListenButton from "@/components/AudioListenButton";

const subscribeReducedMotion = (callback: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getReducedMotionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

function getOccupationShiftTip(occ: string, lang: "en" | "hi"): string {
  if (lang === "hi") {
    switch (occ) {
      case "Delivery Driver":
        return "दोपहर 12 से 3 बजे के बीच लंबी राइड से बचें और हर डिलीवरी के बीच 2 मिनट छांव में सुस्ताएं।";
      case "Farmer":
        return "खेत का भारी काम भोर में सुबह 10 बजे से पहले करें और दोपहर की तेज धूप में काम रोकें।";
      case "Traffic Police":
        return "हर 45 मिनट में बूथ की छांव में रोटेशन ड्यूटी करें और गीला सूती रुमाल साथ रखें।";
      case "Student":
        return "दोपहर के समय इनडोर कमरों में रहें और सीधी धूप वाले बाहरी खेलकूद से बचें।";
      case "Office Worker":
        return "सुबह 9 बजे से पहले या शाम 5:30 बजे के बाद आवागमन करें और एसी में भी पानी पीते रहें।";
      default:
        return "दोपहर की तेज धूप (12-4 बजे) में बाहरी गतिविधियां कम से कम रखें।";
    }
  }
  switch (occ) {
    case "Delivery Driver":
      return "Plan longer routes before 11 AM; take 2-min shaded rests between drops and avoid 12-3 PM heat peak.";
    case "Farmer":
      return "Begin field tasks at dawn before 10 AM; suspend heavy open-field exertion during noon hours.";
    case "Traffic Police":
      return "Rotate junction posts every 45 mins with shaded booth breaks; keep wet neck cloth handy.";
    case "Student":
      return "Stay in shaded classrooms during midday lunch break; avoid unshaded sports in peak sun.";
    case "Office Worker":
      return "Commute before 9 AM or after 5:30 PM; avoid abrupt cold-to-hot street transitions.";
    default:
      return "Limit outdoor exertion during peak afternoon hours (12-4 PM).";
  }
}

export default function SafetyPlanCard() {
  const {
    lang,
    setLang,
    t,
    city,
    customCity,
    age,
    occupation,
    sunHours,
    healthHistory,
    customHealthNote,
    selectedHour,
    weatherData
  } = useAppState();

  const [glassesFilled, setGlassesFilled] = useState<number>(0);
  const [aiPlan, setAiPlan] = useState<PlanAIResponse | null>(null);
  const [isLoadingAiPlan, setIsLoadingAiPlan] = useState<boolean>(false);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);

  const displayCity = customCity || (city === "OTHER_SEARCH" ? "Delhi" : city);

  // Strictness step: for Under 18, Over 60, or history of Heatstroke / Heat exhaustion
  const isVulnerable = isVulnerableUser(age, healthHistory);

  // Compute live readings and windows from heatModel
  const reading = adjustedFeelsLikeForHour(
    selectedHour,
    weatherData.hourlyApparent,
    weatherData.hourlyUv,
    sunHours,
    isVulnerable
  );
  const { saferRanges, avoidRanges } = computeSafeWindows(
    weatherData.hourlyApparent,
    weatherData.hourlyUv,
    sunHours,
    isVulnerable
  );

  const effectiveRiskLevel = reading.riskLevel;

  // Instant reactive local plan derived synchronously on EVERY render
  const localAdvice = generateFallbackPlan({
    city: displayCity,
    age,
    occupation,
    sunHours,
    healthHistory,
    customHealthNote,
    lang,
    currentTemp: weatherData.currentTemp,
    adjustedTemp: reading.adjusted,
    riskLevel: effectiveRiskLevel
  });

  // Verify whether cached aiPlan matches active selections
  const isAiPlanFresh =
    aiPlan &&
    aiPlan.source === "gemini" &&
    aiPlan.appliedAge === age &&
    aiPlan.appliedOccupation === occupation &&
    aiPlan.appliedSunHours === sunHours;

  const activeAgeAdvice = isAiPlanFresh && aiPlan.ageAdvice ? aiPlan.ageAdvice : localAdvice.ageAdvice;
  const activeOccupationAdvice = isAiPlanFresh && aiPlan.occupationAdvice ? aiPlan.occupationAdvice : localAdvice.occupationAdvice;
  const activeSunAdvice = isAiPlanFresh && aiPlan.sunExposureAdvice ? aiPlan.sunExposureAdvice : localAdvice.sunExposureAdvice;
  const activeHealthAdvices = isAiPlanFresh && aiPlan.healthAdvice && aiPlan.healthAdvice.length > 0 ? aiPlan.healthAdvice : localAdvice.healthAdvice;

  // Dynamic hydration schedule based on Sun Hours & Occupation
  const baseGlasses = sunHours === "More than 6 hours" ? 16 : sunHours === "2 to 6 hours" ? 12 : 8;
  const isHighExertionJob = occupation === "Delivery Driver" || occupation === "Farmer" || occupation === "Traffic Police";
  const totalGlasses = isHighExertionJob ? baseGlasses + 2 : baseGlasses;
  const targetLiters = (totalGlasses * 0.25).toFixed(1);

  const hydrationIntervalText =
    sunHours === "More than 6 hours"
      ? (lang === "hi" ? `हर 15-20 मिनट में 250ml + ओआरएस (${targetLiters}L लक्ष्य)` : `Drink 250ml every 15–20 mins + ORS (${targetLiters}L target)`)
      : sunHours === "2 to 6 hours"
      ? (lang === "hi" ? `हर 30 मिनट में 250ml (${targetLiters}L लक्ष्य)` : `Drink 250ml every 30 mins (${targetLiters}L target)`)
      : (lang === "hi" ? `हर 45 मिनट में 250ml (${targetLiters}L लक्ष्य)` : `Drink 250ml every 45 mins (${targetLiters}L target)`);

  const displayGlasses = reducedMotion ? totalGlasses : Math.min(glassesFilled, totalGlasses);

  // Staggered fill for hydration glass icons on load or when totalGlasses changes
  useEffect(() => {
    if (reducedMotion) return;

    const timers: NodeJS.Timeout[] = [];
    for (let i = 1; i <= totalGlasses; i++) {
      timers.push(
        setTimeout(() => {
          setGlassesFilled(i);
        }, i * 90)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [totalGlasses, reducedMotion]);

  // Fetch AI plan from server-side /api/plan route with graceful fallback
  useEffect(() => {
    let cancelled = false;

    async function fetchAiPlan() {
      setIsLoadingAiPlan(true);
      try {
        const res = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: displayCity,
            age,
            occupation,
            sunHours,
            healthHistory,
            customHealthNote,
            lang,
            currentTemp: weatherData.currentTemp,
            adjustedTemp: reading.adjusted,
            riskLevel: effectiveRiskLevel
          })
        });
        if (res.ok) {
          const data = (await res.json()) as PlanAIResponse;
          if (!cancelled) {
            setAiPlan(data);
          }
        }
      } catch {
        // Fallback remains active
      } finally {
        if (!cancelled) {
          setIsLoadingAiPlan(false);
        }
      }
    }

    const timer = setTimeout(fetchAiPlan, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [age, occupation, sunHours, healthHistory, customHealthNote, lang, displayCity, reading.adjusted, effectiveRiskLevel, weatherData.currentTemp]);

  // Comprehensive profile summary chips
  const summaryChips = [
    `📍 ${displayCity}`,
    occupation && occupation !== "Not specified" ? `💼 ${occupation}` : null,
    age ? `👤 Age: ${age}` : null,
    sunHours ? `☀️ Sun: ${sunHours}` : null,
    healthHistory.includes("heatstroke") ? "Heatstroke history" : null,
    healthHistory.includes("exhaustion") ? "Heat exhaustion" : null,
    healthHistory.includes("migraine") ? "Migraine" : null,
    healthHistory.includes("skin_infections") ? "Skin care" : null,
    healthHistory.includes("fatigue") ? "Physical fatigue" : null,
    customHealthNote.trim() ? `Note: "${customHealthNote.trim().slice(0, 25)}..."` : null
  ].filter(Boolean) as string[];

  const planSpeechText =
    lang === "hi"
      ? `आपकी दैनिक हीट सुरक्षा योजना, शहर ${displayCity} के लिए। वर्तमान हीट स्तर: ${effectiveRiskLevel}, अनुमानित तापमान ${reading.adjusted} डिग्री सेल्सियस। धूप में रहने का समय: ${sunHours}। ${
          saferRanges.length > 0
            ? `बाहर निकलने का सुरक्षित समय: ${saferRanges.join(", ")}।`
            : "सुबह 8 बजे से पहले ही बाहर निकलें।"
        } ${
          avoidRanges.length > 0 ? `दोपहर की तेज धूप से बचें: ${avoidRanges.join(", ")}।` : ""
        } जलपान अनुसूची: ${hydrationIntervalText}। ${
          age ? `उम्र ${age} के लिए सलाह: ${activeAgeAdvice}` : ""
        } ${
          occupation && occupation !== "Not specified"
            ? `व्यवसाय ${occupation} के लिए सलाह: ${activeOccupationAdvice}`
            : ""
        } ${
          activeSunAdvice ? `धूप से बचाव: ${activeSunAdvice}` : ""
        } ${
          activeHealthAdvices.length > 0 ? `स्वास्थ्य सलाह: ${activeHealthAdvices.join(" ")}` : ""
        }`.slice(0, 1400)
      : `Your Daily Heat Safety Plan for ${displayCity}. Current heat level: ${effectiveRiskLevel}, with an adjusted feels-like temperature of ${reading.adjusted} degrees Celsius. Sun exposure: ${sunHours}. ${
          saferRanges.length > 0
            ? `Safest outdoor windows are: ${saferRanges.join(", ")}.`
            : "Prefer early morning hours before 8 AM."
        } ${
          avoidRanges.length > 0 ? `Avoid peak afternoon exposure: ${avoidRanges.join(", ")}.` : ""
        } Hydration schedule: ${hydrationIntervalText}. ${
          age ? `Advice for age ${age}: ${activeAgeAdvice}` : ""
        } ${
          occupation && occupation !== "Not specified"
            ? `Advice for ${occupation}: ${activeOccupationAdvice}`
            : ""
        } ${
          activeSunAdvice ? `Sun protection: ${activeSunAdvice}` : ""
        } ${
          activeHealthAdvices.length > 0 ? `Health considerations: ${activeHealthAdvices.join(" ")}` : ""
        }`.slice(0, 1400);

  return (
    <div
      id="safety-plan-card"
      className="w-full bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-5 sm:p-6 card-shadow animate-fade-rise-2 flex flex-col gap-4 transition-all duration-500"
    >
      {/* Phone-style Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1E2A44]/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Back"
            className="p-1 rounded-lg text-[#1E2A44] hover:bg-[#FBEBD9] cursor-pointer"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2.4} />
          </button>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm sm:text-base text-[#1E2A44] leading-tight">
              {t.planCard.title}
            </span>
            <span className="text-[11px] font-bold text-[#F47A1F]">
              📍 {displayCity} · {weatherData.currentTemp}°C {weatherData.isLive ? "(Live Weather)" : ""}
            </span>
          </div>
        </div>

        {/* Audio Listen Button & EN / HI toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <AudioListenButton textToSpeak={planSpeechText} lang={lang} />
          <div className="flex items-center bg-[#FBEBD9] rounded-full p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                lang === "en" ? "bg-[#F47A1F] text-[#FFFAF4]" : "text-[#5B6577]"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              className={`px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                lang === "hi" ? "bg-[#F47A1F] text-[#FFFAF4]" : "text-[#5B6577]"
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Row with round occupation icon & Personalisation chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="w-8 h-8 rounded-full bg-[#F47A1F]/15 text-[#F47A1F] flex items-center justify-center shrink-0">
          <HugeiconsIcon icon={Briefcase01Icon} size={16} strokeWidth={2.2} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {summaryChips.map((chip, idx) => (
            <span
              key={idx}
              className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FBEBD9] text-[#1E2A44] border border-[#1E2A44]/10"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Stricter Advice Notice if vulnerable */}
      {isVulnerable && (
        <div className="text-[11px] font-bold text-[#D92D20] bg-[#FDECEA] p-2 rounded-xl flex items-center gap-1.5 leading-tight">
          <HugeiconsIcon icon={Alert02Icon} size={14} strokeWidth={2.4} className="shrink-0" />
          <span>
            {lang === "hi"
              ? "आपकी उम्र या स्वास्थ्य इतिहास के कारण सलाह अधिक सख्त रखी गई है।"
              : "Advice is stricter for your age or health history."}
          </span>
        </div>
      )}

      {/* 4 Tinted Sections */}
      <div className="flex flex-col gap-3">
        {/* Section 1: Red Tint Current Heat Level */}
        <div className="bg-[#FDECEA] border border-[#D92D20]/20 rounded-xl p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#D92D20]">
              {t.planCard.currentHeatLevel}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#D92D20] text-[#FFFAF4]">
                {effectiveRiskLevel}
              </span>
              {isVulnerable && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#D92D20]/15 text-[#D92D20] border border-[#D92D20]/30">
                  +1 Stricter
                </span>
              )}
            </div>
          </div>
          <p className="text-xs font-semibold text-[#1E2A44] leading-tight">
            {lang === "hi"
              ? `समायोजित तापमान ${reading.adjusted}°C है (${displayCity})। सीधी धूप और भारी श्रम से बचें।`
              : `Adjusted heat index is ${reading.adjusted}°C for ${displayCity}. Limit strenuous outdoor work and direct exposure.`}
          </p>

          {/* Formula breakdown showing exact effect of Sun Hours, UV, and apparent temp */}
          <div className="flex items-center flex-wrap gap-1.5 text-[10px] font-bold text-[#5B6577] bg-[#FFFAF4]/90 px-2.5 py-1.5 rounded-lg border border-[#D92D20]/15">
            <span>Feels: {reading.rawFeelsLike}°C</span>
            <span>+</span>
            <span className="text-[#F47A1F]">UV {reading.uv} (+{reading.uvOff}°C)</span>
            <span>+</span>
            <span className="text-[#D92D20]">Sun ({sunHours}): +{reading.expOff}°C</span>
            <span>=</span>
            <span className="text-[#1E2A44] font-black">{reading.adjusted}°C Adjusted</span>
          </div>
        </div>

        {/* Section 2: Green Tint Best Time to Go Out */}
        <div className="bg-[#EAF6EE] border border-[#2E9E5B]/25 rounded-xl p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#2E9E5B]">
              {t.planCard.bestTimeToLeave}
            </span>
            {isVulnerable && (
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#2E9E5B]/20 text-[#2E9E5B]">
                {lang === "hi" ? "सख्त समय सीमा" : "Vulnerable Window"}
              </span>
            )}
          </div>
          <div className="text-xs font-bold text-[#1E2A44]">
            {saferRanges.length > 0 ? saferRanges.join(", ") : "Early morning before 8 AM & after 6 PM"}
          </div>
          {avoidRanges.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#D92D20] mt-0.5">
              <HugeiconsIcon icon={Sun01Icon} size={13} strokeWidth={2.2} />
              <span>
                {t.planCard.avoidWindow}: {avoidRanges.join(", ")}
              </span>
            </div>
          )}

          {/* Occupation shift guidance */}
          {occupation && occupation !== "Not specified" && (
            <div className="text-[11px] font-medium text-[#1E2A44] bg-[#FFFAF4]/90 p-2 rounded-lg border border-[#2E9E5B]/20 mt-1">
              <span className="font-bold text-[#2E9E5B]">{occupation} Shift Advice: </span>
              <span>{getOccupationShiftTip(occupation, lang)}</span>
            </div>
          )}
        </div>

        {/* Section 3: Blue Tint Hydration Schedule */}
        <div className="bg-[#EAF3FC] border border-[#2F7FD1]/25 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#2F7FD1]">
              {t.planCard.hydrationSchedule}
            </span>
            <span className="text-[11px] font-bold text-[#1E2A44]">
              {hydrationIntervalText}
            </span>
          </div>

          {/* Dynamic glass icons reflecting sunHours and occupation */}
          <div className="flex items-center flex-wrap gap-1.5 pt-1">
            {Array.from({ length: totalGlasses }).map((_, idx) => {
              const isFilled = idx < displayGlasses;
              return (
                <div
                  key={idx}
                  title={`Glass ${idx + 1} (250ml)`}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isFilled
                      ? "bg-[#2F7FD1] text-[#FFFAF4] scale-100 shadow-sm"
                      : "bg-[#2F7FD1]/15 text-[#2F7FD1]/40 scale-95"
                  }`}
                >
                  <HugeiconsIcon icon={GlassWaterIcon} size={13} strokeWidth={2.2} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Peach Tint Warning Signs & Personalized Tips */}
        <div className="bg-[#FDEFE3] border border-[#F47A1F]/25 rounded-xl p-3 flex flex-col gap-2">
          <span className="text-xs font-extrabold text-[#F47A1F]">
            {t.planCard.warningSigns}
          </span>
          <ul className="text-[11px] font-medium text-[#1E2A44] list-disc list-inside space-y-0.5 leading-snug">
            {t.planCard.warningSignsList.map((sign, idx) => (
              <li key={idx}>{sign}</li>
            ))}
          </ul>

          {/* "For you" personalized tips section */}
          <div className="mt-1 pt-2 border-t border-[#F47A1F]/20 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#1E2A44]">
                {t.planCard.forYouTitle}:
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  aiPlan?.source === "gemini"
                    ? "bg-[#F47A1F]/15 text-[#F47A1F] border border-[#F47A1F]/30"
                    : "bg-[#1E2A44]/10 text-[#5B6577]"
                }`}
              >
                {isLoadingAiPlan
                  ? lang === "hi"
                    ? "अपडेट हो रहा है..."
                    : "Updating..."
                  : aiPlan?.source === "gemini"
                  ? "Gemini AI Tailored"
                  : "Clinical Protocols"}
              </span>
            </div>

            {/* Age Advice */}
            <p className="text-[11px] text-[#1E2A44] leading-relaxed">
              • <span className="font-semibold">{age}:</span> {activeAgeAdvice}
            </p>

            {/* Occupation Advice */}
            {occupation && occupation !== "Not specified" && (
              <p className="text-[11px] text-[#1E2A44] leading-relaxed">
                • <span className="font-semibold">{occupation}:</span> {activeOccupationAdvice}
              </p>
            )}

            {/* Sun Exposure Advice */}
            {activeSunAdvice && (
              <p className="text-[11px] text-[#1E2A44] leading-relaxed">
                • <span className="font-semibold">Sun Exposure ({sunHours}):</span> {activeSunAdvice}
              </p>
            )}

            {/* Health Conditions Advice */}
            {activeHealthAdvices.map((adv, idx) => (
              <p key={idx} className="text-[11px] text-[#1E2A44] leading-relaxed">
                • <span className="font-semibold">Health:</span> {adv}
              </p>
            ))}

            {/* Custom Health Note if provided */}
            {customHealthNote.trim() && (
              <p className="text-[11px] text-[#1E2A44] leading-relaxed bg-[#FFFAF4]/80 p-1.5 rounded-md border border-[#F47A1F]/20">
                • <span className="font-semibold">Personal Note:</span> &ldquo;{customHealthNote.trim()}&rdquo; &mdash; Pace activity accordingly.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Soft Chip */}
      <div className="text-center py-2 px-3 rounded-full bg-[#FBEBD9] text-[#1E2A44] text-xs font-bold tracking-tight">
        {t.planCard.footerChip}
      </div>
    </div>
  );
}
