"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import {
  adjustedFeelsLikeForHour,
  RiskLevel
} from "@/lib/heatModel";

export default function HourlyChartSection() {
  const { city, sunHours, selectedHour, setSelectedHour, lang } = useAppState();
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  // Compute 24 hours of adjusted feels-like temperatures
  const hourlyData = Array.from({ length: 24 }, (_, h) => {
    const reading = adjustedFeelsLikeForHour(h, undefined, undefined, sunHours);
    return {
      hour: h,
      temp: reading.adjusted,
      raw: reading.rawFeelsLike,
      uv: reading.uv,
      risk: reading.riskLevel
    };
  });

  const temps = hourlyData.map(d => d.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  // Chart coordinates: width 800, height 200, padding
  const width = 800;
  const height = 200;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const yMin = Math.floor(Math.min(22, minTemp - 2));
  const yMax = Math.ceil(Math.max(48, maxTemp + 2));

  const getX = (h: number) => paddingX + (h / 23) * chartWidth;
  const getY = (t: number) => paddingTop + chartHeight - ((t - yMin) / (yMax - yMin)) * chartHeight;

  // Build SVG path
  const points = hourlyData.map(d => `${getX(d.hour)},${getY(d.temp)}`);
  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `M ${getX(0)},${paddingTop + chartHeight} L ${points.join(" L ")} L ${getX(23)},${paddingTop + chartHeight} Z`;

  // Selected or hovered hour details
  const activeHourIndex = hoveredHour !== null ? hoveredHour : selectedHour;
  const activeData = hourlyData[activeHourIndex];

  const formatHourLabel = (h: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const d = h % 12 === 0 ? 12 : h % 12;
    return `${d} ${ampm}`;
  };

  return (
    <div className="w-full bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[26px] p-6 sm:p-8 card-shadow flex flex-col gap-6 animate-fade-rise-1">
      {/* Header with Title and Current Hour Spotlight */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2A44]/10">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#F47A1F]">
            {lang === "hi" ? "24-घंटे का हीटवक्र" : "24-Hour Thermal Curve"}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#1E2A44]">
            {lang === "hi"
              ? `${city} का 24-घंटे का अनुभूत तापमान चार्ट`
              : `24-Hour Adjusted Feels-Like Profile for ${city}`}
          </h3>
          <p className="text-xs text-[#5B6577] font-medium">
            {lang === "hi"
              ? "किसी भी घंटे पर क्लिक करें या कर्सर ले जाएं ताकि लाइव तापमान और यूवी किरणें देखी जा सकें।"
              : "Click or scrub any hour on the timeline to sync conditions across the application."}
          </p>
        </div>

        {/* Active Hour Metric Chip */}
        <div className="flex items-center gap-3 bg-[#FAF4EC] px-4 py-2.5 rounded-2xl border border-[#1E2A44]/15 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5B6577]">
              {formatHourLabel(activeData.hour)} ({activeData.hour}:00)
            </span>
            <span className="text-2xl font-black text-[#1E2A44]">
              {activeData.temp.toFixed(1)}°C
            </span>
          </div>
          <div className="flex flex-col border-l border-[#1E2A44]/15 pl-3 text-xs">
            <span className="font-bold text-[#F47A1F]">UV {activeData.uv}</span>
            <span
              className={`font-black ${
                activeData.risk === "Extreme"
                  ? "text-[#D92D20]"
                  : activeData.risk === "Danger"
                  ? "text-[#F47A1F]"
                  : activeData.risk === "Caution"
                  ? "text-[#D98200]"
                  : "text-[#2E9E5B]"
              }`}
            >
              {activeData.risk}
            </span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Area Chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {/* Linear gradient for area fill */}
            <linearGradient id="heatAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F47A1F" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#F5B83D" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2E9E5B" stopOpacity="0.05" />
            </linearGradient>

            {/* Danger Zone Shading (12:00 - 16:30) */}
            <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#D92D20" strokeWidth="1" strokeOpacity="0.15" />
            </pattern>
          </defs>

          {/* Shaded Danger Peak Zone (12:00 to 16:30) */}
          <rect
            x={getX(12)}
            y={paddingTop}
            width={getX(16.5) - getX(12)}
            height={chartHeight}
            fill="#FDECEA"
            opacity="0.8"
            rx="6"
          />

          {/* Horizontal Grid lines and temperature labels */}
          {[25, 32, 38, 44].map(t => {
            const y = getY(t);
            return (
              <g key={t}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#1E2A44"
                  strokeOpacity="0.08"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-[#5B6577] font-mono font-bold"
                >
                  {t}°
                </text>
              </g>
            );
          })}

          {/* SVG Area Fill */}
          <path d={areaPath} fill="url(#heatAreaGradient)" />

          {/* SVG Line Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="#F47A1F"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hour Tick Markers & Labels */}
          {[0, 4, 8, 12, 16, 20, 23].map(h => {
            const x = getX(h);
            return (
              <g key={h}>
                <line
                  x1={x}
                  y1={paddingTop + chartHeight}
                  x2={x}
                  y2={paddingTop + chartHeight + 6}
                  stroke="#1E2A44"
                  strokeOpacity="0.2"
                />
                <text
                  x={x}
                  y={paddingTop + chartHeight + 20}
                  textAnchor="middle"
                  className="text-[11px] fill-[#5B6577] font-bold"
                >
                  {formatHourLabel(h)}
                </text>
              </g>
            );
          })}

          {/* Active / Selected Hour Vertical Marker Line */}
          <line
            x1={getX(activeHourIndex)}
            y1={paddingTop}
            x2={getX(activeHourIndex)}
            y2={paddingTop + chartHeight}
            stroke="#1E2A44"
            strokeWidth="2"
            strokeDasharray="3 3"
          />

          {/* Active Hour Circle Marker */}
          <circle
            cx={getX(activeHourIndex)}
            cy={getY(activeData.temp)}
            r="6"
            fill="#FFFAF4"
            stroke="#F47A1F"
            strokeWidth="3.5"
          />

          {/* Invisible interactive click/hover overlay columns */}
          {hourlyData.map(d => (
            <rect
              key={d.hour}
              x={getX(d.hour) - chartWidth / 48}
              y={paddingTop}
              width={chartWidth / 24}
              height={chartHeight + 20}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredHour(d.hour)}
              onMouseLeave={() => setHoveredHour(null)}
              onClick={() => setSelectedHour(d.hour)}
            />
          ))}
        </svg>
      </div>

      {/* Legend & Safe Window Callouts */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1E2A44]/10 text-xs font-semibold text-[#5B6577]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#2E9E5B]" />
            <span>Low (&lt;32°C)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#F5B83D]" />
            <span>Caution (32-38°C)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#F47A1F]" />
            <span>Danger (38-46°C)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#D92D20]" />
            <span>Extreme (&ge;46°C)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-[#FDECEA] text-[#D92D20] font-black text-[11px]">
            {lang === "hi" ? "लाल क्षेत्र: 12:00 - 16:30 धूप से बचें" : "Red Zone: 12:00 - 16:30 Avoid Sun"}
          </span>
        </div>
      </div>
    </div>
  );
}
