/**
 * Deployment Pipeline Script
 * Full automated pipeline: tech-icons → optimize-images → CV → build → commit → push
 * Run with: npm run deploy
 * Or via git alias: git deploy (when configured)
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${colors.bright}[deploy]${colors.reset} ${color}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
  } catch (error) {
    if (options.ignoreError) return null;
    throw error;
  }
}

function checkTectonic() {
  const tectonicPath = join(PROJECT_ROOT, '..', 'docs_and_backup', 'cv', 'tectonic', 'tectonic.exe');
  if (!existsSync(tectonicPath)) {
    log('Tectonic executable not found, skipping CV generation', colors.yellow);
    return false;
  }
  return true;
}

async function step(name, fn) {
  log(`\n🚀 Step: ${name}`, colors.cyan);
  console.log('─'.repeat(50));
  try {
    await fn();
    log(`✅ ${name} completed`, colors.green);
    return true;
  } catch (error) {
    log(`❌ ${name} failed: ${error.message}`, colors.red);
    return false;
  }
}

async function main() {
  console.log('\n' + '='.repeat(60));
  log('Starting deployment pipeline', colors.magenta);
  console.log('='.repeat(60) + '\n');

  let allSuccess = true;

  // Step 1: Generate tech icons
  allSuccess &= await step('Generate Tech Icons', () => {
    exec('node scripts/generate-tech-icons.mjs');
  });

  // Step 2: Optimize project images
  allSuccess &= await step('Optimize Project Images', () => {
    exec('node scripts/optimize-images.mjs');
  });

  // Step 3: Generate CV files (if Tectonic available)
  if (checkTectonic()) {
    allSuccess &= await step('Generate CV Files', () => {
      exec('node scripts/generate-cv.mjs');
    });
  }

  // Step 4: Build Astro project
  allSuccess &= await step('Build Astro Project', () => {
    exec('npx astro build');
  });

  // Step 5: Strip HTML comments from build output
  allSuccess &= await step('Strip HTML Comments', () => {
    exec('node scripts/strip-html-comments.mjs');
  });

  // Step 6: Stage all changes
  allSuccess &= await step('Stage All Changes', () => {
    exec('git add -A');
  });

  // Step 7: Commit changes
  allSuccess &= await step('Commit Changes', () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const commitMessage = `deploy: ${timestamp}`;
    try {
      exec(`git commit -m "${commitMessage}" --allow-empty`, { silent: true });
      log(`Committed: ${commitMessage}`, colors.green);
    } catch (e) {
      if (e.message.includes('nothing to commit')) {
        log('Nothing to commit, skipping', colors.yellow);
      } else {
        throw e;
      }
    }
  });

  // Step 8: Push to remote
  allSuccess &= await step('Push to Remote', () => {
    const branch = exec('git rev-parse --abbrev-ref HEAD', { silent: true }).trim();
    exec(`git push origin ${branch}`);
    log(`Pushed to origin/${branch}`, colors.green);
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  if (allSuccess) {
    log('Deployment completed successfully! 🎉', colors.green);
  } else {
    log('Deployment completed with warnings ⚠️', colors.yellow);
  }
  console.log('='.repeat(60) + '\n');

  if (!allSuccess) process.exit(1);
}

main();
