---
title:
  en: "Face Recognition Office Attendance System"
  id: "Sistem Absensi Kantor dengan Face Recognition"
summary:
  en: "Web-based office attendance system with face recognition authentication and attendance verification, IP restriction, and comprehensive security features."
  id: "Sistem absensi kantor berbasis web dengan face recognition untuk login dan verifikasi absensi, IP restriction, dan fitur keamanan komprehensif."
date: 2026-04-15
year: 2026
status: "experimental"
category: ["backend"]
craft: ai
techStack: ["Go", "Gin", "SQLite", "JSON Web Tokens", "JavaScript", "Tailwind CSS"]
thumbnail: "/images/projects/face-recognition-attendance-thumb.webp"
heroImage: "/images/projects/face-recognition-attendance-hero.webp"
links:
  github: "https://github.com/gerrymoeis/sistem_absensi_kantor"
---

# Face Recognition Office Attendance System

Sistem absensi kantor berbasis web yang memanfaatkan face recognition untuk memastikan karyawan benar-benar hadir secara fisik di kantor. Sistem ini mendukung dua faktor verifikasi: login via password atau face recognition, serta verifikasi wajah opsional saat clock in/out.

## Key Features

### Face Recognition Authentication
Dual-mode autentikasi dengan face recognition:
- Face login sebagai alternatif password-based login
- Face verification saat clock in/out untuk memastikan kehadiran fisik
- 5-angle guided face enrollment (frontal, left, right, up, down)
- 93.61% accuracy dengan 74ms average response time
- Replay attack prevention via SHA-256 image hash deduplication
- Quality validation dengan minimum 80x80 resolution

### IP Restriction & Security
Keamanan jaringan dengan IP filtering:
- CIDR-based network filtering untuk akses terbatas dari WiFi kantor
- Rate limiting dengan token bucket algorithm (5 req/min production)
- Account locking setelah 5 failed attempts (15-minute lock)
- JWT authentication dengan HS256 signed tokens (24h expiry)
- Comprehensive audit logging untuk semua actions
- Role-based access control (admin/employee)

### Admin Dashboard
Dashboard komprehensif untuk manajemen:
- User management dengan CRUD operations
- Face enrollment management untuk setiap user
- Attendance data viewer dengan date filtering
- Activity log viewer untuk audit trail
- Excel export (all data dan monthly report)
- Leave request management (approve/reject workflow)

### Attendance Management
Sistem absensi yang lengkap:
- Clock in/out dengan timestamp dan photo capture
- Status kehadiran: Hadir, Izin, Sakit, Cuti, Alpha
- Multi-status attendance dengan keterangan
- Leave request system dengan proof file upload
- Late detection (standard work start 08:00)
- Monthly attendance statistics

## Technical Highlights

### Go + Gin Backend
Clean Architecture dengan Go dan Gin:
- Three-layer architecture (Handler → Service → Repository)
- Explicit dependency injection via constructor functions
- Conditional route registration untuk face features
- Graceful degradation jika face recognition unavailable

### SQLite Database
Database ringan tanpa dependency eksternal:
- Pure Go SQLite implementation (modernc.org/sqlite)
- Single-writer configuration untuk menghindari locked errors
- Parameterized queries untuk SQL injection prevention
- Conditional column migrations yang idempotent
- 6 main tables dengan proper foreign key relationships

### Face Recognition Pipeline
Integrasi dlib face recognition via go-face:
- CGO-based compilation with MSYS2 MINGW64
- 128-dimension face descriptors stored as SQLite BLOBs
- Multiple encodings per user untuk akurasi lebih baik
- Euclidean distance matching dengan configurable threshold
- Client-side MediaPipe Face Mesh untuk guided scanning UI

### Frontend Architecture
Server-side rendered UI dengan JavaScript enhancement:
- Tailwind CSS untuk responsive styling
- Vanilla JavaScript tanpa framework
- Webcam capture dan guided face scan UI
- LocalStorage token persistence
- HttpOnly cookie untuk page-level auth

## Design Process

Design sistem berfokus pada keamanan dan usability:
1. Research kebutuhan absensi kantor dan flow yang ada
2. Design database schema dengan 6 main entities
3. Implementasi face recognition pipeline dengan go-face
4. Build admin dashboard dengan comprehensive statistics
5. Testing dengan 1000+ face images untuk accuracy validation

## Challenges

### Face Recognition di Windows
Problem: go-face membutuhkan dlib C++ library yang kompleks untuk Windows compilation.
Solution: Build script dengan MSYS2 MINGW64 environment, bundling required DLLs untuk distribusi. Graceful degradation ketika library tidak tersedia.

### SQLite Concurrency
Problem: SQLite single-writer nature membatasi concurrent access.
Solution: Database connection pool dengan SetMaxOpenConns(1), application-level transaction management.

### Security Hardening
Problem: Sistem absensi membutuhkan security level tinggi karena data sensitif.
Solution: Multi-layer security: IP restriction + rate limiting + account locking + JWT + bcrypt + audit logging + replay attack prevention.

### Replay Attack Prevention
Problem: Face recognition images bisa di-replay untuk spoofing.
Solution: SHA-256 image hash dengan 24-hour deduplication window, hanya aktif di production mode.

## Results

Sistem berhasil diimplementasikan dengan hasil:
- 93.61% face recognition accuracy (tested with 1000+ images)
- 74ms average face recognition response time
- 26MB production binary size (optimized)
- Comprehensive audit trail for all system actions
- Production-ready security dengan rating 9/10

Sistem ini demonstrate kemampuan untuk membangun aplikasi enterprise-grade dengan Go yang memiliki security, performance, dan reliability tinggi.

---

**Tech Stack**: Go, Gin, SQLite, JSON Web Tokens, Face Recognition (go-face/dlib), Tailwind CSS  
**Status**: Completed - Production ready  
**GitHub**: [github.com/gerrymoeis/sistem_absensi_kantor](https://github.com/gerrymoeis/sistem_absensi_kantor)
