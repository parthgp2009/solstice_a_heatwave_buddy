export type Language = 'en' | 'hi';

export interface TranslationDictionary {
  brand: string;
  tagline: string;
  headlineLine1: string;
  headlineLine2: string;
  supportingText: string;
  nav: {
    home: string;
    about: string;
    safetyPlan: string;
    faqs: string;
    signIn: string;
  };
  planBuilder: {
    title: string;
    cityLabel: string;
    ageLabel: string;
    occupationLabel: string;
    occupationPlaceholder: string;
    hoursLabel: string;
    healthHistoryLabel: string;
    healthHistoryPrivacy: string;
    rememberDevice: string;
    under18Notice: string;
    getPlanButton: string;
    missingFieldsHint: string;
    useLocation: string;
    locationPrivacy: string;
    customHealthPlaceholder: string;
    charsRemaining: string;
    searchCityPlaceholder: string;
  };
  featureRow: {
    weatherTitle: string;
    weatherSubtitle: string;
    planTitle: string;
    planSubtitle: string;
    preparedTitle: string;
    preparedSubtitle: string;
    bilingualTitle: string;
    bilingualSubtitle: string;
  };
  liveCard: {
    liveNow: string;
    adjustedLabel: string;
    breakdownPrefix: string;
    howWeCalc: string;
    howWeCalcBody: string;
    selectedHour: string;
  };
  planCard: {
    title: string;
    currentHeatLevel: string;
    bestTimeToLeave: string;
    avoidWindow: string;
    hydrationSchedule: string;
    hydrationInterval: string;
    warningSigns: string;
    warningSignsList: string[];
    forYouTitle: string;
    footerChip: string;
  };
  footerDisclaimer: string;
  callAmbulance: string;
}

