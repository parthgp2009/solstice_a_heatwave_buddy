"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import BottomDisclaimerStrip from "@/components/BottomDisclaimerStrip";
import { AppStateProvider, useAppState } from "@/context/AppStateContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Shield01Icon,
  Sun01Icon,
  Alert02Icon,
  ArrowRight01Icon,
  Call02Icon
} from "@hugeicons/core-free-icons";

function AboutContent() {
  const { lang, t } = useAppState();

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#F47A1F] selection:text-[#FFFAF4] pb-24 bg-[#FDF3E7]">
      <TopBar />

      <main className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
        {/* Header Title */}
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#F47A1F]">
            {lang === "hi" ? "हमारे बारे में और हमारा मिशन" : "About Solstice & Our Mission"}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E2A44] tracking-tight leading-tight">
            {lang === "hi"
              ? "भीषण गर्मी में हर जीवन की रक्षा"
              : "Protecting Lives During India's Extreme Heatwaves"}
          </h1>
          <p className="text-sm sm:text-base text-[#5B6577] font-medium leading-relaxed max-w-3xl">
            {lang === "hi"
              ? "सोलस्टाइस (लू साथी) वास्तविक समय के मौसम, सटीक हीट इंडेक्स और व्यक्तिगत सुरक्षा योजनाओं के साथ भारत के नागरिकों, विशेष रूप से धूप में काम करने वाले श्रमिकों की सुरक्षा के लिए प्रतिबद्ध है।"
              : "Solstice (Heatwave Buddy) is designed to provide real-time meteorological insights, adjusted feels-like heat stress metrics, and tailored protective plans for delivery riders, farmers, students, and vulnerable citizens across India."}
          </p>
        </div>

        {/* Infographic Spotlight: tagline.jpeg */}
        <div className="bg-[#FFFAF4] border border-[#D92D20]/25 rounded-[22px] p-6 sm:p-8 card-shadow grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 relative w-full h-[420px] rounded-xl overflow-hidden shadow-md border border-[#D92D20]/20">
            <Image
              src="/tagline.jpeg"
              alt="India Heat Toll Statistics 2024"
              fill
              className="object-contain bg-[#F8F3E8]"
              priority
            />
          </div>

          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEA] text-[#D92D20] text-xs font-extrabold w-fit">
              <HugeiconsIcon icon={Alert02Icon} size={14} strokeWidth={2.5} />
              <span>{lang === "hi" ? "आधिकारिक स्वास्थ्य आंकड़े (2024)" : "Government Heat Surveillance Data"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A44] leading-snug">
              {lang === "hi"
                ? "48,000+ संदिग्ध हीटस्ट्रोक मामले और 161 पुष्ट मौतें"
                : "Over 48,000 Suspected Heatstroke Cases and 161 Confirmed Deaths"}
            </h2>

            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "2024 की भीषण गर्मी में भारत के कई राज्यों में तापमान 45°C से 50°C तक पहुंच गया था। सरकारी निगरानी आंकड़ों के अनुसार हजारों लोग हीटस्ट्रोक और गंभीर निर्जलीकरण के शिकार हुए। समय पर सटीक चेतावनी और उचित कार्य समय का पालन ही एकमात्र जीवनरक्षक उपाय है।"
                : "During the record summer heatwaves of 2024, temperatures crossed 45°C to 50°C across northern, central, and western India. Government surveillance recorded over 48,000 suspected heatstroke cases and 161 confirmed fatalities. Understanding micro-climate heat stress and scheduling outdoor exertion outside danger hours is critical to saving lives."}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#FBEBD9] p-3 rounded-xl border border-[#1E2A44]/10">
                <span className="text-xl sm:text-2xl font-extrabold text-[#D92D20] block">
                  48,000+
                </span>
                <span className="text-xs font-semibold text-[#1E2A44]">
                  {lang === "hi" ? "संदिग्ध मामले" : "Suspected Cases"}
                </span>
              </div>
              <div className="bg-[#FBEBD9] p-3 rounded-xl border border-[#1E2A44]/10">
                <span className="text-xl sm:text-2xl font-extrabold text-[#1E2A44] block">
                  161
                </span>
                <span className="text-xs font-semibold text-[#1E2A44]">
                  {lang === "hi" ? "पुष्ट मौतें" : "Confirmed Deaths"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/plan"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F47A1F] text-[#FFFAF4] text-xs font-extrabold hover:bg-[#E06912] transition-colors shadow-sm"
              >
                <span>{lang === "hi" ? "अपनी सुरक्षा योजना बनाएं" : "Create Your Safety Plan Now"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F47A1F]/15 text-[#F47A1F] flex items-center justify-center">
              <HugeiconsIcon icon={Sun01Icon} size={20} strokeWidth={2.2} />
            </div>
            <h3 className="font-extrabold text-base text-[#1E2A44]">
              {lang === "hi" ? "समायोजित हीट मॉडल" : "Scientific Heat Model"}
            </h3>
            <p className="text-xs text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "ओपन-मेटियो मौसम पूर्वानुमान के साथ यूवी सूचकांक और धूप में रहने के समय का वैज्ञानिक संयोजन।"
                : "We go beyond raw thermometers. Our pure heat model factors in UV index intensity (+1 to +1.5) and hours in direct sunlight (+1 to +2)."}
            </p>
          </div>

          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2E9E5B]/15 text-[#2E9E5B] flex items-center justify-center">
              <HugeiconsIcon icon={Shield01Icon} size={20} strokeWidth={2.2} />
            </div>
            <h3 className="font-extrabold text-base text-[#1E2A44]">
              {lang === "hi" ? "पूर्ण गोपनीयता" : "Zero-Storage Privacy"}
            </h3>
            <p className="text-xs text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "जीपीएस निर्देशांक कभी भी सर्वर पर सेव नहीं होते। स्वास्थ्य इतिहास केवल आपके अपने फोन पर रहता है।"
                : "Exact coordinates are evaluated in-memory once. Age, occupation, and health notes are never logged or stored on remote servers."}
            </p>
          </div>

          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D92D20]/15 text-[#D92D20] flex items-center justify-center">
              <HugeiconsIcon icon={Call02Icon} size={20} strokeWidth={2.2} />
            </div>
            <h3 className="font-extrabold text-base text-[#1E2A44]">
              {lang === "hi" ? "आपातकालीन 108 सहायता" : "108 Emergency First Aid"}
            </h3>
            <p className="text-xs text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "गंभीर लक्षणों के लिए तुरंत 108 एम्बुलेंस डायल करने की सीधी सुविधा हमेशा मौजूद है।"
                : "Direct 1-tap dialing for India's 108 emergency ambulance and immediate protocol steps for heat exhaustion."}
            </p>
          </div>
        </div>
      </main>

      <BottomDisclaimerStrip />
    </div>
  );
}

export default function AboutPage() {
  return (
    <AppStateProvider>
      <AboutContent />
    </AppStateProvider>
  );
}
