---
title:
  en: "Infortic - AI-Powered Opportunity Platform"
  id: "Infortic - Platform Peluang berbasis AI"
summary:
  en: "End-to-end platform that automatically scrapes Instagram opportunities using AI extraction and displays curated competitions, scholarships, and internships."
  id: "Platform end-to-end yang secara otomatis mengambil peluang dari Instagram menggunakan ekstraksi AI dan menampilkan kompetisi, beasiswa, dan magang yang dikurasi."
date: 2026-05-15
year: 2026
featured: true
status: "in-progress"
priority: 3
category: ["web", "data-mining"]
craft: ai
techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Python", "Playwright", "JavaScript"]
thumbnail: "/images/projects/infortic-thumb.webp"
heroImage: "/images/projects/infortic-hero.webp"
links:
  github: "https://github.com/gerrymoeis/infortic_scraper"
  live: "https://infortic.gerrymoeis.workers.dev"
  demo: "https://github.com/gerrymoeis/infortic_frontend"
linkTitles:
  github: "Scraper"
  demo: "Frontend"
---

# Infortic - AI-Powered Opportunity Platform

Platform lengkap yang secara otomatis mengumpulkan, mengekstrak, dan menampilkan peluang dari Instagram (kompetisi, beasiswa, magang, lomba) menggunakan AI. Sistem terdiri dari scraper otomatis yang berjalan daily via GitHub Actions dan frontend modern Next.js yang menampilkan data terkurasi.

## Key Features

### Automated Instagram Scraping
Scraping otomatis dari 28 akun Instagram Indonesia:
- Akun seperti infolomba, lomba.it, csrelatedcompetitions, informasilomba, eventmahasiswa8, dan lainnya
- Anti-detection: stealth plugin, random scheduling (7 cron schedules), account shuffling
- Deep scrape mode untuk memulihkan caption dari modal dialogs
- Download images untuk AI analysis dan CDN upload
- Checkpoint system untuk resume capability
- Debug screenshots on errors

### AI-Powered Data Extraction
Ekstraksi data terstruktur menggunakan AI:
- Primary: Google Gemini 3.1 Flash-Lite Vision API
- Fallback: OpenRouter API (smart free model router)
- 5 API keys Gemini dengan round-robin rotation
- Mengekstrak: title, description, category (10 types), audiences (9 types), registration dates, contact, event type, fee type, organizer, registration URL
- 5 JSON recovery strategies untuk reliability
- 3-step fallback: Gemini AI → Regex → OCR (Tesseract)

### Cloudflare R2 CDN
Penyimpanan gambar permanen dan cepat:
- Images dikonversi ke WebP Q70 (~60% size reduction)
- Dikirim via Cloudflare Worker URL
- R2-first architecture: upload sebelum database insertion
- Tidak ada URL expiration seperti Instagram

### Modern Next.js Frontend
Frontend performa tinggi dengan Next.js 16:
- ISR (Incremental Static Regeneration) - 1 jam untuk opportunities, 24 jam untuk categories
- Server Components sebagai default
- Framer Motion animations untuk UI yang smooth
- Client-side search, filter (by type, audience, fee, event type), dan sort
- Design system dengan tailwind-merge, clsx, dan Lucide icons
- Responsive design untuk semua devices

### SEO Optimization
Full SEO implementation:
- Dynamic sitemap generation untuk semua published opportunities
- Structured data (JSON-LD untuk Organization dan WebSite)
- Open Graph dan Twitter card metadata
- MetadataBase dan canonical URLs
- Optimized cache headers (1 hour public, 24 hours stale-while-revalidate)

### Opportunity Management
10 tipe peluang dengan 9 audience categories:
- Types: competition, scholarship, internship, job, freelance, festival, training, workshop, hackathon, tryout
- Audiences: sd, smp, sma, smk, d2, d3, d4, s1, umum
- Intelligent duplicate detection (by post_id, title, organizer, dates)
- Automatic expiration filtering
- Smart merge untuk extends deadlines dan fills NULL fields

## Technical Highlights

