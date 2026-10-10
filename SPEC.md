# Project Specification: Heatwave Buddy (लू साथी)

## 1. Overview
**Heatwave Buddy / Solstice** (लू साथी) is a mobile-first, multi-page web application designed for people in India facing extreme heat (such as delivery riders, farmers, students, traffic police, office workers, and vulnerable age groups).

### Multi-Page System Architecture
The application is structured into specialized routes:
* **`/` (Home)**: High-impact hero, real-time adjusted temperature station, primary action CTAs, crisis tagline banner, and portals to all dedicated sections.
* **`/plan` (Safety Plan)**: Dedicated full-screen plan builder with live risk assessment, customized hydration scheduling, and tailored age/occupation/health protocols.
* **`/weather` (Live Weather & Heat Index)**: Dedicated weather monitoring station with city selector, live feels-like gauge, 24-hour hour control slider, and full 24-hour hourly forecast breakdown table.
* **`/about` (Crisis Stats & About)**: Detailed public health context featuring the **India Heat Toll Statistics (2024)** infographic (`tagline.jpeg`), Solstice mission, scientific heat model methodology, and prevention steps.
* **`/faqs` (FAQs)**: Interactive bilingual question-and-answer library covering heatstroke warning signs, UV index adjustments, and emergency protocols.
* **`/privacy` (Privacy Policy)**: Strict zero-storage guarantees (exact GPS coordinates never stored, local-only health considerations, permanent under-18 privacy lock).
* **`/terms` (Terms of Service)**: Legal and medical disclaimers emphasizing occupational heat stress guidance and immediate 108 ambulance dialing.

### Branding & Logo Integration
* **Top-Left Logo**: Features the official **Solstice** logo with circular temperature gauge 'o' and thermometer 'l', transparently blended into the cream page background.
* **Tagline**: Features the official India Heat Toll Statistics infographic from `tagline.jpeg` ("Over 48,000 Suspected Heatstroke Cases and 161 Confirmed Deaths") as an authoritative crisis banner and modal preview on the home screen, and a full spotlight on the About page.

---

## 2. Design Aesthetics & Visual Tokens

### Palette (CSS Variables, Fixed)
* **Cream**: `#FDF3E7` (Page background)
* **Card**: `#FFFAF4` (Card surfaces, never pure white)
* **Navy**: `#1E2A44` (Headings, primary text, disclaimer bar)
* **Slate**: `#5B6577` (Muted body text, secondary labels)
* **Orange**: `#F47A1F` (Primary brand accent, CTAs, highlight)
* **Danger Red**: `#D92D20` (Tint: `#FDECEA` for extreme heat status & alerts)
* **Green**: `#2E9E5B` (Tint: `#EAF6EE` for safe windows & low risk)
* **Blue**: `#2F7FD1` (Tint: `#EAF3FC` for hydration schedule)
* **Peach Tint**: `#FDEFE3` (For warning signs and warm haze)
* **Yellow**: `#F5B83D` (Caution status and sun accents)
* **Contrast**: All text maintains at least 4.5:1 WCAG AA contrast against its background.

### Typography
* **Headlines & Body**: Plus Jakarta Sans (800 for headlines, 600 for titles, 400 and 500 for body).
* **Hindi Localization**: Noto Sans Devanagari loaded via `next/font`.
* No Inter, Geist, Space Grotesk, or monospace fonts.

### Shapes & Elevation
* **Cards**: 18px to 22px border radius.
* **Buttons & Inputs**: 12px border radius.
* **Pills & Toggles**: Fully rounded (`rounded-full`).
* **Elevation**: Soft, low-opacity shadows (`box-shadow: 0 12px 32px rgba(30, 42, 68, 0.08)`).

---

## 3. Hero Background & Atmospheric Motion

### Hero Photo
* Full-bleed hero photo stored at `/public/hero-photo.webp` loaded via `next/image` with priority.
* Analyzed with sharp image pipeline:
  * **Sun Position**: X = 96.9%, Y = 45.0%
  * **Skyline / Bridge Horizon**: Y = 47.9%
  * **River Mist Band**: Y = 52.0%
* Left mask gradient (`mask-image: linear-gradient(...)`) blends the photo seamlessly into the cream background.
* Bottom smooth curved cream swoosh (SVG) blends hero into following sections.
* Fallback to `#F6D9B8` if photo fails to load.

