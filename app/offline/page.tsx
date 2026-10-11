"use client";

import React from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { useAppState } from "@/context/AppStateContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  WifiDisconnected01Icon,
  FirstAidKitIcon,
  Call02Icon,
  RefreshIcon
} from "@hugeicons/core-free-icons";

export default function OfflinePage() {
  const { lang } = useAppState();

  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#F47A1F] selection:text-[#FFFAF4] pb-24 bg-[#FDF3E7]">
      <TopBar />

      <main className="relative z-20 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-6">
        {/* Offline Notice Card */}
        <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-6 sm:p-8 card-shadow flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FBEBD9] text-[#F47A1F] flex items-center justify-center">
            <HugeiconsIcon icon={WifiDisconnected01Icon} size={30} strokeWidth={2.2} />
          </div>

          <div className="flex flex-col gap-2 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2A44] tracking-tight">
              {lang === "hi" ? "आप ऑफलाइन हैं" : "You Are Offline"}
            </h1>
            <p className="text-sm sm:text-base text-[#1E2A44] font-bold leading-relaxed">
              {lang === "hi"
                ? "आप ऑफलाइन हैं। लाइव मौसम और AI योजनाओं के लिए इंटरनेट आवश्यक है। आपातकालीन जांच और 108 कॉल अभी भी काम कर रहे हैं।"
                : "You are offline. Live weather and AI plans need internet. The emergency check and call 108 still work."}
            </p>
            <p className="text-xs sm:text-sm text-[#5B6577] font-medium mt-1 leading-relaxed">
              {lang === "hi"
                ? "इंटरनेट कनेक्शन कट जाने पर भी आपकी सुरक्षा के लिए आवश्यक प्राथमिक उपचार और एम्बुलेंस सहायता हमेशा उपलब्ध रहती है।"
                : "Even without an internet connection, critical emergency heatstroke checks and direct ambulance calling remain operational on your device."}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 mt-3">
            <Link
              href="/plan#emergency-check-card"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F47A1F] text-[#FFFAF4] font-extrabold text-sm hover:bg-[#d66512] transition-colors shadow-sm"
            >
              <HugeiconsIcon icon={FirstAidKitIcon} size={18} strokeWidth={2.4} />
              <span>{lang === "hi" ? "आपातकालीन जांच खोलें" : "Open Emergency Check"}</span>
            </Link>

            <a
              href="tel:108"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D92D20] text-[#FFFAF4] font-extrabold text-sm hover:bg-[#b82518] transition-colors shadow-sm"
            >
              <HugeiconsIcon icon={Call02Icon} size={18} strokeWidth={2.4} />
              <span>{lang === "hi" ? "108 एम्बुलेंस डायल करें" : "Call 108 Ambulance"}</span>
            </a>

            <button
              type="button"
              onClick={handleRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FFFAF4] border border-[#1E2A44]/20 text-[#1E2A44] font-bold text-sm hover:bg-[#FBEBD9] transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={2.2} />
              <span>{lang === "hi" ? "पुनः प्रयास करें" : "Retry Connection"}</span>
            </button>
          </div>
        </div>

        {/* Offline Emergency First Aid Card */}
        <div className="bg-[#FFFAF4] border border-[#D92D20]/30 rounded-[20px] p-5 sm:p-6 card-shadow flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-[#D92D20]">
            <HugeiconsIcon icon={FirstAidKitIcon} size={20} strokeWidth={2.4} />
            <h2 className="text-base sm:text-lg font-extrabold text-[#1E2A44]">
              {lang === "hi"
                ? "ऑफलाइन प्राथमिक उपचार निर्देश (108 का इंतजार करते समय)"
                : "Offline First Aid Guidance (While Waiting for 108)"}
            </h2>
          </div>

          <ul className="text-xs sm:text-sm text-[#1E2A44] font-medium space-y-2 list-disc pl-5 leading-relaxed">
            <li>
              {lang === "hi"
                ? "व्यक्ति को तुरंत छाया या ठंडी हवादार जगह पर ले जाएं।"
                : "Immediately move the person to shade or a cool, ventilated area."}
            </li>
            <li>
              {lang === "hi"
                ? "तंग कपड़े ढीले करें और अतिरिक्त कपड़े हटा दें।"
                : "Loosen tight clothing and remove excess layers."}
            </li>
            <li>
              {lang === "hi"
                ? "गीले कपड़ों या ठंडे पानी से त्वचा को पोंछें और पंखा झलें।"
                : "Cool the skin with cold wet cloths or water, and fan the person."}
            </li>
            <li>
              {lang === "hi"
                ? "केवल तभी घूंट-घूंट पानी दें जब व्यक्ति पूरी तरह सचेत हो। बेहोश या भ्रमित व्यक्ति को कुछ भी न पिलाएं।"
                : "Give sips of water only if the person is fully awake. Never give fluids to someone who is confused or unconscious."}
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
