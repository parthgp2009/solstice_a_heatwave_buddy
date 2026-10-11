# Solstice: Heatwave Buddy (लू साथी)
> Real-Time Personalised Heat Safety for India

**Solstice: Heatwave Buddy** is a mobile-first, installable Progressive Web Application (PWA) engineered to protect delivery riders, outdoor workers, students, farmers, and vulnerable communities across India during extreme heatwaves.

---

## 🌟 Key Features

1. **Installable PWA & Offline Support**:
   - Progressive Web App manifest (`/manifest.webmanifest`) configured with `start_url: "/plan"`, standalone display, and official high-resolution icons (192×192 and 512×512).
   - Hand-crafted lightweight Service Worker (`/sw.js`) pre-caching the application shell, essential static assets, and the offline fallback page.
   - **Offline Emergency Guarantee**: The **Heatstroke Emergency Check** and **Call 108 Ambulance** link work 100% offline with zero network dependency.
   - Automatic bilingual offline status banner informing users when internet is disconnected.

2. **Physiological Heat Model**:
   - Built on Open-Meteo real-time telemetry.
   - Biomedical adjustments for solar UV index (`+1°C` to `+1.5°C`) and direct sun exposure duration (`+1°C` to `+2°C`).
   - Personalized risk tiers: Low, Caution, Danger, and Extreme.
   - Vulnerability safeguards: Automatic +1 risk tier elevation for users Under 18, Over 60, or with heatstroke history.

3. **Occupational Work-Rest Scheduler**:
   - Clinical pacing guidance for Light, Moderate, and Heavy physical labor.
   - Hour-by-hour hydration pacing targets and safe outdoor window calculations.

4. **Clinical Triage & Emergency Protocol**:
   - Step-by-step triage covering 7 critical warning signs of heatstroke.
   - Immediate 1-tap `tel:108` emergency ambulance calling.
   - Critical cooling first aid steps and choking prevention safeguards.

5. **Strict Zero-Storage Privacy**:
   - No personal health information, age, or medical notes are ever stored on servers or logged in databases.
   - GPS coordinates are processed strictly in volatile memory for meteorological lookup and never logged.
   - Permanent privacy lock for users under 18.
   - The Service Worker caches zero API responses, zero weather telemetry, and zero user data.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Curated palette: Cream `#FDF3E7`, Navy `#1E2A44`, Orange `#F47A1F`, Red `#D92D20`)
- **PWA**: Web App Manifest (`app/manifest.ts`), Custom Service Worker (`public/sw.js`)
- **Telemetry**: Open-Meteo API
- **Audio / Voice**: Amazon Polly (Neural Bilingual Kajal voice)
- **Database / Auth**: Supabase (Row Level Security enabled)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/parthgp2009/mysite.git
cd mysite

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env.local` file in the root directory (refer to `.env.example`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# AWS Polly Voice Configuration (Server-side only)
MY_AWS_ACCESS_KEY_ID=your-aws-access-key-id
MY_AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
MY_AWS_REGION=ap-south-1
```

### Development & Production

```bash
# Run local development server
npm run dev

# Run linter
npm run lint

# Build production bundle
npm run build

# Start production server
npm start
```

---

## 📄 License & Disclaimer

General occupational guidance only, not a certified medical diagnosis. In any life-threatening heat emergency, call **108** immediately.

© 2026 Solstice: Heatwave Buddy (लू साथी). All rights reserved.
