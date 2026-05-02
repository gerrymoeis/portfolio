/**
 * Deployment Script
 * Generates CV, commits changes, and pushes to repository
 * Run: npm run deploy
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// ANSI color codes for better logging
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

/**
 * Logger with timestamp and colors
 */
function log(message, color = colors.reset) {
  const timestamp = new Date().toLocaleTimeString('id-ID', { hour12: false });
  console.log(`${colors.bright}[${timestamp}]${colors.reset} ${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

/**
 * Execute command and return output
 */
function exec(command, options = {}) {
  try {
    return execSync(command, {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
  } catch (error) {
    if (options.ignoreError) {
      return null;
    }
    throw error;
  }
}

/**
 * Check if Tectonic is available
 */
function checkTectonic() {
  const tectonicPath = join(PROJECT_ROOT, '..', 'docs_and_backup', 'cv', 'tectonic', 'tectonic.exe');
  
  if (!existsSync(tectonicPath)) {
    logError('Tectonic executable not found!');
    logInfo(`Expected path: ${tectonicPath}`);
    return false;
  }
  
  logSuccess('Tectonic executable found');
  return true;
}

/**
 * Check git status
 */
function checkGitStatus() {
  try {
    // Check if we're in a git repository
    exec('git rev-parse --git-dir', { silent: true });
    
    // Check current branch
    const branch = exec('git branch --show-current', { silent: true }).trim();
    logInfo(`Current branch: ${branch}`);
    
    // Check for uncommitted changes (excluding CV files)
    const status = exec('git status --porcelain', { silent: true });
    const nonCVChanges = status
      .split('\n')
      .filter(line => line.trim())
      .filter(line => !line.includes('Gerry Moeis_CV_'));
    
    if (nonCVChanges.length > 0) {
      logWarning('You have uncommitted changes (excluding CV files):');
      nonCVChanges.forEach(line => console.log(`  ${line}`));
      return false;
    }
    
    logSuccess('Git status clean (excluding CV files)');
    return true;
  } catch (error) {
    logError('Git check failed');
    throw error;
  }
}

/**
 * Generate CV files
 */
async function generateCV() {
  log('📄 Generating CV files...', colors.blue);
  
  try {
    exec('node scripts/generate-cv.mjs');
    logSuccess('CV generation completed');
    return true;
  } catch (error) {
    logError('CV generation failed');
    console.error(error.message);
    return false;
  }
}

/**
 * Check if CV files have changes
 */
function checkCVChanges() {
  const cvFiles = [
    'public/Gerry Moeis_CV_EN.pdf',
    'public/Gerry Moeis_CV_ID.pdf',
  ];
  
  let hasChanges = false;
  const changedFiles = [];
  
  for (const file of cvFiles) {
    const status = exec(`git status --porcelain "${file}"`, { silent: true }).trim();
    if (status) {
      hasChanges = true;
      changedFiles.push(file);
      logInfo(`Changed: ${file}`);
    }
  }
  
  if (!hasChanges) {
    logInfo('No changes detected in CV files');
  }
  
  return { hasChanges, changedFiles };
}

/**
 * Prompt user for input
 */
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * Commit and push changes
 */
async function commitAndPush(files) {
  try {
    // Stage CV files
    log('📦 Staging CV files...', colors.blue);
    for (const file of files) {
      exec(`git add "${file}"`);
    }
    logSuccess('Files staged');
    
    // Get commit message
    const defaultMessage = `chore: update CV files [${new Date().toISOString().split('T')[0]}]`;
    console.log(`\n${colors.cyan}Default commit message:${colors.reset}`);
    console.log(`  ${defaultMessage}\n`);
    
    const customMessage = await prompt('Enter custom message (or press Enter for default): ');
    const commitMessage = customMessage.trim() || defaultMessage;
    
    // Commit
    log('💾 Committing changes...', colors.blue);
    exec(`git commit -m "${commitMessage}"`);
    logSuccess(`Committed: ${commitMessage}`);
    
    // Push
    log('🚀 Pushing to remote...', colors.blue);
    exec('git push origin main');
    logSuccess('Pushed to main branch');
    
    return true;
  } catch (error) {
    logError('Commit/push failed');
    console.error(error.message);
    return false;
  }
}

/**
 * Main deployment process
 */
async function main() {
  console.log('\n' + '='.repeat(60));
  log('🚀 Starting deployment process', colors.magenta);
  console.log('='.repeat(60) + '\n');
  
  try {
    // Step 1: Pre-flight checks
    log('🔍 Running pre-flight checks...', colors.blue);
    
    if (!checkTectonic()) {
      logError('Pre-flight check failed: Tectonic not found');
      process.exit(1);
    }
    
    if (!checkGitStatus()) {
      logWarning('You have uncommitted changes. Please commit or stash them first.');
      const proceed = await prompt('Continue anyway? (y/N): ');
      if (proceed.toLowerCase() !== 'y') {
        logInfo('Deployment cancelled');
        process.exit(0);
      }
    }
    
    console.log('');
    
    // Step 2: Generate CV
    const cvSuccess = await generateCV();
    if (!cvSuccess) {
      logError('Deployment stopped: CV generation failed');
      process.exit(1);
    }
    
    console.log('');
    
    // Step 3: Check for changes
    log('🔍 Checking for CV changes...', colors.blue);
    const { hasChanges, changedFiles } = checkCVChanges();
    
    if (!hasChanges) {
      logInfo('No CV changes to commit. Deployment complete.');
      process.exit(0);
    }
    
    console.log('');
    
    // Step 4: Commit and push
    const pushSuccess = await commitAndPush(changedFiles);
    if (!pushSuccess) {
      logError('Deployment failed during commit/push');
      process.exit(1);
    }
    
    // Success
    console.log('\n' + '='.repeat(60));
    logSuccess('Deployment completed successfully!');
    logInfo('Cloudflare Pages will automatically build and deploy');
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    logError('Deployment failed with error:');
    console.error(error);
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  }
}

// Run main function
main();
