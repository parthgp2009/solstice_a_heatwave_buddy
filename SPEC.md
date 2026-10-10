# Project Specification: Heatwave Buddy

## 1. Overview
**Heatwave Buddy** (लू साथी) is a mobile-first, single-page web app designed for people in India facing extreme heat (such as delivery riders, farmers, students, elderly citizens, and outdoor workers). 

The app detects live temperature and feels-like heat index for the user's location, accepts their job role and working hours, generates a personalized AI-powered heat safety plan with hydration and work timings, provides bilingual support (English as default with a side/header switch for Hindi), includes a voice readout ("Listen") powered by **Amazon Polly**, offers emergency direct dialing for Indian Ambulance (**108**), and supports Google Sign-In via Supabase.

---

## 2. User Roles

### A. Visitor (Unauthenticated / Default)
* Can access all core features without logging in.
* Taps **"Use my location"** (with a friendly pre-permission explainer) or searches any Indian city manually.
* Selects their job/situation (*Delivery Rider, Farmer, Student, Elderly, Outdoor Worker, Other*).
* Selects their **working hours / shift** (*Full Day*, *Morning 6 AM – 11 AM*, *Afternoon Peak 11 AM – 4 PM*, *Evening 4 PM – 8 PM*).
* Receives a personalized heat safety plan (via Gemini Pro with rule-based fallback).
* Can listen to the plan using the **"Listen"** button (Amazon Polly with Kajal Neural voice, fallback to browser Web Speech).
* Can switch between **English** (default) and **Hindi** via a language switcher.
* Can tap **"Call 108"** directly in emergency/dire situations, and share their plan via **WhatsApp**.
* **Device Memory**: The site automatically remembers their selected city, role, working hours, and recent plan in browser `localStorage`.

### B. Logged-in User (Google Sign-In via Supabase)
* Has all features of a Visitor.
* Signs in with 1-click **Google Sign-In**.
* Can save their default city, role, and shift to their account profile so it syncs across devices.
* Can view a history of their saved past safety plans in a "Saved Plans" drawer.
* **Privacy Assurance**: Database stores only the city/area name and plan content. Exact GPS coordinates are **never** stored or logged.

---

## 3. Pages & UI Structure (Mobile-First Single Page App)

The app is built as a clean, responsive single page (`/`) with smooth drawer/modal overlays for secondary tasks (Login and Saved Plans).

### Page Sections:
1. **Header & Navigation**:
   * App Logo & Title ("Heatwave Buddy" / "लू साथी").
   * **Language Switcher** (side toggle / header button to switch between English and हिन्दी).
   * **Sign In with Google / Profile Button** (opens Supabase Google Auth modal or user drawer).

2. **Emergency Top Alert Bar**:
   * Prominent **"Call 108 (Ambulance)"** quick-dial button.
   * Clear medical disclaimer: *"General safety guidance only, not medical advice. Call 108 immediately in a medical emergency."*

3. **Location & Search Card**:
   * Friendly pre-permission notice: *"We use your location only to check today's local temperature and heat risk. Your coordinates are never stored."*
   * **"Use my location"** button (triggers browser `navigator.geolocation`).
   * Detected place name display (e.g., *"Rohini, Delhi"* via BigDataCloud reverse geocoding).
   * Fallback city search box (autocomplete for Indian cities using Open-Meteo Geocoding if GPS is denied or fails).

4. **Job & Working Hours Selector**:
   * **Step 1: Role Selection** (6 tap-friendly cards with icons):
     * 🛵 Delivery Rider
     * 🌾 Farmer
     * 🎒 Student
     * 👵 Elderly Person
     * 🏗️ Outdoor Worker
     * 👤 Other
   * **Step 2: Working Hours / Shift Selection**:
     * ☀️ Full Day (Outdoors all day)
     * 🌅 Morning Shift (6 AM – 11 AM)
     * 🔥 Peak Afternoon (11 AM – 4 PM)
     * 🌇 Evening Shift (4 PM – 8 PM)

5. **Live Weather & Heat Index Widget**:
   * Current Temperature (°C).
   * Feels-like Heat Index (°C).
   * Heat Risk Level Badge:
     * 🟢 **Normal / Low Risk** (Heat index < 32°C)
     * 🟡 **Caution** (32°C – 41°C)
     * 🟠 **Danger** (41°C – 54°C)
     * 🔴 **Extreme Danger** (> 54°C)
   * Humidity percentage and wind speed.

