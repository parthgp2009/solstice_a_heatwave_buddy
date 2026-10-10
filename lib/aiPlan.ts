export interface PlanRequestInput {
  city?: string;
  age?: string;
  occupation?: string;
  sunHours?: string;
  healthHistory?: string[];
  customHealthNote?: string;
  lang?: "en" | "hi";
  currentTemp?: number;
  adjustedTemp?: number;
  riskLevel?: string;
}

export interface PlanAIResponse {
  ageAdvice: string;
  occupationAdvice: string;
  healthAdvice: string[];
  actionableTips: string[];
  source: "gemini" | "rule-based";
}

/**
 * Rule-based fallback advisory used when Gemini API key is not configured or offline.
 * Zero-storage, privacy-safe, fully bilingual.
 */
export function generateFallbackPlan(input: PlanRequestInput): PlanAIResponse {
  const isHi = input.lang === "hi";
  const age = input.age || "31 to 45";
  const occupation = input.occupation || "Not specified";
  const healthHistory = Array.isArray(input.healthHistory) ? input.healthHistory : [];

  // Age advice
  let ageAdvice: string;
  if (age === "Under 18") {
    ageAdvice = isHi
      ? "दोपहर 12 से 4 बजे के बीच बाहरी खेलकूद बंद रखें, ओआरएस या नींबू पानी पिएं और अभिभावक की देखरेख में रहें।"
      : "Avoid outdoor sports between 12-4 PM, drink ORS or lemon water, and follow guidance from a parent or guardian.";
  } else if (age === "Over 60") {
    ageAdvice = isHi
      ? "घर के सबसे ठंडे कमरे में रहें, ढीले सूती कपड़े पहनें, और बीपी या हृदय संबंधी नियमित दवाओं का विशेष ध्यान रखें।"
      : "Stay in the coolest room, wear loose cotton clothes, and monitor blood pressure and routine medications closely.";
  } else if (age === "46 to 60") {
    ageAdvice = isHi
      ? "शारीरिक थकावट से बचें, पर्याप्त आराम लें और पसीने से खोए नमक की भरपाई के लिए छाछ या नारियल पानी पिएं।"
      : "Avoid overexertion, take scheduled rest breaks, and replenish salts with buttermilk or coconut water.";
  } else {
    ageAdvice = isHi
      ? "नियमित अंतराल पर पानी पीते रहें और सीधी धूप में सिर को गमछे या टोपी से ढककर रखें।"
      : "Drink water at regular intervals and keep your head covered with a cap or cloth under direct sun.";
  }

  // Occupation advice
  let occupationAdvice: string;
  if (occupation === "Delivery Driver") {
    occupationAdvice = isHi
      ? "हर डिलीवरी के बीच 2 मिनट छाया में रुकें, बाइक पर पानी की ठंडी बोतल रखें, और गर्दन पर गीला रुमाल बांधें।"
      : "Rest in shade for 2 minutes between trips, carry insulated water bottles, and use a damp neck bandana.";
  } else if (occupation === "Farmer") {
    occupationAdvice = isHi
      ? "खेत का भारी काम सुबह 10 बजे से पहले या शाम 5 बजे के बाद करें। खेत में छायादार मचान या पेड़ के नीचे पानी रखें।"
      : "Do heavy farm tasks before 10 AM or after 5 PM. Keep water jugs under tree shade near the field.";
  } else if (occupation === "Traffic Police") {
    occupationAdvice = isHi
      ? "ड्यूटी के दौरान रोटेशन के साथ छांव में जाएं, रिफ्लेक्टिव जैकेट के नीचे सूती इनर पहनें और ग्लूकोज पानी साथ रखें।"
      : "Rotate into shaded booths every 45 minutes, wear breathable cotton under reflective vests, and sip glucose water.";
  } else if (occupation === "Student") {
    occupationAdvice = isHi
      ? "स्कूल/कॉलेज आते-जाते समय छाते का उपयोग करें, भारी बैग से बचें और कक्षा में पानी की बोतल हमेशा भरी रखें।"
      : "Use an umbrella during school commutes, avoid heavy bag strain in heat, and refill your bottle regularly.";
  } else if (occupation === "Office Worker") {
    occupationAdvice = isHi
      ? "एसी वाले दफ्तर से एकदम चिलचिलाती धूप में तुरंत न निकलें, दोपहर के आवागमन में सीधे सूरज के संपर्क से बचें।"
      : "Avoid abrupt cold-to-hot transitions when exiting AC offices, and plan commutes outside peak sun.";
  } else {
    occupationAdvice = isHi
      ? "धूप में अनावश्यक निकलने से बचें और काम के बीच नियमित जलपान करें।"
      : "Limit unnecessary sun exposure and hydrate consistently throughout work shifts.";
  }

  // Health condition advice
  const healthAdvice: string[] = [];
  if (healthHistory.includes("heatstroke") || healthHistory.includes("exhaustion")) {
    healthAdvice.push(
      isHi
        ? "पूर्व हीटस्ट्रोक/थकावट के कारण शरीर की गर्मी सहने की क्षमता कम होती है; थोड़ा भी चक्कर आते ही ठंडी जगह पर लेट जाएं।"
        : "Past heat illness reduces heat tolerance; stop all activity and lie down in shade at the first sign of dizziness."
    );
  }
  if (healthHistory.includes("migraine")) {
    healthAdvice.push(
      isHi
        ? "धूप की तेज चमक और डिहाइड्रेशन से माइग्रेन ट्रिगर हो सकता है; यूवी प्रोटेक्टिव धूप का चश्मा लगाएं।"
        : "Bright sunlight glare and dehydration trigger migraines; wear UV-rated sunglasses and hydrate steadily."
    );
  }
  if (healthHistory.includes("skin_infections")) {
    healthAdvice.push(
      isHi
        ? "घमौरियों और संक्रमण से बचने के लिए पसीने से भीगे कपड़े तुरंत बदलें और त्वचा को सूखा रखें।"
        : "Prevent prickly heat and fungal infections by drying sweat and changing out of damp clothes quickly."
    );
  }
  if (healthHistory.includes("fatigue")) {
    healthAdvice.push(
      isHi
        ? "इलेक्ट्रोलाइट युक्त पेय (नींबू पानी या ओआरएस) लें और दोपहर के समय शारीरिक काम धीमा रखें।"
        : "Drink electrolyte solutions (ORS or lime water) and pace physical tasks during afternoon peaks."
    );
  }

  if (input.customHealthNote && input.customHealthNote.trim()) {
    healthAdvice.push(
      isHi
        ? `व्यक्तिगत स्वास्थ्य ध्यान: ${input.customHealthNote.slice(0, 60)}`
        : `Personal consideration: ${input.customHealthNote.slice(0, 60)}`
    );
  }

  // Actionable tips
  const actionableTips = isHi
    ? [
        "हर 30 मिनट में कम से कम 250 मिलीलीटर पानी पिएं।",
        "हल्के, ढीले और हल्के रंग के सूती कपड़े पहनें।",
        "गंभीर लक्षण (बेहोशी, तेज बुखार, उल्टी) होने पर तुरंत 108 डायल करें।"
      ]
    : [
        "Drink at least 250ml of water or electrolytes every 30 minutes.",
        "Wear loose, light-colored cotton clothing to allow airflow.",
        "Call 108 ambulance immediately if confusion, fainting, or cessation of sweating occurs."
      ];

  return {
    ageAdvice,
    occupationAdvice,
    healthAdvice,
    actionableTips,
    source: "rule-based"
  };
}

