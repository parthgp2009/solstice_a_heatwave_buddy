"use client";

import React from "react";
import { useAppState } from "@/context/AppStateContext";

export default function HowItWorksSection() {
  const { lang } = useAppState();

  const steps = [
    {
      num: "01",
      icon: "🛰️",
      titleEn: "Live Satellite Telemetry",
      titleHi: "लाइव उपग्रह डेटा",
      descEn:
        "Open-Meteo feeds pull real-time air temperature, relative humidity, wind speed, and solar UV irradiance across all Indian cities and districts without tracking your identity.",
      descHi:
        "ओपन-मेटियो उपग्रह डेटा सभी भारतीय शहरों में वास्तविक समय का तापमान, सापेक्ष आर्द्रता, हवा की गति और सौर यूवी किरणें बिना किसी व्यक्तिगत ट्रैकिंग के प्राप्त करता है।"
    },
    {
      num: "02",
      icon: "🌡️",
      titleEn: "Thermal Stress Formulation",
      titleHi: "थर्मल तनाव फॉर्मूलेशन",
      descEn:
        "Standard weather reports measure shaded air. Solstice factors in UV glare (+1 to +1.5°C) and extended sun exposure (+1 to +2°C) to calculate true occupational heat stress on your body.",
      descHi:
        "साधारण मौसम रिपोर्ट केवल छाया का तापमान बताती है। सोलस्टाइस यूवी किरणों (+1 से +1.5°C) और सीधी धूप (+1 से +2°C) को जोड़कर आपके शरीर पर पड़ने वाले वास्तविक प्रभाव की गणना करता है।"
    },
    {
      num: "03",
      icon: "🛡️",
      titleEn: "Personalized Protocol",
      titleHi: "व्यक्तिगत सुरक्षा कार्यक्रम",
      descEn:
        "Calculates your specific hydration rate (250ml every 30 mins), designates optimal early morning fieldwork windows, and mandates shade pauses during peak heat.",
      descHi:
        "आपकी आयु और कार्य के अनुसार पानी पीने की दर (प्रत्येक 30 मिनट में 250 मिली), सुबह के अनुकूल कार्य समय और दोपहर के लाल क्षेत्र में अनिवार्य विश्राम निर्धारित करता है।"
    },
    {
      num: "04",
      icon: "🚨",
      titleEn: "Clinical & Emergency Backup",
      titleHi: "आपातकालीन व चिकित्सा सहायता",
      descEn:
        "Monitors for early signs of heat exhaustion (clammy skin, dizziness, rapid pulse) with single-tap connection to national 108 ambulance dispatch and local hospital networks.",
      descHi:
        "हीट एग्जॉशन के शुरुआती लक्षणों (चक्कर आना, अत्यधिक पसीना, तेज नब्ज) की निगरानी करता है और राष्ट्रीय 108 एम्बुलेंस सेवा से तुरंत संपर्क की सुविधा देता है।"
    }
  ];

  return (
    <div className="w-full bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[26px] p-6 sm:p-10 card-shadow flex flex-col gap-8 animate-fade-rise-1">
      <div className="flex flex-col gap-2 max-w-2xl">
        <span className="text-xs font-black uppercase tracking-wider text-[#F47A1F]">
          {lang === "hi" ? "कार्यप्रणाली" : "How Solstice Works"}
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#1E2A44] tracking-tight">
          {lang === "hi"
            ? "चार चरणों में वास्तविक समय की हीट सुरक्षा"
            : "Four Scientific Steps to Heatwave Protection"}
        </h3>
        <p className="text-sm text-[#5B6577] font-medium leading-relaxed">
          {lang === "hi"
            ? "मौसम विज्ञान, बायोमेडिकल रिसर्च और राष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA) के दिशानिर्देशों का संगम।"
            : "Combining satellite meteorological telemetry, biomedical heat-stress mathematics, and NDMA occupational guidelines."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map(s => (
          <div
            key={s.num}
            className="bg-[#FAF4EC] p-5 sm:p-6 rounded-2xl border border-[#1E2A44]/10 flex flex-col justify-between gap-4 card-hover"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{s.icon}</span>
                <span className="font-mono text-xs font-black text-[#F47A1F] bg-[#FDEFE3] px-2.5 py-1 rounded-full">
                  STEP {s.num}
                </span>
              </div>
              <h4 className="font-extrabold text-base text-[#1E2A44]">
                {lang === "hi" ? s.titleHi : s.titleEn}
              </h4>
              <p className="text-xs text-[#5B6577] font-medium leading-relaxed">
                {lang === "hi" ? s.descHi : s.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
