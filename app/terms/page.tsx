"use client";

import React from "react";
import TopBar from "@/components/TopBar";
import { useAppState } from "@/context/AppStateContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon, Alert02Icon, Shield01Icon, CloudSavingDone01Icon } from "@hugeicons/core-free-icons";

function TermsContent() {
  const { lang } = useAppState();

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#F47A1F] selection:text-[#FFFAF4] pb-24 bg-[#FDF3E7]">
      <TopBar />

      <main className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#F47A1F]">
            {lang === "hi" ? "सेवा की शर्तें" : "Terms of Service"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A44] tracking-tight">
            {lang === "hi" ? "उपयोग की शर्तें और अस्वीकरण" : "Terms of Service & Medical Disclaimer"}
          </h1>
          <p className="text-sm text-[#5B6577] font-medium leading-relaxed">
            {lang === "hi"
              ? "सोलस्टाइस: लू साथी (Solstice: Heatwave Buddy) के उपयोग से जुड़ी महत्वपूर्ण शर्तें, गोपनीयता सिद्धांत और सुरक्षा दिशानिर्देश।"
              : "Important guidelines regarding our occupational safety recommendations, privacy architecture, and emergency care."}
          </p>
        </div>

        <div className="flex flex-col gap-6 text-[#1E2A44]">
          {/* Section 1: Non-Medical Disclaimer */}
          <div className="bg-[#FFFAF4] border border-[#D92D20]/25 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#D92D20]">
              <HugeiconsIcon icon={Alert02Icon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "1. चिकित्सीय सलाह नहीं है (सामान्य मार्गदर्शन)" : "1. Not a Substitute for Medical Advice"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "सोलस्टाइस: लू साथी (Solstice: Heatwave Buddy) द्वारा प्रदान की जाने वाली योजना केवल सामान्य व्यावसायिक और गर्मी से बचाव का मार्गदर्शन है। यह किसी भी चिकित्सक, अस्पताल या प्रमाणित स्वास्थ्य पेशेवर की सलाह या निदान का स्थान नहीं ले सकती। यदि आपको कोई पूर्व चिकित्सीय समस्या है, तो हमेशा अपने डॉक्टर की सलाह का पालन करें।"
                : "The plans and alerts provided by Solstice: Heatwave Buddy are general occupational heat stress guidance and preventative measures only. They do not constitute certified medical diagnosis or clinical treatment. If you have an underlying medical condition, always prioritize your licensed physician's guidance."}
            </p>
          </div>

          {/* Section 2: Emergency 108 Protocol */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#D92D20]">
              <HugeiconsIcon icon={Call02Icon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "2. आपातकालीन 108 एम्बुलेंस प्रोटोकॉल" : "2. Immediate 108 Emergency Protocol"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "यदि आप या आपके आसपास कोई व्यक्ति गंभीर गर्मी के लक्षण (जैसे चक्कर आना, उल्टी, तेज बुखार, भ्रांति या बेहोशी) महसूस करता है, तो वेबसाइट पर निर्भर न रहें और तुरंत 108 डायल करके आपातकालीन एम्बुलेंस बुलाएं।"
                : "In the event of acute heat exhaustion, disorientation, rapid heart rate, cessation of sweating, or loss of consciousness, do not rely solely on digital applications. Immediately call 108 for an emergency ambulance and initiate immediate cooling first aid."}
            </p>
          </div>

          {/* Section 3: Data Storage & Zero-Retention Principles */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#F47A1F]">
              <HugeiconsIcon icon={Shield01Icon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "3. डेटा संग्रहण और गोपनीयता सिद्धांत" : "3. Data Storage & Privacy Principles"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "हमारी सेवा में कोई भी जीपीएस निर्देशांक संग्रहीत नहीं किए जाते। कोई सटीक आयु या स्वास्थ्य इतिहास (जैसे हीटस्ट्रोक, माइग्रेन, कमजोरी) या व्यक्तिगत स्वास्थ्य नोट सर्वर पर संग्रहीत नहीं किए जाते। यदि आप गूगल साइन-इन (Google Sign-In) द्वारा सुपाबेस (Supabase) में अपनी प्राथमिकताएं सहेजते हैं, तो सुपाबेस केवल आपका डिफ़ॉल्ट शहर, व्यवसाय, आयु वर्ग और पसंदीदा शहर ही संग्रहीत करता है। 18 वर्ष से कम उम्र के उपयोगकर्ताओं के लिए डेटा संग्रहण पूरी तरह से वर्जित है।"
                : "Our platform guarantees that no GPS coordinates are stored. No exact age or health history (including past heat illnesses, migraines, or custom notes) are stored on any server. If you authenticate via Google Sign-In and opt to sync preferences, Supabase stores strictly your default city, occupation, age bracket, and favorite cities. All under-18 accounts are strictly barred from cloud storage."}
            </p>
          </div>

          {/* Section 4: Integrated Third-Party Services */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#F47A1F]">
              <HugeiconsIcon icon={CloudSavingDone01Icon} size={20} strokeWidth={2.4} />
              <h2 className="text-lg font-extrabold text-[#1E2A44]">
                {lang === "hi" ? "4. तृतीय-पक्ष सेवाएं (Google Sign-In, Amazon Polly, Gemini)" : "4. Integrated Third-Party Services"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "सोलस्टाइस कुछ चुनिंदा सुरक्षित क्लाउड सेवाओं का उपयोग करता है: पहचान और साइन-इन के लिए गूगल साइन-इन (Google Sign-In), प्राथमिकताओं के सुरक्षित भंडारण हेतु सुपाबेस (Supabase), द्विभाषी ऑडियो के लिए अमेज़न पॉली (Amazon Polly - काजल AI न्यूरल आवाज), तथा सुरक्षा योजना सुझावों को सुव्यवस्थित करने के लिए गूगल जेमिनी (Google Gemini)। इन सेवाओं के साथ कोई संवेदनशील स्वास्थ्य इतिहास या जीपीएस निर्देशांक साझा या संग्रहीत नहीं किए जाते।"
                : "Solstice integrates selected cloud services: Google Sign-In for OAuth authentication, Supabase for minimal preference storage (default city, occupation, age bracket, favorite cities), Amazon Polly for server-side bilingual voice synthesis (Kajal Neural voice), and Google Gemini for in-memory safety plan formatting with zero-retention parameters. No sensitive health histories or exact coordinates are shared with or persisted by these third-party providers."}
            </p>
          </div>

          {/* Section 5: Weather Data Disclaimers */}
          <div className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[20px] p-6 card-shadow flex flex-col gap-3">
            <h2 className="text-lg font-extrabold text-[#1E2A44]">
              {lang === "hi" ? "5. मौसम पूर्वानुमान और सटीकता" : "5. Meteorological Data & Forecast Accuracy"}
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium">
              {lang === "hi"
                ? "मौसम डेटा ओपन-मेटियो वैश्विक मॉडल से प्राप्त होता है। स्थानीय सूक्ष्म जलवायु परिस्थितियां (जैसे कंक्रीट की सड़कें, वाहन की गर्मी या बंद कमरे) वास्तविक तापमान को प्रभावित कर सकती हैं।"
                : "Weather and UV metrics are sourced via open meteorological models (Open-Meteo). Actual microclimates (such as direct asphalt radiation, traffic proximity, or unventilated spaces) can cause local temperatures to vary. Users are advised to exercise common sense precaution."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TermsPage() {
  return <TermsContent />;
}
