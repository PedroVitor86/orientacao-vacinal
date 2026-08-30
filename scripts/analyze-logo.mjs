import sharp from 'sharp';

const inputPath = 'C:\\Users\\Nigger - Pv\\.gemini\\antigravity\\brain\\e832a104-a7ed-468d-b5ab-009999df8390\\.user_uploaded\\media_1787940226756.jpg';

async function analyzeCircles() {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  console.log(`Dimensions: ${metadata.width} x ${metadata.height}`);
}

analyzeCircles();
