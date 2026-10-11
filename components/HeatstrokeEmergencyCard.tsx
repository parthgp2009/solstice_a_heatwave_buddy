"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, Call02Icon, FirstAidKitIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useAppState } from "@/context/AppStateContext";

interface SymptomItem {
  id: string;
  labelEn: string;
  labelHi: string;
}

const EMERGENCY_SYMPTOMS: SymptomItem[] = [
  {
    id: "high_temp",
    labelEn: "Very high body temperature or hot dry skin",
    labelHi: "शरीर का बहुत तेज तापमान या गर्म, सूखी त्वचा"
  },
  {
    id: "confusion",
    labelEn: "Confusion or slurred speech",
    labelHi: "भ्रम की स्थिति या लड़खड़ाती बोली"
  },
  {
    id: "fainting",
    labelEn: "Fainting or unconsciousness",
    labelHi: "बेहोशी या अचेत होना"
  },
  {
    id: "seizure",
    labelEn: "Seizure",
    labelHi: "दौरे पड़ना (दौरा)"
  },
  {
    id: "no_sweating",
    labelEn: "No sweating despite heat",
    labelHi: "गर्मी के बावजूद पसीना न आना"
  },
  {
    id: "rapid_pulse",
    labelEn: "Rapid weak pulse",
    labelHi: "तेज और कमजोर नाड़ी (धड़कन)"
  },
  {
    id: "vomiting",
    labelEn: "Vomiting that does not stop",
    labelHi: "उल्टी जो बंद न हो रही हो"
  }
];

/**
 * Heatstroke Emergency Check Card (Step 4A).
 * 
 * Clinical Rule-Based Triage:
 * - In-memory local state only (Zero-Storage Guarantee).
 * - Immediate 108 Emergency Protocol when any severe sign is checked.
 * - Gentle heat exhaustion guidance when none are checked.
 */
