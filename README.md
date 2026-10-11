# Solstice: Heatwave Buddy

> Real-time personalised heat safety and occupational guidance for communities and workers facing extreme temperatures across India.

**Live Application:** [https://solsitice-a-heat-wave-buddy.netlify.app](https://solsitice-a-heat-wave-buddy.netlify.app)

> **Note:** Solstice: Heatwave Buddy was built for an environment-themed hackathon under the **Heat and Water** track.

---

## 1. The Problem

India experiences severe and prolonged heatwaves during the pre-monsoon and summer months, with summer temperatures regularly exceeding 40°C to 45°C across large parts of the country. High ambient heat combined with solar radiation and humidity creates dangerous physiological stress.

### Populations Most at Risk
- **Outdoor & Gig Workers:** Delivery riders, agricultural workers, construction laborers, and traffic police who perform sustained physical labor under direct sunlight and cannot retreat indoors during peak solar hours.
- **Elderly People (Over 60):** Aging reduces the body's natural thermoregulatory efficiency and thirst sensation, compounded by cardiovascular conditions and routine medications.
- **Children & Youth (Under 18):** Minors produce more metabolic heat relative to body surface area and dehydrate more rapidly during outdoor school commutes and sports.
- **Individuals with Past Heat Illness:** People who have previously experienced heat exhaustion or heatstroke have compromised physiological heat tolerance and face a heightened risk of recurrence.

### Why Generic Temperature Alerts Are Not Enough
Standard weather reports and broadcast alerts quote only ambient shade temperatures (e.g., "38°C today in Delhi"). This single number fails to account for:
1. **Solar UV Radiation:** Direct radiant heating from high solar ultraviolet radiation elevates heat absorption significantly.
2. **Cumulative Exposure:** Spending 30 minutes outdoors versus 6 hours under the sun creates entirely different thermal burdens on the body.
3. **Physical Exertion:** Heavy physical labor generates internal metabolic heat that drastically accelerates heat strain compared to rest.
4. **Individual Vulnerability:** The exact same atmospheric conditions that cause mild discomfort for a healthy young adult resting indoors can be life-threatening for an outdoor courier, senior citizen, or child.

---

## 2. What It Does

Solstice: Heatwave Buddy transforms raw meteorological data into actionable, individualised safety protocols:

- **Live Meteorological Telemetry (Open-Meteo):**
  Fetches real-time ambient temperature, relative humidity, apparent temperature ("feels-like"), and UV index with a 24-hour hourly forecast. Supports preset Indian metropolises (Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Jaipur) and custom location search.

- **Deterministic Physiological Heat Model (`lib/heatModel.ts`):**
  Calculates an adjusted feels-like temperature using transparent, deterministic rules:
  $$\text{Adjusted Feels-Like} = \text{Apparent Temperature} + \text{UV Offset} + \text{Exposure Offset}$$
  - **UV Offset:** $< 6 \rightarrow 0^\circ\text{C}$, $6\text{ to }10 \rightarrow +1^\circ\text{C}$, $> 10 \rightarrow +1.5^\circ\text{C}$.
  - **Sun Exposure Offset:** Up to 2 hours $\rightarrow 0^\circ\text{C}$, 2 to 6 hours $\rightarrow +1^\circ\text{C}$, More than 6 hours $\rightarrow +2^\circ\text{C}$.
  - **Risk Tiers:**
    - **Low:** $< 32^\circ\text{C}$
    - **Caution:** $32^\circ\text{C} \le T < 38^\circ\text{C}$
    - **Danger:** $38^\circ\text{C} \le T < 46^\circ\text{C}$
    - **Extreme:** $\ge 46^\circ\text{C}$
  - **Vulnerability Safeguard:** Automatically elevates risk calculation by **+1 tier** (e.g., Caution becomes Danger; Danger becomes Extreme) for users Under 18, Over 60, or with a self-reported history of heat illness.
  - **Safe & Avoid Windows:** Identifies daily hourly windows below the danger threshold for safer commutes and errands.

- **Personalised Safety Plan (Google Gemini with Rule-Based Fallback):**
  Synthesizes contextual guidance based on the user's age bracket, occupation, daily sun hours, and personal health background:
  - Generates custom plans via Google Gemini through a server-side route (`/api/plan`).
  - Includes a built-in, deterministic rule-based fallback (`lib/aiPlan.ts`) that guarantees full bilingual guidance if the Gemini API key is unconfigured, rate-limited, or offline.

- **Bilingual Interface (English & Hindi):**
  Fully localized in English and Hindi (हिन्दी), covering all navigation, controls, risk tiers, advice sections, emergency checklists, and speech playback.

- **Saved Cities & Optional Cloud Preferences (Google Sign-In + Supabase):**
  Users can optionally sign in with Google to sync non-sensitive preferences across sessions (default city, favorite cities, occupation, non-minor age bracket, preferred language). The application remains 100% functional without signing in.

- **Heatstroke Emergency Check & Call 108 Button:**
  An interactive clinical triage checklist covering 7 critical warning signs of heatstroke (very high body temperature/dry hot skin, confusion or slurred speech, fainting or unconsciousness, seizures, lack of sweating despite heat, rapid weak pulse, persistent vomiting).
  - If any severe symptom is checked, displays an immediate medical emergency warning with first-aid steps.
  - Features a prominent 1-tap `tel:108` emergency ambulance button.

- **Work-Rest Planner (`lib/workRest.ts`):**
  Calculates hourly pacing schedules for Light, Moderate, and Heavy physical labor based on the active risk level:
  - Work-to-rest pacing ratios (e.g., 50/10 min in Caution, 30/30 min or 20/40 min in Danger, and 0/60 min stop-work advice in Extreme conditions).
  - Hydration pacing recommendations (~250 ml of water every 15–20 minutes in Caution/Danger; ORS when sweating heavily).

- **Installable Offline-Capable PWA:**
  Engineered as a Progressive Web Application with a Web App Manifest (`app/manifest.ts`) and custom Service Worker (`public/sw.js`):
  - Pre-caches core application shell assets and a dedicated offline page (`/offline`).
  - **Offline Emergency Guarantee:** The Heatstroke Emergency Check and Call 108 button operate completely offline without network connectivity.
  - Displays a bilingual offline status banner when internet access drops.

- **"Listen" Button (Audio Speech Synthesis):**
  User-triggered audio playback of the safety plan:
  - Never auto-plays; includes play, pause, stop, speed adjustment (1.0x, 1.25x, 1.5x), and loading indicators.
  - Powered by Amazon Polly Neural voice with automatic browser Web Speech API fallback.

---

## 3. How We Use AWS

Solstice: Heatwave Buddy integrates AWS specifically for high-quality, bilingual text-to-speech synthesis:

- **Amazon Polly Neural Voice (`Kajal`):**
  We utilize Amazon Polly's Neural engine with the **Kajal** voice, which provides natural, fluent bilingual synthesis tailored for Indian English (`en-IN`) and Hindi (`hi-IN`).

- **Server-Side Next.js API Route (`app/api/speak/route.ts`):**
  All Polly requests are executed strictly server-side using `@aws-sdk/client-polly`. AWS credentials and keys are never exposed to the browser or included in client JavaScript bundles.

- **Netlify Environment Variable Prefix:**
  Because Netlify reserves environment variables beginning with `AWS_`, credentials are configured with the `MY_` prefix:
  - `MY_AWS_ACCESS_KEY_ID`
  - `MY_AWS_SECRET_ACCESS_KEY`
  - `MY_AWS_REGION`

- **Least-Privilege IAM User:**
  The AWS IAM user identity used by the application is locked down strictly to a single action:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "polly:SynthesizeSpeech",
        "Resource": "*"
      }
    ]
  }
  ```
  The IAM credentials have no access to any other AWS resource or administrative privilege.

- **AWS Budget Alert:**
  An AWS budget alert is configured to notify administrators and maintain cost control.

- **Server-Side Route Safeguards & Rate Limiting:**
  - Enforces a 3,000-character payload ceiling per request.
  - Restricts language parameters strictly to `hi-IN` and `en-IN`.
  - Enforces IP-based in-memory rate limiting (20 requests per minute) to prevent abuse and unexpected charges.
  - Returns `audio/mpeg` with HTTP cache headers (`Cache-Control: public, max-age=3600`).

- **Browser Web Speech API Fallback:**
  If AWS credentials are not configured in `.env.local`, if the Polly service is unreachable, or if an API error occurs, the frontend automatically and silently falls back to the client's native browser Web Speech API (`window.speechSynthesis`).

> **Note:** Solstice does not use any other AWS service. It does not use S3, DynamoDB, Lambda, Bedrock, or EC2.

---

## 4. Architecture

```text
+-------------------------------------------------------------------------------+
|                                  USER BROWSER                                 |
|                                                                               |
|  * Next.js App Shell (PWA installed on device)                                |
|  * Service Worker (public/sw.js - caches shell & offline emergency tools)     |
|  * In-Memory State (GPS, health conditions, typed notes - NEVER sent/stored)  |
|  * Web Speech API (fallback audio when Polly is unavailable)                  |
|  * 1-Tap Emergency Call (tel:108)                                             |
+------------------------------------+------------------------------------------+
                                     |
               +---------------------+---------------------+
               |                     |                     |
     Weather Requests          Plan / Audio           Auth & Saved
      (Client fetch)          (Server Routes)          Preferences
               |                     |                     |
               v                     v                     v
       +---------------+     +---------------+     +---------------+
       |  Open-Meteo   |     |    Next.js    |     |   Supabase    |
       |  Weather API  |     |  on Netlify   |     |   Database    |
       +---------------+     +-------+-------+     +---------------+
                                     |                     |
                     +---------------+---------------+     | (Row Level
                     |                               |     |  Security)
                     v                               v     v
             +---------------+               +---------------+
             | Google Gemini |               |  AWS Polly    |
             |  API (Plan)   |               | Neural (Kajal)|
             +---------------+               +---------------+
