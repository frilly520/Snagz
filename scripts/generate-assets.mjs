import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 1. Master Icon SVG (Square 1024x1024 with rounded corners and safe area)
const masterAppIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1713"/>
      <stop offset="40%" stop-color="#090d0b"/>
      <stop offset="100%" stop-color="#040605"/>
    </linearGradient>
    <linearGradient id="brandEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </linearGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.6"/>
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#10b981" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="1024" height="1024" rx="224" fill="url(#bgGrad)"/>
  
  <!-- Subtle Border Ring -->
  <rect x="16" y="16" width="992" height="992" rx="212" fill="none" stroke="#10b981" stroke-width="8" stroke-opacity="0.25"/>

  <!-- Ambient Glow Behind Symbol -->
  <circle cx="512" cy="512" r="320" fill="url(#glowGrad)"/>

  <!-- SNAGZ "S" Tag-Hook Symbol -->
  <g filter="url(#dropShadow)">
    <!-- Top Hook Segment -->
    <path d="M 690 310 
             L 420 310 
             C 340 310 280 370 280 450 
             C 280 520 330 575 400 595 
             L 610 655 
             C 670 672 710 715 710 770 
             C 710 835 655 885 570 885 
             L 300 885 
             L 300 770 
             L 570 770 
             C 600 770 620 755 620 735 
             C 620 712 600 695 565 685 
             L 360 625 
             C 290 605 240 550 240 470 
             C 240 360 330 270 450 270 
             L 730 270 
             Z" 
          fill="url(#brandEmerald)"/>

    <!-- Dynamic Snag Lightning Bolt / Savings Spark in Upper Loop -->
    <path d="M 720 220 
             L 790 330 
             L 710 330 
             L 750 440 
             L 630 350 
             L 700 350 
             Z" 
          fill="#6ee7b7"/>

    <!-- Tag Eyelet Notch -->
    <circle cx="430" cy="420" r="34" fill="#090d0b" stroke="#34d399" stroke-width="12"/>
  </g>
</svg>`;

// 2. Standalone Symbol SVG (transparent background, pure vector)
const standaloneSymbolSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="brandEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <g transform="translate(10, 0)">
    <!-- SNAGZ "S" Tag-Hook Symbol -->
    <path d="M 590 190 
             L 320 190 
             C 240 190 180 250 180 330 
             C 180 400 230 455 300 475 
             L 510 535 
             C 570 552 610 595 610 650 
             C 610 715 555 765 470 765 
             L 200 765 
             L 200 650 
             L 470 650 
             C 500 650 520 635 520 615 
             C 520 592 500 575 465 565 
             L 260 505 
             C 190 485 140 430 140 350 
             C 140 240 230 150 350 150 
             L 630 150 
             Z" 
          fill="url(#brandEmerald)"/>

    <!-- Snag Spark Accent -->
    <path d="M 620 100 
             L 690 210 
             L 610 210 
             L 650 320 
             L 530 230 
             L 600 230 
             Z" 
          fill="#6ee7b7"/>

    <!-- Eyelet Notch -->
    <circle cx="330" cy="300" r="34" fill="#090d0b" stroke="#34d399" stroke-width="12"/>
  </g>
</svg>`;

// 3. Horizontal Full Logo SVG (Dark Background)
const horizontalLogoDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 160" width="640" height="160">
  <defs>
    <linearGradient id="brandEmeraldH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <!-- Symbol Mini -->
  <g transform="translate(16, 12) scale(0.17)">
    <rect width="800" height="800" rx="180" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-opacity="0.3" stroke-width="16"/>
    <path d="M 590 190 L 320 190 C 240 190 180 250 180 330 C 180 400 230 455 300 475 L 510 535 C 570 552 610 595 610 650 C 610 715 555 765 470 765 L 200 765 L 200 650 L 470 650 C 500 650 520 635 520 615 C 520 592 500 575 465 565 L 260 505 C 190 485 140 430 140 350 C 140 240 230 150 350 150 L 630 150 Z" fill="url(#brandEmeraldH)"/>
    <path d="M 620 100 L 690 210 L 610 210 L 650 320 L 530 230 L 600 230 Z" fill="#6ee7b7"/>
    <circle cx="330" cy="300" r="34" fill="#090d0b" stroke="#34d399" stroke-width="12"/>
  </g>

  <!-- Wordmark "SNAGZ" -->
  <text x="180" y="98" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="900" font-size="78" fill="#ffffff" letter-spacing="2">
    SNAG<tspan fill="url(#brandEmeraldH)">Z</tspan>
  </text>

  <!-- Tagline below -->
  <text x="184" y="132" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="600" font-size="16" fill="#9ca3af" letter-spacing="3.5">
    FIND IT. SAVE IT. SNAG IT.
  </text>
