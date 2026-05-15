---
title:
  en: "Personal Portfolio Website"
  id: "Website Portfolio Pribadi"
summary:
  en: "Personal portfolio website with minimalistic aesthetic, bilingual support, audio visualizer, and automated LaTeX CV generator."
  id: "Website portfolio pribadi dengan aesthetic minimalis, dukungan bilingual, audio visualizer, dan CV generator otomatis menggunakan LaTeX."
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

Portfolio website pribadi yang dibangun dengan Astro, mengusung desain minimalis dengan fokus pada performa, aksesibilitas, dan pengalaman pengguna yang bersih. Website ini menampilkan proyek, blog, dan CV dengan dukungan theme switch dan language switch.

## Key Features

### Minimalistic Design
Desain yang bersih dan minimalis:
- Fokus pada konten dengan tata letak yang rapi
- Typography yang konsisten menggunakan Inter font
- White space yang cukup untuk readability
- CSS custom properties untuk design system yang maintainable

### Theme & Language Switch
Navigasi bilingual dengan toggle theme:
- Dark/light theme toggle dengan system preference detection
- Bahasa Indonesia dan English dengan seamless switching
- LocalStorage persistence untuk preferensi user
- Smooth transitions antara theme

### Audio Visualizer
Integrasi audio visualizer dengan SoundCloud API:
- Multiple visualizer modes (frequency bars, waveform, circular)
- Real-time audio analysis dengan Web Audio API
- Smooth visual effects yang sinkron dengan musik
- Intuitive user controls untuk play/pause dan mode switching

### CV Generator System
Automated CV generation menggunakan LaTeX:
- Data aggregation dari project markdown files
- LaTeX template generator
- Tectonic compiler untuk compile LaTeX ke PDF
- Bilingual CV (English dan Indonesia)

### Blog System
Content management dengan Astro Content Collections:
- Markdown-based blog posts dengan frontmatter
- Reading time calculation
- View counter integration
- Clean, readable layout untuk fokus pada konten

## Technical Highlights

### Static-First Architecture
Website dibangun dengan Astro untuk optimal performance:
- Static HTML generation di build time
- Minimal runtime JavaScript
- Client-side hydration hanya untuk interactive components
- Fast page loads dengan lazy loading

### Design System
Comprehensive design system:
- CSS custom properties untuk colors, spacing, typography
- Consistent design tokens (duration, easing, sizing)
- Reusable component patterns
- Theme switching dengan CSS variables

### Custom Cursor
Custom 3D gradient cursor untuk desktop:
- Smooth cursor trail animation
- Automatic fallback untuk mobile devices
- Menerapkan system reduce motion preferences

### Performance Optimization
- Optimized JavaScript bundles
- Image lazy loading dan WebP optimization
- CSS minification
- Cloudflare Pages deployment dengan CDN

## Design Process

Proses design berfokus pada kesederhanaan dan fungsionalitas:
1. Define design system dengan CSS custom properties
2. Prioritaskan content-first layouts
3. Implement bilingual support dengan data-lang attributes
4. Build reusable component patterns
5. Optimasi performa dan accessibility

## Challenges

### LaTeX Compilation
Problem: LaTeX installation (MiKTeX) membutuhkan 200MB-4GB storage, tidak praktis untuk project portfolio.
Solution: Menggunakan Tectonic LaTeX engine yang lightweight, integrated langsung ke dalam build pipeline via npm scripts.

### Bilingual Content Management
Problem: Maintain content dalam 2 bahasa tanpa code duplication.
Solution: Implement data-lang attributes dengan CSS display toggling, content stored inline untuk better SEO dan maintainability.

### Theme Switching
Problem: Dark/light theme perlu konsisten di seluruh komponen tanpa flash saat load.
Solution: Inline theme initialization script untuk mencegah FOUC, dan CSS custom properties untuk theme-aware styling.

## Results

Website berhasil mencapai:
- Fast load times dengan static-first architecture
- Smooth theme dan language switching
- Clean, maintainable codebase dengan TypeScript
- Bilingual support yang seamless
- Audio visualizer sebagai pelengkap pengalaman website
- Automated CV generation tanpa local dependencies besar

Website ini serve sebagai portfolio showcase dan juga sebagai sarana untuk mengeksplorasi modern web technologies dengan pendekatan yang minimalis dan fungsional.

---

**Tech Stack**: Astro, TypeScript, CSS, LaTeX, SoundCloud API, Cloudflare Pages  
**Status**: In Progress - Continuous improvements dan content updates  
**Live**: [gerrymoeis.pages.dev](https://gerrymoeis.pages.dev)
