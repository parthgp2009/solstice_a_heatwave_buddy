import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.join(process.cwd(), "public", "icons");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function getSvg(size: number, isMaskable = false): string {
  const rx = isMaskable ? "0" : "108";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
    <!-- Solid Navy Palette Background -->
    <rect width="512" height="512" rx="${rx}" fill="#1E2A44" />
    
    <!-- Sun Accent behind Thermometer -->
    <circle cx="320" cy="180" r="70" fill="#F5B83D" opacity="0.9" />
    
    <!-- Sun Rays -->
    <g stroke="#F5B83D" stroke-width="8" stroke-linecap="round" opacity="0.9">
      <line x1="320" y1="85" x2="320" y2="65" />
      <line x1="320" y1="275" x2="320" y2="295" />
      <line x1="225" y1="180" x2="205" y2="180" />
      <line x1="415" y1="180" x2="435" y2="180" />
      <line x1="253" y1="113" x2="239" y2="99" />
      <line x1="387" y1="247" x2="401" y2="261" />
      <line x1="253" y1="247" x2="239" y2="261" />
      <line x1="387" y1="113" x2="401" y2="99" />
    </g>

    <!-- Thermometer Outer Body (Cream #FDF3E7) -->
    <rect x="180" y="110" width="56" height="220" rx="28" fill="#FDF3E7" stroke="#FDF3E7" stroke-width="4" />
    
    <!-- Thermometer Bulb Base (Cream #FDF3E7) -->
    <circle cx="208" cy="350" r="52" fill="#FDF3E7" />
    
    <!-- Inner Tube Glass / Channel -->
    <rect x="194" y="126" width="28" height="200" rx="14" fill="#1E2A44" opacity="0.12" />
    
    <!-- Mercury Fill in Tube (Orange #F47A1F) -->
    <rect x="198" y="190" width="20" height="136" rx="10" fill="#F47A1F" />
    
    <!-- Mercury Bulb (Orange #F47A1F) -->
    <circle cx="208" cy="350" r="38" fill="#F47A1F" />
    
    <!-- Bulb highlight reflection -->
    <circle cx="196" cy="338" r="10" fill="#FFFFFF" opacity="0.5" />
    
    <!-- Tick Marks -->
    <g stroke="#1E2A44" stroke-width="4" stroke-linecap="round" opacity="0.6">
      <line x1="242" y1="150" x2="252" y2="150" />
      <line x1="242" y1="180" x2="256" y2="180" />
      <line x1="242" y1="210" x2="252" y2="210" />
      <line x1="242" y1="240" x2="256" y2="240" />
      <line x1="242" y1="270" x2="252" y2="270" />
    </g>
  </svg>`;
}

async function run() {
  await sharp(Buffer.from(getSvg(192))).png().toFile(path.join(dir, "icon-192.png"));
  await sharp(Buffer.from(getSvg(512))).png().toFile(path.join(dir, "icon-512.png"));
  await sharp(Buffer.from(getSvg(192, true))).png().toFile(path.join(dir, "icon-maskable-192.png"));
  await sharp(Buffer.from(getSvg(512, true))).png().toFile(path.join(dir, "icon-maskable-512.png"));
  console.log("✓ Successfully generated 192x192 and 512x512 icons in public/icons");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
