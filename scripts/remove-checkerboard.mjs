import sharp from 'sharp';

const inputPath = 'C:\\Users\\Nigger - Pv\\.gemini\\antigravity\\brain\\e832a104-a7ed-468d-b5ab-009999df8390\\.user_uploaded\\media_1787940226756.jpg';
const outputPath = 'C:\\Users\\Nigger - Pv\\Desktop\\orientacao-vacinal\\public\\trivax-icon-transparent.png';
const mainIconPath = 'C:\\Users\\Nigger - Pv\\Desktop\\orientacao-vacinal\\public\\trivax-icon.png';

async function processImage() {
  const image = sharp(inputPath);
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    const brightness = (r + g + b) / 3;

    // Check if pixel is neutral grey/white checkerboard
    if (maxDiff < 22 && brightness > 150) {
      data[i + 3] = 0; // Transparent
    } else if (maxDiff < 28 && brightness > 120) {
      const factor = (brightness - 120) / (150 - 120);
      data[i + 3] = Math.round(255 * (1 - factor));
    }
  }

  // Save trimmed image
  await sharp(data, {
    raw: {
      width,
      height,
      channels,
    },
  })
    .trim()
    .png()
    .toFile(outputPath);

  // Copy to mainIconPath as well
  await sharp(outputPath).png().toFile(mainIconPath);

  console.log('Successfully generated transparent trimmed PNGs!');
}

processImage().catch(console.error);
