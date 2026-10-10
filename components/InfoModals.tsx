"use client";

import React from "react";
import { useAppState } from "@/context/AppStateContext";

export default function InfoModals() {
  const { activeModal, setActiveModal, lang } = useAppState();

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1E2A44]/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFAF4] border border-[#1E2A44]/20 max-w-lg w-full p-6 rounded-[22px] text-[#1E2A44] card-shadow">
        <h2 className="text-xl font-extrabold uppercase tracking-wider mb-3 text-[#1E2A44]">
          {activeModal === "privacy"
            ? lang === "en"
              ? "Privacy Policy"
              : "गोपनीयता नीति"
            : lang === "en"
            ? "Terms of Service"
            : "सेवा की शर्तें"}
        </h2>
        <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed mb-6 font-medium">
          {activeModal === "privacy"
            ? lang === "en"
              ? "Heatwave Buddy does not log or persist user coordinates. GPS data is evaluated in-memory strictly once to fetch live weather data. Exact coordinates are never stored on any server. Personalisation inputs including age, occupation, and health history are used solely to generate your safety plan. They are never sent to a database or logged on our servers. The only optional storage is locally on your own device if you enable 'Remember on this device', and nothing is ever saved for users under 18."
              : "लू साथी जीपीएस निर्देशांकों को कभी भी स्टोर या लॉग नहीं करता। सटीक निर्देशांक कभी भी किसी सर्वर पर सहेजे नहीं जाते। आयु, कार्य और स्वास्थ्य इतिहास का उपयोग केवल आपकी सुरक्षा योजना बनाने के लिए होता है। वे हमारे सर्वर पर कभी नहीं भेजे जाते।"
            : lang === "en"
            ? "Heatwave Buddy provides occupational heat stress guidance and does not replace certified emergency healthcare. In any severe or life-threatening situation, call 108 immediately."
            : "लू साथी अत्यधिक गर्मी के दौरान प्राथमिक मार्गदर्शन प्रदान करता है। यह चिकित्सीय सलाह नहीं है। गंभीर लक्षणों पर तुरंत 108 डायल करें।"}
        </p>
        <div className="text-right">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="bg-[#1E2A44] text-[#FFFAF4] px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer hover:bg-[#F47A1F] transition-colors"
          >
            {lang === "en" ? "Close" : "बंद करें"}
          </button>
        </div>
      </div>
    </div>
  );
}
