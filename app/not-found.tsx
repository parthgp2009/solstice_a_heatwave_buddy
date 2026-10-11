import React from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  Call02Icon,
  Sun01Icon,
  Compass01Icon,
  Shield01Icon
} from "@hugeicons/core-free-icons";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#F47A1F] selection:text-[#FFFAF4] pb-24 bg-[#FDF3E7]">
      <TopBar />

      <main className="relative z-20 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center text-center gap-6">
        {/* Warm 404 Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FBEBD9] border border-[#F47A1F]/30 px-4 py-1.5 rounded-full shadow-xs">
          <HugeiconsIcon icon={Sun01Icon} size={18} strokeWidth={2.4} className="text-[#F47A1F] animate-spin [animation-duration:12s]" />
          <span className="text-xs sm:text-sm font-extrabold text-[#1E2A44] tracking-wide">
            404 • Page Not Found / पृष्ठ नहीं मिला
          </span>
        </div>

        {/* Big Friendly Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1E2A44] tracking-tight">
            Lost in the Heat?
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-[#F47A1F]">
            धूप में रास्ता भटक गए?
          </p>
        </div>

        {/* Bilingual Explanation */}
        <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-6 sm:p-8 card-shadow max-w-xl flex flex-col gap-4 text-left">
          <p className="text-sm sm:text-base text-[#1E2A44] font-semibold leading-relaxed">
            The page you are looking for does not exist or may have been moved. Don&apos;t stay out in the heat — head back to home for live weather and your safety plan.
          </p>
          <div className="h-px bg-[#1E2A44]/10" />
          <p className="text-xs sm:text-sm text-[#5B6577] font-medium leading-relaxed">
            आप जिस पृष्ठ की तलाश कर रहे हैं वह मौजूद नहीं है या हटा दिया गया है। धूप में खड़े न रहें — तुरंत मुख्य पृष्ठ पर जाकर अपने शहर का तापमान और सुरक्षा योजना देखें।
          </p>
        </div>

        {/* Action Buttons: Home & Call 108 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#F47A1F] hover:bg-[#E0650D] text-white px-6 py-3.5 rounded-xl font-black text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <HugeiconsIcon icon={Home01Icon} size={18} strokeWidth={2.4} />
            <span>Return Home / मुख्य पृष्ठ</span>
          </Link>

          <a
            href="tel:108"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D92D20] hover:bg-[#B91C1C] text-white px-6 py-3.5 rounded-xl font-black text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <HugeiconsIcon icon={Call02Icon} size={18} strokeWidth={2.4} />
            <span>Call 108 Ambulance / 108 एम्बुलेंस</span>
          </a>
        </div>

        {/* Quick Links Navigation */}
        <div className="flex items-center flex-wrap justify-center gap-2 pt-4">
          <span className="text-xs font-bold text-[#5B6577]">Quick Navigation:</span>
          <Link
            href="/weather"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFAF4] border border-[#1E2A44]/15 text-xs font-bold text-[#1E2A44] hover:border-[#F47A1F] transition-colors"
          >
            <HugeiconsIcon icon={Compass01Icon} size={14} className="text-[#F47A1F]" />
            Weather Station
          </Link>
          <Link
            href="/plan"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFAF4] border border-[#1E2A44]/15 text-xs font-bold text-[#1E2A44] hover:border-[#F47A1F] transition-colors"
          >
            <HugeiconsIcon icon={Shield01Icon} size={14} className="text-[#F47A1F]" />
            Safety Plan
          </Link>
        </div>
      </main>
    </div>
  );
}
