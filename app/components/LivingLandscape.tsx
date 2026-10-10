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

// 24-hour meteorological summer profile for North/Central India
const HOURLY_DATA: HourlyPoint[] = [
  { hour: 0, timeStr: "00:00", temp: 28, heatIndex: 30, level: "safe", adviceEn: "Night cooling window. Open cross-ventilation.", adviceHi: "रात का ठंडा समय। कमरों में हवा आने दें।" },
  { hour: 1, timeStr: "01:00", temp: 27, heatIndex: 29, level: "safe", adviceEn: "Safe rest hours. Keep drinking water near bed.", adviceHi: "विश्राम का समय। बिस्तर के पास पानी रखें।" },
  { hour: 2, timeStr: "02:00", temp: 27, heatIndex: 28, level: "safe", adviceEn: "Lowest temperature of the 24-hour cycle.", adviceHi: "दिन का न्यूनतम तापमान। शांतिपूर्ण समय।" },
  { hour: 3, timeStr: "03:00", temp: 26, heatIndex: 28, level: "safe", adviceEn: "Coolest atmospheric hours.", adviceHi: "वातावरण का सबसे शीतल समय।" },
  { hour: 4, timeStr: "04:00", temp: 26, heatIndex: 28, level: "safe", adviceEn: "Pre-dawn hours. Excellent for early outdoor chores.", adviceHi: "भोर का समय। जरूरी काम जल्दी शुरू करें।" },
  { hour: 5, timeStr: "05:00", temp: 28, heatIndex: 30, level: "safe", adviceEn: "Dawn begins. Drink fresh water before day starts.", adviceHi: "सुबह की शुरुआत। दिन शुरू करने से पहले पानी पिएं।" },
  { hour: 6, timeStr: "06:00", temp: 30, heatIndex: 32, level: "safe", adviceEn: "Sun rises. Best window for farm and field labor.", adviceHi: "सूर्योदय। खेत और बाहर के भारी काम का सबसे अच्छा समय।" },
  { hour: 7, timeStr: "07:00", temp: 32, heatIndex: 34, level: "caution", adviceEn: "Temperature climbing. Cover head with cotton cloth.", adviceHi: "धूप तेज हो रही है। सिर पर सूती गमछा बांधें।" },
  { hour: 8, timeStr: "08:00", temp: 34, heatIndex: 37, level: "caution", adviceEn: "Moderate heat. Start periodic hydration stops.", adviceHi: "गर्मी बढ़ रही है। हर घंटे पानी पीना शुरू करें।" },
  { hour: 9, timeStr: "09:00", temp: 37, heatIndex: 40, level: "caution", adviceEn: "Rapid heating. Complete direct sun tasks now.", adviceHi: "तेज धूप। सीधी धूप वाले काम अब समाप्त करें।" },
  { hour: 10, timeStr: "10:00", temp: 39, heatIndex: 43, level: "danger", adviceEn: "Heat hazard begins. Move toward covered shade.", adviceHi: "खतरा शुरू। छायादार स्थानों की ओर जाएं।" },
  { hour: 11, timeStr: "11:00", temp: 41, heatIndex: 46, level: "danger", adviceEn: "Critical radiant heat. Avoid strenuous outdoor effort.", adviceHi: "भीषण धूप। बाहर भारी मेहनत का काम बंद रखें।" },
  { hour: 12, timeStr: "12:00", temp: 43, heatIndex: 48, level: "extreme", adviceEn: "PEAK HEATWAVE. Prohibit direct solar exposure.", adviceHi: "चरम लू का समय। सीधी धूप में निकलना सख्त मना है।" },
  { hour: 13, timeStr: "13:00", temp: 45, heatIndex: 51, level: "extreme", adviceEn: "SEVERE DANGER. Maximum heat stroke risk. Rest strictly.", adviceHi: "अत्यधिक गंभीर खतरा। केवल आराम करें और पानी पिएं।" },
  { hour: 14, timeStr: "14:00", temp: 45, heatIndex: 51, level: "extreme", adviceEn: "SOLAR ZENITH PEAK. Drink ORS and stay indoors.", adviceHi: "भीषणतम लू। ओआरएस पिएं और कमरे में रहें।" },
  { hour: 15, timeStr: "15:00", temp: 44, heatIndex: 49, level: "extreme", adviceEn: "Extreme ground radiation. Asphalt temperature over 60°C.", adviceHi: "सड़कें अत्यधिक गर्म। दोपहिया वाहन संभलकर चलाएं।" },
  { hour: 16, timeStr: "16:00", temp: 43, heatIndex: 47, level: "danger", adviceEn: "Hot dry wind (Loo) active. Keep eyes and face covered.", adviceHi: "गर्म पछुआ हवा (लू)। चेहरा और आंखें ढक कर रखें।" },
  { hour: 17, timeStr: "17:00", temp: 41, heatIndex: 44, level: "danger", adviceEn: "Gradual cooling begins. Stay under tree or building shade.", adviceHi: "तापमान धीरे-धीरे कम हो रहा है। छांव में ही रहें।" },
  { hour: 18, timeStr: "18:00", temp: 38, heatIndex: 41, level: "caution", adviceEn: "Sunset approaches. Safer for evening transit.", adviceHi: "सूर्यास्त का समय। आवागमन के लिए अपेक्षाकृत सुरक्षित।" },
  { hour: 19, timeStr: "19:00", temp: 36, heatIndex: 39, level: "caution", adviceEn: "Dusk. Heat dissipates slowly from concrete.", adviceHi: "शाम का समय। भरपूर पानी और छाछ पिएं।" },
  { hour: 20, timeStr: "20:00", temp: 34, heatIndex: 37, level: "caution", adviceEn: "Warm night breeze. Safe for dinner and errands.", adviceHi: "शाम के काम और भोजन का समय।" },
  { hour: 21, timeStr: "21:00", temp: 32, heatIndex: 35, level: "safe", adviceEn: "Moderate nighttime temperature. Replenish fluids.", adviceHi: "शरीर में पानी की कमी पूरी करने का समय।" },
  { hour: 22, timeStr: "22:00", temp: 30, heatIndex: 33, level: "safe", adviceEn: "Cooling night hours. Safe for sleep.", adviceHi: "रात का शांत और सुरक्षित समय।" },
  { hour: 23, timeStr: "23:00", temp: 29, heatIndex: 31, level: "safe", adviceEn: "Late night. Keep room ventilated.", adviceHi: "देर रात। हवादार कमरे में विश्राम करें।" },
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
  // Current selected hour on the 24-hour ribbon (default to 14:00 peak heat demo)
  const [selectedHour, setSelectedHour] = useState<number>(14);

  // Parallax scroll offset
  const [scrollY, setScrollY] = useState<number>(0);

  // Matka hydration tracker state
  const [waterGlasses, setWaterGlasses] = useState<number>(4);
  const [lastDrunkTime, setLastDrunkTime] = useState<string>("13:15");
  const [nextDueTime, setNextDueTime] = useState<string>("14:00");

  // Accessibility / performance flags
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Ribbon dragging state
  const ribbonRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startHourRef = useRef<number>(14);

  useEffect(() => {
    // Check reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", motionListener);

    // Check screen size
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize, { passive: true });

    // Parallax scroll listener
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      motionQuery.removeEventListener("change", motionListener);
      window.removeEventListener("resize", checkSize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const currentPoint = HOURLY_DATA[selectedHour] || HOURLY_DATA[14];

  // Calculate Sun position along an arc across the sky
  // Sun travels between 05:00 (dawn) and 19:00 (dusk)
  // When hour < 5 or > 19, sun sits below horizon
  const isDaytime = selectedHour >= 5 && selectedHour <= 19;
  const dayProgress = Math.max(0, Math.min(1, (selectedHour - 5) / 14));
  const sunArcAngle = dayProgress * Math.PI; // 0 to PI

  // Sun coordinate percentages
  const sunX = 12 + 76 * dayProgress; // from 12% to 88% width
  const sunY = isDaytime ? 70 - 52 * Math.sin(sunArcAngle) : 85; // arc height
  const sunOpacity = isDaytime ? 1 : 0.25;

  // Tree shadow calculation based on sun position
  // Tree base is at X=82%, Y=78%
  // Morning (sun left): shadow points right/long
  // Noon (sun overhead): shadow short and directly beneath
  // Afternoon (sun right): shadow points left/long
  const shadowSkew = (0.5 - dayProgress) * 75; // -37.5 to +37.5 deg
  const shadowScaleX = 0.6 + Math.abs(0.5 - dayProgress) * 1.4;
  const shadowScaleY = Math.max(0.2, (1 - Math.sin(sunArcAngle)) * 1.2 + 0.25);

  // Heat-haze displacement filter scale (stronger when hotter)
  // At 26°C scale is 2, at 45°C scale is 18 (reduced by half on mobile for performance)
  const rawHaze = Math.max(2, (currentPoint.temp - 24) * 0.85);
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
    // Every 24px of horizontal drag equals 1 hour
    const hourDelta = Math.round(deltaX / 26);
    let newHour = startHourRef.current + hourDelta;
    if (newHour < 0) newHour = 0;
    if (newHour > 23) newHour = 23;
    setSelectedHour(newHour);
  }, []);

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#EFE0C0] text-[#16130F] select-none">
      {/* SVG HEAT-HAZE FILTER DEF (Isolated strictly to the horizon strip) */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="heatHaze" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.08"
              numOctaves="1"
              result="noise"
              seed="2"
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

      {/* FULL-SCREEN ILLUSTRATED SCENE (FLAT-COLOUR PAPER-CUT SVG SHAPES) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          {/* SKY BACKGROUND (Fixed flat turmeric wash) */}
          <rect x="0" y="0" width="1200" height="800" fill="#EFE0C0" />
          <rect x="0" y="0" width="1200" height="380" fill="#E3A81F" fillOpacity="0.22" />

          {/* BIRDS CROSSING THE SKY SLOWLY */}
          <g className={reducedMotion ? "" : "animate-bird-flight"} opacity="0.85">
            <path
              d="M 120,110 Q 128,102 136,110 Q 144,102 152,110 Q 136,116 120,110 Z"
              fill="#16130F"
            />
            <path
              d="M 155,95 Q 161,89 167,95 Q 173,89 179,95 Q 167,100 155,95 Z"
              fill="#16130F"
            />
            <path
              d="M 190,122 Q 196,117 202,122 Q 208,117 214,122 Q 202,127 190,122 Z"
              fill="#16130F"
            />
          </g>

          {/* LARGE FLAT SUN (Positioned along arc from 24-hour ribbon) */}
          <g
            style={{
              transform: `translate(${sunX * 12}px, ${sunY * 8}px)`,
              opacity: sunOpacity,
              transition: "transform 0.12s ease-out, opacity 0.2s ease",
            }}
          >
            {/* Flat sun - strictly no gradients, solid turmeric circle */}
            <circle cx="0" cy="0" r={isMobile ? "48" : "64"} fill="#E3A81F" />
            <circle cx="0" cy="0" r={isMobile ? "38" : "50"} fill="#C4552F" fillOpacity="0.35" />
          </g>

          {/* LAYER 1: DISTANT HILLS WITH HEAT-HAZE WOBBLE (Parallax speed 0.1) */}
          <g
            filter={hazeScale > 0 ? "url(#heatHaze)" : undefined}
            style={{
              transform: `translateY(${scrollY * 0.08}px)`,
            }}
          >
            {/* Paper-cut angular distant ridge in terracotta */}
            <polygon
              points="
                0,380
                95,355
                180,368
                310,332
                450,360
                580,325
                710,358
                850,330
                990,362
                1120,338
                1200,352
                1200,520
                0,520
              "
              fill="#C4552F"
            />
          </g>

          {/* LAYER 2: MID HILLS (Deep Leaf Green, Parallax speed 0.2) */}
          <g
            style={{
              transform: `translateY(${scrollY * 0.16}px)`,
            }}
          >
            {/* Confident hand-cut polygon shapes */}
            <polygon
              points="
                0,430
                140,395
                260,422
                410,380
                560,418
                720,375
                880,412
                1040,378
                1200,420
                1200,600
                0,600
              "
              fill="#1E4A38"
            />
          </g>

          {/* LAYER 3: RIVER (River Indigo, sweeping across lower midground) */}
          <g
            style={{
              transform: `translateY(${scrollY * 0.24}px)`,
            }}
          >
            <polygon
              points="
                0,520
                180,510
                360,535
                580,515
                820,545
                1050,525
                1200,540
                1200,640
                1020,650
                740,620
                450,645
                210,615
                0,635
              "
              fill="#24407A"
            />

            {/* Slow river ripple movement lines */}
            <g className={reducedMotion ? "" : "animate-river-ripple"}>
              <line x1="120" y1="550" x2="260" y2="550" stroke="#EFE0C0" strokeWidth="2.5" />
              <line x1="380" y1="575" x2="520" y2="575" stroke="#E3A81F" strokeWidth="2" />
              <line x1="680" y1="565" x2="840" y2="565" stroke="#EFE0C0" strokeWidth="2.5" />
              <line x1="940" y1="580" x2="1080" y2="580" stroke="#E3A81F" strokeWidth="2" />
            </g>
          </g>

          {/* LAYER 4: FOREGROUND EARTH (Flat clay cream / terracotta soil) */}
          <polygon
            points="
              0,605
              250,585
              520,610
              780,580
              1020,605
              1200,590
              1200,800
              0,800
            "
            fill="#EFE0C0"
          />
          <line x1="0" y1="605" x2="1200" y2="590" stroke="#16130F" strokeWidth="3" />

          {/* DYNAMIC TREE SHADOW (Angle and length change with sun) */}
          {isDaytime && (
            <ellipse
              cx="1010"
              cy="670"
              rx={110 * shadowScaleX}
              ry={22 * shadowScaleY}
              fill="#16130F"
              fillOpacity="0.45"
              style={{
                transform: `rotate(${shadowSkew}deg)`,
                transformOrigin: "1010px 670px",
                transition: "transform 0.12s ease-out, rx 0.12s ease, ry 0.12s ease",
              }}
            />
          )}

          {/* LAYER 5: LARGE PEEPAL TREE (On right side) */}
          <g
            style={{
              transform: `translateY(${scrollY * 0.05}px)`,
            }}
          >
            {/* Trunk and heavy roots in Ink */}
            <path
              d="
                M 990,670
                L 1005,530
                L 985,460
                L 1015,380
                L 1030,460
                L 1020,535
                L 1045,670
                L 1070,685
                L 1020,675
                L 965,685
                Z
              "
              fill="#16130F"
            />
            {/* Large side branches */}
            <path
              d="
                M 1010,430
                Q 940,400 905,435
                Q 935,420 1005,445
                Z
              "
              fill="#16130F"
            />
            <path
              d="
                M 1025,410
                Q 1085,370 1120,400
                Q 1075,390 1020,425
                Z
              "
              fill="#16130F"
            />

            {/* Peepal Foliage clusters (Deep Leaf Green with gentle sway) */}
            <g className={reducedMotion ? "" : "animate-leaf-sway"}>
              {/* Main canopy paper-cut lobes */}
              <polygon points="900,430 960,370 1020,380 970,450" fill="#1E4A38" />
              <polygon points="970,390 1030,310 1090,340 1040,410" fill="#1E4A38" />
              <polygon points="1040,350 1110,290 1170,330 1110,390" fill="#1E4A38" />
              <polygon points="870,470 940,420 990,460 920,510" fill="#1E4A38" />
              <polygon points="1060,420 1130,370 1180,415 1115,460" fill="#1E4A38" />
              <polygon points="980,460 1040,410 1080,450 1015,490" fill="#1E4A38" />

              {/* Heart-shaped peepal leaf silhouettes */}
              <path
                d="M 920,435 C 910,410 935,410 945,425 C 955,410 980,410 970,435 L 945,460 Z"
                fill="#1E4A38"
              />
              <path
                d="M 1040,360 C 1030,335 1055,335 1065,350 C 1075,335 1100,335 1090,360 L 1065,385 Z"
                fill="#1E4A38"
              />
              <path
                d="M 1120,400 C 1110,375 1135,375 1145,390 C 1155,375 1180,375 1170,400 L 1145,425 Z"
                fill="#1E4A38"
              />
            </g>
          </g>

          {/* LAYER 6: FOREGROUND CLAY WATER POT (MATKA) */}
          <g transform="translate(140, 580)">
            {/* Matka base ring */}
            <ellipse cx="60" cy="115" rx="35" ry="9" fill="#16130F" />
            {/* Bulbous pot body in Terracotta */}
            <path
              d="
                M 35,60
                C 10,75 5,105 30,118
                C 50,126 70,126 90,118
                C 115,105 110,75 85,60
                Z
              "
              fill="#C4552F"
              stroke="#16130F"
              strokeWidth="3"
            />
            {/* Matka neck and thick rolled lip */}
            <path
              d="
                M 35,60
                L 40,42
                C 38,36 82,36 80,42
                L 85,60
                Z
              "
              fill="#C4552F"
              stroke="#16130F"
              strokeWidth="2.5"
            />
            <ellipse cx="60" cy="38" rx="22" ry="6" fill="#16130F" />

            {/* Hydration water level mark lines inside matka */}
            <line
              x1="32"
              y1={75 + (4 - waterGlasses) * 8}
              x2="88"
              y2={75 + (4 - waterGlasses) * 8}
              stroke="#24407A"
              strokeWidth="4"
            />
            <text
              x="60"
              y="102"
              fill="#16130F"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="inherit"
            >
              {waterGlasses}/4
            </text>
          </g>
        </svg>
      </div>

      {/* OVER THE SCENE (HEADER & PRIMARY CALL TO ACTION) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 pt-8 pb-4 flex flex-col justify-between flex-1">
        {/* TOP ROW: BRAND & LANGUAGE TOGGLE */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#16130F] font-serif leading-none">
              {lang === "en" ? "Heatwave Buddy" : "लू साथी"}
            </h1>
            <p className="text-sm sm:text-base text-[#16130F] mt-2 font-medium max-w-md leading-snug">
              {lang === "en"
                ? "Real-time heat safety for India's extreme days."
                : "अत्यधिक गर्मी में आपकी सुरक्षा का साथी।"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleLang}
              className="border-2 border-[#16130F] bg-[#EFE0C0] text-[#16130F] px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase cursor-pointer hover:bg-[#16130F] hover:text-[#EFE0C0]"
            >
              {lang === "en" ? "हिन्दी" : "ENGLISH"}
            </button>
          </div>
        </header>

        {/* MIDDLE CALLOUT: USE MY LOCATION BUTTON & MATKA DRINK BUTTON */}
        <div className="my-auto py-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <button
              onClick={onLocationClick}
              className="border-2 border-[#16130F] bg-[#16130F] text-[#EFE0C0] px-6 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider cursor-pointer hover:bg-[#C4552F] hover:border-[#C4552F]"
            >
              {lang === "en" ? "Use My Current Location" : "मेरे स्थान का उपयोग करें"}
            </button>
            <span className="text-xs text-[#16130F] font-medium">
              {lang === "en"
                ? "Detects live weather and calculates hourly danger thresholds."
                : "सटीक मौसम और खतरे के घंटों की पहचान करता है।"}
            </span>
          </div>

          {/* MATKA HYDRATION COUNTER BUTTON */}
          <div className="border-2 border-[#16130F] bg-[#EFE0C0] p-3 flex flex-col gap-1.5 max-w-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-[#C4552F]">
              {lang === "en" ? "Clay Pot Hydration" : "मटका जल ट्रैकर"}
            </div>
            <div className="text-xs text-[#16130F]">
              {lang === "en" ? "Next drink due: " : "अगला पानी: "}
              <strong className="font-bold text-[#24407A]">{nextDueTime}</strong>
              <span className="block text-[11px] opacity-80">
                {lang === "en"
                  ? `Last intake logged at ${lastDrunkTime}`
                  : `अंतिम बार पिया: ${lastDrunkTime}`}
              </span>
            </div>
            <button
              onClick={handleDrinkWater}
              className="border border-[#16130F] bg-[#C4552F] text-[#EFE0C0] px-3 py-1 text-xs font-bold uppercase tracking-wide cursor-pointer hover:bg-[#16130F]"
            >
              {lang === "en" ? "I Drank Water" : "मैंने पानी पिया"}
            </button>
          </div>
        </div>

        {/* BOTTOM OF HERO: 24-HOUR INTERACTIVE RIBBON */}
        <div className="w-full pt-4 pb-2">
          {/* LIVE STATUS BAR ABOVE RIBBON */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b-2 border-[#16130F] pb-2 mb-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold font-serif text-[#16130F]">
                {currentPoint.temp}°C
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C4552F]">
                {lang === "en" ? "Feels Like" : "हीट इंडेक्स"}: {currentPoint.heatIndex}°C
              </span>
              <span className="text-xs font-bold tracking-wider text-[#1E4A38]">
                [{currentPoint.timeStr}]
              </span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#16130F] sm:text-right max-w-lg">
              {lang === "en" ? currentPoint.adviceEn : currentPoint.adviceHi}
            </div>
          </div>

          {/* DRAGGABLE RIBBON STRIP */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#16130F]/70">
              <span>{lang === "en" ? "Drag 24-Hour Timeline" : "24 घंटे की पट्टी खींचें"}</span>
              <span className="text-[#C4552F]">
                {lang === "en" ? "Sun Moves Across Sky" : "सूर्य की स्थिति बदलती है"}
              </span>
            </div>

            <div
              ref={ribbonRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative w-full h-14 border-2 border-[#16130F] bg-[#EFE0C0] flex items-center overflow-x-auto cursor-grab active:cursor-grabbing touch-pan-x"
            >
              {HOURLY_DATA.map((pt) => {
                const isSelected = pt.hour === selectedHour;
                const isPeak = pt.temp >= 43;
                return (
                  <button
                    key={pt.hour}
                    onClick={() => setSelectedHour(pt.hour)}
                    className={`flex-1 min-w-[46px] h-full flex flex-col items-center justify-center border-r border-[#16130F] text-xs transition-none ${
                      isSelected
                        ? "bg-[#16130F] text-[#EFE0C0] font-bold"
                        : isPeak
                        ? "bg-[#E3A81F]/30 text-[#16130F] hover:bg-[#E3A81F]/60"
                        : "bg-transparent text-[#16130F] hover:bg-[#EFE0C0]"
                    }`}
                  >
                    <span className="text-[11px] leading-tight font-medium">
                      {pt.hour.toString().padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[10px] leading-tight ${
                        isSelected
                          ? "text-[#E3A81F]"
                          : isPeak
                          ? "text-[#C4552F] font-bold"
                          : "text-[#16130F]/80"
                      }`}
                    >
                      {pt.temp}°
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
