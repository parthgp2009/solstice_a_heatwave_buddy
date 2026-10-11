import sharp from "sharp";
import path from "path";

async function generateOgImage() {
  const width = 1200;
  const height = 630;
  const publicDir = path.join(process.cwd(), "public");
  const logoPath = path.join(publicDir, "logo.png");
  const outputPath = path.join(publicDir, "og-image.png");

  // Read logo and resize nicely to width 440
  const resizedLogoBuffer = await sharp(logoPath)
    .resize({ width: 460 })
    .toBuffer();

  const svgOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFAF4"/>
        <stop offset="100%" stop-color="#FBEBD9"/>
      </linearGradient>
      <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F47A1F"/>
        <stop offset="100%" stop-color="#E0650D"/>
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
        <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#1E2A44" flood-opacity="0.08"/>
      </filter>
    </defs>

    <!-- Background Cream -->
    <rect width="${width}" height="${height}" fill="#FDF3E7"/>

    <!-- Subtle warm radial glow top right -->
    <circle cx="1080" cy="120" r="340" fill="#F47A1F" opacity="0.07"/>
    <circle cx="120" cy="540" r="280" fill="#2E9E5B" opacity="0.05"/>

    <!-- Decorative Top Accent Bar -->
    <rect x="0" y="0" width="${width}" height="8" fill="url(#orangeGrad)"/>

    <!-- Outer Card Frame -->
    <rect x="60" y="50" width="1080" height="530" rx="28" fill="url(#cardGrad)" stroke="#1E2A44" stroke-opacity="0.12" stroke-width="2" filter="url(#shadow)"/>

    <!-- Crisis Tagline / Context Badge -->
    <g transform="translate(110, 95)">
      <rect x="0" y="0" width="310" height="36" rx="18" fill="#FDECEA" stroke="#D92D20" stroke-opacity="0.3" stroke-width="1.5"/>
      <circle cx="18" cy="18" r="5" fill="#D92D20"/>
      <text x="32" y="23" font-family="Plus Jakarta Sans, sans-serif, Arial" font-size="13" font-weight="800" fill="#D92D20" letter-spacing="0.5">
        EXTREME HEAT DEFENSE • 2026
      </text>
    </g>

    <!-- Subtitle / Hindi Badge -->
    <g transform="translate(440, 95)">
      <rect x="0" y="0" width="190" height="36" rx="18" fill="#FFFAF4" stroke="#1E2A44" stroke-opacity="0.15" stroke-width="1.5"/>
      <text x="95" y="23" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif, Arial" font-size="13" font-weight="700" fill="#1E2A44">
        लू साथी • Heatwave Buddy
      </text>
    </g>

    <!-- Main Headline Text -->
    <text x="110" y="275" font-family="Plus Jakarta Sans, sans-serif, Arial" font-size="44" font-weight="800" fill="#1E2A44" letter-spacing="-0.8">
      Real-Time Heat Safety &amp; Hydration
    </text>

    <!-- Subtitle Paragraph -->
    <text x="110" y="325" font-family="Plus Jakarta Sans, sans-serif, Arial" font-size="20" font-weight="500" fill="#5B6577">
      Tailored occupational safety plans, adjusted feels-like heat index,
    </text>
    <text x="110" y="355" font-family="Plus Jakarta Sans, sans-serif, Arial" font-size="20" font-weight="500" fill="#5B6577">
      and bilingual Kajal AI speech readout for workers across India.
    </text>

    <!-- Feature Badges Row -->
    <!-- Feature 1: Weather Gauge -->
    <g transform="translate(110, 420)">
      <rect x="0" y="0" width="220" height="52" rx="16" fill="#FFFAF4" stroke="#1E2A44" stroke-opacity="0.12" stroke-width="1.5"/>
      <text x="20" y="32" font-family="Plus Jakarta Sans, sans-serif, Arial" font-size="14" font-weight="700" fill="#1E2A44">
        🌡️ Live Heat Index
      </text>
    </g>

    <!-- Feature 2: Personalised Plan -->
    <g transform="translate(350, 420)">
      <rect x="0" y="0" width="230" height="52" rx="16" fill="#FFFAF4" stroke="#1E2A44" stroke-opacity="0.12" stroke-width="1.5"/>
      <text x="20" y="32" font-family="Plus Jakarta Sans, sans-serif, Arial" font-size="14" font-weight="700" fill="#1E2A44">
        📋 Personalised Plan
      </text>
    </g>

    <!-- Feature 3: Bilingual Voice -->
    <g transform="translate(600, 420)">
      <rect x="0" y="0" width="230" height="52" rx="16" fill="#FFFAF4" stroke="#1E2A44" stroke-opacity="0.12" stroke-width="1.5"/>
      <text x="20" y="32" font-family="Plus Jakarta Sans, sans-serif, Arial" font-size="14" font-weight="700" fill="#1E2A44">
        🎙️ Kajal AI Speech
      </text>
    </g>

    <!-- Feature 4: Zero Storage -->
    <g transform="translate(850, 420)">
      <rect x="0" y="0" width="220" height="52" rx="16" fill="#EAF6EE" stroke="#2E9E5B" stroke-opacity="0.3" stroke-width="1.5"/>
      <text x="20" y="32" font-family="Plus Jakarta Sans, sans-serif, Arial" font-size="14" font-weight="700" fill="#2E9E5B">
        🛡️ Zero-Storage Privacy
      </text>
    </g>

    <!-- Footer Bar inside card -->
    <line x1="110" y1="495" x2="1070" y2="495" stroke="#1E2A44" stroke-opacity="0.1" stroke-width="1"/>
    <text x="110" y="535" font-family="Plus Jakarta Sans, sans-serif, Arial" font-size="14" font-weight="700" fill="#5B6577">
      Free for India's delivery riders, farmers, students, police &amp; citizens
    </text>
    <text x="1070" y="535" text-anchor="end" font-family="Plus Jakarta Sans, sans-serif, Arial" font-size="14" font-weight="800" fill="#D92D20">
      🚨 Emergency 108 Protocol
    </text>
  </svg>
  `;

  // Composite background SVG with resized logo.png placed at (110, 150)
  await sharp(Buffer.from(svgOverlay))
    .composite([
      {
        input: resizedLogoBuffer,
        top: 155,
        left: 110,
      },
    ])
    .png({ quality: 95 })
    .toFile(outputPath);

  console.log(`Generated og-image.png at ${outputPath}`);
}

generateOgImage().catch(err => {
  console.error("Error generating og-image:", err);
  process.exit(1);
});
