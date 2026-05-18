---
title:
  en: "Computer Lab Inventory System"
  id: "Sistem Inventaris Laboratorium Komputer"
summary:
  en: "Web-based inventory management system for university computer labs with AI-powered OCR attendance logbook, device tracking, and course scheduling."
  id: "Sistem manajemen inventaris laboratorium komputer berbasis web dengan absensi logbook berbasis AI OCR, pelacakan perangkat, dan jadwal kuliah."
date: 2026-05-15
year: 2026
status: "in-progress"
priority: 2
category: ["backend"]
techStack: ["Go", "Gin", "Bootstrap", "JavaScript", "SQLite", "PostgreSQL"]
thumbnail: "/images/projects/lab-kom-sim-thumb.webp"
heroImage: "/images/projects/lab-kom-sim-hero.webp"
links:
  github: "https://github.com/gerrymoeis/lab_kom_sim"
---

# Computer Lab Inventory System

Sistem inventaris untuk laboratorium komputer universitas yang memantau 40 PC dalam grid 8x5, mengelola perangkat dan peripheral, katalog software, jadwal perkuliahan, serta logbook kehadiran mahasiswa dengan AI-powered OCR. Sistem ini dirancang untuk deployment di laptop saat development dan auto-deploy ke Android via SSH + Tailscale untuk produksi.

## Key Features

### Dashboard PC Grid
Visualisasi grid 8x5 untuk seluruh 40 PC laboratorium:
- Color-coded status (normal, warning, broken, inactive)
- Statistics cards untuk overview kondisi lab
- Detail spesifikasi per PC (processor, RAM, storage, OS)
- Photo upload untuk serial number dan panel depan
- Status tracking dengan last-checked timestamp

### Device & Peripheral Management
Manajemen perangkat secara hierarkis:
- 46 device type templates dari inventory nyata
- Categories: peripheral, network, power, display, printer, consumable, audio, tools, server, security
- Asset code generation otomatis dengan prefix system
- Loan tracking (active, returned, overdue)
- Usage tracking dengan availability status
- Individual items (loanable) vs consumables (quantity-based)

### AI-Powered OCR Logbook
Absensi logbook otomatis dengan AI:
- Upload foto logbook kehadiran tulisan tangan
- Primary OCR via OpenRouter vision model
- Fallback via Google Gemini API
- Smart context: ditto marks, date inference, abbreviation normalization
- NIM validation (11-digit format)
- Levenshtein-based duplicate detection sebelum save
- Preview & edit sebelum menyimpan
- Bulk save dengan duplicate skipping
- Excel export untuk laporan absensi

### Course Schedule Management
Jadwal perkuliahan laboratorium:
- CRUD untuk course schedules
- Today highlighting untuk jadwal hari ini
- Day-based filtering
- Lecturer, class, time tracking

### Software Catalog & PC Assignment
Katalog software dengan assignment ke PC:
- 14 required software ter-seed (VS Code, Python, Unity, Blender, etc.)
- Many-to-many relationship antara PC dan software
- Toggle-based assignment per PC dengan batch edit
- Kategori required vs other software
- Real inventory data untuk 24 PCs

### Full Audit Trail
Setiap aksi tercatat secara detail:
- Create, update, delete, upload, login, logout, export
- IP address dan user agent tercapture
- Old/new values dalam JSON untuk rollback tracing
- Action-type filtering untuk analisis

## Technical Highlights

### Go + Gin Backend
Clean Architecture dengan Go dan Gin:
- Dual database support: SQLite (development) dan PostgreSQL/Neon DB (production)
- Custom DB wrapper dengan automatic ? → $N query rewriting untuk PostgreSQL compatibility
- Session-based auth dengan cookie store (7-day expiry) dan single-session enforcement
- Role-based access: admin vs dosen (read-only)

### Bootstrap + Vanilla JS Frontend
Frontend ringan tanpa JavaScript framework berat:
- Bootstrap 5.3 untuk responsive layout dan komponen siap pakai
- Vanilla JavaScript untuk interactivity dan AJAX
- Server-side rendering dengan Go html/template engine
- HEIC-to-JPEG conversion via WASM (wazero runtime)

### AI OCR Pipeline
Dua-layer AI untuk ekstraksi teks dari logbook:
- OpenRouter free vision model sebagai primary
- Google Gemini API sebagai fallback
- Exponential backoff retry (up to 3 attempts)
- Levenshtein distance untuk duplicate detection
- Smart prompt engineering untuk ditto marks dan abbreviation handling

### Dual Database Architecture
Fleksibel antara development dan production:
- SQLite via modernc.org/sqlite (pure Go, no CGO) untuk local development
- PostgreSQL via jackc/pgx/v5 untuk production (Neon DB serverless)
- Automatis query rewriting untuk cross-database compatibility
- 11 tabel dengan relasi foreign key yang proper

## Design Process

Desain sistem berfokus pada kebutuhan laboratorium komputer universitas:
1. Research lab inventory management requirements dan existing workflows
2. Design database schema dengan 11 main entities
3. Implement grid-based PC visualization (8x5 layout)
4. Build AI OCR pipeline untuk automate logbook entry
5. Test dengan data inventory nyata dari 24 PCs

## Challenges

### Dual Database Compatibility
Problem: SQLite dan PostgreSQL memiliki perbedaan sintaks query (placeholder ? vs $N).
Solution: Custom DB wrapper yang secara otomatis rewrite query placeholders, memungkinkan kode yang sama berjalan di kedua database.

### AI OCR Accuracy
Problem: Logbook tulisan tangan memiliki variasi tulisan, ditto marks, dan singkatan.
Solution: Two-layer AI pipeline (OpenRouter → Gemini) dengan smart prompt engineering yang handle ditto marks, date inference, abbreviation normalization, dan spelling correction. Ditambah Levenshtein-based duplicate detection.

### PC Grid Visualization
Problem: 40 PCs dalam layout 8x5 membutuhkan visualisasi yang intuitif.
Solution: Bootstrap grid dengan color-coded status cards, real-time status updates via vanilla JS polling, dan detail popup untuk spesifikasi lengkap.

### Mobile Deployment
Problem: Sistem perlu dijalankan di Android (Termux) untuk produksi di lab.
Solution: Auto-deploy workflow via SSH + Tailscale, ARM64 cross-compilation, dan environment-based database switching (SQLite dev / PostgreSQL prod).

## Results

Sistem berhasil diimplementasikan dengan hasil:
- 40 PCs ter-monitor dalam grid 8x5 dengan real-time status
- 46 device types dengan asset code generation otomatis
- 14 required software ter-seed dan ter-assign ke PCs
- AI OCR yang mengotomatisasi entry logbook kehadiran
- Dual database compatibility (SQLite dev / PostgreSQL prod)
- Full audit trail untuk seluruh operasi sistem

Sistem ini demonstrate kemampuan membangun enterprise-grade inventory management system dengan Go yang memiliki AI integration, dual database support, dan deployment fleksibel.

---

**Tech Stack**: Go, Gin, Bootstrap, Vanilla JS, SQLite, PostgreSQL, AI OCR (OpenRouter + Gemini)  
**Status**: In Progress - Continuous improvements  
**GitHub**: [github.com/gerrymoeis/lab_kom_sim](https://github.com/gerrymoeis/lab_kom_sim)
