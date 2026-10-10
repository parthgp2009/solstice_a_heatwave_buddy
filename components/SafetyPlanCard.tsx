"use client";

import React, { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Sun01Icon,
  Briefcase01Icon,
  GlassWaterIcon,
  Alert02Icon,
  Tick02Icon,
  UserIcon
} from "@hugeicons/core-free-icons";
import { useAppState } from "@/context/AppStateContext";
import {
  adjustedFeelsLikeForHour,
  computeSafeWindows,
  RiskLevel
} from "@/lib/heatModel";

export default function SafetyPlanCard() {
  const {
    lang,
    setLang,
    t,
    age,
    occupation,
    sunHours,
    healthHistory,
    selectedHour
  } = useAppState();

  const [glassesFilled, setGlassesFilled] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
  }, []);

  // Compute live readings and windows from heatModel
  const reading = adjustedFeelsLikeForHour(selectedHour, undefined, undefined, sunHours);
  const { saferRanges, avoidRanges } = computeSafeWindows(undefined, undefined, sunHours);

  // Strictness step: for Under 18, Over 60, or history of Heatstroke / Heat exhaustion
  const isVulnerable =
    age === "Under 18" ||
    age === "Over 60" ||
    healthHistory.includes("heatstroke") ||
    healthHistory.includes("exhaustion");

  const getStricterLevel = (lvl: RiskLevel): RiskLevel => {
    if (!isVulnerable) return lvl;
    if (lvl === "Low") return "Caution";
    if (lvl === "Caution") return "Danger";
    return "Extreme";
  };

  const effectiveRiskLevel = getStricterLevel(reading.riskLevel);

  // Staggered fill for hydration glass icons on load
  const totalGlasses = 8;
  useEffect(() => {
    if (reducedMotion) {
      setGlassesFilled(totalGlasses);
      return;
    }

    setGlassesFilled(0);
    const timers: NodeJS.Timeout[] = [];
    for (let i = 1; i <= totalGlasses; i++) {
      timers.push(
        setTimeout(() => {
          setGlassesFilled(i);
        }, i * 150)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [reducedMotion]);

  // Specific guidance text by age
  const getAgeAdvice = () => {
    if (lang === "hi") {
      if (age === "Under 18")
        return "धूप में कम समय रहें, हर 30 मिनट में छांव लें, बड़ों की देखरेख में खेलें और पार्क किए वाहन में कभी न बैठें।";
      if (age === "46 to 60")
        return "हर 45 मिनट में आराम करें, प्यास लगने से पहले पानी पिएं और दोपहर के घंटों से बचें।";
      if (age === "Over 60")
        return "तेज धूप में बाहर न निकलें, ठंडे कमरे में रहें, नियमित दवाओं के बारे में डॉक्टर से सलाह लें और ओआरएस पास रखें।";
      return "नियमित अंतराल पर पानी पिएं और शरीर को थकावट से बचाएं।";
    }
    if (age === "Under 18")
      return "Shorter time outdoors, shade breaks every 30 minutes, adult supervision for sports, drink before thirsty, and never stay in a parked vehicle.";
    if (age === "46 to 60")
      return "Rest breaks about every 45 minutes, start drinking earlier in the day, and avoid peak afternoon heat.";
    if (age === "Over 60")
      return "Avoid peak hours, rest in a cool space, keep ORS handy, have someone check in, and verify medications with your doctor.";
    return "Standard heat precautions: pace yourself and maintain steady fluid intake.";
  };

  // Specific guidance text by occupation
  const getOccupationAdvice = () => {
    if (lang === "hi") {
      if (occupation === "Delivery Driver")
        return "हवादार हेलमेट पहनें, लंबी सवारी दोपहर बाद करें, और दो ऑर्डर के बीच छांव में सुस्ताएं।";
      if (occupation === "Student")
        return "पानी की बोतल साथ रखें, दोपहर में खेलकूद या तेज धूप में खड़े रहने से बचें और टोपी पहनें।";
      if (occupation === "Farmer")
        return "काम जल्दी भोर में शुरू करें, सिर व गर्दन ढक कर रखें, दोपहर में आराम करें और खेत में पानी रखें।";
      if (occupation === "Traffic Police")
        return "चौराहे पर बारी-बारी से छांव लें, ऑन-ड्यूटी पानी पिएं और सांस लेने योग्य कपड़े पहनें।";
      if (occupation === "Office Worker")
        return "आवाजाही के समय सावधानी बरतें, एसी में भी पानी पीते रहें और अचानक तेज धूप में निकलने से बचें।";
      return "नियमित पेयजल और धूप से बचाव का ध्यान रखें।";
    }
    if (occupation === "Delivery Driver")
      return "Use a vented helmet, plan longer deliveries outside peak heat, and rest in shade between orders.";
    if (occupation === "Student")
      return "Carry a water bottle, avoid sports under direct midday sun, and wear a brimmed cap.";
    if (occupation === "Farmer")
      return "Start early and pause before peak noon heat, cover head and neck, and keep drinking water in the field.";
    if (occupation === "Traffic Police")
      return "Rotate shade breaks at the junction, carry water on duty, and use breathable reflective gear.";
    if (occupation === "Office Worker")
      return "Take care during midday commutes, stay hydrated indoors in air conditioning, and avoid abrupt hot/cold transitions.";
    return "Ensure regular hydration and limit unnecessary outdoor exposure.";
  };

  // Specific guidance text by health condition
  const getHealthAdvice = () => {
    const list: string[] = [];
    if (healthHistory.includes("heatstroke") || healthHistory.includes("exhaustion")) {
      list.push(
        lang === "hi"
          ? "लू का पिछला इतिहास होने से सहनशीलता कम होती है, गर्मी में ज्यादा जोर न लगाएं और तुरंत रुकें।"
          : "History of heat illness causes lower tolerance, avoid heavy exertion and cool down at first symptoms."
      );
    }
    if (healthHistory.includes("migraine")) {
      list.push(
        lang === "hi"
          ? "धूप, चकाचौंध और पानी की कमी से सिरदर्द बढ़ सकता है, धूप का चश्मा और पानी साथ रखें।"
          : "Heat glare and dehydration can trigger migraine, wear sunglasses and drink fluids regularly."
      );
    }
    if (healthHistory.includes("skin_infections")) {
      list.push(
        lang === "hi"
          ? "त्वचा को ढकें, साफ व सूखा रखें, और पसीने वाले कपड़े तुरंत बदलें।"
          : "Keep skin clean and dry, cover exposed areas, and change sweaty clothing promptly."
      );
    }
    if (healthHistory.includes("fatigue")) {
      list.push(
        lang === "hi"
          ? "काम के छोटे-छोटे हिस्से बनाएं, पर्याप्त आराम लें और इलेक्ट्रोलाइट्स पिएं।"
          : "Shorter work intervals with frequent rest periods and electrolytes."
      );
    }
    return list;
  };

  const healthAdvices = getHealthAdvice();

  // Chips summary
  const summaryChips = [
    occupation && occupation !== "Not specified" ? occupation : null,
    age ? `Age: ${age}` : null,
    healthHistory.includes("heatstroke") ? "Heatstroke history" : null,
    healthHistory.includes("exhaustion") ? "Heat exhaustion" : null,
    healthHistory.includes("migraine") ? "Migraine" : null,
    healthHistory.includes("skin_infections") ? "Skin care" : null,
    healthHistory.includes("fatigue") ? "Fatigue" : null
  ].filter(Boolean) as string[];

  return (
    <div className="w-full bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-5 sm:p-6 card-shadow animate-fade-rise-2 flex flex-col gap-4">
      {/* Phone-style Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2A44]/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Back"
            className="p-1 rounded-lg text-[#1E2A44] hover:bg-[#FBEBD9] cursor-pointer"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2.4} />
          </button>
          <span className="font-extrabold text-sm sm:text-base text-[#1E2A44]">
            {t.planCard.title}
          </span>
        </div>

        {/* Small EN / HI toggle */}
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
        <div className="bg-[#FDECEA] border border-[#D92D20]/20 rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#D92D20]">
              {t.planCard.currentHeatLevel}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#D92D20] text-[#FFFAF4]">
              {effectiveRiskLevel}
            </span>
          </div>
          <p className="text-xs font-semibold text-[#1E2A44] leading-tight">
            {lang === "hi"
              ? `समायोजित तापमान ${reading.adjusted}°C है। सीधी धूप और भारी श्रम से बचें।`
              : `Adjusted heat index is ${reading.adjusted}°C. Limit strenuous outdoor work and direct exposure.`}
          </p>
        </div>

        {/* Section 2: Green Tint Best Time to Go Out */}
        <div className="bg-[#EAF6EE] border border-[#2E9E5B]/25 rounded-xl p-3 flex flex-col gap-1.5">
          <span className="text-xs font-extrabold text-[#2E9E5B]">
            {t.planCard.bestTimeToLeave}
          </span>
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
        </div>

        {/* Section 3: Blue Tint Hydration Schedule */}
        <div className="bg-[#EAF3FC] border border-[#2F7FD1]/25 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#2F7FD1]">
              {t.planCard.hydrationSchedule}
            </span>
            <span className="text-[11px] font-bold text-[#1E2A44]">
              {t.planCard.hydrationInterval}
            </span>
          </div>

          {/* Row of small glass icons by hour (filling one after another on load) */}
          <div className="flex items-center justify-between gap-1 pt-1">
            {Array.from({ length: totalGlasses }).map((_, idx) => {
              const isFilled = idx < glassesFilled;
              return (
                <div
                  key={idx}
                  title={`Glass ${idx + 1}`}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isFilled
                      ? "bg-[#2F7FD1] text-[#FFFAF4] scale-100 shadow-sm"
                      : "bg-[#2F7FD1]/15 text-[#2F7FD1]/40 scale-95"
                  }`}
                >
                  <HugeiconsIcon icon={GlassWaterIcon} size={14} strokeWidth={2.2} />
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
          <div className="mt-1 pt-2 border-t border-[#F47A1F]/20 flex flex-col gap-1">
            <span className="text-[11px] font-extrabold text-[#1E2A44]">
              {t.planCard.forYouTitle}:
            </span>
            <p className="text-[11px] text-[#1E2A44] leading-relaxed">
              • <span className="font-semibold">{age}:</span> {getAgeAdvice()}
            </p>
            {occupation && occupation !== "Not specified" && (
              <p className="text-[11px] text-[#1E2A44] leading-relaxed">
                • <span className="font-semibold">{occupation}:</span> {getOccupationAdvice()}
              </p>
            )}
            {healthAdvices.map((adv, idx) => (
              <p key={idx} className="text-[11px] text-[#1E2A44] leading-relaxed">
                • <span className="font-semibold">Health:</span> {adv}
              </p>
            ))}
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