export default function HeatstrokeEmergencyCard() {
  const { lang } = useAppState();
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const toggleSymptom = (id: string) => {
    setCheckedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const clearAll = () => setCheckedIds([]);

  const isEmergency = checkedIds.length > 0;

  return (
    <div
      id="emergency-check-card"
      className={`w-full bg-[#FFFAF4] border rounded-[22px] p-5 sm:p-7 card-shadow transition-all ${
        isEmergency
          ? "border-[#D92D20]/50 ring-2 ring-[#D92D20]/20"
          : "border-[#1E2A44]/15"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1E2A44]/10">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              isEmergency ? "bg-[#D92D20] text-[#FFFAF4]" : "bg-[#FBEBD9] text-[#F47A1F]"
            }`}
          >
            <HugeiconsIcon icon={FirstAidKitIcon} size={22} strokeWidth={2.4} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#1E2A44] leading-tight">
              {lang === "hi" ? "हीटस्ट्रोक आपातकालीन जांच" : "Heatstroke Emergency Check"}
            </h2>
            <p className="text-xs text-[#5B6577] font-medium mt-0.5">
              {lang === "hi"
                ? "यदि किसी व्यक्ति में नीचे दिए गए लक्षण दिखें तो तुरंत जांचें:"
                : "Check any warning signs currently observed in yourself or someone else:"}
            </p>
          </div>
        </div>

        {checkedIds.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-bold text-[#5B6577] hover:text-[#1E2A44] underline cursor-pointer shrink-0"
          >
            {lang === "hi" ? "रीसेट करें" : "Clear all"}
          </button>
        )}
      </div>

      {/* Checklist Grid */}
      <div className="py-4 flex flex-col gap-2.5">
        <span className="text-[11px] font-extrabold text-[#1E2A44] uppercase tracking-wider">
          {lang === "hi" ? "खतरे के लक्षण (टिक करें):" : "Warning Signs (Tick any that apply):"}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EMERGENCY_SYMPTOMS.map(symptom => {
            const isChecked = checkedIds.includes(symptom.id);
            return (
              <label
                key={symptom.id}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all select-none ${
                  isChecked
                    ? "bg-[#FDECEA] border-[#D92D20] text-[#D92D20] shadow-xs"
                    : "bg-[#FFFAF4] border-[#1E2A44]/15 text-[#1E2A44] hover:bg-[#FBEBD9]/60"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSymptom(symptom.id)}
                  className="mt-0.5 rounded text-[#D92D20] focus:ring-[#D92D20] accent-[#D92D20] cursor-pointer"
                />
                <span className="leading-snug">
                  {lang === "hi" ? symptom.labelHi : symptom.labelEn}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Outcome Section: Red Medical Emergency Banner OR Green Heat Exhaustion Advice */}
      <div className="pt-2">
        {isEmergency ? (
          /* RED MEDICAL EMERGENCY BANNER */
          <div className="bg-[#FDECEA] border border-[#D92D20]/40 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#D92D20] text-[#FFFAF4] shrink-0 mt-0.5">
                <HugeiconsIcon icon={Alert02Icon} size={22} strokeWidth={2.4} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm sm:text-base font-black text-[#D92D20] uppercase tracking-tight">
                  {lang === "hi"
                    ? "यह एक मेडिकल इमरजेंसी हो सकती है। तुरंत 108 पर कॉल करें।"
                    : "This may be a medical emergency. Call 108 now."}
                </h3>
                <p className="text-xs text-[#1E2A44] font-medium leading-relaxed">
                  {lang === "hi"
                    ? "हीटस्ट्रोक जानलेवा हो सकता है। तुरंत एम्बुलेंस बुलाएं और सहायता आने तक प्राथमिक उपचार शुरू करें:"
                    : "Heatstroke can be fatal within minutes. Call emergency services immediately and begin active cooling while waiting:"}
                </p>
              </div>
            </div>

            {/* Direct Tap-to-Call 108 Button */}
            <a
              href="tel:108"
              className="w-full py-3 px-4 rounded-xl font-black text-sm bg-[#D92D20] text-[#FFFAF4] hover:bg-[#B82518] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <HugeiconsIcon icon={Call02Icon} size={18} strokeWidth={2.4} />
              <span>{lang === "hi" ? "तुरंत 108 एम्बुलेंस डायल करें" : "Call 108 Ambulance Now"}</span>
            </a>

            {/* Immediate First Aid Steps */}
            <div className="bg-[#FFFAF4] border border-[#D92D20]/25 rounded-xl p-3.5 flex flex-col gap-2">
              <span className="text-[11px] font-extrabold text-[#D92D20] uppercase tracking-wider">
                {lang === "hi" ? "एम्बुलेंस आने तक प्राथमिक उपचार के कदम:" : "First Aid Steps While Waiting for 108:"}
              </span>
              <ul className="text-xs text-[#1E2A44] font-medium space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>
                  {lang === "hi"
                    ? "छाया या ठंडी जगह पर ले जाएं।"
                    : "Move to shade or a cool place."}
                </li>
                <li>
                  {lang === "hi" ? "कपड़े ढीले करें।" : "Loosen clothing."}
                </li>
                <li>
                  {lang === "hi"
                    ? "गीले कपड़े या पानी से त्वचा को ठंडा करें।"
                    : "Cool the skin with wet cloths or water."}
                </li>
                <li>
                  {lang === "hi" ? "व्यक्ति को पंखा झलें।" : "Fan the person."}
                </li>
                <li>
                  {lang === "hi"
                    ? "केवल तभी घूंट-घूंट पानी दें जब व्यक्ति पूरी तरह होश में हो।"
                    : "Give sips of water only if fully awake."}
                </li>
              </ul>

              {/* Strict Critical Caution */}
              <div className="mt-1 p-2 bg-[#FDECEA] border-l-4 border-[#D92D20] rounded-r-lg text-xs font-bold text-[#D92D20] leading-snug">
                {lang === "hi"
                  ? "⚠️ जो व्यक्ति भ्रमित या बेहोश हो, उसे बिल्कुल पानी न दें।"
                  : "⚠️ Do not give water to someone who is confused or unconscious."}
              </div>
            </div>
          </div>
        ) : (
          /* LIGHTER HEAT EXHAUSTION ADVICE (WHEN NONE TICKED) */
          <div className="bg-[#EAF6EE] border border-[#2E9E5B]/30 rounded-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-[#2E9E5B]">
              <HugeiconsIcon icon={Tick02Icon} size={18} strokeWidth={2.4} />
              <h3 className="text-xs sm:text-sm font-extrabold text-[#1E2A44]">
                {lang === "hi"
                  ? "कोई गंभीर लक्षण नहीं चुना गया — हीट एग्जॉशन (थकान) सलाह:"
                  : "No severe signs selected — Heat Exhaustion Advice:"}
              </h3>
            </div>

            <p className="text-xs text-[#5B6577] font-medium leading-relaxed">
              {lang === "hi"
                ? "यदि गर्मी से थकान या कमजोरी महसूस हो रही हो, तो इन चरणों का पालन करें:"
                : "If feeling unwell or tired in the heat, follow these steps:"}
            </p>

            <ul className="text-xs text-[#1E2A44] font-semibold space-y-1 list-disc pl-4 leading-relaxed">
              <li>{lang === "hi" ? "छाया में आराम करें।" : "Rest in shade."}</li>
              <li>{lang === "hi" ? "पानी या ओआरएस (ORS) के घूंट पिएं।" : "Sip water or ORS."}</li>
              <li>{lang === "hi" ? "त्वचा को ठंडा करें।" : "Cool the skin."}</li>
              <li>
                {lang === "hi"
                  ? "यदि 30 मिनट में सुधार न हो या स्थिति बिगड़े तो 108 पर कॉल करें।"
                  : "Call 108 if not better in 30 minutes or if it gets worse."}
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mandatory Disclaimer Footer & Zero-Storage Notice */}
      <div className="mt-4 pt-3 border-t border-[#1E2A44]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#5B6577]">
        <span className="font-semibold italic">
          {lang === "hi"
            ? "⚠️ यह सामान्य मार्गदर्शन है, चिकित्सकीय निदान नहीं।"
            : "⚠️ This is general guidance, not a medical diagnosis."}
        </span>
        <span className="text-[10px] text-[#5B6577]/80">
          {lang === "hi" ? "🔒 कोई डेटा सहेजा नहीं जाता" : "🔒 Zero data stored"}
        </span>
      </div>
    </div>
  );
}