</svg>`;

// 4. Horizontal Full Logo SVG (Light Background)
const horizontalLogoLightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 160" width="640" height="160">
  <defs>
    <linearGradient id="brandEmeraldHL" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>
  <g transform="translate(16, 12) scale(0.17)">
    <rect width="800" height="800" rx="180" fill="#10b981" fill-opacity="0.12" stroke="#10b981" stroke-opacity="0.4" stroke-width="16"/>
    <path d="M 590 190 L 320 190 C 240 190 180 250 180 330 C 180 400 230 455 300 475 L 510 535 C 570 552 610 595 610 650 C 610 715 555 765 470 765 L 200 765 L 200 650 L 470 650 C 500 650 520 635 520 615 C 520 592 500 575 465 565 L 260 505 C 190 485 140 430 140 350 C 140 240 230 150 350 150 L 630 150 Z" fill="url(#brandEmeraldHL)"/>
    <path d="M 620 100 L 690 210 L 610 210 L 650 320 L 530 230 L 600 230 Z" fill="#059669"/>
    <circle cx="330" cy="300" r="34" fill="#ffffff" stroke="#10b981" stroke-width="12"/>
  </g>

  <!-- Wordmark "SNAGZ" -->
  <text x="180" y="98" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="900" font-size="78" fill="#0f172a" letter-spacing="2">
    SNAG<tspan fill="url(#brandEmeraldHL)">Z</tspan>
  </text>

  <!-- Tagline below -->
  <text x="184" y="132" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="600" font-size="16" fill="#475569" letter-spacing="3.5">
    FIND IT. SAVE IT. SNAG IT.
  </text>
</svg>`;

// 5. Maskable Icon SVG (512x512 with 20% safe margin, full bleed background)
const maskableIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="maskableBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1713"/>
      <stop offset="100%" stop-color="#040605"/>
    </linearGradient>
    <linearGradient id="brandEmeraldM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <!-- Full bleed background for any maskable crop -->
  <rect width="512" height="512" fill="url(#maskableBg)"/>
  
  <!-- Safe-zone centered symbol -->
  <g transform="translate(100, 100) scale(0.39)">
    <path d="M 590 190 L 320 190 C 240 190 180 250 180 330 C 180 400 230 455 300 475 L 510 535 C 570 552 610 595 610 650 C 610 715 555 765 470 765 L 200 765 L 200 650 L 470 650 C 500 650 520 635 520 615 C 520 592 500 575 465 565 L 260 505 C 190 485 140 430 140 350 C 140 240 230 150 350 150 L 630 150 Z" fill="url(#brandEmeraldM)"/>
    <path d="M 620 100 L 690 210 L 610 210 L 650 320 L 530 230 L 600 230 Z" fill="#6ee7b7"/>
    <circle cx="330" cy="300" r="34" fill="#090d0b" stroke="#34d399" stroke-width="12"/>
  </g>
</svg>`;

// 6. Android Adaptive Icon Background SVG
const androidAdaptiveBgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="androidBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1713"/>
      <stop offset="50%" stop-color="#090d0b"/>
      <stop offset="100%" stop-color="#040605"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#androidBg)"/>
  <circle cx="256" cy="256" r="180" fill="#10b981" fill-opacity="0.08"/>
</svg>`;

// 7. Android Adaptive Icon Foreground SVG
const androidAdaptiveFgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="brandEmeraldAF" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <g transform="translate(116, 116) scale(0.35)">
    <path d="M 590 190 L 320 190 C 240 190 180 250 180 330 C 180 400 230 455 300 475 L 510 535 C 570 552 610 595 610 650 C 610 715 555 765 470 765 L 200 765 L 200 650 L 470 650 C 500 650 520 635 520 615 C 520 592 500 575 465 565 L 260 505 C 190 485 140 430 140 350 C 140 240 230 150 350 150 L 630 150 Z" fill="url(#brandEmeraldAF)"/>
    <path d="M 620 100 L 690 210 L 610 210 L 650 320 L 530 230 L 600 230 Z" fill="#6ee7b7"/>
    <circle cx="330" cy="300" r="34" fill="#090d0b" stroke="#34d399" stroke-width="12"/>
  </g>