### Motion Layers (Shared 30fps RAF & CSS Keyframes)
1. **Slow Photo Drift**: Scale 1.03 to 1.08 and small pan over 50-second alternating cycle.
2. **Sun Glow**: Positioned over the sun at X: 96.9%, Y: 45.0% using `mix-blend-mode: screen`, breathing gently on an 8-second cycle and fading on page scroll.
3. **Drifting Haze**: 3 layers of translucent warm haze and cloud wisps (cream and peach, 20% to 35% opacity) looping seamlessly on 80s to 160s intervals, plus a low mist layer over the skyline/river.
4. **Heat Shimmer**: Thin band over the skyline distorted with SVG `feTurbulence` and `feDisplacementMap`, dynamically scaled to the current adjusted feels-like temperature.
5. **Rising Warm Air Specks**: Canvas layer rendering ~24 soft glowing specks floating upward with gentle horizontal sway, repelling within 120px of cursor.
6. **Pointer / Scroll Parallax**: Photo shifts up to 12px, haze up to 20px, floating cards shift in opposite direction.
7. **Accessibility**: Full `prefers-reduced-motion` override displaying a clean, still version without animations or parallax.

---

## 4. Component Architecture & Controls

### GlideSelect Integration (`components/GlideSelect.tsx`)
Converted to TypeScript with explicit prop types. Used for all single-choice controls across the app:
1. **City**: Delhi (DL), Mumbai (MH), Kolkata (WB), Chennai (TN), Bengaluru (KA), Hyderabad (TS), Jaipur (RJ), and "Other city (search)".
2. **Age**: Under 18, 18 to 30, 31 to 45, 46 to 60, Over 60.
3. **Occupation**: Not specified, Delivery Driver (tag: "On the road all day"), Student, Farmer, Traffic Police, Office Worker.
4. **Hours in the Sun Today**: Up to 2 hours, 2 to 6 hours, More than 6 hours.
* Themed with `accentColor="#F47A1F"`, `surfaceColor="#FBEBD9"`, `highlightColor="#F9D9B8"`, `textColor="#1E2A44"`, `size="lg"`, `radius={14}`.
* Full-width trigger in plan builder with label on left and chevron on right.
* Unclipped menu rendering with automatic card z-index elevation.

### Personalisation Inputs
* **Health History**: Multi-select toggle chips (Heatstroke, Heat exhaustion, Migraine, Skin infections, Physical fatigue, None of the above).
* **Exclusive "None of the above"**: Clears other chips and reveals an optional 80-character custom note input with live counter.
* **Privacy Controls**: "Used only to make your plan. Not saved on our servers."
* **"Remember on this device" switch**: Off by default, saves strictly to `localStorage`.
* **Under-18 Safety**: If "Under 18" is chosen, shows "Ask a parent or guardian to help with these questions" and never saves data.

### Heat Model Pure Functions (`lib/heatModel.ts`)
* `uvOffset(uv)`: `< 6` => 0; `6 to 10` => 1; `> 10` => 1.5.
* `exposureOffset(bucket)`: `Up to 2 hrs` => 0; `2 to 6 hrs` => 1; `> 6 hrs` => 2.
* `adjustedFeelsLike = apparent_temp + uvOffset + exposureOffset`.
* **Risk Levels**: `< 32°C` Low; `32°C to < 38°C` Caution; `38°C to < 46°C` Danger; `>= 46°C` Extreme.
* **Safe Windows**: Consecutive hours below Danger threshold with low UV (<6) or nighttime.

### Right-Side Floating Cards
* **Live Reading Card**: Pin & city name, live pulsing dot, adjusted feels-like numeral, breakdown formula line, UV index badge, SVG semicircle gauge with needle sweep animation, "How we calculate this" expander, and interactive hour control slider.
* **Safety Plan Card**: Phone-style card with back arrow, language toggle, personalisation chips, and 4 tinted sections:
  1. Red tint: Current Heat Level & explanation.
  2. Green tint: Best Time to Go Out & avoid windows.
  3. Blue tint: Hydration Schedule with staggered filling glass icons.
  4. Peach tint: Warning Signs & tailored advice for age, occupation, and health conditions.
  * Stricter advice step for Under 18, Over 60, or heatstroke history.

### Bottom Disclaimer Strip
* Fixed navy strip with medical disclaimer and 1-tap `Call 108 Ambulance` button.

---

## 5. Development Phases

* **Step A1 (Completed)**: Hero design look complete (TopBar with Solstice logo, headline, PlanBuilderCard with all fields rendered, FeatureRow, LiveReadingCard, SafetyPlanCard, HeroBackground with photo analysis and motion, BottomDisclaimerStrip, bilingual context, multi-page routing).
* **Step A2 (Completed)**: Full reactive wiring of inputs and `lib/heatModel.ts` across cards, SVG semicircle gauge needle sweep, interactive hour control slider, strictness level logic (+1 tier for vulnerable groups), computed safe/avoid outdoor windows, and interactive Dev Panel (`DevHeatModelPanel.tsx`) verifying all 4 worked examples via `?dev=true`.
* **Step B (Completed)**: Below-hero sections: 24-hour SVG area chart of adjusted feels-like (responsive, no scrollbars, synced with hour control, shaded safe hours), full safety plan section with Amazon Polly "Listen" button and hydration tracker, "How it works" numbered list, expanding FAQs, and footer.
