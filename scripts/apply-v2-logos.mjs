import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconInput = 'C:\\Users\\Nigger - Pv\\.gemini\\antigravity\\brain\\e832a104-a7ed-468d-b5ab-009999df8390\\.user_uploaded\\media_1787945543322.png';
const logoInput = 'C:\\Users\\Nigger - Pv\\.gemini\\antigravity\\brain\\e832a104-a7ed-468d-b5ab-009999df8390\\.user_uploaded\\media_1787945543306.png';

const publicDir = 'C:\\Users\\Nigger - Pv\\Desktop\\orientacao-vacinal\\public';

async function processNewAssets() {
  console.log('Inspecting icon input:');
  const iconMeta = await sharp(iconInput).metadata();
  console.log(iconMeta);

  console.log('Inspecting logo input:');
  const logoMeta = await sharp(logoInput).metadata();
  console.log(logoMeta);

  // 1. Process 3 rings symbol with fresh cache-busting filename
  const iconBuffer = await sharp(iconInput)
    .trim()
    .png({ quality: 100 })
    .toBuffer();

  const iconName = 'trivax-symbol-v2.png';
  fs.writeFileSync(path.join(publicDir, iconName), iconBuffer);
  fs.writeFileSync(path.join(publicDir, 'trivax-icon-transparent.png'), iconBuffer);
  fs.writeFileSync(path.join(publicDir, 'trivax-icon.png'), iconBuffer);

  // 2. Process Full Logo with text with fresh cache-busting filename
  const logoBuffer = await sharp(logoInput)
    .trim()
    .png({ quality: 100 })
    .toBuffer();

  const logoName = 'trivax-full-logo-v2.png';
  fs.writeFileSync(path.join(publicDir, logoName), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'trivax-logo.png'), logoBuffer);

  console.log(`Saved ${iconName} and ${logoName} to ${publicDir}`);
}

processNewAssets().catch(console.error);
