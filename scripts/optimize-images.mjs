import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

const THUMBNAIL_ROOT = join(PROJECT_ROOT, '..', 'thumbnails');

const SIZES = {
  thumbnail: { width: 800, height: 450 },
  hero: { width: 1600, height: 900 },
};

const QUALITY = {
  webp: 82,
};

const collections = [
  {
    name: 'projects',
    sourceDir: join(THUMBNAIL_ROOT, 'projects'),
    outputDir: join(PROJECT_ROOT, 'public', 'images', 'projects'),
    images: {
      'gerrymoeis.pages.dev.jpg': 'personal-portfolio',
      'inlab-himafortic.netlify.app.jpg': 'innovation-lab',
      'pixantara.vercel.app.jpg': 'pixantara',
      'sistem-absensi-kantor.jpg': 'face-recognition-attendance',
      'kangen-wisata.pages.dev.jpg': 'kangen-wisata-tour',
      'lab-kom-sim.jpg': 'lab-kom-sim',
      'infortic.gerrymoeis.workers.dev.jpg': 'infortic',
    },
  },
  {
    name: 'blogs',
    sourceDir: join(THUMBNAIL_ROOT, 'blogs'),
    outputDir: join(PROJECT_ROOT, 'public', 'images', 'blogs'),
    images: {
      'instagram-scraper-blog-1.jpg': 'ai-data-extraction',
    },
  },
];

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

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

async function processImage(sourcePath, slug, outDir) {
  if (!existsSync(sourcePath)) {
    log(`  ❌ Source not found: ${sourcePath}`, colors.red);
    return false;
  }

  try {
    const thumb = join(outDir, `${slug}-thumb.webp`);

    await sharp(sourcePath)
      .resize(SIZES.thumbnail.width, SIZES.thumbnail.height, {
        fit: 'cover',
      })
      .webp({ quality: QUALITY.webp })
      .toFile(thumb);
    log(`  ✓ thumb.webp (${SIZES.thumbnail.width}x${SIZES.thumbnail.height}, q${QUALITY.webp})`, colors.green);

    const hero = join(outDir, `${slug}-hero.webp`);

    await sharp(sourcePath)
      .resize(SIZES.hero.width, SIZES.hero.height, {
        fit: 'cover',
      })
      .webp({ quality: QUALITY.webp })
      .toFile(hero);
    log(`  ✓ hero.webp (${SIZES.hero.width}x${SIZES.hero.height}, q${QUALITY.webp})`, colors.green);

    return true;
  } catch (error) {
    log(`  ❌ Error: ${error.message}`, colors.red);
    return false;
  }
}

async function main() {
  console.log('\n' + '='.repeat(60));
  log(' Image Optimization Script', colors.cyan);
  console.log('='.repeat(60) + '\n');

  let totalSuccess = 0;
  let totalFail = 0;

  for (const collection of collections) {
    log(`[${collection.name}]`, colors.yellow);
    console.log('-'.repeat(40));

    if (!existsSync(collection.sourceDir)) {
      log(`  Skipped — source not found: ${collection.sourceDir}`, colors.yellow);
      console.log();
      continue;
    }

    ensureDir(collection.outputDir);

    let success = 0;
    let fail = 0;

    for (const [sourceFile, slug] of Object.entries(collection.images)) {
      log(`  ${sourceFile}  ->  ${slug}`, colors.cyan);
      const ok = await processImage(join(collection.sourceDir, sourceFile), slug, collection.outputDir);
      if (ok) success++; else fail++;
    }

    log(`  Done: ${success} ok, ${fail} failed`, success > 0 ? colors.green : colors.red);
    totalSuccess += success;
    totalFail += fail;
    console.log();
  }

  console.log('='.repeat(60));
  log(` Total: ${totalSuccess} images processed, ${totalFail} failed`, colors.green);
  console.log('='.repeat(60) + '\n');

  process.exit(totalFail > 0 ? 1 : 0);
}

main();
