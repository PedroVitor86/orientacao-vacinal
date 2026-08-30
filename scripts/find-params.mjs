import sharp from 'sharp';

const inputPath = 'C:\\Users\\Nigger - Pv\\.gemini\\antigravity\\brain\\e832a104-a7ed-468d-b5ab-009999df8390\\.user_uploaded\\media_1787940226756.jpg';

async function findCircleParameters() {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Let's sample colors to see where the rings actually exist
  // Ring colors are saturated (blue / purple)
  let coloredPixels = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
      if (maxDiff > 35 && b > 80) {
        coloredPixels.push({ x, y, r, g, b });
      }
    }
  }

  console.log(`Found ${coloredPixels.length} colored pixels.`);
  
  // Find bounding box of colored pixels
  const xs = coloredPixels.map(p => p.x);
  const ys = coloredPixels.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  console.log(`Bounding box: X [${minX}, ${maxX}] (width ${maxX - minX}), Y [${minY}, ${maxY}] (height ${maxY - minY})`);
  console.log(`Center of emblem: (${(minX + maxX)/2}, ${(minY + maxY)/2})`);
}

findCircleParameters();
