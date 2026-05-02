---
title:
  en: "Pixantara Competition Website"
  id: "Website Kompetisi Pixantara"
summary:
  en: "Game development competition website with Pixel Nusantara theme, showcasing Indonesian culture in retro pixel art aesthetic."
  id: "Website kompetisi game development dengan tema Pixel Nusantara, menampilkan budaya Indonesia dalam retro pixel art aesthetic."
date: 2025-05-15
year: 2025
status: "experimental"
category: "web"
techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP"]
thumbnail: "/images/projects/hd2d-portfolio-hero.svg"
heroImage: "/images/projects/hd2d-portfolio-hero.svg"
links:
  github: "https://github.com/gerrymoeis/pixantara_nextjs"
  live: "https://pixantara.vercel.app"
---

# Pixantara Competition Website

Website untuk kompetisi game development Pixantara dengan tema "Pixel Nusantara" - menggabungkan nostalgia 8-bit gaming dengan identitas budaya Indonesia. Kompetisi ini challenge developers untuk create games yang celebrate Indonesian culture, heritage, dan values melalui pixel art dan retro gaming aesthetics.

## Key Features

### Competition Information Pages
Comprehensive information system:
- About page dengan competition overview
- Timeline page untuk registration dan submission phases
- FAQ page dengan accordion component
- Competition phases breakdown (6 phases dari registration hingga finals)

### User Authentication System
Secure login dan registration:
- Login page untuk existing participants
- Registration system untuk new participants
- User authentication flow
- Protected routes untuk participant dashboard

### Retro Gaming Aesthetic
Visual design terinspirasi dari retro games:
- Pixel art style dengan Press Start 2P font
- Temple/shrine panel designs
- Retro color palette dengan modern gradients
- 8-bit inspired UI elements

### SEO Optimization
Full SEO implementation:
- Dynamic sitemap generation
- Rich metadata untuk all pages
- Open Graph tags untuk social media sharing
- Structured data untuk search engines

### Analytics Integration
Performance tracking:
- Google Analytics integration
- Vercel Analytics untuk performance monitoring
- User behavior tracking
- Conversion funnel analysis

## Technical Highlights

### Next.js App Router
Modern Next.js architecture:
- App Router untuk file-based routing
- Server Components untuk optimal performance
- Client Components untuk interactive elements
- Automatic code splitting

### TypeScript Implementation
Type-safe development:
- Full TypeScript coverage
- Interface definitions untuk data structures
- Type checking untuk props dan state
- Better IDE support dan autocomplete

### Tailwind CSS Styling
Utility-first CSS approach:
- Custom Tailwind configuration
- Responsive design dengan breakpoints
- Custom color palette
- Reusable utility classes

### GSAP Animations
Professional animations:
- Smooth page transitions
- Scroll-triggered animations
- Timeline-based animations
- Performance-optimized animations

### Vercel Deployment
Production deployment:
- Automatic deployments dari Git
- Preview deployments untuk pull requests
- Edge network untuk fast global access
- Built-in analytics dan monitoring

## Design Process

Design process fokus pada retro gaming aesthetic:
1. Research retro game UI patterns (NES, SNES era)
2. Define pixel art style guidelines
3. Create temple/shrine panel components
4. Implement retro typography (Press Start 2P)
5. Add modern touches (gradients, shadows)

## Challenges

### Balancing Retro dan Modern
Problem: Retro aesthetic bisa terlihat outdated jika tidak balanced dengan modern design elements.
Solution: Combine pixel art style dengan modern gradients, shadows, dan smooth animations. Use retro fonts tapi dengan modern spacing dan hierarchy.

### Mobile Responsiveness
Problem: Retro game UIs biasanya designed untuk fixed screen sizes.
Solution: Implement responsive breakpoints dengan Tailwind, adjust panel sizes dan typography untuk mobile screens. Maintain retro feel tapi dengan modern responsive behavior.

### Performance dengan Animations
Problem: GSAP animations bisa impact performance jika tidak optimized.
Solution: Use GSAP dengan efficient selectors, lazy load animations, implement scroll-triggered animations dengan IntersectionObserver.

### SEO untuk Competition Site
Problem: Competition sites perlu good SEO untuk reach potential participants.
Solution: Implement dynamic sitemap, rich metadata, Open Graph tags, structured data. Use Next.js built-in SEO features.

## Results

Website prototype berhasil showcase:
- Retro gaming aesthetic yang consistent
- Modern web technologies (Next.js, TypeScript)
- Responsive design untuk all devices
- SEO optimization untuk search visibility

Note: Website ini adalah prototype/design mockup. Beberapa features masih basic dan ada bugs yang perlu fixing. Mobile responsiveness belum fully optimized. Authentication system adalah UI mockup tanpa backend integration.

Future improvements yang needed:
- Backend integration untuk authentication
- Database untuk participant data
- Admin dashboard untuk competition management
- Mobile responsiveness improvements
- Bug fixes dan polish

Website ini demonstrate kemampuan untuk design dan build themed websites dengan specific aesthetic requirements, meskipun masih dalam prototype stage.

---

**Tech Stack**: Next.js, React, TypeScript, Tailwind CSS, GSAP, Vercel  
**Status**: Completed (Prototype) - Design mockup dengan basic functionality  
**Live**: [pixantara.vercel.app](https://pixantara.vercel.app)
