# Gerry Moeis - Personal Portfolio

Personal portfolio website featuring bilingual support (Indonesian/English), HD-2D aesthetic inspired by Octopath Traveler, SoundCloud audio visualizer, and automated LaTeX CV generation.

## 🎯 Features

- 🎨 **HD-2D Aesthetic** - Layered depth effects and atmospheric lighting
- 🌓 **Light/Dark Theme** - Smooth theme toggle with system preference detection
- 🌍 **Bilingual** - Indonesian and English with seamless switching
- 🎵 **Audio Visualizer** - Real-time visualization synced with SoundCloud
- 🖱️ **Custom Cursor** - Gradient 3D cursor with trail particles
- 📱 **Fully Responsive** - Mobile-first design across all pages
- ⚡ **Performance Optimized** - Minimal JavaScript, static-first architecture
- 📄 **CV Generator** - LaTeX-based CV generation in both languages
- 📝 **Blog System** - Markdown-based blog with Astro Content Collections
- 🚀 **Cloudflare Pages** - CDN deployment with automatic builds

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (Cloudflare Pages)
npm run build

# Build locally with CV generation
npm run build:local

# Deploy (generate CV + commit + push)
npm run deploy

# Preview production build
npm run preview
```

## Project Structure

```
main_folder/
├── src/
│   ├── components/     # Reusable UI components
│   ├── config/         # Site configuration
│   ├── content/        # Markdown content (blogs, projects)
│   ├── i18n/          # Translation files (ID/EN)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   ├── scripts/        # Client-side JavaScript
│   ├── styles/         # Design system and global styles
│   └── tests/          # Unit tests
├── public/            # Static assets
└── templates/         # LaTeX CV templates
```

## Technology Stack

- **Framework**: Astro 5.16.10 (SSG)
- **Language**: TypeScript (strict mode)
- **Animation**: GSAP 3.14.2
- **Testing**: Vitest + fast-check
- **Deployment**: Cloudflare Pages

## License

MIT License

---

**Developer**: Gerry Moeis  
**University**: State University of Surabaya  
**Role**: Web Developer & Tech Enthusiast
