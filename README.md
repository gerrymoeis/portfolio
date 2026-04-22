# Gerry Moeis - Personal Portfolio

An Awwwards-worthy personal portfolio website featuring bilingual support (Indonesian/English), advanced audio visualizer, custom cursor, and HD-2D aesthetic inspired by Octopath Traveler.

## 🎯 Features (14 Total)

- 🎨 **HD-2D Aesthetic** - Layered depth effects and atmospheric lighting
- 🌓 **Light/Dark Theme** - Smooth theme toggle with system preference detection
- 🌍 **Bilingual** - Indonesian and English with seamless switching
- 🎵 **Advanced Audio Visualizer** - Multiple modes synced with SoundCloud
- 🖱️ **Custom Cursor** - Magnetic effect with GSAP animations
- ✨ **Cursor Trail** - Particle effects following cursor
- 🎭 **Three.js 3D Effects** - Minimal but clear 3D elements
- 📱 **Fully Responsive** - Mobile-first design
- ⚡ **Performance Optimized** - Lighthouse 95+ score target
- ♿ **Accessible** - WCAG 2.2 Level AA compliant
- 📄 **Auto CV Generation** - LaTeX-based CV in both languages
- 📝 **StudioCMS** - Content management for projects, blogs, experiences
- 🎬 **Unique Layouts** - Different animations per content type
- 🚀 **Cloudflare Pages** - Free tier deployment

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

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
- **3D**: Three.js (lazy loaded)
- **CMS**: StudioCMS
- **Testing**: Vitest + fast-check
- **Deployment**: Cloudflare Pages

## Content Types

### Projects
- Vertical parallax scroll layout
- Immersive showcase with animations
- Bilingual content

### Blogs
- Clean, readable layout
- No scroll animations (focus on content)
- Table of contents
- Bilingual posts

### Experiences
- Horizontal scroll timeline
- Scroll down = content moves left
- Card-based layout
- Bilingual descriptions

## Development Timeline

- **Phase 1** (Weeks 1-2): Foundation - Theme, i18n, visualizer, cursor
- **Phase 2** (Weeks 3-4): Content & CMS - StudioCMS, layouts, CV generation
- **Phase 3** (Weeks 5-6): Advanced - Three.js, animations, interactions
- **Phase 4** (Week 7): Optimization - Performance, SEO, accessibility
- **Phase 5** (Week 8): Polish & Launch - Final touches, deployment

## License

MIT License

---

**Developer**: Gerry Moeis  
**University**: State University of Surabaya  
**Role**: R&D Head, Himafortic
