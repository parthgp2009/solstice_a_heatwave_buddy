"use client";

import React from "react";
import TopBar from "@/components/TopBar";
import HeroBackground from "@/components/HeroBackground";
import PlanBuilderCard from "@/components/PlanBuilderCard";
import LiveReadingCard from "@/components/LiveReadingCard";
import SafetyPlanCard from "@/components/SafetyPlanCard";
import FeatureRow from "@/components/FeatureRow";
import BottomDisclaimerStrip from "@/components/BottomDisclaimerStrip";
import InfoModals from "@/components/InfoModals";
import { AppStateProvider, useAppState } from "@/context/AppStateContext";

function HeroContent() {
  const { t, setActiveModal } = useAppState();

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#F47A1F] selection:text-[#FFFAF4] pb-24 overflow-x-hidden">
      {/* Background with hero photo, sun glow, haze, heat shimmer, rising specks & cream swoosh */}
      <HeroBackground adjustedFeelsLikeTemp={40} />

      {/* Top Navigation Bar */}
      <TopBar />

      {/* Main Hero Container */}
      <main className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* HERO LEFT SIDE (col-span-7 above 900px) */}
          <div className="min-[900px]:col-span-7 flex flex-col gap-6">
            {/* Headline Section */}
            <div className="flex flex-col gap-2.5 max-w-2xl">
              {/* Small uppercase orange label */}
              <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-[#F47A1F]">
                {t.tagline}
              </span>

              {/* Very large two-line bold headline in dark navy */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E2A44] tracking-tight leading-[1.08]">
                <span className="block">{t.headlineLine1}</span>
                <span className="block text-[#F47A1F]">{t.headlineLine2}</span>
              </h1>

              {/* Supporting text */}
              <p className="text-sm sm:text-base text-[#5B6577] font-medium leading-relaxed max-w-xl">
                {t.supportingText}
              </p>
            </div>

            {/* Rounded Plan Builder Card */}
            <PlanBuilderCard />

            {/* Feature Row on Desktop (Under plan builder or below hero) */}
            <div className="hidden min-[900px]:block mt-2">
              <FeatureRow />
            </div>
          </div>

          {/* HERO RIGHT SIDE (col-span-5 above 900px) */}
          <div className="min-[900px]:col-span-5 flex flex-col gap-6">
            {/* Card 1: Floating Live Reading Card */}
            <LiveReadingCard />

            {/* Card 2: Floating Safety Plan Card (Phone style) */}
            <SafetyPlanCard />

            {/* Feature Row on Mobile (Stacked after right-side cards under 900px) */}
            <div className="block min-[900px]:hidden mt-2">
              <FeatureRow />
            </div>
          </div>
        </div>

        {/* Quick Footer Links for Modals */}
        <div className="mt-8 pt-6 border-t border-[#1E2A44]/10 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#5B6577]">
          <button
            type="button"
            onClick={() => setActiveModal("privacy")}
            className="hover:text-[#F47A1F] cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setActiveModal("terms")}
            className="hover:text-[#F47A1F] cursor-pointer"
          >
            Terms of Service
          </button>
        </div>
      </main>

      {/* Slim Fixed Bottom Disclaimer Strip in Navy */}
      <BottomDisclaimerStrip />

      {/* Modals */}
      <InfoModals />
    </div>
  );
}

export default function Home() {
  return (
    <AppStateProvider>
      <HeroContent />
    </AppStateProvider>
  );
}