</svg>`;

// 8. Social Sharing Open Graph 1200x630 Banner
const socialOgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d0b"/>
      <stop offset="50%" stop-color="#040605"/>
      <stop offset="100%" stop-color="#020302"/>
    </linearGradient>
    <linearGradient id="brandEmeraldOG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <radialGradient id="ambientGlow" cx="30%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#090d0b" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#ogBg)"/>
  <rect width="1200" height="630" fill="url(#ambientGlow)"/>

  <!-- Border accent -->
  <rect x="20" y="20" width="1160" height="590" rx="32" fill="none" stroke="#10b981" stroke-width="2" stroke-opacity="0.2"/>

  <!-- Left Icon Mark -->
  <g transform="translate(100, 165) scale(0.38)">
    <rect width="800" height="800" rx="200" fill="#0e1713" stroke="#10b981" stroke-width="12" stroke-opacity="0.4"/>
    <path d="M 590 190 L 320 190 C 240 190 180 250 180 330 C 180 400 230 455 300 475 L 510 535 C 570 552 610 595 610 650 C 610 715 555 765 470 765 L 200 765 L 200 650 L 470 650 C 500 650 520 635 520 615 C 520 592 500 575 465 565 L 260 505 C 190 485 140 430 140 350 C 140 240 230 150 350 150 L 630 150 Z" fill="url(#brandEmeraldOG)"/>
    <path d="M 620 100 L 690 210 L 610 210 L 650 320 L 530 230 L 600 230 Z" fill="#6ee7b7"/>
    <circle cx="330" cy="300" r="34" fill="#090d0b" stroke="#34d399" stroke-width="12"/>
  </g>

  <!-- Brand Typography -->
  <!-- Name -->
  <text x="460" y="275" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="900" font-size="124" fill="#ffffff" letter-spacing="3">
    SNAG<tspan fill="url(#brandEmeraldOG)">Z</tspan>
  </text>

  <!-- Official Tagline -->
  <text x="465" y="345" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="700" font-size="34" fill="#34d399" letter-spacing="2">
    Find it. Save it. Snag it.
  </text>

  <!-- Value Propositions Badges -->
  <g transform="translate(465, 400)">
    <!-- Badge 1 -->
    <rect x="0" y="0" width="180" height="42" rx="10" fill="#10b981" fill-opacity="0.12" stroke="#10b981" stroke-opacity="0.3"/>
    <text x="90" y="26" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="15" fill="#a7f3d0" text-anchor="middle">🔥 HOT DEALS</text>

    <!-- Badge 2 -->
    <rect x="195" y="0" width="160" height="42" rx="10" fill="#10b981" fill-opacity="0.12" stroke="#10b981" stroke-opacity="0.3"/>
    <text x="275" y="26" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="15" fill="#a7f3d0" text-anchor="middle">🆓 $0 FREE</text>

    <!-- Badge 3 -->
    <rect x="370" y="0" width="220" height="42" rx="10" fill="#10b981" fill-opacity="0.12" stroke="#10b981" stroke-opacity="0.3"/>
    <text x="480" y="26" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="15" fill="#a7f3d0" text-anchor="middle">🏪 EVERYDAY STORES</text>
  </g>

  <!-- URL footer -->
  <text x="465" y="495" font-family="'JetBrains Mono', monospace" font-weight="600" font-size="20" fill="#6b7280" letter-spacing="1">
    VERIFIED DEALS • WEEKLY ADS • ZERO-COMMISSION RANKING
  </text>
</svg>`;

