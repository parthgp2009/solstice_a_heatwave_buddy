export interface SharePlanOptions {
  city: string;
  adjustedTemp: number;
  riskLevel: string;
  age?: string;
  occupation?: string;
  sunHours?: string;
  saferRanges?: string[];
  avoidRanges?: string[];
  hydrationLiters: string;
  keyAdvice?: string;
  lang?: "en" | "hi";
}

/**
 * Formats a clean, readable text summary of the safety plan ready for WhatsApp, SMS, or clipboard.
 * Fully localized in Hindi and English.
 */
export function formatSharePlanText(options: SharePlanOptions): string {
  const isHi = options.lang === "hi";
  const city = options.city || "Delhi";
  const safeWindows =
    options.saferRanges && options.saferRanges.length > 0
      ? options.saferRanges.join(", ")
      : isHi
      ? "सुबह 8 बजे से पहले और शाम 6 बजे के बाद"
      : "Early morning before 8 AM & after 6 PM";

  const avoidWindows =
    options.avoidRanges && options.avoidRanges.length > 0
      ? options.avoidRanges.join(", ")
      : isHi
      ? "दोपहर 12:00 - 4:00"
      : "12:00 PM - 4:00 PM";

  if (isHi) {
    const lines = [
      `☀️ सोलस्टाइस: लू साथी दैनिक हीट सुरक्षा योजना (Solstice: Heatwave Buddy)`,
      `📍 स्थान: ${city} (समायोजित हीट इंडेक्स: ${options.adjustedTemp}°C · ${options.riskLevel})`,
      `👤 प्रोफाइल: ${options.age ? `उम्र ${options.age}` : ""} · ${
        options.occupation && options.occupation !== "Not specified" ? options.occupation : "नागरिक"
      } · धूप: ${options.sunHours || "मध्यम"}`,
      `⏰ बाहर जाने का सुरक्षित समय: ${safeWindows}`,
      `🚫 तेज धूप से बचें: ${avoidWindows}`,
      `💧 जलपान लक्ष्य: ${options.hydrationLiters}L (नियमित पानी पिएं)`,
      options.keyAdvice ? `🛡️ मुख्य सलाह: ${options.keyAdvice}` : "",
      `🚨 आपातकाल में: तुरंत 108 डायल करें।`,
      `🔗 अपनी योजना देखें: https://heatwave-buddy.netlify.app/plan`
    ];
    return lines.filter(Boolean).join("\n");
  }

  const lines = [
    `☀️ Solstice: Heatwave Buddy Daily Heat Safety Plan`,
    `📍 Location: ${city} (Adjusted Heat Index: ${options.adjustedTemp}°C · ${options.riskLevel})`,
    `👤 Profile: ${options.age ? `Age ${options.age}` : ""} · ${
      options.occupation && options.occupation !== "Not specified" ? options.occupation : "Citizen"
    } · Sun: ${options.sunHours || "Moderate"}`,
    `⏰ Safest Outdoor Window: ${safeWindows}`,
    `🚫 Avoid Peak Heat: ${avoidWindows}`,
    `💧 Daily Hydration Target: ${options.hydrationLiters}L fluids`,
    options.keyAdvice ? `🛡️ Key Advice: ${options.keyAdvice}` : "",
    `🚨 Emergency Protocol: Call 108 Ambulance immediately if experiencing confusion or dizziness.`,
    `🔗 View Live Plan: https://heatwave-buddy.netlify.app/plan`
  ];
  return lines.filter(Boolean).join("\n");
}

/**
 * Returns a direct WhatsApp click-to-chat URL with the formatted message.
 */
export function getWhatsAppShareUrl(text: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