6. **Personalized Heat Safety Plan Card**:
   * **Safe Hours Schedule**: Visual morning-to-evening breakdown of safe hours vs. peak danger hours based on real hourly weather data.
   * **Hydration Plan**: Personalized water and electrolyte schedule for their job role and shift.
   * **Warning Signs**: Heat exhaustion vs. heat stroke symptoms.
   * **Emergency Actions & Dire Situation Button**:
     * Step-by-step first-aid steps if feeling dizzy or sick.
     * Big red emergency **"Call 108"** tap button directly inside the plan for dire situations.
   * **Audio Player ("Listen" Button)**:
     * Reads the plan aloud using Amazon Polly (`Kajal` Neural voice, bilingual).
     * User-triggered only (never auto-plays).
     * Loading state and stop button.
     * Label: *"Voice by Amazon Polly"*.
     * Client-side fallback to browser `speechSynthesis` if Polly is unavailable.
   * **WhatsApp Share Button**: One-tap to share the daily plan with family or coworkers.

7. **Google Auth & Profile Modal (Supabase)**:
   * 1-click Google Sign-In.
   * Preference settings (Saved City, Saved Job, Saved Shift).

8. **Saved Plans Drawer**:
   * Displays previously saved safety plans for logged-in users.

---

## 4. Database Schema (Supabase PostgreSQL)

All tables have **Row Level Security (RLS)** strictly enabled.

### Table: `profiles`
Stores user profile information.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, References `auth.users(id)` ON DELETE CASCADE | Matches Supabase Auth user ID |
| `email` | `text` | NOT NULL | User Google email address |
| `full_name` | `text` | NULLABLE | Google profile display name |
| `avatar_url` | `text` | NULLABLE | Google profile picture URL |
| `default_city` | `text` | NULLABLE | Preferred city name (never coordinates) |
| `default_job` | `text` | NULLABLE | Default job role |
| `default_shift` | `text` | NULLABLE | Default working hours/shift |
| `preferred_language` | `text` | DEFAULT `'en'` | `'en'` or `'hi'` |
| `created_at` | `timestamptz` | DEFAULT `now()` | Account creation timestamp |
| `updated_at` | `timestamptz` | DEFAULT `now()` | Last profile update timestamp |

**RLS Policies for `profiles`**:
* `SELECT`: `auth.uid() = id` (Users can only view their own profile).
* `INSERT`: `auth.uid() = id` (Users can only insert their own profile).
* `UPDATE`: `auth.uid() = id` (Users can only update their own profile).

---

### Table: `saved_plans`
Stores safety plans saved by logged-in users.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, DEFAULT `gen_random_uuid()` | Unique record identifier |
| `user_id` | `uuid` | NOT NULL, References `auth.users(id)` ON DELETE CASCADE | Owner of the saved plan |
| `city_name` | `text` | NOT NULL | Name of the city/area (NO GPS coordinates) |
| `job_role` | `text` | NOT NULL | Selected job role |
| `shift` | `text` | NOT NULL | Selected working hours/shift |
| `temperature` | `numeric(4,1)` | NOT NULL | Temperature in °C |
| `heat_index` | `numeric(4,1)` | NOT NULL | Feels-like heat index in °C |
| `danger_level` | `text` | NOT NULL | Caution, Danger, or Extreme Danger |
| `plan_data` | `jsonb` | NOT NULL | Structured JSON of the plan |
| `language` | `text` | DEFAULT `'en'` | Plan language (`'en'` or `'hi'`) |
| `created_at` | `timestamptz` | DEFAULT `now()` | Creation timestamp |

**RLS Policies for `saved_plans`**:
* `SELECT`: `auth.uid() = user_id` (Users can only view their own saved plans).
* `INSERT`: `auth.uid() = user_id` (Users can only insert plans for themselves).
* `DELETE`: `auth.uid() = user_id` (Users can only delete their own plans).

---

## 5. External APIs Used

1. **Open-Meteo Weather API**
   * **Endpoint**: `https://api.open-meteo.com/v1/forecast`
   * **Cost / Key**: Completely free, no API key needed.
   * **Parameters**: `latitude`, `longitude`, `current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`, `hourly=temperature_2m,apparent_temperature`.

2. **BigDataCloud Client-side Reverse Geocoding API**
   * **Endpoint**: `https://api.bigdatacloud.net/data/reverse-geocode-client`
   * **Cost / Key**: Free, no API key needed for client-side queries.
   * **Usage**: Converts GPS coordinates to locality/district/city names in India.