async function main() {
  console.log('Generating SNAGZ Brand Master Assets...');

  // Ensure directories exist
  fs.mkdirSync('public/brand', { recursive: true });
  fs.mkdirSync('public/icons', { recursive: true });
  fs.mkdirSync('public/social', { recursive: true });

  // 1. Write SVGs
  fs.writeFileSync('public/brand/snagz-symbol.svg', standaloneSymbolSvg);
  fs.writeFileSync('public/brand/snagz-logo.svg', horizontalLogoDarkSvg);
  fs.writeFileSync('public/brand/snagz-logo-dark.svg', horizontalLogoDarkSvg);
  fs.writeFileSync('public/brand/snagz-logo-light.svg', horizontalLogoLightSvg);
  fs.writeFileSync('public/brand/snagz-maskable.svg', maskableIconSvg);
  fs.writeFileSync('public/brand/android-adaptive-background.svg', androidAdaptiveBgSvg);
  fs.writeFileSync('public/brand/android-adaptive-foreground.svg', androidAdaptiveFgSvg);
  fs.writeFileSync('public/social/snagz-og-1200x630.svg', socialOgSvg);

  // Also root icon.svg
  fs.writeFileSync('public/icon.svg', masterAppIconSvg);

  console.log('Rendering high-resolution raster assets...');

  // 2. Render core sizes from masterAppIconSvg:
  // 16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512, 1024
  const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512, 1024];

  for (const size of sizes) {
    const buffer = await sharp(Buffer.from(masterAppIconSvg))
      .resize(size, size, { fit: 'contain' })
      .png()
      .toBuffer();

    fs.writeFileSync(`public/icons/snagz-icon-${size}.png`, buffer);
    console.log(`Generated public/icons/snagz-icon-${size}.png`);
  }

  // Standalone symbol PNG (1024x1024 transparent)
  const symbolBuffer = await sharp(Buffer.from(standaloneSymbolSvg))
    .resize(1024, 1024)
    .png()
    .toBuffer();
  fs.writeFileSync('public/brand/snagz-symbol.png', symbolBuffer);

  // Apple touch icon (180x180)
  const appleTouchBuffer = await sharp(Buffer.from(masterAppIconSvg))
    .resize(180, 180)
    .png()
    .toBuffer();
  fs.writeFileSync('public/icons/apple-touch-icon.png', appleTouchBuffer);
  fs.writeFileSync('public/apple-touch-icon.png', appleTouchBuffer);

  // PWA standard icons (192 and 512)
  const pwa192 = await sharp(Buffer.from(masterAppIconSvg)).resize(192, 192).png().toBuffer();
  const pwa512 = await sharp(Buffer.from(masterAppIconSvg)).resize(512, 512).png().toBuffer();
  fs.writeFileSync('public/pwa-192x192.png', pwa192);
  fs.writeFileSync('public/pwa-512x512.png', pwa512);

  // Maskable icons (192 and 512)
  const maskable192 = await sharp(Buffer.from(maskableIconSvg)).resize(192, 192).png().toBuffer();
  const maskable512 = await sharp(Buffer.from(maskableIconSvg)).resize(512, 512).png().toBuffer();
  fs.writeFileSync('public/icons/snagz-maskable-192.png', maskable192);
  fs.writeFileSync('public/icons/snagz-maskable-512.png', maskable512);
  fs.writeFileSync('public/pwa-maskable-512x512.png', maskable512);

  // Android Adaptive layers
  const androidBg = await sharp(Buffer.from(androidAdaptiveBgSvg)).resize(512, 512).png().toBuffer();
  const androidFg = await sharp(Buffer.from(androidAdaptiveFgSvg)).resize(512, 512).png().toBuffer();
  fs.writeFileSync('public/icons/android-adaptive-background.png', androidBg);
  fs.writeFileSync('public/icons/android-adaptive-foreground.png', androidFg);

  // Favicon PNGs
  const fav16 = await sharp(Buffer.from(masterAppIconSvg)).resize(16, 16).png().toBuffer();
  const fav32 = await sharp(Buffer.from(masterAppIconSvg)).resize(32, 32).png().toBuffer();
  const fav48 = await sharp(Buffer.from(masterAppIconSvg)).resize(48, 48).png().toBuffer();
  fs.writeFileSync('public/favicon-16x16.png', fav16);
  fs.writeFileSync('public/favicon-32x32.png', fav32);
  fs.writeFileSync('public/favicon-48x48.png', fav48);
  fs.writeFileSync('public/favicon.png', fav32);

  // Favicon ICO (standard 32x32 ICO header container or 32px png named favicon.ico)
  // Generating genuine multi-resolution .ico from 16, 32, 48 PNG buffers:
  // A standard ICO structure:
  // ICONDIR header (6 bytes) + 3 x ICONDIRENTRY (16 bytes each = 48 bytes) + image datas
  function createIco(images) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // reserved
    header.writeUInt16LE(1, 2); // 1 = ICO
    header.writeUInt16LE(images.length, 4); // count

    let offset = 6 + images.length * 16;
    const entries = [];
    const imageBuffers = [];

    for (const img of images) {
      const entry = Buffer.alloc(16);
      entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
      entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
      entry.writeUInt8(0, 2); // color palette count
      entry.writeUInt8(0, 3); // reserved
      entry.writeUInt16LE(1, 4); // color planes
      entry.writeUInt16LE(32, 6); // bits per pixel
      entry.writeUInt32LE(img.data.length, 8); // size
      entry.writeUInt32LE(offset, 12); // offset

      offset += img.data.length;
      entries.push(entry);
      imageBuffers.push(img.data);
    }

    return Buffer.concat([header, ...entries, ...imageBuffers]);
  }

  const icoBuffer = createIco([
    { width: 16, height: 16, data: fav16 },
    { width: 32, height: 32, data: fav32 },
    { width: 48, height: 48, data: fav48 }
  ]);

  fs.writeFileSync('public/icons/favicon.ico', icoBuffer);
  fs.writeFileSync('public/favicon.ico', icoBuffer);

  // Social Open Graph 1200x630 PNG
  const ogBuffer = await sharp(Buffer.from(socialOgSvg)).resize(1200, 630).png().toBuffer();
  fs.writeFileSync('public/social/snagz-og-1200x630.png', ogBuffer);

  console.log('All SNAGZ brand assets generated successfully!');
}

main().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
