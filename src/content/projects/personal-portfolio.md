---
title:
  en: "Personal Portfolio Website"
  id: "Website Portfolio Pribadi"
summary:
  en: "Portfolio website with HD-2D aesthetic, legal audio visualizer, and automated CV generator system using LaTeX."
  id: "Website portfolio dengan aesthetic HD-2D, audio visualizer legal, dan sistem CV generator otomatis menggunakan LaTeX."
date: 2026-01-15
year: 2026
status: "in-progress"
priority: 1
category: ["web"]
techStack: ["Astro", "TypeScript", "JavaScript", "CSS", "LaTeX"]
thumbnail: "/images/projects/personal-portfolio-thumb.webp"
heroImage: "/images/projects/personal-portfolio-hero.webp"
links:
  github: "https://github.com/gerrymoeis/portfolio"
  live: "https://gerrymoeis.pages.dev"
---

# Personal Portfolio Website

Portfolio website pribadi yang dibangun dengan Astro, menerapkan HD-2D aesthetic terinspirasi dari game Octopath Traveler. Website ini menampilkan proyek, blog, dan CV dengan desain yang fokus pada kedalaman visual dan motion yang tenang.

## Key Features

### HD-2D Visual Design
Implementasi aesthetic HD-2D dengan:
- Layered depth menggunakan CSS transform dan z-index
- Soft lighting dengan radial gradients dan glow effects
- Grain texture overlay untuk efek retro
- Panel framing style seperti JRPG menu systems

### Audio Visualizer
Integrasi audio visualizer yang legal menggunakan SoundCloud API:
- Multiple visualizer modes (frequency bars, waveform, circular)
- Real-time audio analysis dengan Web Audio API
- Smooth color transitions yang sinkron dengan musik
- Responsive controls untuk play/pause dan mode switching

### Bilingual Support (EN/ID)
Sistem i18n dengan toggle language switch:
- Content dalam Bahasa Indonesia dan English
- Toggle switch di setiap halaman
- LocalStorage persistence untuk preferensi user
- Seamless switching tanpa page reload

### CV Generator System
Automated CV generation menggunakan LaTeX:
- Data aggregation dari berbagai sumber
- LaTeX template generator
- LaTeXLite API untuk compile LaTeX ke PDF
- No installation required (cloud-based compilation)

### Blog System
Content management dengan Astro Content Collections:
- Markdown-based blog posts dengan frontmatter
- Reading time calculation
- View counter integration
- Tag system untuk kategorisasi

## Technical Highlights

### Static-First Architecture
Website dibangun dengan Astro untuk optimal performance:
- Static HTML generation di build time
- Minimal runtime JavaScript
- Client-side hydration hanya untuk interactive components
- Fast page loads dengan lazy loading

### Design System
Comprehensive design system dengan:
- CSS custom properties untuk colors, spacing, typography
- Consistent motion tokens (duration, easing)
- Reusable component patterns
- Theme switching (dark/light mode)

### Custom Cursor
3D gradient cursor untuk desktop:
- Custom cursor images dengan gradient effects
- Smooth cursor trail animation
- Automatic fallback untuk mobile devices
- Respects user's reduced motion preferences

### Performance Optimization
- Optimized JavaScript bundles
- Image lazy loading
- CSS minification
- Cloudflare Pages deployment dengan CDN

## Design Process

Proses design dimulai dengan research HD-2D aesthetic:
1. Analisa visual elements dari Octopath Traveler
2. Identifikasi key characteristics (depth, lighting, framing)
3. Translate ke web technologies (CSS, SVG, Canvas)
4. Build design system dengan tokens
5. Implement progressive enhancement

## Challenges

Beberapa technical challenges yang dihadapi:

### Audio Visualizer Legality
Problem: Banyak audio visualizer menggunakan audio files yang tidak legal.
Solution: Integrasi dengan SoundCloud API untuk streaming legal music, dengan proper attribution dan links ke original tracks.

### LaTeX Compilation
Problem: LaTeX installation (MiKTeX) membutuhkan 200MB-4GB storage.
Solution: Menggunakan LaTeXLite API untuk cloud-based compilation, eliminasi kebutuhan local installation.

### Bilingual Content Management
Problem: Maintain content dalam 2 bahasa tanpa code duplication.
Solution: Implement data-lang attributes dengan CSS display toggling, content stored inline untuk better SEO.

### Performance vs Visual Richness
Problem: HD-2D aesthetic membutuhkan banyak visual effects yang bisa impact performance.
Solution: Selective hydration, CSS-based effects where possible, respect reduced motion preferences.

## Results

Website berhasil mencapai:
- Fast load times (< 2s first contentful paint)
- Smooth animations yang respect user preferences
- Clean, maintainable codebase dengan TypeScript
- Bilingual support yang seamless
- Legal audio integration dengan proper attribution
- Automated CV generation tanpa local dependencies

Website ini serve sebagai portfolio showcase dan juga sebagai learning project untuk explore modern web technologies dan design patterns.

---

**Tech Stack**: Astro, TypeScript, CSS, LaTeX, SoundCloud API, Cloudflare Pages  
**Status**: In Progress - Continuous improvements dan content updates  
**Live**: [gerrymoeis.pages.dev](https://gerrymoeis.pages.dev)
