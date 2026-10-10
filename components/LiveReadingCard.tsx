"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sun01Icon,
  Location01Icon,
  Alert02Icon,
  ArrowDown01Icon
} from "@hugeicons/core-free-icons";
import { useAppState } from "@/context/AppStateContext";
import {
  adjustedFeelsLikeForHour,
  RiskLevel,
  isVulnerableUser,
  DEFAULT_HOURLY_APPARENT_TEMP,
  DEFAULT_HOURLY_UV_INDEX
} from "@/lib/heatModel";

const subscribeReducedMotion = (callback: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getReducedMotionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

export default function LiveReadingCard() {
  const {
    city,
    customCity,
    sunHours,
    selectedHour,
    setSelectedHour,
    t,
    age,
    healthHistory
  } = useAppState();

  const [expandedHow, setExpandedHow] = useState(false);
  const [animatedTemp, setAnimatedTemp] = useState<number>(25);
  const [needleAngle, setNeedleAngle] = useState<number>(-180);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);

  const displayCity = customCity || (city === "OTHER_SEARCH" ? "Delhi" : city);

  const isVulnerable = isVulnerableUser(age, healthHistory);

  // Compute live readings for current selectedHour
  const reading = adjustedFeelsLikeForHour(
    selectedHour,
    DEFAULT_HOURLY_APPARENT_TEMP,
    DEFAULT_HOURLY_UV_INDEX,
    sunHours,
    isVulnerable
  );
  const targetAdjusted = reading.adjusted;

  // On-load count up and needle sweep
  useEffect(() => {
    if (reducedMotion) return;

    const start = 25;
    const end = targetAdjusted;
    const duration = 1000;
    const startTime = performance.now();
    let animId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = start + (end - start) * ease;
      setAnimatedTemp(Math.round(currentVal * 10) / 10);

      const needleProg = Math.max(0, Math.min(1, (currentVal - 25) / 25));
      setNeedleAngle(-180 + needleProg * 180);

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [targetAdjusted, reducedMotion]);

  const displayTemp = reducedMotion ? targetAdjusted : animatedTemp;
  const staticNeedleProg = Math.max(0, Math.min(1, (targetAdjusted - 25) / 25));
  const displayNeedleAngle = reducedMotion ? -180 + staticNeedleProg * 180 : needleAngle;

  // Risk styling
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case "Low":
        return { bg: "bg-[#EAF6EE]", text: "text-[#2E9E5B]", border: "border-[#2E9E5B]/30" };
      case "Caution":
        return { bg: "bg-[#FDF3E7]", text: "text-[#D98200]", border: "border-[#F5B83D]/40" };
      case "Danger":
        return { bg: "bg-[#FDEFE3]", text: "text-[#F47A1F]", border: "border-[#F47A1F]/30" };
      case "Extreme":
      default:
        return { bg: "bg-[#FDECEA]", text: "text-[#D92D20]", border: "border-[#D92D20]/30" };
    }
  };

  const riskStyle = getRiskBadge(reading.riskLevel);

  // Hour label format (e.g. 14 -> 2:00 PM)
  const formatHour = (h: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const d = h % 12 === 0 ? 12 : h % 12;
    return `${d}:00 ${ampm}`;
  };

  return (
    <div className="w-full bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-5 sm:p-6 card-shadow animate-fade-rise-1">
      {/* Top Header: Sun Icon, City, and Live Pulsing Dot */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2A44]/10">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1E2A44]">
          <div className="w-6 h-6 rounded-full bg-[#F47A1F]/15 text-[#F47A1F] flex items-center justify-center">
            <HugeiconsIcon icon={Sun01Icon} size={14} strokeWidth={2.2} />
          </div>
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={Location01Icon} size={13} strokeWidth={2.2} className="text-[#5B6577]" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">{displayCity}</span>
          </div>
        </div>

        {/* Live indicator with pulsing dot */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#EAF6EE] text-[#2E9E5B] border border-[#2E9E5B]/25 rounded-full text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#2E9E5B] animate-pulse-dot" />
          <span>{t.liveCard.liveNow}</span>
        </div>
      </div>

      {/* Main Stats Row: Temperature on left, Semicircle Gauge on right */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
        {/* Left: Big adjusted temperature and breakdown line */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1E2A44] leading-none">
              {displayTemp.toFixed(1)}°C
            </span>
            {/* UV Chip */}
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#FBEBD9] text-[#1E2A44] border border-[#1E2A44]/10">
              UV {reading.uv} · {reading.uvLabel}
            </span>
          </div>

          <span className="text-xs font-bold text-[#5B6577] mt-1">
            {t.liveCard.adjustedLabel}
          </span>

          {/* Breakdown line */}
          <div className="text-[11px] font-medium text-[#1E2A44] mt-1 bg-[#FBEBD9]/60 px-2 py-1 rounded-md">
            {t.liveCard.breakdownPrefix} {reading.rawFeelsLike}°C, UV +{reading.uvOff}, Sun +{reading.expOff} ={" "}
            <span className="font-bold">{reading.adjusted}°C adjusted</span>
            {isVulnerable && (
              <span className="text-[#D92D20] font-bold ml-1">
                · Vulnerable tier (+1)
              </span>
            )}
          </div>
        </div>

        {/* Right: Semicircle SVG Gauge with needle & risk badge */}
        <div className="flex flex-col items-center shrink-0 self-center sm:self-auto">
          <div className="relative w-28 h-16 flex items-end justify-center">
            <svg viewBox="0 0 100 55" className="w-28 h-16 overflow-visible">
              <defs>
                {/* Arc gradient from yellow to danger red */}
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2E9E5B" />
                  <stop offset="35%" stopColor="#F5B83D" />
                  <stop offset="70%" stopColor="#F47A1F" />
                  <stop offset="100%" stopColor="#D92D20" />
                </linearGradient>
              </defs>

              {/* Background track */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#FBEBD9"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Colored gauge arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Needle pivot circle */}
              <circle cx="50" cy="50" r="4.5" fill="#1E2A44" />

              {/* Needle pointer */}
              <g
                style={{
                  transformOrigin: "50px 50px",
                  transform: `rotate(${displayNeedleAngle + 90}deg)`,
                  transition: reducedMotion ? "none" : "transform 0.15s ease-out"
                }}
              >
                <path d="M 48 50 L 50 16 L 52 50 Z" fill="#1E2A44" />
              </g>
            </svg>
          </div>

          {/* Risk Level Badge */}
          <div
            className={`mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border}`}
          >
            <HugeiconsIcon icon={Alert02Icon} size={12} strokeWidth={2.4} />
            <span>{reading.riskLevel}</span>
            {isVulnerable && (
              <span className="text-[10px] opacity-85 font-black ml-0.5 text-[#D92D20]">
                (+1 Strict)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* How we calculate this expander */}
      <div className="pt-2 border-t border-[#1E2A44]/10">
        <button
          type="button"
          onClick={() => setExpandedHow(prev => !prev)}
          className="text-[11px] font-bold text-[#F47A1F] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{t.liveCard.howWeCalc}</span>
          <span
            className={`transform transition-transform duration-200 ${
              expandedHow ? "rotate-180" : ""
            }`}
          >
            <HugeiconsIcon icon={ArrowDown01Icon} size={12} strokeWidth={2.5} />
          </span>
        </button>

        {expandedHow && (
          <p className="text-[11px] text-[#5B6577] mt-1.5 leading-relaxed bg-[#FBEBD9]/70 p-2.5 rounded-xl font-medium">
            {t.liveCard.howWeCalcBody}
          </p>
        )}
      </div>

      {/* Draggable Hour Control Under the Gauge */}
      <div className="mt-3 pt-3 border-t border-[#1E2A44]/10 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#1E2A44]">
          <span>{t.liveCard.selectedHour}:</span>
          <span className="px-2 py-0.5 rounded bg-[#FBEBD9] text-[#F47A1F]">
            {formatHour(selectedHour)} ({selectedHour}:00)
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={23}
          value={selectedHour}
          onChange={e => setSelectedHour(Number(e.target.value))}
          aria-label="Select hour of the day"
          className="w-full accent-[#F47A1F] cursor-pointer h-2 bg-[#FBEBD9] rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-[#5B6577] font-semibold px-0.5">
          <span>00:00 (Cool)</span>
          <span>14:00 (Peak Heat)</span>
          <span>23:00 (Night)</span>
        </div>
      </div>
    </div>
  );
}