export const DICTIONARY: Record<Language, TranslationDictionary> = {
  en: {
    brand: "Heatwave Buddy",
    tagline: "Real-time heat. Personalised protection.",
    headlineLine1: "Stay Safe in",
    headlineLine2: "Extreme Heat",
    supportingText: "Enter your city and a few details to get live temperature, an adjusted feels-like and a personalised safety plan, made for people like you.",
    nav: {
      home: "Home",
      about: "About",
      safetyPlan: "Safety Plan",
      faqs: "FAQs",
      signIn: "Sign in with Google",
    },
    planBuilder: {
      title: "Build Your Safety Plan",
      cityLabel: "City",
      ageLabel: "Age Bracket",
      occupationLabel: "Occupation (Optional)",
      occupationPlaceholder: "Optional",
      hoursLabel: "Hours in Sun Today",
      healthHistoryLabel: "Health Considerations",
      healthHistoryPrivacy: "Used only to make your plan. Not saved on our servers.",
      rememberDevice: "Remember on this device",
      under18Notice: "Ask a parent or guardian to help with these questions",
      getPlanButton: "Get My Safety Plan",
      missingFieldsHint: "Please select your city, age, and sun hours to generate your plan.",
      useLocation: "Use my current location instead",
      locationPrivacy: "Your coordinates are used once to fetch the weather. They are never stored.",
      customHealthPlaceholder: "Add something else (optional)",
      charsRemaining: "characters left",
      searchCityPlaceholder: "Type city name (e.g. Pune, Ahmedabad)...",
    },
    featureRow: {
      weatherTitle: "Live Weather Data",
      weatherSubtitle: "Real-time updates via Open-Meteo",
      planTitle: "Personalised Plan",
      planSubtitle: "Tailored to your age and occupation",
      preparedTitle: "Be Prepared",
      preparedSubtitle: "Hourly hydration and safer outdoor hours",
      bilingualTitle: "Hindi / English",
      bilingualSubtitle: "Instant language toggle anytime",
    },
    liveCard: {
      liveNow: "Live, 2:30 PM",
      adjustedLabel: "Adjusted feels-like (estimate)",
      breakdownPrefix: "Feels like",
      howWeCalc: "How we calculate this",
      howWeCalcBody: "We start with Open-Meteo feels-like temperature, add +1 to +1.5 for high UV levels, and add up to +2 for extended sun exposure. This figure is an estimate to reflect true heat stress.",
      selectedHour: "Selected hour",
    },
    planCard: {
      title: "Today's Safety Plan",
      currentHeatLevel: "Current Heat Level",
      bestTimeToLeave: "Best Time to Go Out",
      avoidWindow: "Avoid Direct Heat",
      hydrationSchedule: "Hydration Schedule",
      hydrationInterval: "Drink 250ml every 30 minutes",
      warningSigns: "Warning Signs",
      warningSignsList: [
        "Dizziness or lightheadedness",
        "Excessive sweating followed by clammy skin",
        "Nausea, headache, or muscle cramps",
        "Rapid pulse and confusion (call 108 immediately)"
      ],
      forYouTitle: "For your age & role",
      footerChip: "Stay cool. Stay hydrated. Stay safe.",
    },
    footerDisclaimer: "General guidance only, not medical diagnosis. In a heat emergency, call 108 immediately.",
    callAmbulance: "Call 108 Ambulance",
  },
  hi: {
    brand: "लू साथी",
    tagline: "वास्तविक समय का मौसम। व्यक्तिगत सुरक्षा।",
    headlineLine1: "भीषण गर्मी में",
    headlineLine2: "सुरक्षित रहें",
    supportingText: "अपने शहर और कुछ विवरण दर्ज करें ताकि आपको लाइव तापमान, समायोजित हीट इंडेक्स और एक व्यक्तिगत सुरक्षा योजना मिल सके।",
    nav: {
      home: "होम",
      about: "के बारे में",
      safetyPlan: "सुरक्षा योजना",
      faqs: "अक्सर पूछे जाने वाले सवाल",
      signIn: "गूगल से साइन इन करें",
    },
    planBuilder: {
      title: "अपनी सुरक्षा योजना बनाएं",
      cityLabel: "शहर",
      ageLabel: "आयु वर्ग",
      occupationLabel: "व्यवसाय (वैकल्पिक)",
      occupationPlaceholder: "वैकल्पिक",
      hoursLabel: "आज धूप में बिताने वाले घंटे",
      healthHistoryLabel: "स्वास्थ्य संबंधी जानकारी",
      healthHistoryPrivacy: "इसका उपयोग केवल आपकी योजना बनाने में होता है। हमारे सर्वर पर कुछ भी सेव नहीं होता।",
      rememberDevice: "इस डिवाइस पर याद रखें",
      under18Notice: "कृपया इन सवालों के लिए माता-पिता या अभिभावक की मदद लें",
      getPlanButton: "मेरी सुरक्षा योजना प्राप्त करें",
      missingFieldsHint: "कृपया योजना बनाने के लिए शहर, आयु और धूप के घंटे चुनें।",
      useLocation: "इसके बजाय मेरे वर्तमान स्थान का उपयोग करें",
      locationPrivacy: "आपके निर्देशांक केवल मौसम जांचने के लिए एक बार उपयोग होते हैं। वे कभी सहेजे नहीं जाते।",
      customHealthPlaceholder: "कुछ और जोड़ें (वैकल्पिक)",
      charsRemaining: "अक्षर शेष",
      searchCityPlaceholder: "शहर का नाम लिखें (जैसे पुणे, अहमदाबाद)...",
    },
    featureRow: {
      weatherTitle: "लाइव मौसम डेटा",
      weatherSubtitle: "ओपन-मेटियो द्वारा वास्तविक समय अपडेट",
      planTitle: "व्यक्तिगत योजना",
      planSubtitle: "आपकी उम्र और व्यवसाय के अनुसार",
      preparedTitle: "तैयार रहें",
      preparedSubtitle: "घंटेवार जल योजना और सुरक्षित समय",
      bilingualTitle: "हिन्दी / अंग्रेजी",
      bilingualSubtitle: "किसी भी समय भाषा बदलें",
    },
    liveCard: {
      liveNow: "लाइव, दोपहर 2:30",
      adjustedLabel: "समायोजित हीट इंडेक्स (अनुमान)",
      breakdownPrefix: "अनुभूत तापमान",
      howWeCalc: "इसकी गणना कैसे होती है",
      howWeCalcBody: "हम ओपन-मेटियो अनुभूत तापमान से शुरुआत करते हैं, उच्च यूवी किरणों के लिए +1 से +1.5 जोड़ते हैं, और धूप में रहने के समय के लिए +2 तक जोड़ते हैं। यह एक व्यावहारिक अनुमान है।",
      selectedHour: "चुना गया समय",
    },
    planCard: {
      title: "आज की सुरक्षा योजना",
      currentHeatLevel: "वर्तमान गर्मी का स्तर",
      bestTimeToLeave: "बाहर जाने का सबसे अच्छा समय",
      avoidWindow: "तेज धूप से बचें",
      hydrationSchedule: "जलपान अनुसूची",
      hydrationInterval: "प्रत्येक 30 मिनट में 250 मिलीलीटर पानी पिएं",
      warningSigns: "खतरे के लक्षण",
      warningSignsList: [
        "चक्कर आना या सिर घूमना",
        "अत्यधिक पसीना आना या त्वचा चिपचिपी होना",
        "जी मिचलाना, सिरदर्द या मांसपेशियों में ऐंठन",
        "तेज धड़कन या भ्रम की स्थिति (तुरंत 108 डायल करें)"
      ],
      forYouTitle: "आपकी उम्र और कार्य के लिए",
      footerChip: "शांत रहें। पानी पीते रहें। सुरक्षित रहें।",
    },
    footerDisclaimer: "केवल सामान्य मार्गदर्शन, चिकित्सकीय निदान नहीं। आपात स्थिति में तुरंत 108 पर कॉल करें।",
    callAmbulance: "108 एम्बुलेंस डायल करें",
  }
};

