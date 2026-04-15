/**
 * One-off script: optimize 6 Wikimedia Commons homepage images.
 * Resizes to max 2048px wide, converts to WebP q=85, deletes .jpg originals.
 * Run: node scripts/optimize-homepage-images.js
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const FILES = [
  'wild-mushrooms-forest-floor',
  'person-foraging-mushroom-nature',
  'mushroom-gills-closeup-macro',
  'mushroom-cluster-growing-on-wood',
  'colorful-wild-mushrooms-nature',
  'wild-mushroom-basket-foraging',
]

async function main() {
  for (const name of FILES) {
    const jpgPath = path.join(PUBLIC_DIR, `${name}.jpg`)
    const webpPath = path.join(PUBLIC_DIR, `${name}.webp`)

    if (!fs.existsSync(jpgPath)) {
      console.log(`skip (no jpg): ${name}`)
      continue
    }

    const jpgStat = fs.statSync(jpgPath)
    const jpgSizeMB = (jpgStat.size / 1024 / 1024).toFixed(2)

    await sharp(jpgPath)
      .resize({ width: 2048, withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath)

    const webpStat = fs.statSync(webpPath)
    const webpSizeKB = (webpStat.size / 1024).toFixed(0)
    const reduction = (100 - (webpStat.size / jpgStat.size) * 100).toFixed(0)

    fs.unlinkSync(jpgPath)

    console.log(`${name}: ${jpgSizeMB} MB JPG -> ${webpSizeKB} KB WebP (${reduction}% smaller)`)
  }
  console.log('\nAll done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
