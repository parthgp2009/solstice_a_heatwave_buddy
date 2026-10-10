"use client";

import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import { useAppState } from "@/context/AppStateContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

interface FaqItem {
  qEn: string;
  qHi: string;
  aEn: string;
  aHi: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    qEn: "What is Solstice (Heatwave Buddy)?",
    qHi: "सोलस्टाइस (लू साथी) क्या है?",
    aEn: "Solstice is a specialised heat safety platform for India. It detects real-time meteorological conditions, calculates personalized heat stress (taking into account UV index and duration in direct sun), and provides hour-by-hour guidance for outdoor workers, students, and citizens.",
    aHi: "सोलस्टाइस (लू साथी) भारत में भीषण गर्मी से सुरक्षा का एक विशेष मंच है। यह वास्तविक समय के मौसम की जांच करता है, यूवी किरणों और धूप के समय के आधार पर हीट इंडेक्स की गणना करता है और घंटेवार सुरक्षा सलाह प्रदान करता है।"
  },
  {
    qEn: "How is the Adjusted Feels-Like temperature calculated?",
    qHi: "समायोजित हीट इंडेक्स की गणना कैसे की जाती है?",
    aEn: "We take the Open-Meteo apparent temperature as the baseline, then add a scientific UV offset (+1°C for UV 6-10, +1.5°C for UV >10) and an exposure offset (+1°C for 2-6 hours, +2°C for over 6 hours in direct sun). This provides a realistic measure of true physiological heat load.",
    aHi: "हम ओपन-मेटियो के अनुभूत तापमान से शुरुआत करते हैं, फिर यूवी किरणों के लिए (+1°C से +1.5°C) और सीधी धूप में काम करने के समय के लिए (+1°C से +2°C) जोड़ते हैं। यह शरीर पर गर्मी के वास्तविक प्रभाव को दर्शाता है।"
  },
  {
    qEn: "Why is the guidance stricter for Under 18, Seniors, or people with heat illness history?",
    qHi: "18 वर्ष से कम, वरिष्ठ नागरिकों या पिछले हीटस्ट्रोक इतिहास वालों के लिए सलाह सख्त क्यों है?",
    aEn: "Children, older adults, and individuals with prior heat exhaustion have significantly reduced thermoregulation and lower sweating efficiency. Our heat model elevates advice by one risk tier to protect them from dangerous thermal overload.",
    aHi: "बच्चों, बुजुर्गों और लू के पिछले इतिहास वाले लोगों में शरीर का तापमान नियंत्रित करने की क्षमता कम होती है। इसलिए उनकी सुरक्षा के लिए सलाह को एक स्तर अधिक सख्त रखा जाता है।"
  },
  {
    qEn: "Are my GPS coordinates or health notes stored on your servers?",
    qHi: "क्या मेरे जीपीएस निर्देशांक या स्वास्थ्य संबंधी जानकारी सर्वर पर सेव होती है?",
    aEn: "Never. Your exact coordinates are queried in-memory strictly once to fetch local weather, and never stored. Age, occupation, and health history are never sent to a database or logged; they stay on your own device if you enable 'Remember on this device', and nothing is ever saved for users under 18.",
    aHi: "बिल्कुल नहीं। जीपीएस निर्देशांक केवल मौसम जांचने के लिए एक बार उपयोग होते हैं। उम्र, कार्य और स्वास्थ्य इतिहास कभी भी सर्वर पर सेव या लॉग नहीं होते। वे केवल आपके फोन पर रह सकते हैं।"
  },
  {
    qEn: "What should I do in a heat emergency?",
    qHi: "गर्मी की आपात स्थिति में मुझे क्या करना चाहिए?",
    aEn: "If anyone shows signs of heatstroke (confusion, fainting, rapid pulse, hot dry skin, or seizures), immediately call 108 for an ambulance. Move them to shaded, cool surroundings, loosen tight clothing, apply cool damp cloths to neck and underarms, and fan them.",
    aHi: "यदि किसी को हीटस्ट्रोक के लक्षण दिखें (चक्कर आना, बेहोशी, तेज धड़कन या तेज बुखार), तो तुरंत 108 डायल करें। पीड़ित को छांव या ठंडे स्थान पर ले जाएं, कपड़े ढीले करें और गर्दन पर ठंडी पट्टी रखें।"
  },
  {
    qEn: "Which cities are supported?",
    qHi: "किन शहरों के लिए मौसम उपलब्ध है?",
    aEn: "We feature major metro hubs (Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Jaipur) in our quick selector, and support any town or district across India via the 'Other city (search)' Open-Meteo geocoding search.",
    aHi: "त्वरित चयन में प्रमुख शहर (दिल्ली, मुंबई, कोलकाता, चेन्नई, बेंगलुरु, हैदराबाद, जयपुर) शामिल हैं, और 'अन्य शहर (खोजें)' द्वारा भारत के किसी भी शहर या जिले की खोज की जा सकती है।"
  }
];

function FaqsContent() {
  const { lang } = useAppState();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#F47A1F] selection:text-[#FFFAF4] pb-24 bg-[#FDF3E7]">
      <TopBar />

      <main className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#F47A1F]">
            {lang === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2A44] tracking-tight">
            {lang === "hi" ? "गर्मी सुरक्षा और कार्यप्रणाली" : "Heat Safety & System Guidance"}
          </h1>
          <p className="text-sm text-[#5B6577] font-medium leading-relaxed">
            {lang === "hi"
              ? "सोलस्टाइस के कार्य करने के तरीके, हीट इंडेक्स फॉर्मूले और गोपनीयता नीति से जुड़े मुख्य उत्तर।"
              : "Clear answers on how Solstice computes heat stress, protects user privacy, and handles emergencies."}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[18px] card-shadow overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-[#1E2A44] cursor-pointer hover:bg-[#FBEBD9]/40 transition-colors"
                >
                  <span>{lang === "hi" ? faq.qHi : faq.qEn}</span>
                  <span
                    className={`transform transition-transform duration-200 text-[#F47A1F] shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={2.5} />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5B6577] leading-relaxed font-medium border-t border-[#1E2A44]/10 bg-[#FFFAF4]">
                    {lang === "hi" ? faq.aHi : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function FaqsPage() {
  return <FaqsContent />;
}