export const CITIES_CONFIG = [
  { value: "Delhi", labelEn: "Delhi", labelHi: "दिल्ली", tagEn: "DL", tagHi: "DL" },
  { value: "Mumbai", labelEn: "Mumbai", labelHi: "मुंबई", tagEn: "MH", tagHi: "MH" },
  { value: "Kolkata", labelEn: "Kolkata", labelHi: "कोलकाता", tagEn: "WB", tagHi: "WB" },
  { value: "Chennai", labelEn: "Chennai", labelHi: "चेन्नई", tagEn: "TN", tagHi: "TN" },
  { value: "Bengaluru", labelEn: "Bengaluru", labelHi: "बेंगलुरु", tagEn: "KA", tagHi: "KA" },
  { value: "Hyderabad", labelEn: "Hyderabad", labelHi: "हैदराबाद", tagEn: "TS", tagHi: "TS" },
  { value: "Jaipur", labelEn: "Jaipur", labelHi: "जयपुर", tagEn: "RJ", tagHi: "RJ" },
  { value: "OTHER_SEARCH", labelEn: "Other city (search)", labelHi: "अन्य शहर (खोजें)", tagEn: "Search", tagHi: "खोजें" },
];

export const AGE_CONFIG = [
  { value: "Under 18", labelEn: "Under 18", labelHi: "18 वर्ष से कम", tagEn: "Youth", tagHi: "किशोर" },
  { value: "18 to 30", labelEn: "18 to 30", labelHi: "18 से 30 वर्ष", tagEn: "Adult", tagHi: "वयस्क" },
  { value: "31 to 45", labelEn: "31 to 45", labelHi: "31 से 45 वर्ष", tagEn: "Mid-Adult", tagHi: "मध्यम" },
  { value: "46 to 60", labelEn: "46 to 60", labelHi: "46 से 60 वर्ष", tagEn: "Mature", tagHi: "प्रौढ़" },
  { value: "Over 60", labelEn: "Over 60", labelHi: "60 वर्ष से अधिक", tagEn: "Senior", tagHi: "वरिष्ठ" },
];

export const OCCUPATION_CONFIG = [
  { value: "Not specified", labelEn: "Not specified", labelHi: "अनिर्दिष्ट", tagEn: "General", tagHi: "सामान्य" },
  { value: "Delivery Driver", labelEn: "Delivery Driver", labelHi: "डिलीवरी ड्राइवर", tagEn: "On the road all day", tagHi: "दिन भर सड़क पर" },
  { value: "Student", labelEn: "Student", labelHi: "विद्यार्थी", tagEn: "School/College", tagHi: "स्कूल/कॉलेज" },
  { value: "Farmer", labelEn: "Farmer", labelHi: "किसान", tagEn: "Open fields", tagHi: "खेत-खलिहान" },
  { value: "Traffic Police", labelEn: "Traffic Police", labelHi: "ट्रैफिक पुलिस", tagEn: "Junction duty", tagHi: "सड़क ड्यूटी" },
  { value: "Office Worker", labelEn: "Office Worker", labelHi: "कार्यालय कर्मी", tagEn: "AC/Commute", tagHi: "दफ्तर/यात्रा" },
];

export const SUN_HOURS_CONFIG = [
  { value: "Up to 2 hours", labelEn: "Up to 2 hours", labelHi: "2 घंटे तक", tagEn: "Light", tagHi: "हल्की धूप" },
  { value: "2 to 6 hours", labelEn: "2 to 6 hours", labelHi: "2 से 6 घंटे", tagEn: "Moderate", tagHi: "मध्यम धूप" },
  { value: "More than 6 hours", labelEn: "More than 6 hours", labelHi: "6 घंटे से अधिक", tagEn: "High", tagHi: "लगातार धूप" },
];

export const HEALTH_CONDITIONS_CONFIG = [
  { id: "heatstroke", labelEn: "Heatstroke", labelHi: "हीटस्ट्रोक (लू लगना)" },
  { id: "exhaustion", labelEn: "Heat exhaustion", labelHi: "अत्यधिक थकान" },
  { id: "migraine", labelEn: "Migraine", labelHi: "माइग्रेन" },
  { id: "skin_infections", labelEn: "Skin infections", labelHi: "त्वचा संक्रमण" },
  { id: "fatigue", labelEn: "Physical fatigue", labelHi: "शारीरिक कमजोरी" },
  { id: "none", labelEn: "None of the above", labelHi: "इनमें से कोई नहीं" },
];
