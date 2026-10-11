"use client";

import React from "react";
import TopBar from "@/components/TopBar";
import { useAppState } from "@/context/AppStateContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { Shield01Icon, LockKeyIcon, UserIcon } from "@hugeicons/core-free-icons";

function PrivacyContent() {
  const { lang } = useAppState();

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#F47A1F] selection:text-[#FFFAF4] pb-24 bg-[#FDF3E7]">
      <TopBar />

      <main className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#F47A1F]">
            {lang === "hi" ? "डेटा सुरक्षा और गोपनीयता" : "Privacy & Data Protection Policy"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A44] tracking-tight">
            {lang === "hi" ? "आपकी निजता हमारी सर्वोच्च प्राथमिकता है" : "Privacy Policy & Zero-Storage Guarantees"}
          </h1>
          <p className="text-sm text-[#5B6577] font-medium leading-relaxed">
            {lang === "hi"
              ? "सोलस्टाइस: लू साथी (Solstice: Heatwave Buddy) में हम आपके व्यक्तिगत डेटा की सुरक्षा के लिए कड़े नियम लागू करते हैं।"
              : "Solstice: Heatwave Buddy is engineered with zero-storage principles to protect user safety and health confidentiality."}
          </p>
        </div>

        <div className="flex flex-col gap-6 text-[#1E2A44]">
          {/* Card 1: GPS Coordinates Policy */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#F47A1F]">
              <HugeiconsIcon icon={LockKeyIcon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "1. जीपीएस निर्देशांक कभी सहेजे नहीं जाते" : "1. Exact GPS Coordinates Are Never Stored"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "जब आप 'मेरे स्थान का उपयोग करें' चुनते हैं, तो आपके सटीक अक्षांश और देशांतर केवल एक बार ओपन-मेटियो मौसम एपीआई से स्थानीय तापमान और यूवी डेटा प्राप्त करने के लिए मेमोरी में उपयोग किए जाते हैं। वे हमारे किसी भी सर्वर या डेटाबेस पर कभी भी रिकॉर्ड या लॉग नहीं किए जाते।"
                : "When you tap 'Use my current location', your precise latitude and longitude are queried in volatile memory solely to fetch hourly temperature and UV data from Open-Meteo. Exact GPS coordinates are never stored, logged, or retained on any server."}
            </p>
          </div>

          {/* Card 2: Age, Occupation & Health History */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#F47A1F]">
              <HugeiconsIcon icon={Shield01Icon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "2. आयु, व्यवसाय और स्वास्थ्य जानकारी का उपयोग" : "2. Use of Age, Occupation & Health Inputs"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "आपकी आयु, कार्य, धूप में रहने का समय और स्वास्थ्य स्थितियां केवल आपके डिवाइस पर आपकी व्यक्तिगत योजना तैयार करने के लिए उपयोग होती हैं। यह जानकारी हमारे सर्वर पर कभी नहीं भेजी जाती। इसका एकमात्र वैकल्पिक भंडारण आपके अपने डिवाइस के localStorage में 'इस डिवाइस पर याद रखें' स्विच को ऑन करने पर ही होता है।"
                : "Your age bracket, occupation, sun exposure hours, and selected health considerations are used strictly in-memory to tailor your personalized heat safety plan. This information is never transmitted to our database or logged on our servers. The only optional persistence is on your own local device via localStorage if you explicitly enable 'Remember on this device'."}
            </p>
          </div>

          {/* Card 3: Under-18 Protection */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#F47A1F]">
              <HugeiconsIcon icon={UserIcon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "3. 18 वर्ष से कम आयु के उपयोगकर्ताओं की सुरक्षा" : "3. Strict Under-18 Child Privacy Protection"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "यदि कोई उपयोगकर्ता '18 वर्ष से कम' चुनता है, तो हम एक सूचना दिखाते हैं कि वे माता-पिता या अभिभावक की मदद लें। ऐसे उपयोगकर्ताओं के लिए डिवाइस मेमोरी पूरी तरह बंद रहती है और कोई भी डेटा कभी सेव नहीं किया जाता।"
                : "If a user selects 'Under 18', we advise them to seek assistance from a parent or guardian. The 'Remember on this device' toggle is permanently disabled, and no information is ever stored or synced for minors under any circumstances."}
            </p>
          </div>

          {/* Card 4: Signed-in User Accounts */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <h2 className="text-lg font-extrabold text-[#1E2A44]">
              {lang === "hi" ? "4. साइन-इन किए गए उपयोगकर्ता खाते (सुपाबेस)" : "4. Signed-In User Accounts (Supabase)"}
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "यदि कोई वयस्क उपयोगकर्ता गूगल साइन-इन करता है और अपनी प्रोफ़ाइल सहेजता है, तो सुपाबेस डेटाबेस में केवल सामान्य शहर का नाम, व्यवसाय और आयु वर्ग ही सहेजा जा सकता है (कोई निर्देशांक नहीं)। सभी डेटाबेस तालिकाओं पर रो-लेवल सिक्योरिटी (RLS) लागू है।"
                : "If an adult user chooses to sign in via Google and save a profile, our database may store only the general city name, occupation, and adult age bracket. Exact coordinates and sensitive health notes are never written to the cloud database. All database tables enforce strict Row Level Security (RLS)."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}

