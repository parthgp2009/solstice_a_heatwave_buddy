"use client";

import React from "react";
import TopBar from "@/components/TopBar";
import { useAppState } from "@/context/AppStateContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Shield01Icon,
  LockKeyIcon,
  UserIcon,
  CloudSavingDone01Icon,
  VolumeHighIcon,
  AiBrain01Icon
} from "@hugeicons/core-free-icons";

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
              : "Solstice: Heatwave Buddy is engineered with strict zero-storage principles to protect user safety and health confidentiality."}
          </p>
        </div>

        <div className="flex flex-col gap-6 text-[#1E2A44]">
          {/* Card 1: GPS Coordinates Policy */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#F47A1F]">
              <HugeiconsIcon icon={LockKeyIcon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "1. कोई जीपीएस निर्देशांक कभी सहेजे नहीं जाते" : "1. No GPS Coordinates Stored"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "जब आप 'मेरे स्थान का उपयोग करें' चुनते हैं, तो आपके सटीक अक्षांश और देशांतर केवल ओपन-मेटियो मौसम एपीआई से स्थानीय तापमान और यूवी डेटा प्राप्त करने के लिए ब्राउज़र मेमोरी में उपयोग किए जाते हैं। कोई भी जीपीएस निर्देशांक हमारे किसी भी सर्वर या डेटाबेस पर कभी भी रिकॉर्ड, सहेजे या लॉग नहीं किए जाते।"
                : "When you choose 'Use my current location' or search a city, geographic coordinates are processed temporarily in volatile memory solely to fetch hourly weather metrics from Open-Meteo. No GPS coordinates are ever stored, logged, or retained on our servers or databases."}
            </p>
          </div>

          {/* Card 2: Age, Occupation & Health History */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#F47A1F]">
              <HugeiconsIcon icon={Shield01Icon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "2. कोई सटीक आयु या स्वास्थ्य इतिहास सहेजा नहीं जाता" : "2. No Exact Age or Health History Stored"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "आपकी सटीक जन्मतिथि या सटीक आयु कभी नहीं पूछी जाती। आपका स्वास्थ्य इतिहास (जैसे हीटस्ट्रोक, माइग्रेन, थकान) और कोई भी लिखा हुआ स्वास्थ्य नोट कभी भी सर्वर पर संग्रहीत या लॉग नहीं किया जाता। यह जानकारी केवल आपके वर्तमान सत्र में सुरक्षा योजना बनाने के लिए उपयोग होती है और डिवाइस पर तभी सहेजी जाती है जब आप 'इस डिवाइस पर याद रखें' चुनते हैं।"
                : "We never ask for or store your exact date of birth or exact age. Your medical history (such as heatstroke history, exhaustion, migraines, or physical fatigue) and any typed custom health notes are strictly never stored on a server or logged. They are used in-memory solely to tailor your safety plan and remain entirely local to your device."}
            </p>
          </div>

          {/* Card 3: Supabase Storage & Google Sign-In */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#F47A1F]">
              <HugeiconsIcon icon={CloudSavingDone01Icon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "3. सुपाबेस क्लाउड और गूगल साइन-इन" : "3. Supabase Cloud Storage & Google Sign-In"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "यदि आप गूगल साइन-इन (Google Sign-In) द्वारा अपनी प्राथमिकताएं सहेजते हैं, तो सुपाबेस (Supabase) डेटाबेस में केवल डिफ़ॉल्ट शहर, व्यवसाय, आयु वर्ग और पसंदीदा शहर ही सहेजे जाते हैं। कोई भी संवेदनशील स्वास्थ्य डेटा, नोट या निर्देशांक सुपाबेस में नहीं जाता। सभी तालिकाओं पर रो-लेवल सिक्योरिटी (RLS) लागू है।"
                : "If you sign in via Google Sign-In to sync preferences across sessions, Supabase stores only your default city, occupation, age bracket, and favorite cities. Sensitive health records, typed notes, and GPS coordinates are strictly barred from the database. All Supabase tables enforce strict Row Level Security (RLS)."}
            </p>
          </div>

          {/* Card 4: Under-18 Child Protection */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#F47A1F]">
              <HugeiconsIcon icon={UserIcon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "4. 18 वर्ष से कम आयु के उपयोगकर्ताओं की सुरक्षा" : "4. Strict Under-18 Privacy Lock"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "यदि कोई उपयोगकर्ता '18 वर्ष से कम' चुनता है, तो क्लाउड स्टोरेज और लोकल डिवाइस स्टोरेज दोनों पूरी तरह से अक्षम हो जाते हैं। 18 वर्ष से कम आयु के किसी भी उपयोगकर्ता का कोई भी डेटा कभी भी सहेजा या ट्रैक नहीं किया जाता।"
                : "If a user selects 'Under 18', cloud synchronization and local device persistence are completely locked out. No data is stored, synced, or retained for minors under 18 under any circumstances."}
            </p>
          </div>

          {/* Card 5: Amazon Polly Voice Synthesis */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#F47A1F]">
              <HugeiconsIcon icon={VolumeHighIcon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "5. अमेज़न पॉली (Amazon Polly) आवाज सेवा" : "5. Amazon Polly Audio Synthesis"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "जब आप 'योजना सुनें' बटन दबाते हैं, तो टेक्स्ट को अमेज़न पॉली (Amazon Polly) की काजल न्यूरल आवाज (hi-IN और en-IN) द्वारा सर्वर-साइड संश्लेषित किया जाता है। अमेज़न पॉली को कोई व्यक्तिगत पहचान या स्वास्थ्य डेटा नहीं भेजा जाता और न ही कोई ऑडियो रिकॉर्डिंग रखी जाती है। अनुपलब्ध होने पर ब्राउज़र का वेब स्पीच एपीआई उपयोग किया जाता है।"
                : "When you click 'Listen to Plan', speech synthesis is handled securely server-side via Amazon Polly using the bilingual Kajal Neural voice (hi-IN and en-IN). No personal identifiers or health histories are stored by Amazon Polly. If Amazon Polly is unavailable or rate-limited, speech automatically falls back to your device's browser voice."}
            </p>
          </div>

          {/* Card 6: Google Gemini AI Advisory */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#F47A1F]">
              <HugeiconsIcon icon={AiBrain01Icon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "6. गूगल जेमिनी (Google Gemini) एआई सुरक्षा योजना" : "6. Google Gemini AI Advisory"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "आपकी व्यक्तिगत सुरक्षा सलाह तैयार करने के लिए गूगल जेमिनी (Google Gemini) का उपयोग बिना डेटा प्रतिधारण (Zero-retention) के केवल मेमोरी में किया जाता है। कोई व्यक्तिगत पहचान या खाता विवरण जेमिनी को नहीं भेजा जाता और न ही इस डेटा का उपयोग किसी मॉडल प्रशिक्षण के लिए किया जाता है। ऑफलाइन होने पर अंतर्निहित नियम-आधारित योजना सक्रिय रहती है।"
                : "Personalized heat safety tips are structured in-memory via Google Gemini with zero-retention API configurations. No personal identifiers or account credentials are exchanged with Google Gemini, and no user inputs are permanently logged or utilized for model training. If the API is rate-limited or offline, Solstice falls back gracefully to its deterministic rule-based safety plan."}
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
