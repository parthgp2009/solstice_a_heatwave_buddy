"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  Home01Icon,
  Call02Icon,
  RefreshIcon
} from "@hugeicons/core-free-icons";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log safe error notice in development without printing sensitive details
    console.error("Global Error Boundary caught:", error?.message || error);
  }, [error]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#F47A1F] selection:text-[#FFFAF4] pb-24 bg-[#FDF3E7]">
      <TopBar />

      <main className="relative z-20 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center text-center gap-6">
        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FDECEA] border border-[#D92D20]/30 px-4 py-1.5 rounded-full shadow-xs">
          <HugeiconsIcon icon={Alert02Icon} size={18} strokeWidth={2.4} className="text-[#D92D20]" />
          <span className="text-xs sm:text-sm font-extrabold text-[#D92D20] tracking-wide">
            Application Error • एप्लिकेशन त्रुटि
          </span>
        </div>

        {/* Big Friendly Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1E2A44] tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-[#F47A1F]">
            कुछ गड़बड़ हो गई
          </p>
        </div>

        {/* Bilingual Explanation Card */}
        <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[22px] p-6 sm:p-8 card-shadow max-w-xl flex flex-col gap-4 text-left">
          <p className="text-sm sm:text-base text-[#1E2A44] font-semibold leading-relaxed">
            An unexpected error occurred while loading this view. You can retry loading, return to the home screen, or reach emergency medical services if you need immediate assistance.
          </p>
          <div className="h-px bg-[#1E2A44]/10" />
          <p className="text-xs sm:text-sm text-[#5B6577] font-medium leading-relaxed">
            इस पृष्ठ को लोड करते समय एक अप्रत्याशित समस्या आई। आप पुनः प्रयास कर सकते हैं, मुख्य स्क्रीन पर वापस जा सकते हैं, या गर्मी से अस्वस्थ होने पर तुरंत आपातकालीन चिकित्सा सहायता ले सकते हैं।
          </p>
        </div>

        {/* Action Buttons: Try Again, Home & Call 108 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#1E2A44] hover:bg-[#151E32] text-white px-5 py-3.5 rounded-xl font-black text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <HugeiconsIcon icon={RefreshIcon} size={18} strokeWidth={2.4} />
            <span>Try Again / पुनः प्रयास</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#F47A1F] hover:bg-[#E0650D] text-white px-5 py-3.5 rounded-xl font-black text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <HugeiconsIcon icon={Home01Icon} size={18} strokeWidth={2.4} />
            <span>Return Home / मुख्य पृष्ठ</span>
          </Link>

          <a
            href="tel:108"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D92D20] hover:bg-[#B91C1C] text-white px-5 py-3.5 rounded-xl font-black text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <HugeiconsIcon icon={Call02Icon} size={18} strokeWidth={2.4} />
            <span>Call 108 / 108 एम्बुलेंस</span>
          </a>
        </div>
      </main>
    </div>
  );
}