3. **Open-Meteo Geocoding API (Fallback Search)**
   * **Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`
   * **Cost / Key**: Free, no API key needed.
   * **Usage**: Autocomplete city search for fallback when location access is denied.

4. **Google Gemini Pro API**
   * **Model**: Gemini Pro (`gemini-2.5-pro` or `gemini-1.5-pro`)
   * **Usage**: Server-side route `app/api/plan/route.ts`. Generates high quality, personalized heat safety plans in English or Hindi.
   * **Fallback**: Hardcoded rule-based safety plan based on Indian heat index thresholds if the AI call fails.

5. **Amazon Polly (AWS Text-to-Speech)**
   * **Package**: `@aws-sdk/client-polly`
   * **Security**: Server-side only via `app/api/speak/route.ts`. AWS keys never reach the browser.
   * **Voice & Engine**: Voice `Kajal`, Engine `Neural` (bilingual Indian English `en-IN` & Hindi `hi-IN`).
   * **Fallback**: Browser Web Speech API (`window.speechSynthesis`).

---

## 6. AWS Service Details & Configuration

### A. AWS Service
* **Service**: Amazon Polly
* **Operation**: `SynthesizeSpeech`

### B. AWS IAM Permissions
The IAM user or role only needs the following single permission:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "polly:SynthesizeSpeech"
      ],
      "Resource": "*"
    }
  ]
}
```

### C. Environment Variables
Variable names use the `MY_` prefix to comply with Netlify's build requirements:
```env
# AWS Polly Credentials (Server-side only)
MY_AWS_ACCESS_KEY_ID="your_aws_access_key_id_here"
MY_AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key_here"
MY_AWS_REGION="ap-south-1"

# Google Gemini API (Server-side only)
GEMINI_API_KEY="your_gemini_api_key_here"

# Supabase (Public client)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key_here"
```

### D. Audio Route Guardrails (`app/api/speak/route.ts`)
* **Character Limit**: Maximum 1,500 characters per request.
* **Format**: MP3 (`audio/mpeg`).
* **Rate Limiting**: Server-side IP rate limiting to protect AWS billing.
* **No Auto-Play**: Requires explicit user interaction.

---

## 7. Phase-by-Phase Build Plan

* **Phase 1: Design and layout with fake data**
  * Mobile-first responsive single-page layout with Tailwind CSS.
  * Header with title, language toggle (EN/HI), and Google Sign-In button.
  * Location explainer banner & city search box mockup.
  * 6 job role selector buttons + 4 working hour shift buttons.
  * Live weather & heat index widget with fake data (42°C, feels like 47°C, Danger).
  * Safety plan card (safe hours, hydration, warning signs, 108 emergency dialer button, dummy "Listen" button with Polly label).
  * *Deliverable: Beautiful, interactive UI working with fake data.*

* **Phase 2: Live location, weather API and AI plan with rule-based fallback**
  * Browser geolocation with friendly pre-permission explainer.
  * BigDataCloud client-side reverse geocoding for city display.
  * Open-Meteo geocoding search fallback.
  * Real Open-Meteo weather API call.
  * Next.js server route `app/api/plan/route.ts` using Google Gemini Pro.
  * Rule-based plan fallback if Gemini is offline or rate-limited.
  * `localStorage` persistence for city, role, and shift.
  * *Deliverable: End-to-end live weather detection and AI plan generation.*

* **Phase 2B: Amazon Polly voice readout**
  * Install `@aws-sdk/client-polly`.
  * Create `app/api/speak/route.ts` using `MY_AWS_*` credentials.
  * Configure Kajal (Neural voice) for both Hindi and Indian English.
  * Add "Listen" button with loading, play/pause, stop, and Polly attribution.
  * Fall back to browser `speechSynthesis` if Polly fails.
  * *Deliverable: Working audio readout with Amazon Polly.*

* **Phase 3: Database and login (Supabase Google Sign-In)**
  * Install `@supabase/supabase-js`.
  * Set up Supabase client and Google OAuth integration.
  * Create `profiles` and `saved_plans` tables with RLS.
  * Allow logged-in users to save preferences and past plans.
  * Build Saved Plans drawer.
  * *Deliverable: Google authentication and persistent cloud storage.*

* **Phase 4: Security**
  * Server-side rate limiting on `/api/plan` and `/api/speak`.
  * Input validation on all API routes.
  * Privacy check: ensure exact coordinates are never stored or logged.
  * *Deliverable: Hardened, production-safe routes.*

* **Phase 5: Polish and Hindi/English localization**
  * Full bilingual dictionary for all UI text and alerts.
  * Tested prompts for natural Hindi safety plans and Kajal audio.
  * One-tap WhatsApp share and 108 emergency dialing.
  * Final responsiveness, contrast, and performance audit.
  * *Deliverable: Complete, polished bilingual app.*
