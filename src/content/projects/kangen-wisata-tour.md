---
title:
  en: "KanGen Wisata Tour Company Profile"
  id: "Profil Perusahaan KanGen Wisata Tour"
summary:
  en: "Company profile website for KanGen Wisata Tour travel agency featuring tour packages, fleet gallery, and WhatsApp-based reservation system."
  id: "Website profil perusahaan untuk biro perjalanan KanGen Wisata Tour dengan paket wisata, galeri armada, dan sistem reservasi berbasis WhatsApp."
date: 2024-10-15
year: 2024
status: "completed"
category: ["web"]
techStack: ["Astro", "Tailwind CSS", "TypeScript", "JavaScript"]
thumbnail: "/images/projects/kangen-wisata-tour-thumb.webp"
heroImage: "/images/projects/kangen-wisata-tour-hero.webp"
links:
  github: "https://github.com/gerrymoeis/kangen_wisata"
  live: "https://kangen-wisata.pages.dev"
---

# KanGen Wisata Tour Company Profile

Website profil perusahaan untuk KanGen Wisata Tour, biro perjalanan wisata yang didirikan tahun 2010 oleh Mustiady. Website ini berfungsi sebagai brosur digital yang menampilkan paket wisata, armada kendaraan, galeri foto, dan sistem reservasi terintegrasi WhatsApp.

## Key Features

### Tour Packages Display
Informasi paket wisata yang informatif:
- 3 paket wisata utama: Bali, Lombok, dan Yogyakarta
- Detail harga, rute, dan akomodasi per paket
- Card-based layout dengan gambar dan deskripsi
- CTA button untuk reservasi langsung
- Harga kompetitif dengan rentang IDR 2.8J - 4.2J

### Fleet Gallery with Slider
Galeri armada dengan custom image slider:
- 3 tipe kendaraan: Hiace Primio, Isuzu Elf, Big Bus
- Custom-built image slider dengan snap-scroll
- Navigasi prev/next buttons
- Detail kapasitas, layanan, dan fitur per kendaraan
- 4 gambar per kendaraan dengan zoom hover effect

### Photo Gallery with Lightbox
Galeri foto dengan lightbox popup:
- 12 foto dengan pagination client-side (4 per halaman)
- Fullscreen lightbox dengan prev/next navigation
- Keyboard shortcuts (ArrowLeft, ArrowRight, Escape)
- Pre-optimized WebP images dengan getImage()

### WhatsApp Reservation System
Sistem reservasi terintegrasi WhatsApp:
- Form multi-field: nama, telepon, email, jumlah, destinasi
- Stay duration toggle dengan radio button
- Auto-generate WhatsApp message
- One-click redirect ke wa.me untuk konfirmasi
- No backend required (fully static)

### Custom Scroll Animations
Home-built AOS (Animate On Scroll):
- IntersectionObserver-based animations
- Multiple animation types: fade-up, fade-down, zoom-in
- Configurable delays via data-aos-delay
- Staggered animations untuk card lists
- No external animation library dependency

## Technical Highlights

### Astro Static Site
Fully static site dengan Astro 6:
- Static HTML generation di build time
- Zero runtime JavaScript untuk page content
- Image optimization via Astro getImage() ke WebP
- XML sitemap generation via @astrojs/sitemap
- Dynamic robots.txt endpoint

### Tailwind CSS v4 Styling
Modern styling dengan Tailwind CSS v4:
- Custom theme via @theme at-rule (Tailwind v4 approach)
- Vite plugin integration (@tailwindcss/vite)
- Custom color palette: dark-teal, tomato red, orange, yellow
- Responsive design dengan mobile-first methodology
- Card-based layout dengan shadows dan rounded corners

### Parallax Hero Sections
Custom parallax implementation:
- CSS background-attachment: fixed untuk desktop
- JavaScript requestAnimationFrame fallback untuk mobile
- Dark overlays untuk text readability
- Staggered fade-in-up animations
- Height customizable via props

### Image Optimization
Full image optimization pipeline:
- All images dioptimasi ke WebP format di build time
- Hero images: 1920px width
- Gallery images: 1200px width
- OG image: 1200x630 untuk social sharing
- Astro global quality: 65 untuk optimal file size

## Design Process

Desain website mengikuti kebutuhan perusahaan travel:
1. Research website kompetitor travel agency
2. Define color palette yang mencerminkan profesionalisme dan kepercayaan
3. Design responsive layouts dengan Tailwind CSS
4. Build custom components (slider, lightbox, form)
5. Implement animations untuk better user experience

## Challenges

### Custom Slider Implementation
Problem: Fleet images membutuhkan slider yang ringan tanpa dependency eksternal.
Solution: Custom slider dengan CSS snap-scroll dan JavaScript prev/next controls. Native feel tanpa library overhead.

### Parallax on Mobile
Problem: CSS background-attachment: fixed tidak support di mobile browsers.
Solution: JavaScript-based parallax dengan requestAnimationFrame yang mentranslate background div berdasarkan scroll progress. Fallback mulus tanpa layout shift.

### Image Performance
Problem: Banyak gambar besar (45+ assets) bisa impact load time.
Solution: Optimasi semua gambar ke WebP via Astro's getImage(), responsive sizing untuk setiap use case, lazy loading untuk gallery images.

### Zero-JS Philosophy
Problem: Menjaga site tetap ringan tanpa JavaScript framework.
Solution: Vanilla JavaScript untuk interactive elements (slider, lightbox, animations). Astro renders semua content sebagai static HTML, JavaScript hanya untuk enhancement.

## Results

Website berhasil menjadi marketing tool digital untuk KanGen Wisata Tour:
- Fully static site dengan fast load times
- Professional branding dengan consistent design system
- WhatsApp integration untuk lead generation
- Responsive design untuk semua devices
- SEO optimization dengan proper metadata dan sitemap

Website ini demonstrate kemampuan untuk build company profile website yang professional, fast, dan functional tanpa JavaScript framework berlebihan.

---

**Tech Stack**: Astro, Tailwind CSS v4, TypeScript, Cloudflare Pages  
**Status**: Completed - Production live  
**Live**: [kangen-wisata.pages.dev](https://kangen-wisata.pages.dev)
