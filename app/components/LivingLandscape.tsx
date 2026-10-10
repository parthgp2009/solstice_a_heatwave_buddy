"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export type Language = "en" | "hi";

interface HourlyPoint {
  hour: number;
  timeStr: string;
  temp: number;
  heatIndex: number;
  adviceEn: string;
  adviceHi: string;
  level: "safe" | "caution" | "danger" | "extreme";
}

// 24-hour meteorological summer profile for India
const HOURLY_DATA: HourlyPoint[] = [
  { hour: 0, timeStr: "00:00", temp: 28, heatIndex: 30, level: "safe", adviceEn: "Night cooling window. Open cross-ventilation.", adviceHi: "रात का ठंडा समय। कमरों में हवा आने दें।" },
  { hour: 1, timeStr: "01:00", temp: 27, heatIndex: 29, level: "safe", adviceEn: "Safe rest hours. Keep drinking water near bed.", adviceHi: "विश्राम का समय। बिस्तर के पास पानी रखें।" },
  { hour: 2, timeStr: "02:00", temp: 27, heatIndex: 28, level: "safe", adviceEn: "Lowest temperature of the 24-hour cycle.", adviceHi: "दिन का न्यूनतम तापमान। शांतिपूर्ण समय।" },
  { hour: 3, timeStr: "03:00", temp: 26, heatIndex: 28, level: "safe", adviceEn: "Coolest atmospheric hours.", adviceHi: "वातावरण का सबसे शीतल समय।" },
  { hour: 4, timeStr: "04:00", temp: 26, heatIndex: 28, level: "safe", adviceEn: "Pre-dawn hours. Ideal for early outdoor chores.", adviceHi: "भोर का समय। जरूरी काम जल्दी शुरू करें।" },
  { hour: 5, timeStr: "05:00", temp: 28, heatIndex: 30, level: "safe", adviceEn: "Dawn begins. Drink fresh water before stepping out.", adviceHi: "सुबह की शुरुआत। बाहर निकलने से पहले पानी पिएं।" },
  { hour: 6, timeStr: "06:00", temp: 30, heatIndex: 32, level: "safe", adviceEn: "Sun rises. Best window for outdoor labor.", adviceHi: "सूर्योदय। बाहर के भारी काम का सबसे सुरक्षित समय।" },
  { hour: 7, timeStr: "07:00", temp: 32, heatIndex: 34, level: "caution", adviceEn: "Sun climbing. Wear a light hat or cotton cloth.", adviceHi: "धूप बढ़ रही है। सिर पर सूती गमछा बांधें।" },
  { hour: 8, timeStr: "08:00", temp: 34, heatIndex: 37, level: "caution", adviceEn: "Moderate heat. Start hourly hydration stops.", adviceHi: "गर्मी बढ़ रही है। हर घंटे पानी पीना शुरू करें।" },
  { hour: 9, timeStr: "09:00", temp: 37, heatIndex: 40, level: "caution", adviceEn: "Rapid heating. Complete direct sun tasks now.", adviceHi: "तेज धूप। सीधी धूप वाले काम अब समाप्त करें।" },
  { hour: 10, timeStr: "10:00", temp: 39, heatIndex: 43, level: "danger", adviceEn: "Heat hazard active. Move toward covered shade.", adviceHi: "खतरा शुरू। छायादार स्थानों की ओर जाएं।" },
  { hour: 11, timeStr: "11:00", temp: 41, heatIndex: 46, level: "danger", adviceEn: "Severe radiant heat. Pause heavy outdoor exertion.", adviceHi: "भीषण धूप। बाहर भारी मेहनत का काम बंद रखें।" },
  { hour: 12, timeStr: "12:00", temp: 43, heatIndex: 48, level: "extreme", adviceEn: "PEAK HEATWAVE. Prohibit direct solar exposure.", adviceHi: "चरम लू का समय। सीधी धूप में निकलना सख्त मना है।" },
  { hour: 13, timeStr: "13:00", temp: 45, heatIndex: 51, level: "extreme", adviceEn: "SEVERE DANGER. Maximum heat stroke risk. Rest strictly.", adviceHi: "अत्यधिक गंभीर खतरा। केवल आराम करें और पानी पिएं।" },
  { hour: 14, timeStr: "14:00", temp: 45, heatIndex: 51, level: "extreme", adviceEn: "SOLAR ZENITH PEAK. Drink ORS and stay indoors.", adviceHi: "भीषणतम लू। ओआरएस पिएं और कमरे में रहें।" },
  { hour: 15, timeStr: "15:00", temp: 44, heatIndex: 49, level: "extreme", adviceEn: "Extreme ground radiation. Asphalt retains heavy heat.", adviceHi: "सड़कें अत्यधिक गर्म। धूप में खड़े रहने से बचें।" },
  { hour: 16, timeStr: "16:00", temp: 43, heatIndex: 47, level: "danger", adviceEn: "Dry hot wind (Loo) active. Keep eyes and face covered.", adviceHi: "गर्म हवा (लू) सक्रिय। चेहरा और आंखें ढक कर रखें।" },
  { hour: 17, timeStr: "17:00", temp: 41, heatIndex: 44, level: "danger", adviceEn: "Gradual cooling begins. Stay under tree or building shade.", adviceHi: "तापमान धीरे-धीरे कम हो रहा है। छांव में ही रहें।" },
  { hour: 18, timeStr: "18:00", temp: 38, heatIndex: 41, level: "caution", adviceEn: "Sunset approaches. Safer for evening commute.", adviceHi: "सूर्यास्त का समय। शाम की आवाजाही के लिए बेहतर।" },
  { hour: 19, timeStr: "19:00", temp: 36, heatIndex: 39, level: "caution", adviceEn: "Dusk. Heat dissipates slowly from buildings.", adviceHi: "शाम का समय। भरपूर पानी और छाछ पिएं।" },
  { hour: 20, timeStr: "20:00", temp: 34, heatIndex: 37, level: "caution", adviceEn: "Warm night breeze. Safe for dinner and errands.", adviceHi: "शाम के जरूरी काम निपटाने का समय।" },
  { hour: 21, timeStr: "21:00", temp: 32, heatIndex: 35, level: "safe", adviceEn: "Moderate nighttime temperature. Replenish fluids.", adviceHi: "शरीर में पानी की कमी पूरी करने का समय।" },
  { hour: 22, timeStr: "22:00", temp: 30, heatIndex: 33, level: "safe", adviceEn: "Cooling night hours. Safe for sleep.", adviceHi: "रात का शांत और सुरक्षित समय।" },
  { hour: 23, timeStr: "23:00", temp: 29, heatIndex: 31, level: "safe", adviceEn: "Late night. Keep room well ventilated.", adviceHi: "देर रात। हवादार कमरे में विश्राम करें।" },
];

