---
title:
  en: "Innovation Lab Website"
  id: "Website Innovation Lab"
summary:
  en: "Website for intensive coaching program preparing for Olivia and Gemastik competitions, with automated competition information scraping."
  id: "Website untuk program coaching intensif persiapan kompetisi Olivia dan Gemastik, dengan scraping otomatis informasi kompetisi."
date: 2025-04-20
year: 2025
status: "completed"
category: "web"
techStack: ["Astro", "Vue", "TypeScript", "Tailwind CSS", "Anime.js"]
thumbnail: "/images/projects/innovation-lab-thumb.webp"
heroImage: "/images/projects/innovation-lab-hero.webp"
links:
  github: "https://github.com/gerrymoeis/innovation-lab-himafortic"
  live: "https://inlab-himafortic.netlify.app"
---

# Innovation Lab Website

Website resmi untuk Innovation Lab, program coaching intensif yang diselenggarakan oleh Himafortic (Himpunan Mahasiswa Informatika) untuk persiapan kompetisi Olivia dan Gemastik. Program ini fokus pada Web Development, C++ Programming, dan UI/UX Design.

## Key Features

### Program Information System
Comprehensive information tentang program:
- Timeline program dari pendaftaran hingga final
- Profil mentor untuk setiap track (Web Dev, C++, UI/UX)
- Silabus pembelajaran untuk masing-masing track
- FAQ section untuk pertanyaan umum

### Competition Data Scraping
Automated scraping informasi kompetisi:
- Scraping data dari website Gemastik
- Scraping data dari website Olivia
- Display competition categories dan requirements
- Update otomatis untuk informasi terbaru

### Countdown Timer
Real-time countdown untuk deadline penting:
- Countdown untuk penutupan pendaftaran
- Visual countdown dengan days, hours, minutes, seconds
- Automatic update setiap detik
- Responsive design untuk mobile dan desktop

### Mentor Profiles
Detailed mentor information:
- Profile photos dan bio untuk setiap mentor
- Expertise areas dan achievements
- Contact information dan social media links
- Organized by track (Web Dev, C++, UI/UX)

### Interactive Timeline
Visual timeline untuk program schedule:
- Step-by-step program phases
- Dates dan descriptions untuk setiap phase
- Visual indicators untuk completed/active/upcoming phases
- Smooth scroll animations

## Technical Highlights

### Astro + Vue Integration
Hybrid architecture dengan Astro dan Vue:
- Astro untuk static pages dan SEO optimization
- Vue components untuk interactive elements (countdown, animations)
- Client-side hydration hanya untuk necessary components
- Fast page loads dengan minimal JavaScript

### Tailwind CSS Styling
Modern styling dengan Tailwind CSS:
- Utility-first CSS approach
- Responsive design dengan mobile-first methodology
- Custom color palette dengan gradient effects
- Dark theme dengan glassmorphism effects

### Anime.js Animations
Smooth animations menggunakan Anime.js:
- Staggered animations untuk card elements
- Scroll-triggered animations untuk sections
- Fade-in effects dengan translateY
- Easing functions untuk natural motion

### Data Management
Structured data management:
- JSON files untuk mentor profiles
- TypeScript interfaces untuk type safety
- Centralized data files untuk easy updates
- Reusable data structures

## Design Process

Website design mengikuti modern web design trends:
1. Research kompetitor websites (hackathon, bootcamp sites)
2. Define color palette dengan gradient effects
3. Create component library (cards, buttons, timeline)
4. Implement responsive layouts
5. Add animations untuk better UX

## Challenges

### Data Scraping Implementation
Problem: Gemastik dan Olivia websites tidak provide API untuk data access.
Solution: Implement web scraping dengan Axios untuk fetch HTML, parse relevant information, dan display di website. Update manual untuk data changes.

### Countdown Timer Accuracy
Problem: JavaScript setTimeout/setInterval tidak always accurate untuk countdown.
Solution: Calculate time difference dari server time, update UI setiap second dengan requestAnimationFrame untuk smooth updates.

### Responsive Timeline Design
Problem: Timeline component sulit di-design untuk mobile screens.
Solution: Vertical timeline untuk mobile, horizontal untuk desktop. Use CSS media queries dan Flexbox untuk adaptive layout.

### Performance dengan Animations
Problem: Banyak animations bisa cause performance issues.
Solution: Use Anime.js dengan efficient selectors, lazy load animations, respect reduced motion preferences.

## Results

Website berhasil digunakan untuk:
- 100+ registrations untuk Innovation Lab program
- Centralized information hub untuk participants
- Automated competition data updates
- Professional presentation untuk program branding

Program Innovation Lab berjalan sukses dengan:
- 5 minggu coaching clinic
- 3 tracks (Web Dev, C++, UI/UX)
- Hands-on project-based learning
- Preparation untuk Olivia dan Gemastik competitions

Website ini demonstrate kemampuan untuk build functional, informative website dengan modern web technologies dan good UX practices.

---

**Role**: Head of Research and Technology Department - Himafortic  
**Tech Stack**: Astro, Vue, TypeScript, Tailwind CSS, Anime.js, Netlify  
**Status**: Completed - Program telah selesai dilaksanakan  
**Live**: [inlab-himafortic.netlify.app](https://inlab-himafortic.netlify.app)
