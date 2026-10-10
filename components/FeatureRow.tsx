"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sun01Icon,
  UserIcon,
  Shield01Icon,
  TranslateIcon
} from "@hugeicons/core-free-icons";
import { useAppState } from "@/context/AppStateContext";

export default function FeatureRow() {
  const { t } = useAppState();

  const features = [
    {
      icon: Sun01Icon,
      bg: "bg-[#F47A1F]/15",
      color: "text-[#F47A1F]",
      title: t.featureRow.weatherTitle,
      subtitle: t.featureRow.weatherSubtitle
    },
    {
      icon: UserIcon,
      bg: "bg-[#F5B83D]/20",
      color: "text-[#D98200]",
      title: t.featureRow.planTitle,
      subtitle: t.featureRow.planSubtitle
    },
    {
      icon: Shield01Icon,
      bg: "bg-[#2E9E5B]/15",
      color: "text-[#2E9E5B]",
      title: t.featureRow.preparedTitle,
      subtitle: t.featureRow.preparedSubtitle
    },
    {
      icon: TranslateIcon,
      bg: "bg-[#5B6577]/15",
      color: "text-[#5B6577]",
      title: t.featureRow.bilingualTitle,
      subtitle: t.featureRow.bilingualSubtitle
    }
  ];

  return (
    <div className="w-full bg-[#FFFAF4]/90 backdrop-blur-sm border border-[#1E2A44]/10 rounded-[20px] p-4 sm:p-5 card-shadow">
      <div className="grid grid-cols-2 min-[900px]:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1E2A44]/10">
        {features.map((feat, idx) => {
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2 sm:px-4 ${
                idx % 2 === 0 ? "pr-2" : "pl-2"
              } sm:p-2`}
            >
              <div
                className={`w-10 h-10 rounded-full ${feat.bg} ${feat.color} flex items-center justify-center shrink-0`}
              >
                <HugeiconsIcon icon={feat.icon} size={20} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-xs sm:text-sm text-[#1E2A44] truncate">
                  {feat.title}
                </span>
                <span className="text-[11px] text-[#5B6577] font-medium leading-tight line-clamp-1">
                  {feat.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