```

---

## 5. Privacy & Data Protection

Solstice: Heatwave Buddy is built around strict zero-storage principles for personal and health data:

### What Is NEVER Stored or Logged
- **GPS Coordinates:** When location access is granted, latitude and longitude are processed in volatile browser memory solely to query weather data from Open-Meteo. Coordinates are never saved to a database, written to disk, or logged.
- **Exact Age & Date of Birth:** The application never requests or records exact dates of birth or numerical ages.
- **Health Conditions & Medical History:** Checkbox selections (heatstroke history, heat exhaustion, migraines, fatigue) are processed only in volatile memory to compute the safety plan and are never sent to a database or logged on a server.
- **Custom Health Notes:** Any typed note (up to 80 characters) is used solely within the active session to generate advice and is never stored on any server.
- **Minors Under 18:** If a user selects "Under 18", both cloud synchronization and local storage persistence are strictly disabled. The database schema enforces this through a SQL `CHECK` constraint that rejects records for users under 18.

### What Is Stored ONLY if the User Opts In (Google Sign-In)
If a user explicitly chooses to sign in with Google to sync preferences across sessions, Supabase stores only:
- Default city
- Favorite cities list
- Occupation
- Age bracket (`18 to 30`, `31 to 45`, `46 to 60`, `Over 60`)
- Preferred language (`en` or `hi`)

### Database Security
- Every table in Supabase has **Row Level Security (RLS)** enabled.
- Access policies restrict reads, inserts, updates, and deletions so authenticated users can interact exclusively with their own row (`auth.uid() = id`).
- Service role keys are never exposed to the frontend.

---

## 6. Safety and Honesty

- **General Guidance Only (Not Medical Advice):**
  Solstice: Heatwave Buddy provides general occupational heat stress guidance and preventative measures. It is **not** a certified medical diagnosis tool and does not provide clinical medical care.
- **Immediate Emergency Action:**
  Anyone exhibiting severe signs of heat illness (confusion, lack of sweating, seizures, vomiting, fainting) must receive immediate cooling and professional emergency medical attention by calling **108** in India.
- **Conservative Thresholds:**
  The temperature risk thresholds (`lib/heatModel.ts`) and work-rest schedules (`lib/workRest.ts`) are conservative, safety-first benchmarks designed with an abundance of caution, particularly when elevating risk tiers for vulnerable individuals.

---

## 7. Environment Variables

All environment variables used by the project are listed in `.env.example`. No keys or secret values are hardcoded in the codebase:

```bash
# Google Gemini API Key (Optional: for personalized AI safety plans)
GEMINI_API_KEY=

# AWS Polly Credentials (Optional: server-side only, MY_ prefix per Netlify rules)
MY_AWS_ACCESS_KEY_ID=
MY_AWS_SECRET_ACCESS_KEY=
MY_AWS_REGION=ap-south-1

# Supabase Configuration (Optional: for Google OAuth & saved preferences)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 8. Getting Started Locally

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/parthgp2009/solstice_a_heatwave_buddy.git
cd mysite

# Install dependencies
npm install
```

### Configure Environment
Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```
Add your respective keys for Google Gemini, AWS Polly, and Supabase (all services have built-in graceful fallbacks if omitted).

### Run the Application
```bash
# Start local development server
npm run dev

# Run linter
npm run lint

# Build production bundle
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. License

This project is licensed under the MIT License.
