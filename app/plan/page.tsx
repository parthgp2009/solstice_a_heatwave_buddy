"use client";

import React from "react";
import TopBar from "@/components/TopBar";
import PlanBuilderCard from "@/components/PlanBuilderCard";
import LiveReadingCard from "@/components/LiveReadingCard";
import SafetyPlanCard from "@/components/SafetyPlanCard";
import WorkRestCard from "@/components/WorkRestCard";
import HeatstrokeEmergencyCard from "@/components/HeatstrokeEmergencyCard";
import FeatureRow from "@/components/FeatureRow";
import { useAppState } from "@/context/AppStateContext";

export default function SafetyPlanPage() {
  const { lang } = useAppState();

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#F47A1F] selection:text-[#FFFAF4] pb-24 bg-[#FDF3E7]">
      <TopBar />

      <main className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#F47A1F]">
            {lang === "hi" ? "व्यक्तिगत हीट सुरक्षा योजना" : "Personalised Heat Safety Plan"}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E2A44] tracking-tight">
            {lang === "hi" ? "अपनी दैनिक योजना अनुकूलित करें" : "Customize Your Daily Safety Plan"}
          </h1>
          <p className="text-sm sm:text-base text-[#5B6577] font-medium leading-relaxed">
            {lang === "hi"
              ? "अपना शहर, आयु वर्ग, कार्य और धूप में रहने का समय दर्ज करें ताकि लाइव मौसम के अनुसार आपकी जलपान और कार्य अनुसूची तैयार हो सके।"
              : "Adjust your city, age bracket, occupation, and expected sun exposure to see your adjusted feels-like heat index and hour-by-hour safety protocol."}
          </p>
        </div>

        <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Plan Builder Controls */}
          <div className="min-[900px]:col-span-6 flex flex-col gap-6">
            <PlanBuilderCard />
          </div>

          {/* Right Column: Live Reading & Plan Cards */}
          <div className="min-[900px]:col-span-6 flex flex-col gap-6">
            <LiveReadingCard />
            <SafetyPlanCard />
            <WorkRestCard />
            <HeatstrokeEmergencyCard />
          </div>
        </div>

        <div className="mt-4">
          <FeatureRow />
        </div>
      </main>
    </div>
  );
}
