import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

function strip(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      strip(full);
    } else if (entry.name.endsWith('.html')) {
      writeFileSync(full, readFileSync(full, 'utf-8').replace(/<!--[\s\S]*?-->/g, ''), 'utf-8');
    }
  }
}

strip(distDir);
