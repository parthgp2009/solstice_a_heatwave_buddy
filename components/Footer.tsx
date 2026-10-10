"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppState } from "@/context/AppStateContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon } from "@hugeicons/core-free-icons";

export default function Footer() {
  const { lang } = useAppState();

  return (
    <footer className="w-full bg-[#1E2A44] text-[#FFFAF4] mt-16 pt-12 pb-24 border-t-4 border-[#F47A1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* Top Footer Row: Brand, Emergency SOS, and Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Mission (Col 1-5) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-36 flex items-center bg-white/90 p-1.5 rounded-xl">
                <Image
                  src="/logo.png"
                  alt="Solstice Logo"
                  width={160}
                  height={38}
                  className="h-7 w-auto object-contain"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F47A1F]">
                HEAT SAFETY INDIA
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#FFFAF4]/70 leading-relaxed font-medium max-w-sm">
              {lang === "hi"
                ? "सोलस्टाइस (लू साथी) भारत के नागरिकों, विशेष रूप से धूप में काम करने वाले श्रमिकों के लिए वास्तविक समय की गर्मी सुरक्षा और स्वास्थ्य कार्यक्रम प्रदान करता है।"
                : "Solstice (Heatwave Buddy) delivers real-time thermal stress telemetry, occupational hydration pacing, and customized clinical protection plans across India."}
            </p>

            {/* Emergency 108 Callout */}
            <div className="flex items-center gap-3 bg-[#D92D20]/20 border border-[#D92D20]/50 p-3 rounded-2xl w-fit">
              <div className="w-9 h-9 rounded-xl bg-[#D92D20] text-white flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Call02Icon} size={16} strokeWidth={2.4} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FFFAF4]/80">
                  {lang === "hi" ? "राष्ट्रीय आपातकालीन एम्बुलेंस" : "National Heat Emergency Hotline"}
                </span>
                <a href="tel:108" className="text-sm font-black text-white hover:underline">
                  Dial 108 Immediately
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links (Col 6-8) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#F47A1F]">
              {lang === "hi" ? "शीघ्र लिंक्स" : "Quick Navigation"}
            </span>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm font-bold text-[#FFFAF4]/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {lang === "hi" ? "होम (डैशबोर्ड)" : "Home (Live Dashboard)"}
                </Link>
              </li>
              <li>
                <Link href="/plan" className="hover:text-white transition-colors">
                  {lang === "hi" ? "दैनिक सुरक्षा योजना बनाएं" : "Build Daily Safety Plan"}
                </Link>
              </li>
              <li>
                <Link href="/weather" className="hover:text-white transition-colors">
                  {lang === "hi" ? "लाइव मौसम व 24-घंटे का हीटवक्र" : "Live Weather & 24h Heat Timeline"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {lang === "hi" ? "भारत हीट आंकड़े व रिपोर्ट" : "India Heat Toll & Crisis Report"}
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-white transition-colors">
                  {lang === "hi" ? "अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal (Col 9-12) */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#F47A1F]">
              {lang === "hi" ? "गोपनीयता व वैज्ञानिक स्रोत" : "Privacy & Scientific Standards"}
            </span>
            <p className="text-xs text-[#FFFAF4]/70 leading-relaxed font-medium">
              {lang === "hi"
                ? "शून्य-भंडारण गारंटी: सटीक जीपीएस निर्देशांक और स्वास्थ्य संबंधी विवरण हमारे सर्वर पर कभी रिकॉर्ड या लॉग नहीं किए जाते।"
                : "Zero-storage guarantee: precise GPS coordinates and health notes are never persisted on any remote server or database."}
            </p>
            <div className="flex flex-wrap gap-3 pt-2 text-xs font-bold text-[#FFFAF4]/90">
              <Link href="/privacy" className="hover:text-[#F47A1F] underline">
                {lang === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-[#F47A1F] underline">
                {lang === "hi" ? "सेवा की शर्तें" : "Terms of Service"}
              </Link>
            </div>
            <span className="text-[11px] text-[#FFFAF4]/50 mt-1">
              Data: Open-Meteo API • Audio: Amazon Polly (Kajal Neural) • Guidance: NDMA / IDSP
            </span>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FFFAF4]/60 font-semibold">
          <span>
            © 2026 Solstice Heatwave Buddy (लू साथी). All rights reserved.
          </span>
          <span>
            {lang === "hi"
              ? "सार्वजनिक स्वास्थ्य सुरक्षा हेतु समर्पित पहल"
              : "Dedicated public health initiative for heat mitigation across India."}
          </span>
        </div>
      </div>
    </footer>
  );
}
