#!/usr/bin/env node

/**
 * Spotify Configuration Validation Script
 * Validates that all required environment variables are properly configured
 * for the Spotify integration to work correctly.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateSpotifyConfig() {
  log('\n🎵 Validating Spotify Integration Configuration...', 'blue');
  log('=' .repeat(50), 'blue');

  const requiredVars = [
    'SPOTIFY_WORKER_URL',
    'SPOTIFY_WORKER_URL_DEV', 
    'SPOTIFY_WORKER_URL_STAGING',
    'SPOTIFY_WORKER_URL_PROD'
  ];

  const optionalVars = [
    'DEV_SPOTIFY_WORKER_URL',
    'NODE_ENV',
    'DEPLOYMENT_ENVIRONMENT'
  ];

  let hasErrors = false;
  let hasWarnings = false;

  // Check if .env file exists
  let envVars = {};
  try {
    const envContent = readFileSync(join(projectRoot, '.env'), 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    log('✅ Found .env file', 'green');
  } catch (error) {
    log('⚠️  No .env file found - using process.env only', 'yellow');
    hasWarnings = true;
  }

  // Merge with process.env (process.env takes precedence)
  envVars = { ...envVars, ...process.env };

  log('\n📋 Required Environment Variables:', 'bold');
  requiredVars.forEach(varName => {
    const value = envVars[varName];
    if (!value || value === 'your-domain.com' || value.includes('your-subdomain')) {
      log(`❌ ${varName}: Missing or using placeholder value`, 'red');
      hasErrors = true;
    } else {
      log(`✅ ${varName}: ${value}`, 'green');
    }
  });

  log('\n📋 Optional Environment Variables:', 'bold');
  optionalVars.forEach(varName => {
    const value = envVars[varName];
    if (!value) {
      log(`⚠️  ${varName}: Not set (will use defaults)`, 'yellow');
    } else {
      log(`✅ ${varName}: ${value}`, 'green');
    }
  });

  // Validate URL formats
  log('\n🔗 URL Validation:', 'bold');
  requiredVars.forEach(varName => {
    const value = envVars[varName];
    if (value && !value.includes('your-')) {
      try {
        new URL(value);
        log(`✅ ${varName}: Valid URL format`, 'green');
      } catch (error) {
        log(`❌ ${varName}: Invalid URL format - ${value}`, 'red');
        hasErrors = true;
      }
    }
  });

  // Environment-specific recommendations
  log('\n🎯 Environment-Specific Recommendations:', 'bold');
  const nodeEnv = envVars.NODE_ENV || 'development';
  const deploymentEnv = envVars.DEPLOYMENT_ENVIRONMENT || nodeEnv;

  log(`Current NODE_ENV: ${nodeEnv}`, 'blue');
  log(`Current DEPLOYMENT_ENVIRONMENT: ${deploymentEnv}`, 'blue');

  if (deploymentEnv === 'development') {
    const devUrl = envVars.DEV_SPOTIFY_WORKER_URL || envVars.SPOTIFY_WORKER_URL_DEV;
    if (!devUrl || devUrl.includes('localhost')) {
      log('✅ Development: Using localhost worker URL', 'green');
    } else {
      log('⚠️  Development: Consider using localhost for local development', 'yellow');
    }
  }

  if (deploymentEnv === 'staging') {
    const stagingUrl = envVars.SPOTIFY_WORKER_URL_STAGING;
    if (stagingUrl && stagingUrl.includes('staging')) {
      log('✅ Staging: Using staging-specific worker URL', 'green');
    } else {
      log('⚠️  Staging: Consider using staging-specific worker URL', 'yellow');
      hasWarnings = true;
    }
  }

  if (deploymentEnv === 'production') {
    const prodUrl = envVars.SPOTIFY_WORKER_URL_PROD || envVars.SPOTIFY_WORKER_URL;
    if (prodUrl && !prodUrl.includes('localhost') && !prodUrl.includes('staging')) {
      log('✅ Production: Using production worker URL', 'green');
    } else {
      log('❌ Production: Must use production worker URL', 'red');
      hasErrors = true;
    }
  }

  // Summary
  log('\n📊 Configuration Summary:', 'bold');
  if (hasErrors) {
    log('❌ Configuration has errors that must be fixed', 'red');
    log('\n🔧 Next Steps:', 'yellow');
    log('1. Copy .env.example to .env if not done already', 'yellow');
    log('2. Update placeholder values with your actual worker URLs', 'yellow');
    log('3. Deploy your Cloudflare Worker and get the URL', 'yellow');
    log('4. Run this script again to validate', 'yellow');
    process.exit(1);
  } else if (hasWarnings) {
    log('⚠️  Configuration is functional but has warnings', 'yellow');
    log('✅ Spotify integration should work with current configuration', 'green');
    process.exit(0);
  } else {
    log('✅ Configuration is complete and valid!', 'green');
    log('🎵 Spotify integration is ready to use', 'green');
    process.exit(0);
  }
}

// Run validation if called directly
if (process.argv[1] && process.argv[1].endsWith('validate-spotify-config.js')) {
  validateSpotifyConfig();
}

export { validateSpotifyConfig };