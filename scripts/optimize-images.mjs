/**
 * Image Optimization Script
 * Processes project thumbnails: resize, compress, convert to WebP
 * Run: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const SOURCE_DIR = join(PROJECT_ROOT, '..', 'docs_and_backup', 'projects_thumbnails');
const OUTPUT_DIR = join(PROJECT_ROOT, 'public', 'images', 'projects');

// Mapping source files to project slugs
const IMAGE_MAPPING = {
  'gerrymoeis.pages.dev.jpg': 'personal-portfolio',
  'inlab-himafortic.netlify.app.jpg': 'innovation-lab',
  'pixantara.vercel.app.jpg': 'pixantara',
};

// Image dimensions
const SIZES = {
  thumbnail: { width: 800, height: 450 },
  hero: { width: 1600, height: 900 },
};

// Quality settings
const QUALITY = {
  webp: 85,
  jpg: 90,
};

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Ensure output directory exists
 */
function ensureOutputDir() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    log(`✅ Created output directory: ${OUTPUT_DIR}`, colors.green);
  }
}

/**
 * Process single image: generate thumbnail and hero versions
 */
async function processImage(sourceFile, projectSlug) {
  const sourcePath = join(SOURCE_DIR, sourceFile);
  
  if (!existsSync(sourcePath)) {
    log(`❌ Source file not found: ${sourceFile}`, colors.red);
    return false;
  }
  
  log(`\n📸 Processing: ${sourceFile} → ${projectSlug}`, colors.cyan);
  
  try {
    // Generate thumbnail (800x450)
    const thumbWebp = join(OUTPUT_DIR, `${projectSlug}-thumb.webp`);
    const thumbJpg = join(OUTPUT_DIR, `${projectSlug}-thumb.jpg`);
    
    await sharp(sourcePath)
      .resize(SIZES.thumbnail.width, SIZES.thumbnail.height, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: QUALITY.webp })
      .toFile(thumbWebp);
    log(`  ✓ Thumbnail WebP: ${projectSlug}-thumb.webp`, colors.green);
    
    await sharp(sourcePath)
      .resize(SIZES.thumbnail.width, SIZES.thumbnail.height, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: QUALITY.jpg })
      .toFile(thumbJpg);
    log(`  ✓ Thumbnail JPG: ${projectSlug}-thumb.jpg`, colors.green);
    
    // Generate hero (1600x900)
    const heroWebp = join(OUTPUT_DIR, `${projectSlug}-hero.webp`);
    const heroJpg = join(OUTPUT_DIR, `${projectSlug}-hero.jpg`);
    
    await sharp(sourcePath)
      .resize(SIZES.hero.width, SIZES.hero.height, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: QUALITY.webp })
      .toFile(heroWebp);
    log(`  ✓ Hero WebP: ${projectSlug}-hero.webp`, colors.green);
    
    await sharp(sourcePath)
      .resize(SIZES.hero.width, SIZES.hero.height, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: QUALITY.jpg })
      .toFile(heroJpg);
    log(`  ✓ Hero JPG: ${projectSlug}-hero.jpg`, colors.green);
    
    return true;
  } catch (error) {
    log(`❌ Error processing ${sourceFile}: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n' + '='.repeat(60));
  log('🖼️  Image Optimization Script', colors.cyan);
  console.log('='.repeat(60) + '\n');
  
  // Check source directory
  if (!existsSync(SOURCE_DIR)) {
    log(`❌ Source directory not found: ${SOURCE_DIR}`, colors.red);
    process.exit(1);
  }
  
  // Ensure output directory exists
  ensureOutputDir();
  
  // Process all images
  let successCount = 0;
  let failCount = 0;
  
  for (const [sourceFile, projectSlug] of Object.entries(IMAGE_MAPPING)) {
    const success = await processImage(sourceFile, projectSlug);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  log(`✅ Processed: ${successCount} images`, colors.green);
  if (failCount > 0) {
    log(`❌ Failed: ${failCount} images`, colors.red);
  }
  log(`📁 Output: ${OUTPUT_DIR}`, colors.cyan);
  console.log('='.repeat(60) + '\n');
  
  process.exit(failCount > 0 ? 1 : 0);
}

main();
