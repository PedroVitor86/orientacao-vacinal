import sharp from 'sharp';

const inputPath = 'C:\\Users\\Nigger - Pv\\.gemini\\antigravity\\brain\\e832a104-a7ed-468d-b5ab-009999df8390\\.user_uploaded\\media_1787940226756.jpg';
const outputPath = 'C:\\Users\\Nigger - Pv\\Desktop\\orientacao-vacinal\\public\\trivax-icon-transparent.png';
const mainIconPath = 'C:\\Users\\Nigger - Pv\\Desktop\\orientacao-vacinal\\public\\trivax-icon.png';

async function perfectEmblem() {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Let's refine the exact center of each circle:
  // We can measure the exact circle centers from the color distribution
  const c1 = { x: 513.5, y: 316.5 }; // Top ring (Purple/Lilac)
  const c2 = { x: 416.0, y: 492.5 }; // Bottom-left ring (Deep Indigo/Violet)
  const c3 = { x: 610.5, y: 492.5 }; // Bottom-right ring (Blue/Cyan)

  const R_out = 173.0;
  const R_in = 128.0;

  function ringDistance(px, py, c) {
    const dist = Math.hypot(px - c.x, py - c.y);
    if (dist >= R_in && dist <= R_out) return 0;
    if (dist < R_in) return R_in - dist;
    return dist - R_out;
  }

  const outBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 3;
      const outIdx = (y * width + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      const d1 = ringDistance(x, y, c1);
      const d2 = ringDistance(x, y, c2);
      const d3 = ringDistance(x, y, c3);

      const minD = Math.min(d1, d2, d3);

      if (minD <= 0) {
        // Pixel is strictly inside the ring band!
        outBuffer[outIdx] = r;
        outBuffer[outIdx + 1] = g;
        outBuffer[outIdx + 2] = b;
        outBuffer[outIdx + 3] = 255;
      } else if (minD < 1.2) {
        // Subpixel smooth anti-aliased edge
        const alpha = Math.round(255 * (1 - minD / 1.2));
        outBuffer[outIdx] = r;
        outBuffer[outIdx + 1] = g;
        outBuffer[outIdx + 2] = b;
        outBuffer[outIdx + 3] = alpha;
      } else {
        // Outside the ring geometry -> 100% transparent
        outBuffer[outIdx] = 0;
        outBuffer[outIdx + 1] = 0;
        outBuffer[outIdx + 2] = 0;
        outBuffer[outIdx + 3] = 0;
      }
    }
  }

  const trimmed = await sharp(outBuffer, {
    raw: { width, height, channels: 4 }
  })
    .trim()
    .png({ quality: 100 })
    .toBuffer();

  await sharp(trimmed).toFile(outputPath);
  await sharp(trimmed).toFile(mainIconPath);

  console.log('100% Perfect geometric cutout saved!');
}

perfectEmblem();
