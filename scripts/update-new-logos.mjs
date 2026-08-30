import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconInput = 'C:\\Users\\Nigger - Pv\\.gemini\\antigravity\\brain\\e832a104-a7ed-468d-b5ab-009999df8390\\.user_uploaded\\media_1787945543322.png';
const logoInput = 'C:\\Users\\Nigger - Pv\\.gemini\\antigravity\\brain\\e832a104-a7ed-468d-b5ab-009999df8390\\.user_uploaded\\media_1787945543306.png';

const publicDir = 'C:\\Users\\Nigger - Pv\\Desktop\\orientacao-vacinal\\public';

async function updateLogos() {
  console.log('Processing new logos...');

  // 1. Process Icon (3 rings symbol)
  const iconBuffer = await sharp(iconInput)
    .trim()
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'trivax-icon-transparent.png'), iconBuffer);
  fs.writeFileSync(path.join(publicDir, 'trivax-icon.png'), iconBuffer);
  
  // Also save JPG versions for any fallbacks
  await sharp(iconBuffer)
    .flatten({ background: '#080612' })
    .jpeg({ quality: 95 })
    .toFile(path.join(publicDir, 'trivax-icon.jpg'));

  // 2. Process Full Logo (Symbol + TRIVAX text)
  const logoBuffer = await sharp(logoInput)
    .trim()
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'trivax-logo.png'), logoBuffer);

  await sharp(logoBuffer)
    .flatten({ background: '#080612' })
    .jpeg({ quality: 95 })
    .toFile(path.join(publicDir, 'trivax-logo.jpg'));

  console.log('All new logos updated successfully!');
}

updateLogos().catch(console.error);
