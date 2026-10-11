"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  WifiDisconnected01Icon,
  FirstAidKitIcon,
  Call02Icon
} from "@hugeicons/core-free-icons";

function subscribeToConnectivity(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getConnectivitySnapshot() {
  return typeof navigator !== "undefined" ? !navigator.onLine : false;
}

function getServerConnectivitySnapshot() {
  return false;
}

/**
 * Offline Notification Banner (Step 5A).
 * 
 * Displays in both Hindi and English when the user loses network connectivity:
 * "You are offline. Live weather and AI plans need internet. The emergency check and call 108 still work."
 * 
 * Provides immediate 1-tap access to the Heatstroke Emergency Check and Call 108.
 */
export default function OfflineBanner() {
  const isOffline = useSyncExternalStore(
    subscribeToConnectivity,
    getConnectivitySnapshot,
    getServerConnectivitySnapshot
  );

  if (!isOffline) {
    return null;
  }

  return (
    <div
      id="offline-banner"
      role="status"
      aria-live="polite"
      className="sticky top-0 z-50 w-full bg-[#1E2A44] text-[#FDF3E7] border-b-2 border-[#D92D20] px-4 py-3 shadow-md animate-in slide-in-from-top duration-200"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Banner Message in English and Hindi */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D92D20] text-[#FFFAF4] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <HugeiconsIcon icon={WifiDisconnected01Icon} size={18} strokeWidth={2.4} />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="font-extrabold text-[#FFFAF4] leading-tight">
              You are offline. Live weather and AI plans need internet. The emergency check and call 108 still work.
            </p>
            <p className="font-medium text-[#FDF3E7]/80 text-[11px] sm:text-xs leading-tight">
              आप ऑफलाइन हैं। लाइव मौसम और AI योजनाओं के लिए इंटरनेट आवश्यक है। आपातकालीन जांच और 108 कॉल अभी भी काम कर रहे हैं।
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <Link
            href="/plan#emergency-check-card"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F47A1F] text-[#FFFAF4] font-bold text-xs hover:bg-[#d66512] transition-colors"
          >
            <HugeiconsIcon icon={FirstAidKitIcon} size={14} strokeWidth={2.4} />
            <span>Emergency Check</span>
          </Link>
          <a
            href="tel:108"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D92D20] text-[#FFFAF4] font-bold text-xs hover:bg-[#b82518] transition-colors"
          >
            <HugeiconsIcon icon={Call02Icon} size={14} strokeWidth={2.4} />
            <span>Call 108</span>
          </a>
        </div>
      </div>
    </div>
  );
}
