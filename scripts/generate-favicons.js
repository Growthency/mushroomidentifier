/**
 * One-off: rasterize /public/favicon.svg into all required PNG favicon sizes.
 * Also generates logo-512.png for OG/social previews.
 * Run: node scripts/generate-favicons.js
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const SVG_PATH = path.join(PUBLIC_DIR, 'favicon.svg')

const TARGETS = [
  { size: 16,  out: 'favicon-16x16.png' },
  { size: 32,  out: 'favicon-32x32.png' },
  { size: 180, out: 'apple-touch-icon.png' },
  { size: 512, out: 'logo-512.png' },
  // Header logo used inline in <Image>
  { size: 128, out: 'logo-header.png' },
  // PWA / Android Chrome — referenced by site.webmanifest
  { size: 192, out: 'android-chrome-192x192.png' },
  { size: 512, out: 'android-chrome-512x512.png' },
]

async function main() {
  if (!fs.existsSync(SVG_PATH)) {
    throw new Error(`SVG not found at ${SVG_PATH}`)
  }
  const svgBuffer = fs.readFileSync(SVG_PATH)

  for (const { size, out } of TARGETS) {
    const outPath = path.join(PUBLIC_DIR, out)
    await sharp(svgBuffer, { density: Math.max(300, size * 2) })
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outPath)
    const stat = fs.statSync(outPath)
    console.log(`${out}: ${size}x${size}, ${(stat.size / 1024).toFixed(1)} KB`)
  }

  console.log('\nAll favicons + logo variants regenerated from favicon.svg.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
