#!/usr/bin/env node

/**
 * Bundle Size Analysis Script
 * 
 * Analyzes the built JavaScript bundles to ensure they meet size targets:
 * - Home page: < 50KB
 * - Blog pages: < 20KB
 * - Projects page: < 40KB
 * 
 * Run after building: npm run build && node scripts/analyze-bundles.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Size targets in KB
const SIZE_TARGETS = {
  home: 50,
  blogs: 20,
  projects: 40,
};

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

/**
 * Recursively find all JS files in a directory
 */
function findJSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findJSFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Analyze JavaScript bundles for a specific page with Spotify optimization insights
 */
function analyzePageBundles(pagePath, pageName) {
  const pageDir = path.join(__dirname, '..', 'dist', pagePath);
  
  if (!fs.existsSync(pageDir)) {
    console.log(`${colors.yellow}⚠ Page not found: ${pagePath}${colors.reset}`);
    return null;
  }

  // Find all JS files referenced in the HTML
  const htmlPath = path.join(pageDir, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    console.log(`${colors.yellow}⚠ HTML not found: ${htmlPath}${colors.reset}`);
    return null;
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');
  const scriptMatches = html.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/g);
  
  let totalSize = 0;
  let spotifySize = 0;
  const scripts = [];
  const spotifyScripts = [];

  for (const match of scriptMatches) {
    const scriptSrc = match[1];
    // Convert relative path to absolute
    const scriptPath = path.join(__dirname, '..', 'dist', scriptSrc);
    
    if (fs.existsSync(scriptPath)) {
      const size = parseFloat(getFileSizeKB(scriptPath));
      const content = fs.readFileSync(scriptPath, 'utf-8');
      const hasSpotify = content.includes('spotify') || content.includes('Spotify');
      
      totalSize += size;
      scripts.push({
        path: scriptSrc,
        size: size,
        hasSpotify: hasSpotify
      });

      if (hasSpotify) {
        spotifySize += size;
        spotifyScripts.push({
          path: scriptSrc,
          size: size
        });
      }
    }
  }

  return {
    name: pageName,
    totalSize: totalSize,
    spotifySize: spotifySize,
    scripts: scripts,
    spotifyScripts: spotifyScripts,
    target: SIZE_TARGETS[pageName.toLowerCase()] || null,
  };
}

/**
 * Print analysis results with Spotify optimization insights
 */
function printResults(results) {
  console.log(`\n${colors.bold}${colors.cyan}📊 JavaScript Bundle Analysis${colors.reset}\n`);
  console.log('─'.repeat(80));

  let totalSpotifySize = 0;

  results.forEach((result) => {
    if (!result) return;

    const { name, totalSize, spotifySize, scripts, spotifyScripts, target } = result;
    const withinTarget = target ? totalSize < target : true;
    const statusColor = withinTarget ? colors.green : colors.red;
    const statusIcon = withinTarget ? '✓' : '✗';

    console.log(`\n${colors.bold}${name} Page${colors.reset}`);
    console.log(`${statusColor}${statusIcon} Total: ${totalSize.toFixed(2)} KB${colors.reset}${target ? ` (target: < ${target} KB)` : ''}`);
    
    if (spotifySize > 0) {
      const spotifyPercentage = ((spotifySize / totalSize) * 100).toFixed(1);
      console.log(`🎵 Spotify: ${spotifySize.toFixed(2)} KB (${spotifyPercentage}% of total)`);
      totalSpotifySize += spotifySize;
    }
    
    if (scripts.length > 0) {
      console.log('\nScripts:');
      scripts.forEach((script) => {
        const spotifyIcon = script.hasSpotify ? '🎵' : '  ';
        console.log(`  ${spotifyIcon} ${script.path} - ${script.size.toFixed(2)} KB`);
      });
    } else {
      console.log('  No JavaScript bundles found');
    }

    // Spotify-specific recommendations
    if (spotifyScripts.length > 0) {
      console.log(`\n${colors.cyan}🎵 Spotify Optimization Recommendations:${colors.reset}`);
      
      if (spotifySize > 20) {
        console.log(`  ⚡ Consider using the optimized Spotify client (current: ${spotifySize.toFixed(2)} KB)`);
        console.log(`  📦 Implement lazy loading for Spotify integration`);
      } else if (spotifySize > 10) {
        console.log(`  ✨ Spotify bundle size is reasonable (${spotifySize.toFixed(2)} KB)`);
        console.log(`  💡 Consider code splitting if not already implemented`);
      } else {
        console.log(`  ✅ Spotify bundle size is well optimized (${spotifySize.toFixed(2)} KB)`);
      }
    }
  });

  // Overall Spotify analysis
  if (totalSpotifySize > 0) {
    console.log(`\n${colors.bold}${colors.cyan}🎵 Overall Spotify Analysis${colors.reset}`);
    console.log(`Total Spotify code across all pages: ${totalSpotifySize.toFixed(2)} KB`);
    
    if (totalSpotifySize > 30) {
      console.log(`${colors.yellow}⚠ Consider implementing shared Spotify chunks to reduce duplication${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ Spotify integration has minimal bundle impact${colors.reset}`);
    }
  }

  console.log('\n' + '─'.repeat(80));
}

/**
 * Analyze all chunks in the dist directory
 */
function analyzeAllChunks() {
  const chunksDir = path.join(__dirname, '..', 'dist', 'chunks');
  
  if (!fs.existsSync(chunksDir)) {
    console.log(`${colors.yellow}⚠ Chunks directory not found${colors.reset}`);
    return;
  }

  const jsFiles = findJSFiles(chunksDir);
  
  if (jsFiles.length === 0) {
    console.log(`${colors.yellow}⚠ No chunk files found${colors.reset}`);
    return;
  }

  console.log(`\n${colors.bold}${colors.cyan}📦 Code Chunks${colors.reset}\n`);
  console.log('─'.repeat(80));

  jsFiles.forEach((file) => {
    const size = getFileSizeKB(file);
    const relativePath = path.relative(path.join(__dirname, '..', 'dist'), file);
    console.log(`  • ${relativePath} - ${size} KB`);
  });

  console.log('\n' + '─'.repeat(80));
}

/**
 * Main analysis function
 */
function main() {
  const distDir = path.join(__dirname, '..', 'dist');

  if (!fs.existsSync(distDir)) {
    console.error(`${colors.red}Error: dist directory not found. Run 'npm run build' first.${colors.reset}`);
    process.exit(1);
  }

  // Analyze each page
  const results = [
    analyzePageBundles('', 'Home'),
    analyzePageBundles('blogs', 'Blogs'),
    analyzePageBundles('projects', 'Projects'),
  ];

  printResults(results);
  analyzeAllChunks();

  // Check if all targets are met
  const allTargetsMet = results.every((result) => {
    if (!result || !result.target) return true;
    return result.totalSize < result.target;
  });

  if (allTargetsMet) {
    console.log(`\n${colors.green}${colors.bold}✓ All bundle size targets met!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}${colors.bold}✗ Some bundle size targets exceeded${colors.reset}\n`);
    process.exit(1);
  }
}

main();
