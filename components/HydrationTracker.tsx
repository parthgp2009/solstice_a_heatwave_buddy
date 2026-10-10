"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import AudioListenButton from "@/components/AudioListenButton";

export default function HydrationTracker() {
  const { lang, occupation, sunHours } = useAppState();

  // Compute recommended target glasses (250ml each)
  const targetGlasses = sunHours === "More than 6 hours" ? 16 : sunHours === "2 to 6 hours" ? 14 : 10;
  const targetLiters = (targetGlasses * 0.25).toFixed(1);

  const [glassesConsumed, setGlassesConsumed] = useState<number>(5);

  const consumedLiters = (glassesConsumed * 0.25).toFixed(2);
  const percentComplete = Math.min(100, Math.round((glassesConsumed / targetGlasses) * 100));

  const addGlass = () => {
    if (glassesConsumed < targetGlasses + 4) {
      setGlassesConsumed(prev => prev + 1);
    }
  };

  const removeGlass = () => {
    if (glassesConsumed > 0) {
      setGlassesConsumed(prev => prev - 1);
    }
  };

  const hydrationSpeechText =
    lang === "hi"
      ? `दैनिक जलपान लक्ष्य: ${targetLiters} लीटर। अब तक आपने ${consumedLiters} लीटर पानी पिया है। हर 30 मिनट में 250 मिलीलीटर पानी पिएं। यदि आपको अत्यधिक पसीना आ रहा है तो 2 लीटर के बाद ओआरएस इलेक्ट्रोलाइट घोल अवश्य लें।`
      : `Daily hydration goal for your profile is ${targetLiters} liters. You have logged ${consumedLiters} liters so far. Maintain 250ml every 30 minutes in the heat. Add an ORS electrolyte packet after heavy perspiration.`;

  return (
    <div className="w-full bg-[#FFFAF4] border border-[#2F7FD1]/25 rounded-[26px] p-6 sm:p-8 card-shadow flex flex-col gap-6 animate-fade-rise-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2A44]/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3FC] text-[#2F7FD1] flex items-center justify-center text-2xl shadow-xs">
            💧
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#2F7FD1]">
              {lang === "hi" ? "दैनिक जल संतुलन" : "Daily Water & Electrolyte Monitor"}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#1E2A44]">
              {lang === "hi" ? "इंटरएक्टिव हाइड्रेशन ट्रैकर" : "Occupational Hydration Tracker"}
            </h3>
          </div>
        </div>

        {/* Audio speech button with Polly / Web Speech fallback */}
        <AudioListenButton textToSpeak={hydrationSpeechText} lang={lang} />
      </div>

      {/* Stats Summary & Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Consumed */}
        <div className="bg-[#FAF4EC] p-4 rounded-2xl border border-[#1E2A44]/10 flex flex-col">
          <span className="text-xs font-bold text-[#5B6577]">
            {lang === "hi" ? "अब तक पिया गया पानी" : "Water Logged"}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#1E2A44] mt-1">
            {consumedLiters} L
          </span>
          <span className="text-[11px] text-[#2F7FD1] font-bold mt-0.5">
            {glassesConsumed} {lang === "hi" ? "गिलास" : "glasses"} (250ml)
          </span>
        </div>

        {/* Target */}
        <div className="bg-[#FAF4EC] p-4 rounded-2xl border border-[#1E2A44]/10 flex flex-col">
          <span className="text-xs font-bold text-[#5B6577]">
            {lang === "hi" ? "अनुशंसित लक्ष्य" : "Target For Your Role"}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#1E2A44] mt-1">
            {targetLiters} L
          </span>
          <span className="text-[11px] text-[#5B6577] font-semibold mt-0.5">
            {occupation || "Active Worker"} ({sunHours})
          </span>
        </div>

        {/* ORS Alert */}
        <div className="bg-[#FDEFE3] p-4 rounded-2xl border border-[#F47A1F]/30 flex flex-col">
          <span className="text-xs font-bold text-[#F47A1F]">
            {lang === "hi" ? "इलेक्ट्रोलाइट्स / ओआरएस" : "ORS Electrolytes"}
          </span>
          <span className="text-sm font-extrabold text-[#1E2A44] mt-1">
            {glassesConsumed >= 8
              ? lang === "hi"
                ? "ओआरएस लेने का समय!"
                : "Time for 1 ORS Packet!"
              : lang === "hi"
              ? "सादा पानी पर्याप्त है"
              : "Plain Water Sufficient"}
          </span>
          <span className="text-[11px] text-[#5B6577] font-medium mt-0.5">
            {glassesConsumed >= 8 ? "Sweat sodium replenishment active" : "Add ORS after 2L of sweating"}
          </span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs font-bold text-[#1E2A44]">
          <span>{lang === "hi" ? "दैनिक प्रगति" : "Daily Hydration Progress"}</span>
          <span className="text-[#2F7FD1] font-black">{percentComplete}%</span>
        </div>
        <div className="w-full h-3.5 bg-[#FAF4EC] rounded-full overflow-hidden border border-[#1E2A44]/10">
          <div
            className="h-full bg-gradient-to-r from-[#2F7FD1] to-[#2E9E5B] transition-all duration-300 rounded-full"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Interactive Glass Icons Grid */}
      <div className="flex flex-col gap-2 pt-2">
        <span className="text-xs font-bold text-[#5B6577]">
          {lang === "hi" ? "गिलास पर टैप करके तुरंत पानी दर्ज करें:" : "Tap a glass to log intake (250ml each):"}
        </span>
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {Array.from({ length: targetGlasses }).map((_, idx) => {
            const isFilled = idx < glassesConsumed;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setGlassesConsumed(idx + 1)}
                className={`w-11 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-black transition-all cursor-pointer border ${
                  isFilled
                    ? "bg-[#2F7FD1] text-white border-[#2F7FD1] shadow-xs scale-102"
                    : "bg-[#FAF4EC] text-[#5B6577] border-[#1E2A44]/15 hover:border-[#2F7FD1] hover:text-[#2F7FD1]"
                }`}
                title={`Glass ${idx + 1} (250ml)`}
              >
                <span className="text-sm">{isFilled ? "🥛" : "🥤"}</span>
                <span className="text-[9px] mt-0.5">{idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick +/- Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E2A44]/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={removeGlass}
            disabled={glassesConsumed === 0}
            className="px-3.5 py-1.5 rounded-xl border border-[#1E2A44]/20 text-xs font-bold text-[#1E2A44] hover:bg-[#FAF4EC] disabled:opacity-40 cursor-pointer"
          >
            - 1 {lang === "hi" ? "गिलास" : "Glass"}
          </button>
          <button
            type="button"
            onClick={addGlass}
            className="px-4 py-1.5 rounded-xl bg-[#2F7FD1] text-white text-xs font-black hover:bg-[#2568AC] shadow-xs cursor-pointer"
          >
            + 1 {lang === "hi" ? "गिलास (250ml)" : "Glass (250ml)"}
          </button>
        </div>

        <span className="text-[11px] text-[#5B6577] font-semibold">
          {lang === "hi" ? "प्रत्येक 30 मिनट में 1 गिलास पिएं" : "Paced interval: 1 glass every 30 mins"}
        </span>
      </div>
    </div>
  );
}
