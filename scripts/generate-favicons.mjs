import sharp from 'sharp'
import fs from 'fs/promises'

const sizes = [
  16,
  32,
  48,
  167,
  180,
  192,
  512
]

async function generateFavicons() {
  const svgBuffer = await fs.readFile('public/favicon.svg')

  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`public/favicon-${size}x${size}.png`)

    console.log(`Generated ${size}x${size} favicon`)
  }
}

generateFavicons().catch(console.error)