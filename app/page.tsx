"use client";

import React from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import HeroBackground from "@/components/HeroBackground";
import LiveReadingCard from "@/components/LiveReadingCard";
import FeatureRow from "@/components/FeatureRow";
import TaglineCard from "@/components/TaglineCard";
import { useAppState } from "@/context/AppStateContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Shield01Icon,
  Sun01Icon,
  Alert02Icon,
  HelpCircleIcon
} from "@hugeicons/core-free-icons";

export default function HomePage() {
  const { t, lang } = useAppState();

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#F47A1F] selection:text-[#FFFAF4] pb-24 overflow-x-hidden bg-[#FDF3E7]">
      {/* Background with photo, sun glow, drifting haze, heat shimmer & rising specks */}
      <HeroBackground adjustedFeelsLikeTemp={40} />

      {/* Top Navigation Bar with blended Solstice Logo */}
      <TopBar />

      {/* Main Hero Container */}
      <main className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 flex flex-col gap-12">
        {/* Two-Column Hero Grid */}
        <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 lg:gap-12 items-center pt-2">
          
          {/* HERO LEFT SIDE: Headline, Subtitle, and Primary CTAs */}
          <div className="min-[900px]:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-3 max-w-2xl">
              {/* Tagline Label */}
              <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-[#F47A1F]">
                {t.tagline}
              </span>

              {/* Large Two-Line Bold Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E2A44] tracking-tight leading-[1.08]">
                <span className="block">{t.headlineLine1}</span>
                <span className="block text-[#F47A1F]">{t.headlineLine2}</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-[#5B6577] font-medium leading-relaxed max-w-xl">
                {t.supportingText}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Link
                href="/plan"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-extrabold text-sm sm:text-base bg-[#F47A1F] text-[#FFFAF4] hover:bg-[#E06912] active:scale-[0.99] transition-all shadow-md"
              >
                <span>{lang === "hi" ? "अपनी सुरक्षा योजना बनाएं" : "Build Your Safety Plan"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2.5} />
              </Link>

              <Link
                href="/weather"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm sm:text-base bg-[#FFFAF4] text-[#1E2A44] border border-[#1E2A44]/20 hover:bg-[#FBEBD9] transition-all subtle-shadow"
              >
                <span>{lang === "hi" ? "लाइव मौसम व हीट इंडेक्स" : "Check Live Weather"}</span>
              </Link>
            </div>

            {/* Quick Feature Row Highlights */}
            <div className="mt-2">
              <FeatureRow />
            </div>
          </div>

          {/* HERO RIGHT SIDE: Live Reading Card Spotlight */}
          <div className="min-[900px]:col-span-5 flex flex-col gap-4">
            <div className="relative">
              <div className="absolute -top-3 left-4 z-10 bg-[#F47A1F] text-[#FFFAF4] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                {lang === "hi" ? "लाइव मौसम मॉनिटर" : "Live Weather Station"}
              </div>
              <LiveReadingCard />
            </div>

            <div className="bg-[#FFFAF4]/90 border border-[#1E2A44]/15 rounded-[18px] p-4 flex items-center justify-between text-xs font-bold text-[#1E2A44] card-shadow">
              <span>{lang === "hi" ? "अपने शहर का 24-घंटे का हीट विवरण देखें:" : "View full 24-hour heat timeline:"}</span>
              <Link
                href="/weather"
                className="inline-flex items-center gap-1 text-[#F47A1F] hover:underline"
              >
                <span>{lang === "hi" ? "मौसम पेज खोलें" : "Explore Weather"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        </div>

        {/* Tagline Crisis Infographic Banner */}
        <div className="w-full">
          <TaglineCard />
        </div>

        {/* Multi-Page Portal Cards Grid */}
        <div className="flex flex-col gap-4 pt-4 border-t border-[#1E2A44]/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#F47A1F]">
                {lang === "hi" ? "समर्पित अनुभाग" : "Explore Solstice Sections"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A44] tracking-tight">
                {lang === "hi" ? "हर जरूरत के लिए अलग पेज" : "Dedicated Pages for Heat Protection"}
              </h2>
            </div>
            <p className="text-xs text-[#5B6577] max-w-md">
              {lang === "hi"
                ? "सभी सुविधाएं एक ही पेज पर भरने के बजाय अलग-अलग विशेष पेजों पर व्यवस्थित की गई हैं।"
                : "Organized across focused, dedicated pages so you can monitor, plan, and protect with ease."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Card 1: Safety Plan Page */}
            <Link
              href="/plan"
              className="group bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-6 card-shadow flex flex-col justify-between gap-4 hover:border-[#F47A1F] hover:-translate-y-1 transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F47A1F]/15 text-[#F47A1F] flex items-center justify-center group-hover:bg-[#F47A1F] group-hover:text-[#FFFAF4] transition-colors">
                  <HugeiconsIcon icon={Shield01Icon} size={22} strokeWidth={2.2} />
                </div>
                <h3 className="font-extrabold text-lg text-[#1E2A44]">
                  {lang === "hi" ? "व्यक्तिगत सुरक्षा योजना" : "Personal Safety Plan"}
                </h3>
                <p className="text-xs text-[#5B6577] leading-relaxed font-medium">
                  {lang === "hi"
                    ? "डिलीवरी राइडर, किसान, छात्र और वरिष्ठ नागरिकों के लिए घंटेवार कार्य समय, छांव और जलपान अनुसूची।"
                    : "Tailor hydration intervals, rest pauses, and safe outdoor hours for delivery drivers, farmers, students, and seniors."}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#F47A1F] group-hover:translate-x-1 transition-transform">
                <span>{lang === "hi" ? "योजना बनाएं" : "Build Your Plan"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2.5} />
              </div>
            </Link>

            {/* Card 2: Live Weather Page */}
            <Link
              href="/weather"
              className="group bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-6 card-shadow flex flex-col justify-between gap-4 hover:border-[#F47A1F] hover:-translate-y-1 transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#2E9E5B]/15 text-[#2E9E5B] flex items-center justify-center group-hover:bg-[#2E9E5B] group-hover:text-[#FFFAF4] transition-colors">
                  <HugeiconsIcon icon={Sun01Icon} size={22} strokeWidth={2.2} />
                </div>
                <h3 className="font-extrabold text-lg text-[#1E2A44]">
                  {lang === "hi" ? "लाइव मौसम व यूवी मॉनिटर" : "Live Weather & UV Monitor"}
                </h3>
                <p className="text-xs text-[#5B6577] leading-relaxed font-medium">
                  {lang === "hi"
                    ? "भारत के किसी भी शहर का 24-घंटे का तापमान, यूवी इंडेक्स, और समायोजित हीट स्ट्रेस ग्राफ।"
                    : "Track hourly apparent temperatures, UV radiation tiers, and 24-hour heat stress forecasts for any Indian city."}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2E9E5B] group-hover:translate-x-1 transition-transform">
                <span>{lang === "hi" ? "लाइव मौसम देखें" : "View Live Weather"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2.5} />
              </div>
            </Link>

            {/* Card 3: Crisis Stats & FAQs */}
            <Link
              href="/about"
              className="group bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-6 card-shadow flex flex-col justify-between gap-4 hover:border-[#D92D20] hover:-translate-y-1 transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#D92D20]/15 text-[#D92D20] flex items-center justify-center group-hover:bg-[#D92D20] group-hover:text-[#FFFAF4] transition-colors">
                  <HugeiconsIcon icon={Alert02Icon} size={22} strokeWidth={2.2} />
                </div>
                <h3 className="font-extrabold text-lg text-[#1E2A44]">
                  {lang === "hi" ? "2024 लू आंकड़े व मिशन" : "2024 Toll Stats & Mission"}
                </h3>
                <p className="text-xs text-[#5B6577] leading-relaxed font-medium">
                  {lang === "hi"
                    ? "सरकारी स्वास्थ्य निगरानी के 48,000+ मामलों की रिपोर्ट और सोलस्टाइस का जीवनरक्षक मिशन।"
                    : "Explore government surveillance data on heatwave fatalities and why microclimate adjustments save lives."}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#D92D20] group-hover:translate-x-1 transition-transform">
                <span>{lang === "hi" ? "आंकड़े पढ़ें" : "Read Full Report"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2.5} />
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Multi-Page Navigation Bar */}
        <div className="pt-6 border-t border-[#1E2A44]/10 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#5B6577]">
          <Link href="/" className="text-[#F47A1F]">Home</Link>
          <span>•</span>
          <Link href="/plan" className="hover:text-[#F47A1F] transition-colors">Safety Plan</Link>
          <span>•</span>
          <Link href="/weather" className="hover:text-[#F47A1F] transition-colors">Live Weather</Link>
          <span>•</span>
          <Link href="/about" className="hover:text-[#F47A1F] transition-colors">Crisis Stats & About</Link>
          <span>•</span>
          <Link href="/faqs" className="hover:text-[#F47A1F] transition-colors">FAQs</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-[#F47A1F] transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#F47A1F] transition-colors">Terms of Service</Link>
        </div>
      </main>
    </div>
  );
}
