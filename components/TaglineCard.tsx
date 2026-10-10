"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useAppState } from "@/context/AppStateContext";

export default function TaglineCard() {
  const { lang } = useAppState();
  const [showFullImage, setShowFullImage] = useState(false);

  return (
    <>
      {/* High-impact Tagline Alert Banner */}
      <div className="w-full bg-[#FFFAF4] border border-[#D92D20]/25 rounded-[20px] p-4 sm:p-5 card-shadow flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          {/* Mini Thumbnail of tagline.jpeg */}
          <div
            onClick={() => setShowFullImage(true)}
            className="relative w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden border border-[#D92D20]/20 shadow-sm shrink-0 cursor-pointer group"
            title="Click to view full heat toll statistics"
          >
            <Image
              src="/tagline.jpeg"
              alt="India Heat Toll Statistics"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-[#1E2A44]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] font-bold text-white bg-[#1E2A44]/75 px-1 rounded">
                Zoom
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#D92D20]">
              <HugeiconsIcon icon={Alert02Icon} size={14} strokeWidth={2.5} />
              <span>
                {lang === "hi" ? "भारत में लू का प्रकोप (2024)" : "India Heat Toll Statistics (2024)"}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#1E2A44] leading-snug mt-0.5">
              {lang === "hi"
                ? "48,000+ संदिग्ध हीटस्ट्रोक मामले और 161 पुष्ट मौतें"
                : "Over 48,000 Suspected Heatstroke Cases and 161 Confirmed Deaths"}
            </h3>
            <p className="text-xs text-[#5B6577] font-medium leading-relaxed mt-1 max-w-xl">
              {lang === "hi"
                ? "सरकारी निगरानी का नया डेटा गंभीर स्वास्थ्य संकट दर्शाता है। वास्तविक समय की चेतावनी और व्यक्तिगत सुरक्षा योजना से जीवन बचाएं।"
                : "Government surveillance data reveals severe heatwave impacts across India. Real-time alerts and personalised plans prevent heat illness."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-stretch md:self-auto justify-end">
          <button
            type="button"
            onClick={() => setShowFullImage(true)}
            className="px-3.5 py-2 text-xs font-bold text-[#1E2A44] bg-[#FBEBD9] hover:bg-[#F9D9B8] rounded-xl transition-colors cursor-pointer"
          >
            {lang === "hi" ? "आंकड़े देखें" : "View Infographic"}
          </button>
          <Link
            href="/about"
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-[#FFFAF4] bg-[#D92D20] hover:bg-[#B72418] rounded-xl transition-colors shadow-sm"
          >
            <span>{lang === "hi" ? "पूरी रिपोर्ट" : "Learn More"}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2.4} />
          </Link>
        </div>
      </div>

      {/* Full-view Modal for tagline.jpeg */}
      {showFullImage && (
        <div
          className="fixed inset-0 z-50 bg-[#1E2A44]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#FFFAF4] rounded-[22px] overflow-hidden card-shadow p-3 border border-[#1E2A44]/20 flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full h-[520px] rounded-xl overflow-hidden">
              <Image
                src="/tagline.jpeg"
                alt="India Heat Toll Infographic"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="w-full mt-3 flex items-center justify-between px-2 pb-1">
              <span className="text-xs font-bold text-[#5B6577]">
                Government Heatstroke Surveillance 2024
              </span>
              <button
                type="button"
                onClick={() => setShowFullImage(false)}
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#1E2A44] text-[#FFFAF4] rounded-xl hover:bg-[#F47A1F] transition-colors cursor-pointer"
              >
                {lang === "hi" ? "बंद करें" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
