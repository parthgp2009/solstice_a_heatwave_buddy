import { formatSharePlanText, getWhatsAppShareUrl } from "../lib/sharePlan";

function runSharePlanTests() {
  console.log("=== SHAREABLE HEAT SAFETY PLAN TESTS ===");

  // 1. English format test
  console.log("Testing English formatted share text...");
  const enText = formatSharePlanText({
    city: "Delhi",
    adjustedTemp: 44.5,
    riskLevel: "Danger",
    age: "31 to 45",
    occupation: "Delivery Driver",
    sunHours: "2 to 6 hours",
    saferRanges: ["6 AM to 9 AM", "7 PM to 10 PM"],
    avoidRanges: ["12 PM to 4 PM"],
    hydrationLiters: "3.5",
    keyAdvice: "Take 2-min shaded rests between drops.",
    lang: "en"
  });

  console.log("English Output:\n" + enText);

  if (
    !enText.includes("Delhi") ||
    !enText.includes("44.5°C") ||
    !enText.includes("Danger") ||
    !enText.includes("Delivery Driver") ||
    !enText.includes("3.5L") ||
    !enText.includes("108 Ambulance")
  ) {
    console.error("English share plan text assertion failed!");
    process.exit(1);
  }

  // 2. Hindi format test
  console.log("\nTesting Hindi formatted share text...");
  const hiText = formatSharePlanText({
    city: "Jaipur",
    adjustedTemp: 46.0,
    riskLevel: "Extreme",
    age: "Over 60",
    occupation: "Farmer",
    sunHours: "More than 6 hours",
    saferRanges: ["सुबह 7 बजे से पहले"],
    avoidRanges: ["दोपहर 11 से 5 बजे"],
    hydrationLiters: "4.0",
    keyAdvice: "खेत का काम भोर में करें।",
    lang: "hi"
  });

  console.log("Hindi Output:\n" + hiText);

  if (
    !hiText.includes("Jaipur") ||
    !hiText.includes("46°C") ||
    !hiText.includes("Extreme") ||
    !hiText.includes("Farmer") ||
    !hiText.includes("4.0L") ||
    !hiText.includes("108")
  ) {
    console.error("Hindi share plan text assertion failed!");
    process.exit(1);
  }

  // 3. WhatsApp URL encoding test
  console.log("\nTesting WhatsApp share URL encoding...");
  const waUrl = getWhatsAppShareUrl(enText);
  if (!waUrl.startsWith("https://api.whatsapp.com/send?text=") || !waUrl.includes("Delhi")) {
    console.error("WhatsApp URL encoding test failed!");
    process.exit(1);
  }

  console.log("WhatsApp URL generated successfully (length: " + waUrl.length + ")");
  console.log("\nALL SHARE PLAN TESTS PASSED SUCCESSFULLY");
}

runSharePlanTests();
