import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputImage = 'C:\\Users\\Nigger - Pv\\.gemini\\antigravity\\brain\\e832a104-a7ed-468d-b5ab-009999df8390\\.user_uploaded\\media_1787946033549.png';
const publicDir = 'C:\\Users\\Nigger - Pv\\Desktop\\orientacao-vacinal\\public';

async function applyNewLogo() {
  console.log('Processing new user uploaded symbol...');
  const meta = await sharp(inputImage).metadata();
  console.log('Input metadata:', meta);

  const trimmed = await sharp(inputImage)
    .trim()
    .png({ quality: 100 })
    .toBuffer();

  const v3Name = 'trivax-symbol-v3.png';
  fs.writeFileSync(path.join(publicDir, v3Name), trimmed);
  fs.writeFileSync(path.join(publicDir, 'trivax-symbol-v2.png'), trimmed);
  fs.writeFileSync(path.join(publicDir, 'trivax-icon-transparent.png'), trimmed);
  fs.writeFileSync(path.join(publicDir, 'trivax-icon.png'), trimmed);

  console.log(`Successfully saved ${v3Name} to ${publicDir}`);
}

applyNewLogo().catch(console.error);