### Scraper Architecture
Dua-layer scraping dan extraction:
- **Node.js + Playwright**: Instagram scraping dengan stealth anti-detection, deep scrape mode, popup handlers, dan Fisher-Yates account shuffling
- **Python**: AI extraction pipeline dengan Google Gemini + OpenRouter, fuzzy matching untuk duplicate detection, dan PostgreSQL insertion
- GitHub Actions untuk daily automated runs

### Next.js 16 + TypeScript
Modern web architecture dengan App Router:
- ISR dengan 1-hour revalidation untuk opportunities
- Drizzle ORM untuk type-safe database queries
- Neon PostgreSQL serverless database
- SWR dan TanStack React Query untuk data fetching client-side
- Zod untuk form validation dan runtime type checking

### Design System
Comprehensive design system:
- Tailwind CSS 4 dengan custom theme
- Framer Motion untuk page transitions dan micro-interactions
- Lucide React icons
- Consistent spacing, typography, dan color tokens
- Dark/light mode support

### Cloudflare Integration
Full Cloudflare ecosystem:
- R2 object storage untuk image CDN
- Workers deployment via @opennextjs/cloudflare
- Workers Images untuk on-the-fly optimization
- Pages deployment dengan automatic builds

## Design Process

Desain platform berfokus pada otomatisasi dan user experience:
1. Research Instagram accounts yang posting opportunities secara rutin
2. Design scraping pipeline dengan anti-detection measures
3. Implement AI extraction dengan Gemini Vision API
4. Build Next.js frontend dengan ISR dan SEO optimization
5. Setup CI/CD pipeline dengan GitHub Actions dan Cloudflare

## Challenges

### Instagram Anti-Detection
Problem: Instagram memiliki bot detection yang agresif, sering block automated access.
Solution: Multi-layer anti-detection: stealth plugin, random scheduling (7 cron schedules), Fisher-Yates account shuffling, popup/password challenge handlers, dan checkpoint system untuk resume on failure.

### AI Extraction Reliability
Problem: Instagram captions memiliki format tidak terstruktur dan bervariasi.
Solution: 5 JSON recovery strategies (direct parse, regex, formatting fixes, object rebuild, truncation fix), 3-step fallback (Gemini → Regex → OCR), dan 5 API keys round-robin untuk menghindari rate limits.

### Image Migration & CDN
Problem: Instagram image URLs expired setelah periode tertentu, menyebabkan broken images.
Solution: R2-first architecture dengan WebP conversion (Q70), semua images diupload ke Cloudflare R2 sebelum database insertion. Frontend menggunakan optimized image component yang bypass Next.js optimization untuk R2 URLs.

### Performance dengan Dynamic Content
Problem: Opportunities berubah setiap hari, butuh keseimbangan antara freshness dan performance.
Solution: ISR dengan 1-hour revalidation untuk opportunities list, 24-hour untuk categories. Server Components untuk static content, client components hanya untuk search/filter interaktif.

## Results

Platform berhasil mencapai:
- 168/168 posts processed (100% success rate)
- ~15 menit daily scraping cycle
- AI extraction dengan multi-layer fallback untuk reliability
- Cloudflare R2 CDN untuk image delivery yang cepat
- SEO-optimized frontend dengan ISR
- Production-ready dengan GitHub Actions automation

Platform ini demonstrate kemampuan membangun end-to-end AI-powered system yang mengintegrasikan web scraping, AI extraction, cloud infrastructure, dan modern frontend development.

---

**Tech Stack**: Next.js, TypeScript, Tailwind CSS, Framer Motion, Python, Google Gemini, Playwright, PostgreSQL, Drizzle ORM, Cloudflare R2  
**Status**: In Progress - Continuous improvements  
**Frontend**: [github.com/gerrymoeis/infortic_frontend](https://github.com/gerrymoeis/infortic_frontend)  
**Scraper**: [github.com/gerrymoeis/infortic_scraper](https://github.com/gerrymoeis/infortic_scraper)  
**Live**: [infortic.gerrymoeis.workers.dev](https://infortic.gerrymoeis.workers.dev)