interface LivingLandscapeProps {
  lang: Language;
  onToggleLang: () => void;
  onLocationClick: () => void;
}

export default function LivingLandscape({
  lang,
  onToggleLang,
  onLocationClick,
}: LivingLandscapeProps) {
  // Current selected hour on the 24-hour ribbon (default to 14:00 peak heat)
  const [selectedHour, setSelectedHour] = useState<number>(14);

  // Matka hydration tracker state
  const [waterGlasses, setWaterGlasses] = useState<number>(4);
  const [lastDrunkTime, setLastDrunkTime] = useState<string>("13:15");
  const [nextDueTime, setNextDueTime] = useState<string>("14:00");

  // Accessibility flags
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Ribbon dragging state
  const ribbonRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startHourRef = useRef<number>(14);

  useEffect(() => {
    // Detect reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", motionListener);

    // Detect screen width
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize, { passive: true });

    return () => {
      motionQuery.removeEventListener("change", motionListener);
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  const currentPoint = HOURLY_DATA[selectedHour] || HOURLY_DATA[14];

  // Calculate Sun position along an arc across the sky
  // Sun travels between 05:00 (dawn) and 19:00 (dusk)
  const isDaytime = selectedHour >= 5 && selectedHour <= 19;
  const dayProgress = Math.max(0, Math.min(1, (selectedHour - 5) / 14));
  const sunArcAngle = dayProgress * Math.PI; // 0 to PI

  // Sun coordinate percentages for SVG viewBox (1000 x 480)
  const sunX = 90 + 720 * dayProgress; // from X=90 to X=810
  const sunY = isDaytime ? 350 - 270 * Math.sin(sunArcAngle) : 410;
  const sunOpacity = isDaytime ? 1 : 0.25;

  // Tree shadow calculation on ground (Tree trunk base at X=840, Y=380)
  const shadowSkew = (0.5 - dayProgress) * 65; // -32.5 to +32.5 degrees
  const shadowScaleX = 0.7 + Math.abs(0.5 - dayProgress) * 1.1;
  const shadowScaleY = Math.max(0.25, (1 - Math.sin(sunArcAngle)) * 0.9 + 0.3);

  // Heat-haze displacement filter scale (stronger when hotter)
  const rawHaze = Math.max(2, (currentPoint.temp - 24) * 0.8);
  const hazeScale = reducedMotion ? 0 : Math.round(isMobile ? rawHaze * 0.5 : rawHaze);

  // Drink water handler
  const handleDrinkWater = () => {
    setWaterGlasses((prev) => (prev > 0 ? prev - 1 : 4));
    const nowHour = selectedHour;
    const nextH = (nowHour + 1) % 24;
    setLastDrunkTime(`${nowHour.toString().padStart(2, "0")}:15`);
    setNextDueTime(`${nextH.toString().padStart(2, "0")}:00`);
  };

  // Drag handlers for the 24-hour ribbon
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startHourRef.current = selectedHour;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const hourDelta = Math.round(deltaX / 28);
    let newHour = startHourRef.current + hourDelta;
    if (newHour < 0) newHour = 0;
    if (newHour > 23) newHour = 23;
    setSelectedHour(newHour);
  }, []);

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="w-full flex flex-col bg-[#FBF4E6] text-[#2B3A2E]">
      {/* SVG HEAT-HAZE FILTER DEF (Isolated strictly to the distant hills) */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="springHeatHaze" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.08"
              numOctaves="1"
              result="noise"
              seed="5"
            >
              {!reducedMotion && (
                <animate
                  attributeName="baseFrequency"
                  dur="4s"
                  values="0.015 0.08; 0.018 0.06; 0.015 0.08"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={hazeScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* TOP HEADER AREA (PLAIN FLAT COLOR AREA: NO SCENE ELEMENTS BEHIND TEXT) */}
      <header className="w-full bg-[#BFDDEB] border-b-2 border-[#2B3A2E] px-5 sm:px-8 pt-7 pb-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#2B3A2E] font-serif leading-none">
                {lang === "en" ? "Heatwave Buddy" : "लू साथी"}
              </h1>
              {/* Hindi / English Toggle */}
              <button
                onClick={onToggleLang}
                className="border-2 border-[#2B3A2E] bg-[#FBF4E6] text-[#2B3A2E] px-3 py-1 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#2B3A2E] hover:text-[#FBF4E6]"
              >
                {lang === "en" ? "हिन्दी" : "ENGLISH"}
              </button>
            </div>
            <p className="text-sm sm:text-base text-[#2B3A2E] mt-2 font-medium max-w-xl leading-snug">
              {lang === "en"
                ? "Real-time heat safety for India's extreme days."
                : "अत्यधिक गर्मी में आपकी सुरक्षा का साथी।"}
            </p>
          </div>

          {/* Big "Use my location" button on plain flat sky background */}
          <div className="shrink-0">
            <button
              onClick={onLocationClick}
              className="w-full sm:w-auto border-2 border-[#2B3A2E] bg-[#2B3A2E] text-[#FBF4E6] px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer hover:bg-[#8CC49A] hover:text-[#2B3A2E] transition-none"
            >
              {lang === "en" ? "Use My Current Location" : "मेरे स्थान का उपयोग करें"}
            </button>
          </div>
        </div>
      </header>

      {/* SPRING LIVING LANDSCAPE SCENE (SHORTER: ~52vh HEIGHT ON DESKTOP) */}
      <div className="relative w-full h-[46vh] sm:h-[52vh] max-h-[460px] min-h-[310px] overflow-hidden bg-[#BFDDEB] border-b-2 border-[#2B3A2E]">
        <svg
          viewBox="0 0 1000 480"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          {/* SKY BACKGROUND (Flat Sky Blue) */}
          <rect x="0" y="0" width="1000" height="480" fill="#BFDDEB" />

          {/* LARGE FLAT SUN (Moving along arc based on 24-hour ribbon) */}
          <g
            style={{
              transform: `translate(${sunX}px, ${sunY}px)`,
              opacity: sunOpacity,
              transition: "transform 0.12s ease-out, opacity 0.2s ease",
            }}
          >
            {/* Flat butter yellow sun with peach center - no gradients */}
            <circle cx="0" cy="0" r={isMobile ? "40" : "50"} fill="#F6E3A1" />
            <circle cx="0" cy="0" r={isMobile ? "28" : "36"} fill="#F6CDB0" />
            <circle cx="0" cy="0" r={isMobile ? "40" : "50"} fill="none" stroke="#2B3A2E" strokeWidth="2" />
          </g>

          {/* LAYER 1: DISTANT SOFT ROLLING HILLS (Mint, with heat-haze wobble on horizon) */}
          <g filter={hazeScale > 0 ? "url(#springHeatHaze)" : undefined}>
            <path
              d="
                M 0,260
                Q 140,210 290,240
                Q 450,215 590,250
                Q 740,205 880,245
                Q 950,225 1000,235
                L 1000,380
                L 0,380
                Z
              "
              fill="#BFE0C4"
              stroke="#2B3A2E"
              strokeWidth="2"
            />
          </g>

          {/* LAYER 2: MID ROLLING HILLS (Fresh Leaf Green) */}
          <path
            d="
              M 0,290
              Q 180,265 340,300
              Q 510,255 690,305
              Q 850,270 1000,310
              L 1000,420
              L 0,420
              Z
            "
            fill="#8CC49A"
            stroke="#2B3A2E"
            strokeWidth="2"
          />

          {/* LAYER 3: LIGHT WINDING RIVER (Sky Blue) */}
          <path
            d="
              M 0,360
              Q 180,350 360,375
              Q 560,345 740,385
              Q 880,360 1000,375
              L 1000,420
              Q 860,405 710,430
              Q 520,390 320,415
              Q 150,395 0,405
              Z
            "
            fill="#BFDDEB"
            stroke="#2B3A2E"
            strokeWidth="1.8"
          />

          {/* Slow river ripple movement lines */}
          <g className={reducedMotion ? "" : "animate-river-flow"}>
            <line x1="120" y1="375" x2="220" y2="375" stroke="#FBF4E6" strokeWidth="2.5" />
            <line x1="380" y1="390" x2="490" y2="390" stroke="#FBF4E6" strokeWidth="2.5" />
            <line x1="640" y1="375" x2="750" y2="375" stroke="#FBF4E6" strokeWidth="2.5" />
            <line x1="820" y1="395" x2="930" y2="395" stroke="#FBF4E6" strokeWidth="2.5" />
          </g>

          {/* LAYER 4: FOREGROUND MEADOW (Cream / Mint) */}
          <path
            d="
              M 0,395
              Q 260,380 540,405
              Q 780,385 1000,400
              L 1000,480
              L 0,480
              Z
            "
            fill="#FBF4E6"
            stroke="#2B3A2E"
            strokeWidth="2.5"
          />

          {/* BUTTERFLIES FLUTTERING OVER THE SPRING MEADOW */}
          <g className={reducedMotion ? "" : "animate-butterfly-1"}>
            <g transform="translate(310, 200)">
              {/* Left wing */}
              <path d="M 0,0 C -12,-10 -15,5 0,8 Z" fill="#F6E3A1" stroke="#2B3A2E" strokeWidth="1.2" />
              {/* Right wing */}
              <path d="M 0,0 C 12,-10 15,5 0,8 Z" fill="#F3C6CF" stroke="#2B3A2E" strokeWidth="1.2" />
              {/* Body */}
              <line x1="0" y1="-4" x2="0" y2="10" stroke="#2B3A2E" strokeWidth="1.8" />
            </g>
          </g>

          <g className={reducedMotion ? "" : "animate-butterfly-2"}>
            <g transform="translate(540, 240)">
              {/* Left wing */}
              <path d="M 0,0 C -10,-8 -12,4 0,6 Z" fill="#F3C6CF" stroke="#2B3A2E" strokeWidth="1.2" />
              {/* Right wing */}
              <path d="M 0,0 C 10,-8 12,4 0,6 Z" fill="#F6E3A1" stroke="#2B3A2E" strokeWidth="1.2" />
              {/* Body */}
              <line x1="0" y1="-3" x2="0" y2="8" stroke="#2B3A2E" strokeWidth="1.6" />
            </g>
          </g>

          {/* DYNAMIC TREE GROUND SHADOW (Angle and length change with sun) */}
          {isDaytime && (
            <ellipse
              cx="840"
              cy="435"
              rx={85 * shadowScaleX}
              ry={18 * shadowScaleY}
              fill="#2B3A2E"
              fillOpacity="0.3"
              style={{
                transform: `rotate(${shadowSkew}deg)`,
                transformOrigin: "840px 435px",
                transition: "transform 0.12s ease-out, rx 0.12s ease, ry 0.12s ease",
              }}
            />
          )}

          {/* LAYER 5: LARGE BLOSSOMING TREE (Clearly drawn trunk & branches, rounded blossom canopy) */}
          <g>
            {/* Trunk and branching structure in #2B3A2E - clear, elegant branches, not a blob */}
            <path
              d="
                M 825,435
                L 835,330
                L 820,270
                L 838,200
                L 846,270
                L 848,335
                L 865,435
                Z
              "
              fill="#2B3A2E"
            />
            {/* Left primary branch */}
            <path
              d="
                M 830,300
                C 785,260 740,240 710,250
                C 745,235 795,250 834,285
                Z
              "
              fill="#2B3A2E"
            />
            {/* Right primary branch */}
            <path
              d="
                M 845,290
                C 890,250 935,230 965,245
                C 930,225 880,240 842,275
                Z
              "
              fill="#2B3A2E"
            />
            {/* Upper secondary twigs */}
            <line x1="838" y1="205" x2="815" y2="160" stroke="#2B3A2E" strokeWidth="6" />
            <line x1="838" y1="205" x2="865" y2="155" stroke="#2B3A2E" strokeWidth="6" />
            <line x1="750" y1="250" x2="725" y2="210" stroke="#2B3A2E" strokeWidth="4.5" />
            <line x1="915" y1="240" x2="945" y2="200" stroke="#2B3A2E" strokeWidth="4.5" />

            {/* Overlapping rounded canopy made of flat blossom shapes and fresh leaves */}
            <g className={reducedMotion ? "" : "animate-blossom-sway"}>
              {/* Back canopy clusters in Peach */}
              <circle cx="760" cy="220" r="44" fill="#F6CDB0" stroke="#2B3A2E" strokeWidth="1.8" />
              <circle cx="910" cy="210" r="46" fill="#F6CDB0" stroke="#2B3A2E" strokeWidth="1.8" />
              <circle cx="840" cy="155" r="50" fill="#F6CDB0" stroke="#2B3A2E" strokeWidth="1.8" />

              {/* Main blossom canopy in Blossom Pink */}
              <circle cx="720" cy="245" r="38" fill="#F3C6CF" stroke="#2B3A2E" strokeWidth="2" />
              <circle cx="785" cy="180" r="45" fill="#F3C6CF" stroke="#2B3A2E" strokeWidth="2" />
              <circle cx="890" cy="170" r="48" fill="#F3C6CF" stroke="#2B3A2E" strokeWidth="2" />
              <circle cx="950" cy="235" r="40" fill="#F3C6CF" stroke="#2B3A2E" strokeWidth="2" />
              <circle cx="840" cy="225" r="52" fill="#F3C6CF" stroke="#2B3A2E" strokeWidth="2" />

              {/* Foreground petal clusters & fresh leaf accents */}
              <circle cx="810" cy="240" r="32" fill="#F6CDB0" stroke="#2B3A2E" strokeWidth="1.8" />
              <circle cx="875" cy="230" r="34" fill="#F3C6CF" stroke="#2B3A2E" strokeWidth="1.8" />

              {/* Fresh leaf touches */}
              <path d="M 700,240 C 690,225 710,220 715,235 Z" fill="#8CC49A" stroke="#2B3A2E" strokeWidth="1.2" />
              <path d="M 965,220 C 975,205 955,200 950,215 Z" fill="#8CC49A" stroke="#2B3A2E" strokeWidth="1.2" />
              <path d="M 835,130 C 825,115 845,110 850,125 Z" fill="#8CC49A" stroke="#2B3A2E" strokeWidth="1.2" />
            </g>

            {/* SLOWLY FALLING BLOSSOM PETALS (Small flat shapes, low count) */}
            <g>
              <path
                d="M 740,270 C 743,266 747,269 745,273 C 743,276 738,274 740,270 Z"
                fill="#F3C6CF"
                stroke="#2B3A2E"
                strokeWidth="1"
                className={reducedMotion ? "" : "animate-petal-1"}
              />
              <path
                d="M 880,260 C 883,256 887,259 885,263 C 883,266 878,264 880,260 Z"
                fill="#F3C6CF"
                stroke="#2B3A2E"
                strokeWidth="1"
                className={reducedMotion ? "" : "animate-petal-2"}
              />
              <path
                d="M 810,285 C 813,281 817,284 815,288 C 813,291 808,289 810,285 Z"
                fill="#F6CDB0"
                stroke="#2B3A2E"
                strokeWidth="1"
                className={reducedMotion ? "" : "animate-petal-3"}
              />
            </g>
          </g>

          {/* LAYER 6: FOREGROUND CLAY WATER POT (MATKA) IN THE SCENE */}
          <g transform="translate(65, 375)">
            {/* Matka base stand */}
            <ellipse cx="40" cy="62" rx="22" ry="5" fill="#2B3A2E" />
            {/* Pot body in Peach with #2B3A2E outline */}
            <path
              d="
                M 24,28
                C 6,38 2,54 20,62
                C 32,67 48,67 60,62
                C 78,54 74,38 56,28
                Z
              "
              fill="#F6CDB0"
              stroke="#2B3A2E"
              strokeWidth="2.2"
            />
            {/* Neck and mouth lip */}
            <path
              d="
                M 24,28
                L 28,16
                C 26,12 54,12 52,16
                L 56,28
                Z
              "
              fill="#F6CDB0"
              stroke="#2B3A2E"
              strokeWidth="2"
            />
            <ellipse cx="40" cy="14" rx="14" ry="4" fill="#2B3A2E" />

            {/* Water level indicator inside pot */}
            <line
              x1="20"
              y1={38 + (4 - waterGlasses) * 5}
              x2="60"
              y2={38 + (4 - waterGlasses) * 5}
              stroke="#BFDDEB"
              strokeWidth="3.5"
            />
            <text
              x="40"
              y="54"
              fill="#2B3A2E"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              {waterGlasses}/4
            </text>
          </g>
        </svg>

        {/* CLAY POT HYDRATION CONTROL: DRAWN AS PART OF SCENE, NOT A BORDERED BOX */}
        <div className="absolute bottom-3 left-32 sm:left-36 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 z-20 pointer-events-auto">
          <div className="text-xs text-[#2B3A2E] leading-tight">
            <span className="font-bold text-[#2B3A2E] block">
              {lang === "en" ? "Clay Pot Water" : "मटके का ताजा पानी"}
            </span>
            <span className="text-[11px] opacity-85">
              {lang === "en" ? `Next due: ${nextDueTime}` : `अगला समय: ${nextDueTime}`}
            </span>
          </div>
          <button
            onClick={handleDrinkWater}
            className="border-2 border-[#2B3A2E] bg-[#2B3A2E] text-[#FBF4E6] px-3 py-1 text-xs font-bold uppercase tracking-wide cursor-pointer hover:bg-[#8CC49A] hover:text-[#2B3A2E] transition-none"
          >
            {lang === "en" ? "I Drank Water" : "मैंने पानी पिया"}
          </button>
        </div>
      </div>

      {/* BELOW THE SCENE (FLAT CREAM #FBF4E6 BACKGROUND: NEVER OVER HILLS OR TREE) */}
      <section className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-6 flex flex-col gap-5">
        {/* LIVE TEMPERATURE HEADLINE & ADVICE SENTENCE */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 border-b-2 border-[#2B3A2E] pb-4">
          <div className="flex flex-wrap items-baseline gap-3">
            {/* Large numeral styled like newspaper headline */}
            <span className="text-5xl sm:text-6xl font-bold font-serif text-[#2B3A2E] leading-none">
              {currentPoint.temp}°C
            </span>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2B3A2E] border-2 border-[#2B3A2E] px-2 py-0.5 bg-[#F6CDB0]">
              {lang === "en" ? "Feels Like" : "हीट इंडेक्स"}: {currentPoint.heatIndex}°C
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-wider text-[#2B3A2E] border-2 border-[#2B3A2E] px-2 py-0.5 bg-[#F6E3A1]">
              {currentPoint.timeStr}
            </span>
          </div>

          <div className="text-sm sm:text-base font-medium text-[#2B3A2E] md:text-right max-w-xl leading-snug">
            {lang === "en" ? currentPoint.adviceEn : currentPoint.adviceHi}
          </div>
        </div>

        {/* 24-HOUR RIBBON: FULLY VISIBLE IN ITS OWN ROW ON FLAT CREAM BACKGROUND */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2B3A2E]">
            <span>{lang === "en" ? "24-Hour Ribbon (Drag or Tap)" : "24 घंटे की पट्टी (खींचें या टैप करें)"}</span>
            <span className="text-[#2B3A2E] opacity-75">
              {lang === "en" ? "Moves Sun & Tree Shadow Live" : "सूर्य व छाया की स्थिति बदलती है"}
            </span>
          </div>

          {/* Draggable ribbon bar */}
          <div
            ref={ribbonRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-14 border-2 border-[#2B3A2E] bg-[#FBF4E6] flex items-center overflow-x-auto cursor-grab active:cursor-grabbing touch-pan-x"
          >
            {HOURLY_DATA.map((pt) => {
              const isSelected = pt.hour === selectedHour;
              const isPeak = pt.temp >= 43;
              return (
                <button
                  key={pt.hour}
                  onClick={() => setSelectedHour(pt.hour)}
                  className={`flex-1 min-w-[46px] h-full flex flex-col items-center justify-center border-r border-[#2B3A2E] text-xs transition-none cursor-pointer ${
                    isSelected
                      ? "bg-[#2B3A2E] text-[#FBF4E6] font-bold"
                      : isPeak
                      ? "bg-[#F6CDB0] text-[#2B3A2E] hover:bg-[#F6E3A1]"
                      : "bg-[#FBF4E6] text-[#2B3A2E] hover:bg-[#BFE0C4]"
                  }`}
                >
                  <span className="text-[11px] leading-tight font-medium">
                    {pt.hour.toString().padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[10px] leading-tight font-bold ${
                      isSelected ? "text-[#F6E3A1]" : "text-[#2B3A2E]"
                    }`}
                  >
                    {pt.temp}°
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