/**
 * Calls Gemini REST API with structured prompt and outputs strict JSON.
 * Falls back to generateFallbackPlan on error, network block, or missing API key.
 */
export async function generateGeminiPlan(
  input: PlanRequestInput,
  apiKey: string
): Promise<PlanAIResponse> {
  if (!apiKey) {
    return generateFallbackPlan(input);
  }

  const isHi = input.lang === "hi";
  const prompt = `You are an expert occupational health and heat safety doctor for workers in India.
Provide personalized heat protection advice based on these conditions:
- City: ${input.city || "Delhi"}
- Ambient / Apparent Temperature: ${input.adjustedTemp || 42}°C (Risk Level: ${input.riskLevel || "Danger"})
- Age Bracket: ${input.age || "31 to 45"}
- Occupation: ${input.occupation || "Delivery Driver"}
- Hours in direct sun today: ${input.sunHours || "2 to 6 hours"}
- Health History flags: ${input.healthHistory?.join(", ") || "None"}
- Additional user note: ${input.customHealthNote || "None"}
- Target Language: ${isHi ? "Hindi (Devanagari script)" : "English"}

Respond in STRICT JSON with this exact schema:
{
  "ageAdvice": "Concise 1-sentence medical advice for this age group",
  "occupationAdvice": "Concise 1-sentence practical work tip for this occupation",
  "healthAdvice": ["1-2 concise medical precautions considering their health history"],
  "actionableTips": ["3 brief, practical emergency and hydration bullet points"]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json"
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return generateFallbackPlan(input);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return generateFallbackPlan(input);
    }

    const parsed = JSON.parse(rawText);
    return {
      ageAdvice: typeof parsed.ageAdvice === "string" ? parsed.ageAdvice : generateFallbackPlan(input).ageAdvice,
      occupationAdvice: typeof parsed.occupationAdvice === "string" ? parsed.occupationAdvice : generateFallbackPlan(input).occupationAdvice,
      healthAdvice: Array.isArray(parsed.healthAdvice) && parsed.healthAdvice.length > 0 ? parsed.healthAdvice : generateFallbackPlan(input).healthAdvice,
      actionableTips: Array.isArray(parsed.actionableTips) && parsed.actionableTips.length > 0 ? parsed.actionableTips : generateFallbackPlan(input).actionableTips,
      source: "gemini"
    };
  } catch {
    clearTimeout(timeoutId);
    return generateFallbackPlan(input);
  }
}
