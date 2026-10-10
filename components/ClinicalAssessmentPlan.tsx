"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/context/AppStateContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Sun01Icon,
  Call02Icon
} from "@hugeicons/core-free-icons";

export default function ClinicalAssessmentPlan() {
  const {
    lang,
    city,
    setCity,
    age,
    setAge,
    occupation,
    setOccupation,
    sunHours,
    setSunHours,
    fullName,
    setFullName,
    exactAge,
    setExactAge,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    workEnvironment,
    setWorkEnvironment,
    sunAllergies,
    setSunAllergies,
    hasMigraines,
    setHasMigraines,
    hasHeatstrokeHistory,
    setHasHeatstrokeHistory,
    hasBloodPressureSensitivity,
    setHasBloodPressureSensitivity,
    protectiveGear,
    toggleProtectiveGear,
    assessmentStep,
    setAssessmentStep,
    setActiveModal
  } = useAppState();

  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [smsQueuing, setSmsQueuing] = useState(false);

  // Available Indian cities
  const cityOptions = [
    "Delhi (National Capital Territory)",
    "Mumbai (Maharashtra)",
    "Kolkata (West Bengal)",
    "Chennai (Tamil Nadu)",
    "Bengaluru (Karnataka)",
    "Hyderabad (Telangana)",
    "Jaipur (Rajasthan)",
    "Ahmedabad (Gujarat)",
    "Lucknow (Uttar Pradesh)",
    "Pune (Maharashtra)"
  ];

  // Age brackets
  const ageOptions = ["Under 18", "18 to 30", "31 to 45", "46 to 60", "Over 60"];

  // Occupations
  const occupationOptions = [
    "Delivery Driver",
    "Outdoor Construction Worker",
    "Farmer / Agricultural Laborer",
    "Traffic Police / Field Security",
    "Student / Commuter",
    "Office / Indoor Worker",
    "Senior Citizen / At Home"
  ];

  // Work environments
  const environmentOptions = [
    "Outdoor Direct Sun (Road / Farm / Construction)",
    "Mixed Indoor / Outdoor Transit",
    "Indoor Non-AC / Semi-Ventilated",
    "Indoor Air-Conditioned"
  ];

  // Exposure buckets
  const sunHourOptions: Array<"Up to 2 hours" | "2 to 6 hours" | "More than 6 hours"> = [
    "Up to 2 hours",
    "2 to 6 hours",
    "More than 6 hours"
  ];

  // Protective gear catalog
  const gearCatalog = [
    "Wide Brim Hat / Cap",
    "Umbrella",
    "UV Sunglasses",
    "Cotton Scarf / Bandana",
    "Insulated Water Bottle",
    "ORS Packets",
    "Cooling Neck Ring / Towel"
  ];

  const handleDownloadPdf = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      setPdfGenerating(false);
      setActiveModal("pdf_downloaded");
    }, 600);
  };

  const handleSendSms = () => {
    setSmsQueuing(true);
    setTimeout(() => {
      setSmsQueuing(false);
      setActiveModal("sms_sent");
    }, 600);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Title & Subtitle matching Photo 1 */}
      <div className="text-center flex flex-col gap-2.5 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#1E2A44] tracking-tight leading-tight">
          {lang === "hi" ? "भीषण गर्मी में अपनी दैनिक सुरक्षा योजना बनाएं" : "Plan Your Day in the Heat"}
        </h1>
        <p className="text-sm sm:text-base text-[#5B6577] font-medium leading-relaxed">
          {lang === "hi"
            ? "अपने या परिवार के सदस्य के लिए चिकित्सा-स्तर का विस्तृत हीट सुरक्षा कार्यक्रम तैयार करने के लिए यह 2-चरणीय मूल्यांकन पूरा करें।"
            : "Complete this 2-step assessment to generate an intensive medical-grade heat protection itinerary for you or your family member."}
        </p>
      </div>

      {/* Step Navigation Pill Indicator (Photo 1) */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 my-2">
        {/* Step 1 Pill */}
        <button
          type="button"
          onClick={() => setAssessmentStep(1)}
          className={`inline-flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-full border text-xs sm:text-sm font-black transition-all cursor-pointer ${
            assessmentStep === 1
              ? "bg-[#FFFAF4] border-[#F47A1F] text-[#1E2A44] shadow-sm ring-2 ring-[#F47A1F]/20"
              : "bg-[#FFFAF4]/60 border-[#1E2A44]/15 text-[#5B6577] hover:bg-[#FFFAF4]"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-[#F47A1F] text-white flex items-center justify-center text-[11px] font-black">
            1
          </span>
          <span>{lang === "hi" ? "बुनियादी प्रोफ़ाइल" : "Basic Profile"}</span>
        </button>

        {/* Step 2 Pill */}
        <button
          type="button"
          onClick={() => setAssessmentStep(2)}
          className={`inline-flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-full border text-xs sm:text-sm font-black transition-all cursor-pointer ${
            assessmentStep === 2
              ? "bg-[#FFFAF4] border-[#F47A1F] text-[#1E2A44] shadow-sm ring-2 ring-[#F47A1F]/20"
              : "bg-[#FFFAF4]/60 border-[#1E2A44]/15 text-[#5B6577] hover:bg-[#FFFAF4]"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-[#F47A1F] text-white flex items-center justify-center text-[11px] font-black">
            2
          </span>
          <span>{lang === "hi" ? "धूप व स्वास्थ्य" : "Exposure & Health"}</span>
        </button>

        {/* Step 3 Pill */}
        <button
          type="button"
          onClick={() => setAssessmentStep(3)}
          className={`inline-flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-full border text-xs sm:text-sm font-black transition-all cursor-pointer ${
            assessmentStep === 3
              ? "bg-[#FFFAF4] border-[#1E2A44] text-[#1E2A44] shadow-sm ring-2 ring-[#1E2A44]/20"
              : "bg-[#FFFAF4]/60 border-[#1E2A44]/15 text-[#5B6577] hover:bg-[#FFFAF4]"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-[#1E2A44] text-white flex items-center justify-center text-[11px] font-black">
            3
          </span>
          <span>{lang === "hi" ? "अंतिम योजना" : "Final Plan"}</span>
        </button>
      </div>

      {/* ================= STEP 1: BASIC INFORMATION (Photo 1) ================= */}
      {assessmentStep === 1 && (
        <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[26px] p-6 sm:p-10 card-shadow flex flex-col gap-6 animate-fade-rise-1">
          <div className="flex flex-col gap-1 border-b border-[#1E2A44]/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#1E2A44]">
              {lang === "hi" ? "चरण 1: बुनियादी जानकारी" : "Step 1: Basic Information"}
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6577] font-semibold">
              {lang === "hi" ? "यह सुरक्षा योजना किसके लिए तैयार की जा रही है?" : "Who is this safety plan being prepared for?"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1E2A44]">
                <span className="text-[#F47A1F]">👤</span>
                <span>{lang === "hi" ? "पूरा नाम *" : "Full Name *"}</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-[#FAF4EC] border border-[#1E2A44]/15 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-[#1E2A44] focus:outline-none focus:border-[#F47A1F] focus:ring-2 focus:ring-[#F47A1F]/20"
              />
            </div>

            {/* Exact Age / Age Group */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1E2A44]">
                <span className="text-[#F47A1F]">📅</span>
                <span>{lang === "hi" ? "सटीक आयु / आयु वर्ग" : "Exact Age / Age Group"}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={exactAge}
                  onChange={e => setExactAge(e.target.value)}
                  placeholder="34"
                  min="1"
                  max="110"
                  className="w-24 sm:w-28 bg-[#FAF4EC] border border-[#1E2A44]/15 rounded-xl px-3 py-3 text-sm sm:text-base font-semibold text-[#1E2A44] text-center focus:outline-none focus:border-[#F47A1F]"
                />
                <select
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="flex-1 bg-[#FAF4EC] border border-[#1E2A44]/15 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-[#1E2A44] focus:outline-none focus:border-[#F47A1F] cursor-pointer"
                >
                  {ageOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1E2A44]">
                <span className="text-[#F47A1F]">📞</span>
                <span>{lang === "hi" ? "फ़ोन नंबर (एसएमएस हीट अलर्ट के लिए)" : "Phone Number (for SMS heat alerts)"}</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#FAF4EC] border border-[#1E2A44]/15 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-[#1E2A44] focus:outline-none focus:border-[#F47A1F] focus:ring-2 focus:ring-[#F47A1F]/20"
              />
            </div>

            {/* Email ID */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1E2A44]">
                <span className="text-[#F47A1F]">✉️</span>
                <span>{lang === "hi" ? "ईमेल आईडी (प्लान पीडीएफ प्राप्त करने के लिए)" : "Email ID (to receive plan PDF)"}</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ramesh@example.com"
                className="w-full bg-[#FAF4EC] border border-[#1E2A44]/15 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-[#1E2A44] focus:outline-none focus:border-[#F47A1F] focus:ring-2 focus:ring-[#F47A1F]/20"
              />
            </div>

            {/* City / Location */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1E2A44]">
                <span className="text-[#F47A1F]">📍</span>
                <span>{lang === "hi" ? "शहर / स्थान" : "City / Location"}</span>
              </label>
              <select
                value={city.includes("Delhi") ? cityOptions[0] : cityOptions.find(c => c.startsWith(city)) || cityOptions[0]}
                onChange={e => {
                  const sel = e.target.value;
                  const cityName = sel.split(" (")[0];
                  setCity(cityName);
                }}
                className="w-full bg-[#FAF4EC] border border-[#1E2A44]/15 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-[#1E2A44] focus:outline-none focus:border-[#F47A1F] cursor-pointer"
              >
                {cityOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Primary Occupation */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1E2A44]">
                <span className="text-[#F47A1F]">💼</span>
                <span>{lang === "hi" ? "मुख्य व्यवसाय" : "Primary Occupation"}</span>
              </label>
              <select
                value={occupation}
                onChange={e => setOccupation(e.target.value)}
                className="w-full bg-[#FAF4EC] border border-[#1E2A44]/15 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-[#1E2A44] focus:outline-none focus:border-[#F47A1F] cursor-pointer"
              >
                {occupationOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end pt-4 border-t border-[#1E2A44]/10">
            <button
              type="button"
              onClick={() => setAssessmentStep(2)}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-black text-white bg-[#F47A1F] hover:bg-[#E06912] shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer"
            >
              <span>{lang === "hi" ? "अगला चरण: स्वास्थ्य व धूप →" : "Next Step: Health & Exposure →"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: SUN EXPOSURE & HEALTH RISK FACTORS (Photos 2 & 3) ================= */}
      {assessmentStep === 2 && (
        <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[26px] p-6 sm:p-10 card-shadow flex flex-col gap-6 animate-fade-rise-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E2A44]/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1E2A44]">
                {lang === "hi" ? "चरण 2: धूप का समय और स्वास्थ्य जोखिम" : "Step 2: Sun Exposure & Health Risk Factors"}
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6577] font-semibold">
                {lang === "hi"
                  ? "अपने स्वास्थ्य पृष्ठभूमि के आधार पर थर्मल जोखिम सीमाओं को कैलिब्रेट करने में मदद करें।"
                  : "Help us calibrate thermal thresholds to your health background."}
              </p>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#FDEFE3] text-[#F47A1F] font-black text-xs uppercase tracking-wider">
              {lang === "hi" ? "चरण 2 / 2" : "Step 2 of 2"}
            </span>
          </div>

          {/* Row 1: Daily Hours & Work Environment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1E2A44]">
                <span className="text-[#F47A1F]">☀️</span>
                <span>{lang === "hi" ? "सीधी धूप में बिताया जाने वाला दैनिक समय" : "Daily Hours Under Direct Sun"}</span>
              </label>
              <select
                value={sunHours}
                onChange={e => setSunHours(e.target.value as any)}
                className="w-full bg-[#FAF4EC] border border-[#1E2A44]/15 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-[#1E2A44] focus:outline-none focus:border-[#F47A1F] cursor-pointer"
              >
                <option value="Up to 2 hours">&lt; 2 hours (Low Outdoor Exposure)</option>
                <option value="2 to 6 hours">2 to 6 hours (Moderate Outdoor Exposure)</option>
                <option value="More than 6 hours">&gt; 6 hours (Intense Direct Sun)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1E2A44]">
                <span>🏢</span>
                <span>{lang === "hi" ? "मुख्य कार्य वातावरण" : "Primary Work Environment"}</span>
              </label>
              <select
                value={workEnvironment}
                onChange={e => setWorkEnvironment(e.target.value)}
                className="w-full bg-[#FAF4EC] border border-[#1E2A44]/15 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-[#1E2A44] focus:outline-none focus:border-[#F47A1F] cursor-pointer"
              >
                {environmentOptions.map(env => (
                  <option key={env} value={env}>
                    {env}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sun or Heat Allergies */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-bold text-[#1E2A44]">
              {lang === "hi" ? "धूप या गर्मी से एलर्जी (यदि कोई हो)" : "Sun or Heat Allergies (if any)"}
            </label>
            <textarea
              rows={2}
              value={sunAllergies}
              onChange={e => setSunAllergies(e.target.value)}
              placeholder="e.g. Prone to severe heat rash and sweat eczema in peak humidity"
              className="w-full bg-[#FAF4EC] border border-[#1E2A44]/15 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-[#1E2A44] focus:outline-none focus:border-[#F47A1F] resize-none"
            />
          </div>

          {/* Clinical Health Considerations Checkbox Cards */}
          <div className="flex flex-col gap-3">
            {/* Card 1: Migraines */}
            <label
              className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                hasMigraines
                  ? "bg-[#FAF4EC] border-[#F47A1F]/40 shadow-sm"
                  : "bg-[#FFFAF4] border-[#1E2A44]/15 hover:bg-[#FAF4EC]/50"
              }`}
            >
              <input
                type="checkbox"
                checked={hasMigraines}
                onChange={e => setHasMigraines(e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#0284c7] cursor-pointer rounded"
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-extrabold text-sm sm:text-base text-[#1E2A44]">
                  {lang === "hi" ? "माइग्रेन या धूप से सिरदर्द की समस्या?" : "Prone to Migraines or Heat Headaches?"}
                </span>
                <span className="text-xs sm:text-sm text-[#5B6577] font-medium leading-relaxed">
                  {lang === "hi"
                    ? "तेज धूप, चमक और निर्जलीकरण संवहनी गर्मी सिरदर्द के प्राथमिक कारण हैं।"
                    : "Intense sunlight, glare, and dehydration are primary triggers for vascular heat headaches."}
                </span>
              </div>
            </label>

            {/* Card 2: Heatstroke history */}
            <label
              className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                hasHeatstrokeHistory
                  ? "bg-[#FAF4EC] border-[#F47A1F]/40 shadow-sm"
                  : "bg-[#FFFAF4] border-[#1E2A44]/15 hover:bg-[#FAF4EC]/50"
              }`}
            >
              <input
                type="checkbox"
                checked={hasHeatstrokeHistory}
                onChange={e => setHasHeatstrokeHistory(e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#0284c7] cursor-pointer rounded"
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-extrabold text-sm sm:text-base text-[#1E2A44]">
                  {lang === "hi" ? "पहले हीटस्ट्रोक या अत्यधिक थकान का इतिहास?" : "History of Heatstroke / Heat Exhaustion?"}
                </span>
                <span className="text-xs sm:text-sm text-[#5B6577] font-medium leading-relaxed">
                  {lang === "hi"
                    ? "पहले हुए हीट स्ट्रोक से हाइपोथैलेमस की तापमान नियंत्रण प्रणाली प्रभावित हो सकती है।"
                    : "Prior heat stroke damage impairs the hypothalamus's temperature regulation mechanisms."}
                </span>
              </div>
            </label>

            {/* Card 3: Blood Pressure / Heart / Kidney */}
            <label
              className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                hasBloodPressureSensitivity
                  ? "bg-[#FAF4EC] border-[#F47A1F]/40 shadow-sm"
                  : "bg-[#FFFAF4] border-[#1E2A44]/15 hover:bg-[#FAF4EC]/50"
              }`}
            >
              <input
                type="checkbox"
                checked={hasBloodPressureSensitivity}
                onChange={e => setHasBloodPressureSensitivity(e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#0284c7] cursor-pointer rounded"
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-extrabold text-sm sm:text-base text-[#1E2A44]">
                  {lang === "hi" ? "रक्तचाप / हृदय या गुर्दे की संवेदनशीलता?" : "Blood Pressure / Heart or Kidney Sensitivity?"}
                </span>
                <span className="text-xs sm:text-sm text-[#5B6577] font-medium leading-relaxed">
                  {lang === "hi"
                    ? "उच्च तापमान से रक्त वाहिकाएं फैलती हैं और हृदय को रक्त संचार बनाए रखने के लिए तेज धड़कना पड़ता है।"
                    : "High heat causes vasodilation and forces the heart to beat significantly faster to maintain blood flow."}
                </span>
              </div>
            </label>
          </div>

          {/* Protective Gear Currently Carried (Photo 3) */}
          <div className="flex flex-col gap-3 pt-2">
            <h3 className="text-xs sm:text-sm font-bold text-[#1E2A44]">
              {lang === "hi" ? "साथ में रखे जाने वाले सुरक्षात्मक उपकरण" : "Protective Gear Currently Carried"}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {gearCatalog.map(item => {
                const isSelected = protectiveGear.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleProtectiveGear(item)}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#FDEFE3] border-2 border-[#F47A1F] text-[#F47A1F] shadow-xs"
                        : "bg-[#FAF4EC] border border-[#1E2A44]/15 text-[#5B6577] hover:border-[#1E2A44]/30 hover:text-[#1E2A44]"
                    }`}
                  >
                    <span>{isSelected ? "✓" : "+"}</span>
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-6 border-t border-[#1E2A44]/10">
            <button
              type="button"
              onClick={() => setAssessmentStep(1)}
              className="text-xs sm:text-sm font-bold text-[#5B6577] hover:text-[#1E2A44] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>←</span>
              <span>{lang === "hi" ? "पिछला चरण" : "Previous Step"}</span>
            </button>

            <button
              type="button"
              onClick={() => setAssessmentStep(3)}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-black text-white bg-gradient-to-r from-[#F47A1F] to-[#E04B2C] shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer"
            >
              <span>{lang === "hi" ? "मेरी व्यापक योजना बनाएं ✨" : "Generate My Comprehensive Plan ✨"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: FINAL PLAN (Photo 4) ================= */}
      {assessmentStep === 3 && (
        <div className="flex flex-col gap-6 animate-fade-rise-1">
          {/* Card 1: Hourly Day Management Schedule */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[26px] p-6 sm:p-8 card-shadow flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#1E2A44]">
              <span className="text-[#F47A1F] text-lg">🕒</span>
              <h2 className="text-lg sm:text-xl font-black">
                {lang === "hi"
                  ? `${city} के लिए घंटेवार दिन प्रबंधन अनुसूची`
                  : `Hourly Day Management Schedule for ${city}`}
              </h2>
            </div>

            {/* 4 Schedule Blocks from Photo 4 */}
            <div className="flex flex-col gap-3.5 pt-1">
              {/* Block 1: Optimal Outdoor Window (Mint) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-[#EAF8F0] border border-[#92DBB5] text-[#1E2A44]">
                <span className="font-mono font-bold text-sm sm:text-base tracking-wider shrink-0 text-[#1E2A44]">
                  05:30 - 10:00
                </span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  <strong className="font-bold text-[#1E2A44]">Optimal Outdoor Window:</strong>{" "}
                  Perform high-energy fieldwork, travel, and loading orders during this timeframe. Base hydration: 500ml water.
                </p>
              </div>

              {/* Block 2: Transition & Heat Build-up (Yellow) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-[#FFFBEA] border border-[#FDE68A] text-[#1E2A44]">
                <span className="font-mono font-bold text-sm sm:text-base tracking-wider shrink-0 text-[#1E2A44]">
                  10:00 - 12:30
                </span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  <strong className="font-bold text-[#1E2A44]">Transition & Heat Build-up:</strong>{" "}
                  Put on wide brim cap, polarized UV sunglasses. Drink 250ml electrolyte water every 30 mins.
                </p>
              </div>

              {/* Block 3: RED ZONE (Peak Heat & Loo) (Pink/Red) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-[#FDF0EF] border border-[#FCA5A5] text-[#1E2A44]">
                <span className="font-mono font-bold text-sm sm:text-base tracking-wider shrink-0 text-[#D92D20]">
                  12:30 - 16:30
                </span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  <strong className="font-bold text-[#D92D20]">RED ZONE (Peak Heat & Loo):</strong>{" "}
                  Avoid continuous outdoor transit. Mandate 15-min shade breaks every 45 mins. If you feel dizzy, halt immediately.
                </p>
              </div>

              {/* Block 4: Cooling Recovery Window (Mint) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-[#EAF8F0] border border-[#92DBB5] text-[#1E2A44]">
                <span className="font-mono font-bold text-sm sm:text-base tracking-wider shrink-0 text-[#1E2A44]">
                  16:30 - 21:00
                </span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  <strong className="font-bold text-[#1E2A44]">Cooling Recovery Window:</strong>{" "}
                  Temperature drops, resume standard tasks. Rehydrate with buttermilk or coconut water.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Custom Health Precautions for Your Profile */}
          <div className="bg-[#FFFDF7] border border-[#F3DEBA] rounded-[26px] p-6 sm:p-8 card-shadow flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#7C3AED]/0 text-[#92400E]">
              <span className="text-lg">🫀</span>
              <h2 className="text-lg sm:text-xl font-black text-[#78350F]">
                {lang === "hi" ? "आपकी प्रोफ़ाइल के लिए अनुकूलित स्वास्थ्य सावधानियां" : "Custom Health Precautions for Your Profile"}
              </h2>
            </div>

            <div className="flex flex-col gap-3 text-xs sm:text-sm text-[#1E2A44] leading-relaxed font-medium">
              {/* Migraine note */}
              {hasMigraines && (
                <div className="flex items-start gap-2">
                  <span className="font-black text-[#92400E] shrink-0">• Migraine Sensitivity:</span>
                  <span>
                    Sun glare reflects strongly off roads and vehicle windshields. Never step out without UV400 sunglasses. Place a cool damp cloth over forehead during shade breaks.
                  </span>
                </div>
              )}

              {/* Allergy Notes */}
              {sunAllergies && (
                <div className="flex items-start gap-2">
                  <span className="font-black text-[#92400E] shrink-0">• Allergy Notes:</span>
                  <span>
                    {sunAllergies}. Wear breathable organic cotton, rinse sweat with clean water, avoid synthetic polyesters.
                  </span>
                </div>
              )}

              {/* Protective gear in use */}
              <div className="flex items-start gap-2">
                <span className="font-black text-[#0D9488] shrink-0">• Protective Gear In Use:</span>
                <span>
                  {protectiveGear.length > 0 ? protectiveGear.join(", ") : "Cotton Scarf / Bandana, UV Sunglasses"}
                </span>
              </div>

              {/* Heatstroke History Warning */}
              {hasHeatstrokeHistory && (
                <div className="flex items-start gap-2 text-[#D92D20]">
                  <span className="font-black shrink-0">• Heatstroke Vulnerability:</span>
                  <span>
                    Prior thermal damage slows sweat response. Pre-cool your body before 11:00 AM and keep ORS electrolyte solution chilled in your insulated bottle.
                  </span>
                </div>
              )}

              {/* Blood Pressure Alert */}
              {hasBloodPressureSensitivity && (
                <div className="flex items-start gap-2 text-[#D98200]">
                  <span className="font-black shrink-0">• Cardiovascular Precaution:</span>
                  <span>
                    Heat-induced vasodilation lowers blood pressure. Avoid sudden standing transitions from seated positions in direct sunlight.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick PDF & SMS Triggers */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF4EC] p-4 rounded-2xl border border-[#1E2A44]/10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={pdfGenerating}
                className="px-4 py-2.5 rounded-xl bg-[#1E2A44] text-[#FFFAF4] text-xs font-bold hover:bg-[#F47A1F] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{pdfGenerating ? "Generating..." : "📄 Download Plan PDF"}</span>
              </button>
              <button
                type="button"
                onClick={handleSendSms}
                disabled={smsQueuing}
                className="px-4 py-2.5 rounded-xl bg-[#FFFAF4] border border-[#1E2A44]/20 text-[#1E2A44] text-xs font-bold hover:bg-[#FBEBD9] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>{smsQueuing ? "Queuing..." : `📱 Send SMS Alerts to ${phoneNumber}`}</span>
              </button>
            </div>
            <span className="text-[11px] text-[#5B6577] font-semibold">
              Clinical standard compliant (NDMA / IDSP protocols)
            </span>
          </div>

          {/* Footer Action Row matching Photo 4 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setAssessmentStep(1)}
              className="text-xs sm:text-sm font-bold text-[#F47A1F] hover:underline cursor-pointer"
            >
              ← Plan for another person or edit details
            </button>

            <a
              href="tel:108"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full font-black text-sm sm:text-base text-white bg-[#D92D20] hover:bg-[#B91C1C] shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              <HugeiconsIcon icon={Call02Icon} size={18} strokeWidth={2.4} />
              <span>Emergency SOS: 108</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
