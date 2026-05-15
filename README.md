# Gerry Moeis - Personal Portfolio

Personal portfolio website featuring bilingual support (Indonesian/English), theme switching, audio visualizer via SoundCloud, custom cursor, automated LaTeX CV generation, and blog system — built with Astro and a minimalistic design approach.

## Features

- 🌓 **Light/Dark Theme** - Smooth theme toggle with system preference detection
- 🌍 **Bilingual** - Indonesian and English with seamless language switching
- 🎵 **Audio Visualizer** - Real-time visualization synced with SoundCloud
- 🖱️ **Custom Cursor** - 3D gradient cursor with particle trail
- 📱 **Fully Responsive** - Mobile-first design across all pages
- ⚡ **Performance Optimized** - Static-first architecture with minimal JavaScript
- 📄 **CV Generator** - Automated LaTeX-based CV via Tectonic (EN & ID)
- 📝 **Blog System** - Markdown-based blog with reading time and view counter
- 🎨 **Design System** - CSS custom properties for consistent theming

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build locally with tech-icons, images, CV generation
npm run build:local

# Full deploy (generate assets + build + commit + push)
npm run deploy

# Preview production build
npm run preview
```

## Project Structure

```
main_folder/
├── public/              # Static assets (images, CV PDFs, fonts)
├── scripts/             # Build tools (CV, images, tech-icons, deploy)
├── src/
│   ├── components/      # Reusable UI components
│   ├── config/          # Site and navigation configuration
│   ├── content/         # Markdown content (blogs, projects)
│   ├── data/            # Auto-generated tech icons data
│   ├── i18n/            # Translation keys (ID/EN)
│   ├── layouts/         # Page layouts and SEO metadata
│   ├── pages/           # Route pages
│   ├── scripts/         # Client-side JavaScript
│   ├── styles/          # Design system tokens and global styles
│   └── tests/           # Unit tests (Vitest)
└── dist/                # Build output
```

## Technology Stack

- **Framework**: Astro 5.16.10 (SSG)
- **Language**: TypeScript (strict mode)
- **Animation**: GSAP 3.14.2
- **Icons**: tech-stack-icons + simple-icons
- **Image Processing**: Sharp (WebP, resize, compress)
- **CV Engine**: Tectonic LaTeX compiler
- **Testing**: Vitest + fast-check
- **Deployment**: Cloudflare Pages

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Astro production build |
| `npm run build:local` | Full build: tech-icons → images → CV → Astro |
| `npm run deploy` | Full pipeline: generate → build → commit → push |
| `npm run generate:cv` | Generate CV PDFs (EN & ID) |
| `npm run generate:tech-icons` | Extract SVG icons from tech-stack-icons |
| `npm run optimize-images` | Compress and WebP-optimize thumbnails |
| `npm run test` | Run unit tests |

## License

MIT License

---

**Developer**: Gerry Moeis  
**University**: State University of Surabaya  
**Role**: Web Developer & Tech Enthusiast
