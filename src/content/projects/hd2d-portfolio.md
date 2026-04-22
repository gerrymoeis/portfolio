---
title: "HD-2D Portfolio Website"
summary: "A personal portfolio website inspired by the Octopath Traveler aesthetic, featuring layered depth, soft lighting, and calm motion."
year: 2024
status: "in-progress"
techStack: ["Astro", "TypeScript", "CSS", "Vitest"]
heroImage: "/images/projects/hd2d-portfolio-hero.svg"
links:
  github: "https://github.com/username/hd2d-portfolio"
  live: "https://portfolio.example.com"
---

# HD-2D Portfolio Website

This portfolio website brings the beautiful HD-2D aesthetic of games like Octopath Traveler to the web. The design emphasizes calm, atmospheric visuals with layered depth and subtle motion.

## Key Features

### Static-First Architecture
Built with Astro for optimal performance, the site generates static HTML at build time with minimal runtime JavaScript.

### Design System
A comprehensive design system with:
- Muted, earthy color palette
- Typography hierarchy for display and body text
- Consistent spacing and motion tokens
- Panel framing styles inspired by JRPG menus

### Interactive Elements
- Mouse-reactive background on the home page
- Scroll-based parallax effects on the projects page
- SoundCloud integration with Octopath Traveler playlists
- View counter for blog posts

### Content Management
All content is authored in Markdown with frontmatter, making it easy to add new blog posts and projects without touching code.

## Technical Highlights

The site demonstrates several advanced web development techniques:

- **Content Collections**: Type-safe content with Zod schema validation
- **Client Islands**: Selective hydration for interactive components
- **Property-Based Testing**: Comprehensive test coverage using fast-check
- **Accessibility**: Full keyboard navigation and reduced motion support
- **Performance**: Optimized JavaScript bundles and lazy loading

## Design Process

The design process involved:
1. Studying the HD-2D aesthetic and identifying key visual elements
2. Creating a design system with tokens for colors, typography, and motion
3. Building reusable components with consistent styling
4. Implementing progressive enhancement for interactive features

## Challenges

Some interesting challenges included:
- Balancing visual richness with performance
- Ensuring accessibility while maintaining the aesthetic
- Creating smooth parallax effects without janky scrolling
- Making optional features fail gracefully

## Results

The final site achieves:
- Fast load times with minimal JavaScript
- Smooth, ambient motion that respects user preferences
- Clean, maintainable codebase with strong typing
- Comprehensive test coverage for correctness
