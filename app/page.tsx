"use client";

import React, { useState } from "react";
import LivingLandscape, { Language } from "./components/LivingLandscape";

export default function Home() {
  const [lang, setLang] = useState<Language>("en");
  const [activeModal, setActiveModal] = useState<"privacy" | "tos" | null>(null);

  const handleToggleLang = () => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  const handleLocationClick = () => {
    alert(
      lang === "en"
        ? "Location check initiated. In Phase 2, this connects to browser Geolocation and BigDataCloud reverse geocoding."
        : "स्थान की पहचान शुरू की गई। चरण 2 में यह वास्तविक जीपीएस और मौसम से जुड़ेगा।"
    );
  };

  return (
    <div className="min-h-screen bg-[#EFE0C0] text-[#16130F] flex flex-col justify-between selection:bg-[#16130F] selection:text-[#EFE0C0]">
      {/* STEP A: LIVING LANDSCAPE HERO SCENE & 24-HOUR INTERACTIVE RIBBON */}
      <LivingLandscape
        lang={lang}
        onToggleLang={handleToggleLang}
        onLocationClick={handleLocationClick}
      />

      {/* BELOW HERO: STEP B PLACEHOLDER (AS SPECIFIED: HIDE EVERYTHING ELSE BEHIND SIMPLE PLACEHOLDER TEXT) */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-5 py-16 flex flex-col gap-8">
        <div className="border-t-2 border-[#16130F] pt-8 flex flex-col gap-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#C4552F]">
            {lang === "en" ? "Field Safety Report" : "दैनिक सुरक्षा रिपोर्ट"}
          </div>
          <p className="text-lg sm:text-xl font-medium text-[#16130F] max-w-2xl leading-relaxed">
            {lang === "en"
              ? "The calm single-column safety plan, job role selection, and hourly guidance will unfold here in Step B."
              : "शांत एकल-स्तंभ सुरक्षा योजना, कार्य चयन, और घंटेवार मार्गदर्शन स्टेप बी में यहां प्रस्तुत होगा।"}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveModal("privacy")}
              className="text-xs font-bold uppercase tracking-wider underline hover:text-[#C4552F] cursor-pointer"
            >
              {lang === "en" ? "Privacy Policy" : "गोपनीयता नीति"}
            </button>
            <span className="text-xs">•</span>
            <button
              onClick={() => setActiveModal("tos")}
              className="text-xs font-bold uppercase tracking-wider underline hover:text-[#C4552F] cursor-pointer"
            >
              {lang === "en" ? "Terms of Service" : "सेवा की शर्तें"}
            </button>
            <span className="text-xs">•</span>
            <button
              onClick={() =>
                alert(
                  lang === "en"
                    ? "Google Sign-In will connect via Supabase in Phase 3."
                    : "गूगल साइन-इन चरण 3 में जुड़ेगा।"
                )
              }
              className="text-xs font-bold uppercase tracking-wider underline hover:text-[#C4552F] cursor-pointer"
            >
              {lang === "en" ? "Sign In with Google" : "गूगल से साइन इन करें"}
            </button>
          </div>
        </div>
      </section>

      {/* SLIM FIXED BOTTOM DISCLAIMER STRIP (NOT A LARGE BANNER) */}
      <aside className="fixed bottom-0 left-0 right-0 z-40 bg-[#16130F] text-[#EFE0C0] py-2 px-4 border-t-2 border-[#16130F]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="text-center sm:text-left text-[11px] opacity-90">
            {lang === "en"
              ? "General guidance only, not medical diagnosis. In heat stroke emergencies, call 108 immediately."
              : "केवल सामान्य सुरक्षा सलाह, चिकित्सकीय निदान नहीं। आपातकाल में तुरंत 108 पर कॉल करें।"}
          </div>
          <a
            href="tel:108"
            className="inline-block bg-[#C4552F] text-[#EFE0C0] px-3 py-1 font-bold text-[11px] uppercase tracking-wider border border-[#EFE0C0] hover:bg-[#E3A81F] hover:text-[#16130F] shrink-0"
          >
            {lang === "en" ? "Call 108 Ambulance" : "108 एम्बुलेंस डायल करें"}
          </a>
        </div>
      </aside>

      {/* MODAL FOR PRIVACY POLICY OR TERMS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-[#16130F]/75 flex items-center justify-center p-4">
          <div className="bg-[#EFE0C0] border-2 border-[#16130F] max-w-lg w-full p-6 text-[#16130F]">
            <h2 className="text-lg font-bold font-serif uppercase tracking-wider mb-3">
              {activeModal === "privacy"
                ? lang === "en"
                  ? "Privacy Policy"
                  : "गोपनीयता नीति"
                : lang === "en"
                ? "Terms of Service"
                : "सेवा की शर्तें"}
            </h2>
            <p className="text-xs sm:text-sm text-[#16130F] leading-relaxed mb-6">
              {activeModal === "privacy"
                ? lang === "en"
                  ? "Heatwave Buddy does not log or persist user coordinates. GPS data is evaluated in-memory strictly for live weather requests. Only high-level city names are saved for logged-in accounts."
                  : "लू साथी जीपीएस निर्देशांकों को कभी भी स्टोर या लॉग नहीं करता। निर्देशांकों का उपयोग केवल लाइव मौसम के लिए होता है।"
                : lang === "en"
                ? "Heatwave Buddy provides occupational heat stress guidance and does not replace certified emergency healthcare. Transfer severe cases immediately via 108."
                : "लू साथी अत्यधिक गर्मी के दौरान प्राथमिक मार्गदर्शन प्रदान करता है। गंभीर लक्षणों पर 108 डायल करें।"}
            </p>
            <div className="text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="border-2 border-[#16130F] bg-[#16130F] text-[#EFE0C0] px-4 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                {lang === "en" ? "Close" : "बंद करें"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
