"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon } from "@hugeicons/core-free-icons";
import { useAppState } from "@/context/AppStateContext";

export default function BottomDisclaimerStrip() {
  const { t } = useAppState();

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E2A44] text-[#FDF3E7] py-2 px-4 border-t border-[#1E2A44]/30 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <p className="text-center sm:text-left text-[11px] sm:text-xs opacity-90 font-medium">
          {t.footerDisclaimer}
        </p>
        <a
          href="tel:108"
          className="inline-flex items-center gap-1.5 bg-[#D92D20] text-[#FFFAF4] px-3.5 py-1.5 font-extrabold text-[11px] uppercase tracking-wider rounded-xl hover:bg-[#B72418] transition-colors shrink-0 shadow-sm"
        >
          <HugeiconsIcon icon={Call02Icon} size={14} strokeWidth={2.4} />
          <span>{t.callAmbulance}</span>
        </a>
      </div>
    </aside>
  );
}
