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
    <div className="min-h-screen bg-[#FBF4E6] text-[#2B3A2E] flex flex-col justify-between selection:bg-[#2B3A2E] selection:text-[#FBF4E6] pb-20">
      {/* SPRING LIVING LANDSCAPE (HEADER, ~55% HERO SCENE, TEMPERATURE HEADLINE & 24-HOUR RIBBON) */}
      <LivingLandscape
        lang={lang}
        onToggleLang={handleToggleLang}
        onLocationClick={handleLocationClick}
      />

      {/* BELOW HERO: CLEAN PLACEHOLDER FOR STEP B (FIELD REPORT & SAFETY PLAN) */}
      <section className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-8 flex flex-col gap-6">
        <div className="border-t-2 border-[#2B3A2E] pt-6 flex flex-col gap-3">
          <p className="text-base sm:text-lg font-medium text-[#2B3A2E] max-w-2xl leading-relaxed">
            {lang === "en"
              ? "The calm single-column safety plan, job choices, and hourly hydration advice will unfold here in Step B."
              : "शांत एकल-स्तंभ सुरक्षा योजना, कार्य विकल्प, और घंटेवार जल योजना स्टेप बी में यहां खुलेगी।"}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-bold uppercase tracking-wider text-[#2B3A2E]">
            <button
              onClick={() => setActiveModal("privacy")}
              className="underline hover:text-[#8CC49A] cursor-pointer"
            >
              {lang === "en" ? "Privacy Policy" : "गोपनीयता नीति"}
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal("tos")}
              className="underline hover:text-[#8CC49A] cursor-pointer"
            >
              {lang === "en" ? "Terms of Service" : "सेवा की शर्तें"}
            </button>
            <span>•</span>
            <button
              onClick={() =>
                alert(
                  lang === "en"
                    ? "Google Sign-In will connect via Supabase in Phase 3."
                    : "गूगल साइन-इन चरण 3 में जुड़ेगा।"
                )
              }
              className="underline hover:text-[#8CC49A] cursor-pointer"
            >
              {lang === "en" ? "Sign In with Google" : "गूगल से साइन इन करें"}
            </button>
          </div>
        </div>
      </section>

      {/* SLIM FIXED BOTTOM DISCLAIMER STRIP */}
      <aside className="fixed bottom-0 left-0 right-0 z-40 bg-[#2B3A2E] text-[#FBF4E6] py-2 px-4 border-t-2 border-[#2B3A2E]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="text-center sm:text-left text-[11px] opacity-90 font-medium">
            {lang === "en"
              ? "General guidance only, not medical diagnosis. In heat emergencies, call 108 immediately."
              : "केवल सामान्य सुरक्षा सलाह, चिकित्सकीय निदान नहीं। आपातकाल में तुरंत 108 पर कॉल करें।"}
          </div>
          <a
            href="tel:108"
            className="inline-block bg-[#F6CDB0] text-[#2B3A2E] px-3 py-1 font-bold text-[11px] uppercase tracking-wider border-2 border-[#2B3A2E] hover:bg-[#F6E3A1] shrink-0"
          >
            {lang === "en" ? "Call 108 Ambulance" : "108 एम्बुलेंस डायल करें"}
          </a>
        </div>
      </aside>

      {/* MODAL FOR PRIVACY POLICY OR TERMS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-[#2B3A2E]/70 flex items-center justify-center p-4">
          <div className="bg-[#FBF4E6] border-2 border-[#2B3A2E] max-w-lg w-full p-6 text-[#2B3A2E]">
            <h2 className="text-xl font-bold font-serif uppercase tracking-wider mb-3">
              {activeModal === "privacy"
                ? lang === "en"
                  ? "Privacy Policy"
                  : "गोपनीयता नीति"
                : lang === "en"
                ? "Terms of Service"
                : "सेवा की शर्तें"}
            </h2>
            <p className="text-xs sm:text-sm text-[#2B3A2E] leading-relaxed mb-6 font-medium">
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
                className="border-2 border-[#2B3A2E] bg-[#2B3A2E] text-[#FBF4E6] px-4 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#8CC49A] hover:text-[#2B3A2E]"
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
