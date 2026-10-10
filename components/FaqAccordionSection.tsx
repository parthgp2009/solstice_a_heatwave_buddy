"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

export default function FaqAccordionSection() {
  const { lang } = useAppState();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qEn: "What is the difference between Heat Exhaustion and Heatstroke?",
      qHi: "हीट एग्जॉशन (थकान) और हीटस्ट्रोक (लू लगना) में क्या अंतर है?",
      aEn:
        "Heat exhaustion is characterized by heavy sweating, pale cold clammy skin, weakness, and dizziness. Moving to shade and rehydrating reverses it. Heatstroke is a life-threatening medical emergency where the body temperature spikes above 40°C, skin turns hot and dry (or stops sweating), and the person experiences confusion, seizures, or loss of consciousness. Call 108 immediately for heatstroke.",
      aHi:
        "हीट एग्जॉशन में अत्यधिक पसीना आता है, त्वचा ठंडी और चिपचिपी होती है, और चक्कर आते हैं। छाया में जाने और पानी पीने से यह ठीक हो जाता है। हीटस्ट्रोक एक जानलेवा आपात स्थिति है जिसमें शरीर का तापमान 40°C से ऊपर चला जाता है, पसीना आना बंद हो जाता है, और व्यक्ति भ्रमित या बेहोश हो जाता है। हीटस्ट्रोक होने पर तुरंत 108 डायल करें।"
    },
    {
      qEn: "Why is Solstice's 'Adjusted Feels-Like' higher than standard weather apps?",
      qHi: "सोलस्टाइस का 'समायोजित तापमान' सामान्य मौसम ऐप्स से अधिक क्यों दिखता है?",
      aEn:
        "Standard weather reports measure air temperature inside shaded, ventilated meteorological boxes. In reality, delivery riders on asphalt roads and farmers under direct sunlight absorb intense solar UV radiation and radiant ground heat. Solstice applies biomedical offsets (+1 to +1.5°C for UV, +1 to +2°C for continuous sun exposure) to reflect true physiological heat load.",
      aHi:
        "सामान्य मौसम रिपोर्ट छायादार मौसम केंद्रों में तापमान मापती हैं। वास्तविकता में, सड़कों पर चलने वाले राइडर और खेतों में काम करने वाले किसान सीधी धूप और जमीन की गर्मी को अवशोषित करते हैं। सोलस्टाइस यूवी किरणों और धूप के समय के आधार पर वैज्ञानिक ऑफसेट जोड़ता है ताकि वास्तविक शारीरिक तनाव पता चल सके।"
    },
    {
      qEn: "How much water and electrolyte solution should I drink in extreme heat?",
      qHi: "भीषण गर्मी में कितना पानी और ओआरएस इलेक्ट्रोलाइट घोल पीना चाहिए?",
      aEn:
        "For moderate to high outdoor exposure, aim for 250ml of clean drinking water every 30 minutes (approximately 500ml per hour). Drinking small amounts frequently is far safer than gulping large amounts at once. After sweating out approximately 2 liters, replace lost sodium and potassium by adding 1 packet of WHO-standard ORS or drinking traditional buttermilk/lemon water.",
      aHi:
        "धूप में काम करते समय प्रत्येक 30 मिनट में 250 मिलीलीटर पानी पिएं (लगभग 500 मिली प्रति घंटा)। एक बार में बहुत सारा पानी पीने के बजाय थोड़े-थोड़े अंतराल पर पानी पीना अधिक सुरक्षित है। 2 लीटर पसीना बहने के बाद ओआरएस पैकेट, छाछ या नींबू पानी लेकर इलेक्ट्रोलाइट्स की पूर्ति करें।"
    },
    {
      qEn: "Is my personal information, location, or health history stored on your servers?",
      qHi: "क्या मेरी व्यक्तिगत जानकारी, स्थान या स्वास्थ्य विवरण आपके सर्वर पर सहेजा जाता है?",
      aEn:
        "Never. Solstice operates on strict zero-storage principles. Your GPS coordinates are evaluated in-memory strictly once to fetch open weather data, and health conditions are processed locally in your browser to build your plan. No health notes or location logs ever touch our database.",
      aHi:
        "बिल्कुल नहीं। सोलस्टाइस शून्य-भंडारण (zero-storage) नियमों पर काम करता है। आपका जीपीएस केवल एक बार मौसम जांचने के लिए मेमोरी में उपयोग होता है। आपके स्वास्थ्य विवरण केवल आपके ब्राउज़र में योजना बनाने के लिए उपयोग होते हैं और कभी किसी सर्वर पर नहीं भेजे जाते।"
    },
    {
      qEn: "What immediate first aid should be given to someone who collapses in the heat?",
      qHi: "गर्मी में किसी के बेहोश होने पर तत्काल क्या प्राथमिक उपचार करना चाहिए?",
      aEn:
        "1. Move them to deep shade or an air-conditioned room immediately. 2. Loosen tight clothing. 3. Apply cool water or wet cloths to neck, armpits, and groin. 4. Fan aggressively. 5. If conscious, give small sips of cool water. 6. If unconscious or confused, dial 108 immediately and do not force fluids into their mouth.",
      aHi:
        "1. तुरंत ठंडी छाया या एसी वाले कमरे में ले जाएं। 2. तंग कपड़े ढीले करें। 3. गर्दन, कांख और माथे पर गीला ठंडा कपड़ा रखें। 4. तेज हवा करें। 5. यदि होश में हों, तो घूंट-घूंट करके पानी पिलाएं। 6. यदि बेहोश हों, तो तुरंत 108 पर कॉल करें और मुंह में जबरदस्ती पानी न डालें।"
    }
  ];

  return (
    <div className="w-full bg-[#FFFAF4] border border-[#1E2A44]/15 rounded-[26px] p-6 sm:p-10 card-shadow flex flex-col gap-6 animate-fade-rise-1">
      <div className="flex flex-col gap-2 max-w-2xl">
        <span className="text-xs font-black uppercase tracking-wider text-[#F47A1F]">
          {lang === "hi" ? "अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions"}
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#1E2A44] tracking-tight">
          {lang === "hi"
            ? "हीटवेव सुरक्षा और स्वास्थ्य दिशानिर्देश"
            : "Medical Heatwave Guidance & FAQs"}
        </h3>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-[#FAF4EC] rounded-2xl border border-[#1E2A44]/10 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-black text-sm sm:text-base text-[#1E2A44] cursor-pointer hover:bg-[#F3EADB]/70 transition-colors"
              >
                <span>{lang === "hi" ? faq.qHi : faq.qEn}</span>
                <span
                  className={`transform transition-transform duration-200 text-[#F47A1F] shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <HugeiconsIcon icon={ArrowDown01Icon} size={18} strokeWidth={2.5} />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5B6577] font-medium leading-relaxed border-t border-[#1E2A44]/10 bg-[#FFFAF4]/60">
                  {lang === "hi" ? faq.aHi : faq.aEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
