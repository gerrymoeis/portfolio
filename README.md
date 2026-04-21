# HD-2D Portfolio

A modern, static-first portfolio website built with Astro, featuring an HD-2D aesthetic inspired by Octopath Traveler.

## Features

- 🎨 **HD-2D Aesthetic** - Layered depth effects and atmospheric lighting
- ⚡ **Static-First** - Pre-rendered HTML for optimal performance
- 📱 **Fully Responsive** - Mobile-first design with fluid typography
- ♿ **Accessible** - WCAG compliant with keyboard navigation
- 🎵 **Spotify Integration** - Embedded playlist carousel
- 📊 **View Counter** - Optional blog post view tracking
- 🧪 **Well-Tested** - Unit and property-based testing

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

## Configuration

1. **Personal Information**: Update `src/config/home.ts` with your details
2. **Spotify Playlists**: Configure `src/config/spotify.ts` with your embed URLs
3. **View Counter** (Optional): Copy `.env.example` to `.env` and add your API URL

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/         # Site configuration
├── content/        # Markdown content (blogs, projects)
├── layouts/        # Page layouts
├── pages/          # Route pages
├── scripts/        # Client-side JavaScript
├── styles/         # Design system and global styles
└── tests/          # Unit tests
```

## Technology Stack

- **Framework**: [Astro 5](https://astro.build) - Static site generation
- **Styling**: CSS with custom design tokens
- **Animation**: GSAP for smooth interactions
- **Particles**: tsParticles for visual effects
- **Testing**: Vitest + fast-check
- **TypeScript**: Strict mode enabled

## Design System

The project uses a comprehensive design token system with:
- Fluid typography and spacing
- Responsive breakpoints
- HD-2D depth layers
- Atmospheric effects
- Accessible color contrast

## Content Management

### Adding Blog Posts

Create a new `.md` file in `src/content/blogs/`:

```markdown
---
title: "Your Post Title"
date: 2024-01-01
summary: "Brief description"
tags: ["tag1", "tag2"]
---

Your content here...
```

### Adding Projects

Create a new `.md` file in `src/content/projects/`:

```markdown
---
title: "Project Name"
summary: "Project description"
year: 2024
status: "completed"
techStack: ["Astro", "TypeScript"]
heroImage: "/images/projects/hero.svg"
links:
  github: "https://github.com/..."
  live: "https://..."
---

Project details...
```

## Testing

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui
```

## Deployment

This site is optimized for deployment on:
- **Cloudflare Pages** (recommended)
- **Netlify**
- **Vercel**
- Any static hosting service

Build command: `npm run build`  
Output directory: `dist`

## License

MIT License - feel free to use this as a template for your own portfolio!
