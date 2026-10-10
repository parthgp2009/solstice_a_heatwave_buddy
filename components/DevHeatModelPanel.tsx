"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppState } from "@/context/AppStateContext";
import {
  adjustedFeelsLike,
  getRiskLevel,
  adjustedFeelsLikeForHour,
  computeSafeWindows,
  isVulnerableUser
} from "@/lib/heatModel";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, Alert02Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";

export interface WorkedExampleTest {
  id: number;
  label: string;
  apparentTemp: number;
  uv: number;
  bucket: "Up to 2 hours" | "2 to 6 hours" | "More than 6 hours";
  expectedAdjusted: number;
  expectedRisk?: string;
}

const WORKED_EXAMPLES: WorkedExampleTest[] = [
  {
    id: 1,
    label: "Example 1 (Light Sun & Moderate UV)",
    apparentTemp: 38,
    uv: 4,
    bucket: "Up to 2 hours",
    expectedAdjusted: 38,
  },
  {
    id: 2,
    label: "Example 2 (High UV + Moderate Exposure)",
    apparentTemp: 38,
    uv: 7,
    bucket: "2 to 6 hours",
    expectedAdjusted: 40,
  },
  {
    id: 3,
    label: "Example 3 (Extreme UV + Extended Sun)",
    apparentTemp: 41,
    uv: 12,
    bucket: "More than 6 hours",
    expectedAdjusted: 44.5,
  },
  {
    id: 4,
    label: "Example 4 (UV 10 Peak Boundary => Extreme)",
    apparentTemp: 44,
    uv: 10,
    bucket: "2 to 6 hours",
    expectedAdjusted: 46,
    expectedRisk: "Extreme",
  },
];

function DevHeatModelPanelInner() {
  const searchParams = useSearchParams();
  const isDevUrl = searchParams.get("dev") === "true" || searchParams.get("test") === "true";
  const [isOpenOverride, setIsOpenOverride] = useState<boolean | null>(null);
  const isOpen = isOpenOverride !== null ? isOpenOverride : isDevUrl;
  const { sunHours, selectedHour, age, healthHistory, weatherData } = useAppState();

  const isVulnerable = isVulnerableUser(age, healthHistory);
  const reading = adjustedFeelsLikeForHour(
    selectedHour,
    weatherData.hourlyApparent,
    weatherData.hourlyUv,
    sunHours,
    isVulnerable
  );
  const { saferRanges, avoidRanges } = computeSafeWindows(
    weatherData.hourlyApparent,
    weatherData.hourlyUv,
    sunHours,
    isVulnerable
  );

  return (
    <aside className="fixed bottom-12 right-4 z-40 max-w-md w-[calc(100vw-2rem)] select-none">
      {/* Dev Toggle Pill */}
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={() => setIsOpenOverride(prev => !(prev !== null ? prev : isDevUrl))}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E2A44] text-[#FFFAF4] text-xs font-bold shadow-lg hover:bg-[#F47A1F] transition-all cursor-pointer border border-[#FFFAF4]/20"
        >
          <span>🔬 Heat Model Dev Panel</span>
          <span
            className={`transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <HugeiconsIcon icon={ArrowDown01Icon} size={13} strokeWidth={2.4} />
          </span>
        </button>
      </div>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="bg-[#FFFAF4] border-2 border-[#1E2A44] rounded-[20px] p-4 sm:p-5 card-shadow max-h-[75vh] overflow-y-auto flex flex-col gap-4 text-[#1E2A44]">
          <div className="flex items-center justify-between border-b border-[#1E2A44]/15 pb-2">
            <div>
              <h4 className="font-extrabold text-sm text-[#1E2A44]">
                Heat Model Worked Examples
              </h4>
              <p className="text-[11px] text-[#5B6577]">
                Verified pure functions from <code className="font-mono text-[#F47A1F]">lib/heatModel.ts</code>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpenOverride(false)}
              className="text-xs font-bold text-[#5B6577] hover:text-[#1E2A44] px-2 py-0.5"
            >
              Close
            </button>
          </div>

          {/* Worked Examples Checklist */}
          <div className="flex flex-col gap-2.5">
            {WORKED_EXAMPLES.map(ex => {
              const actualAdjusted = adjustedFeelsLike(ex.apparentTemp, ex.uv, ex.bucket);
              const actualRisk = getRiskLevel(actualAdjusted);
              const passed =
                actualAdjusted === ex.expectedAdjusted &&
                (!ex.expectedRisk || actualRisk === ex.expectedRisk);

              return (
                <div
                  key={ex.id}
                  className="bg-[#FBEBD9]/60 border border-[#1E2A44]/10 rounded-xl p-3 flex flex-col gap-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#1E2A44]">{ex.label}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        passed
                          ? "bg-[#EAF6EE] text-[#2E9E5B]"
                          : "bg-[#FDECEA] text-[#D92D20]"
                      }`}
                    >
                      {passed ? (
                        <>
                          <HugeiconsIcon icon={Tick02Icon} size={11} strokeWidth={2.5} />
                          <span>PASSED</span>
                        </>
                      ) : (
                        <>
                          <HugeiconsIcon icon={Alert02Icon} size={11} strokeWidth={2.5} />
                          <span>FAILED</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#5B6577] font-medium leading-relaxed">
                    Inputs: Feels-like {ex.apparentTemp}°C, UV {ex.uv}, Exposure &quot;{ex.bucket}&quot;
                  </div>

                  <div className="text-[11px] font-bold text-[#1E2A44] flex items-center justify-between pt-0.5">
                    <span>
                      Result: {actualAdjusted}°C {ex.expectedRisk ? `(${actualRisk})` : ""}
                    </span>
                    <span className="text-[#5B6577] font-normal">
                      Target: {ex.expectedAdjusted}°C
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Inspector of Current User State */}
          <div className="bg-[#EAF3FC] border border-[#2F7FD1]/25 rounded-xl p-3 flex flex-col gap-1.5 text-xs">
            <span className="font-extrabold text-[#2F7FD1]">
              Live State Inspector (Hour {selectedHour}:00)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#1E2A44]">
              <div>
                <span className="text-[#5B6577]">Raw Feels-Like: </span>
                <span className="font-bold">{reading.rawFeelsLike}°C</span>
              </div>
              <div>
                <span className="text-[#5B6577]">UV Index: </span>
                <span className="font-bold">{reading.uv} (+{reading.uvOff})</span>
              </div>
              <div>
                <span className="text-[#5B6577]">Sun Bucket: </span>
                <span className="font-bold">+{reading.expOff}</span>
              </div>
              <div>
                <span className="text-[#5B6577]">Adjusted Temp: </span>
                <span className="font-bold text-[#D92D20]">{reading.adjusted}°C</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#5B6577]">Calculated Risk: </span>
                <span className="font-extrabold">{reading.riskLevel}</span>
                {isVulnerable && (
                  <span className="ml-1 text-[#D92D20] font-bold">
                    (Vulnerable: +1 Strictness Tier)
                  </span>
                )}
              </div>
              <div className="col-span-2 text-[10px] text-[#5B6577]">
                Safe: {saferRanges.join(", ")} | Avoid: {avoidRanges.join(", ")}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default function DevHeatModelPanel() {
  return (
    <Suspense fallback={null}>
      <DevHeatModelPanelInner />
    </Suspense>
  );
}
