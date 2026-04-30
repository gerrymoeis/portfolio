---
title:
  en: "AI for Data Extraction: From Brittle Regex to Context-Aware Systems"
  id: "AI untuk Ekstraksi Data: Dari Regex Rapuh ke Sistem yang Paham Konteks"
date: 2026-04-30
summary:
  en: "How AI transformed data extraction from Instagram captions - from fragile pattern matching to systems that actually understand context."
  id: "Bagaimana AI mengubah ekstraksi data dari caption Instagram - dari pattern matching yang rapuh ke sistem yang benar-benar paham konteks."
tags: ["ai", "data-extraction", "automation", "python"]
---

<div data-bilingual>
<div data-lang="en">

# AI for Data Extraction: From Brittle Regex to Context-Aware Systems

A few months ago I built a system to scrape Instagram posts about competitions and events. The goal was simple: grab data from captions, extract important information (title, dates, contact, URLs), then insert into database. Sounds straightforward, but turned out way trickier than I thought.

## The Problem: Messy Text

Instagram captions are chaos. Everyone writes with different styles. Some are neat, some are random. Date formats vary - "1-14 April 2026", "DL: April 15", "Registration opens April 1 to April 14". Important info sometimes in caption, sometimes only in poster image. Language mixed between Indonesian and English.

Manual extraction? Too time-consuming. Hundreds of posts per week, extracting one by one? No way. Had to be automated.

## First Approach: Regex Hell

Initially I tried regex. Standard approach right - create patterns to extract dates, phone numbers, URLs.

```python
date_pattern = r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}'
dates = re.findall(date_pattern, caption)
```

The problem? Regex is extremely brittle. Format changes slightly, immediately breaks. Worse, regex doesn't understand context. If there are two dates in one caption - which is registration deadline, which is event date? Regex can't distinguish.

Then edge cases started appearing. "April Blake" detected as the month April. "Justice Hope" considered an organization. Every time there's a new format, need new regex. Maintenance nightmare.

Research from arXiv (2025) shows traditional NER tools like NLTK and spaCy indeed struggle with ambiguous entities like this. NLTK only gets F1-score 0.846 for person names, and often misclassifies "Justice" or "Hope" as non-person names [1].

## Enter: Large Language Models

Then I tried a different approach - using Google Gemini. Instead of pattern matching, give the LLM the whole caption and ask it to extract structured data.

The difference was dramatic. LLM actually understands context. "April Blake" recognized as person name, not month. "Registration: 1-14 April" vs "Event: April 20" - LLM knows the first is registration date, second is event date.

More impressive, LLM can extract relationships. Not just "ZnO" and "catalyst" as separate entities, but understands that ZnO *is used as* catalyst. Research from Nature Communications (2024) shows GPT-3 and Llama-2 can perform "joint named entity recognition and relation extraction" with much higher accuracy than traditional methods - F1-score 0.824 vs 0.496 for traditional seq2rel method [2].

## Real Example

Input caption:
```
📢 POSTER DESIGN COMPETITION 2026
Registration: April 1-14, 2026
Event: April 20, 2026
Free! 🎉
Info: 08123456789
```

LLM output:
```json
{
  "title": "Poster Design Competition 2026",
  "registration_date": "April 1, 2026 - April 14, 2026",
  "event_date": "April 20, 2026",
  "fee_type": "free",
  "contact": "08123456789"
}
```

LLM automatically distinguishes registration vs event date, parses date range correctly, extracts "free" as fee type, and normalizes phone number format. All without explicit rules. Just clear instructions in the prompt.

## Hybrid Approach

But pure LLM approach isn't perfect either. API calls have cost (though small), and sometimes LLM misses simple patterns. So I implemented 3-layer fallback:

Primary layer uses LLM - handles 85-95% of cases. If LLM misses something obvious (like phone number with standard format), regex fallback kicks in. If caption lacks complete info, OCR extracts text from poster image, then LLM processes OCR output.

This hybrid approach significantly improved extraction accuracy. LLM handles majority of cases, regex catches simple patterns LLM misses, and OCR handles edge cases where information is only in images.

## Training Data: Surprisingly Little

One of LLMs' biggest advantages - doesn't need massive training data. Traditional BERT-based NER needs hundreds of thousands of samples. LLM fine-tuning needs hundreds. In my case, zero-shot prompting (no fine-tuning at all) was enough. Just clear instructions and a few examples in the prompt [2].

## Cost Reality Check

Gemini Flash-Lite (free tier) with batch processing:
- 168 posts processed in ~15 minutes
- 7 API requests (batch 25 posts per request)
- API usage: 0.28% of daily capacity
- Cost: $0

For production system with hundreds of posts per day, cost is still negligible. And time saved from manual extraction? Massive.

## When to Use LLM vs Traditional Methods?

LLMs are powerful for unstructured data where context matters. If data is highly standardized with consistent format, traditional regex might be sufficient and cheaper. But when dealing with real-world messy data like social media posts, LLMs are game changers.

Research shows LLMs consistently outperform traditional methods for context-sensitive tasks. Gemini achieves F1-score 0.960 for person name recognition including ambiguous cases, compared to NLTK's 0.846 [1]. For relationship extraction, the gap is even larger [2].

## Takeaway

AI LLMs aren't just for generating code. Real value is automating tasks that previously required significant human effort. Extracting structured data from unstructured text is one of the best use cases.

What used to take months of manual feature engineering and hundreds of thousands of training samples can now be done in days with hundreds of samples (or even zero-shot). This is a fundamental paradigm shift in information extraction.

---

**References:**

[1] Latifi, P. (2025). "Comparing Traditional NLP Tools and Large Language Models on Ambiguous Entities." arXiv:2509.12098v1. https://arxiv.org/html/2509.12098v1

[2] Dagdelen, J., et al. (2024). "Structured information extraction from scientific text with large language models." Nature Communications, 15, 1418. https://doi.org/10.1038/s41467-024-45563-x

---

**Tech Stack**: Python, Google Gemini API, Javascript, Playwright, PostgreSQL, NeonDB  
**Related**: Information Extraction, NLP, Data Engineering

</div>
<div data-lang="id">

# AI untuk Ekstraksi Data: Dari Regex Rapuh ke Sistem yang Paham Konteks

Beberapa bulan lalu saya bikin sistem untuk scrape postingan Instagram tentang kompetisi dan event. Tujuannya simpel: ambil data dari caption, ekstrak informasi penting (judul, tanggal, kontak, URL), terus masukkan ke database. Kedengarannya straightforward, tapi ternyata jauh lebih tricky dari yang saya kira.

## Masalahnya: Teks yang Berantakan

Caption Instagram itu chaos. Semua orang nulis dengan gaya berbeda-beda. Ada yang rapi, ada yang random. Format tanggal bervariasi - "1-14 April 2026", "DL: 15 April", "Pendaftaran dibuka 1 April sampai 14 April". Info penting kadang di caption, kadang cuma di gambar poster. Bahasa campur antara Indonesia dan Inggris.

Ekstraksi manual? Terlalu memakan waktu. Ratusan post per minggu, ekstrak satu-satu? Gak mungkin. Harus diotomasi.

## Pendekatan Pertama: Neraka Regex

Awalnya saya coba regex. Pendekatan standar kan - bikin pattern untuk ekstrak tanggal, nomor telepon, URL.

```python
date_pattern = r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}'
dates = re.findall(date_pattern, caption)
```

Masalahnya? Regex itu sangat brittle. Format berubah sedikit, langsung rusak. Lebih parah lagi, regex gak ngerti konteks. Kalau ada dua tanggal dalam satu caption - mana yang deadline pendaftaran, mana yang tanggal event? Regex gak bisa bedain.

Terus mulai muncul edge case. "April Blake" terdeteksi sebagai bulan April. "Justice Hope" dianggap organisasi. Setiap kali ada format baru, perlu regex baru. Maintenance nightmare.

Riset dari arXiv (2025) menunjukkan tools NER tradisional seperti NLTK dan spaCy memang struggle dengan entitas ambigu seperti ini. NLTK cuma dapat F1-score 0.846 untuk nama orang, dan sering salah klasifikasi "Justice" atau "Hope" sebagai bukan nama orang [1].

## Masuk: Large Language Model

Terus saya coba pendekatan berbeda - pakai Google Gemini. Daripada pattern matching, kasih LLM seluruh caption dan minta dia ekstrak data terstruktur.

Bedanya dramatis. LLM beneran ngerti konteks. "April Blake" dikenali sebagai nama orang, bukan bulan. "Pendaftaran: 1-14 April" vs "Event: 20 April" - LLM tahu yang pertama tanggal pendaftaran, kedua tanggal event.

Lebih impressive lagi, LLM bisa ekstrak relasi. Bukan cuma "ZnO" dan "katalis" sebagai entitas terpisah, tapi paham bahwa ZnO *digunakan sebagai* katalis. Riset dari Nature Communications (2024) menunjukkan GPT-3 dan Llama-2 bisa melakukan "joint named entity recognition and relation extraction" dengan akurasi jauh lebih tinggi dari metode tradisional - F1-score 0.824 vs 0.496 untuk metode seq2rel tradisional [2].

## Contoh Nyata

Input caption:
```
📢 LOMBA DESAIN POSTER 2026
Pendaftaran: 1-14 April 2026
Event: 20 April 2026
Gratis! 🎉
Info: 08123456789
```

Output LLM:
```json
{
  "title": "Lomba Desain Poster 2026",
  "registration_date": "1 April 2026 - 14 April 2026",
  "event_date": "20 April 2026",
  "fee_type": "gratis",
  "contact": "08123456789"
}
```

LLM otomatis bedain tanggal pendaftaran vs event, parse date range dengan benar, ekstrak "gratis" sebagai tipe biaya, dan normalisasi format nomor telepon. Semua tanpa aturan eksplisit. Cukup instruksi jelas di prompt.

## Pendekatan Hybrid

Tapi pendekatan pure LLM juga gak sempurna. API call ada biayanya (meski kecil), dan kadang LLM miss pattern sederhana. Jadi saya implementasi 3-layer fallback:

Layer primary pakai LLM - handle 85-95% kasus. Kalau LLM miss sesuatu yang obvious (seperti nomor telepon dengan format standar), regex fallback kick in. Kalau caption kurang info lengkap, OCR ekstrak teks dari gambar poster, terus LLM proses output OCR.

Pendekatan hybrid ini secara signifikan meningkatkan akurasi ekstraksi. LLM handle mayoritas kasus, regex catch pattern sederhana yang LLM miss, dan OCR handle edge case dimana informasi hanya ada di gambar.

## Training Data: Surprisingly Little

Salah satu keunggulan terbesar LLM - gak butuh training data masif. NER berbasis BERT tradisional butuh ratusan ribu sample. Fine-tuning LLM butuh ratusan. Di kasus saya, zero-shot prompting (tanpa fine-tuning sama sekali) sudah cukup. Cukup instruksi jelas dan beberapa contoh di prompt [2].

## Realita Biaya

Gemini Flash-Lite (free tier) dengan batch processing:
- 168 post diproses dalam ~15 menit
- 7 API request (batch 25 post per request)
- Penggunaan API: 0.28% dari kapasitas harian
- Biaya: $0

Untuk sistem produksi dengan ratusan post per hari, biaya masih negligible. Dan waktu yang dihemat dari ekstraksi manual? Massive.

## Kapan Pakai LLM vs Metode Tradisional?

LLM powerful untuk unstructured data dimana konteks penting. Kalau data sangat terstandarisasi dengan format konsisten, regex tradisional mungkin cukup dan lebih murah. Tapi ketika dealing dengan data messy dunia nyata seperti social media post, LLM adalah game changer.

Riset menunjukkan LLM konsisten outperform metode tradisional untuk task yang context-sensitive. Gemini mencapai F1-score 0.960 untuk pengenalan nama orang termasuk kasus ambigu, dibanding NLTK yang 0.846 [1]. Untuk ekstraksi relasi, gapnya bahkan lebih besar [2].

## Kesimpulan

AI LLM bukan cuma untuk generate code. Value sebenarnya adalah mengotomasi task yang sebelumnya butuh effort manusia signifikan. Ekstrak data terstruktur dari teks unstructured adalah salah satu use case terbaik.

Yang dulu butuh berbulan-bulan manual feature engineering dan ratusan ribu training sample sekarang bisa dilakukan dalam hitungan hari dengan ratusan sample (atau bahkan zero-shot). Ini adalah paradigm shift fundamental dalam information extraction.

---

**Referensi:**

[1] Latifi, P. (2025). "Comparing Traditional NLP Tools and Large Language Models on Ambiguous Entities." arXiv:2509.12098v1. https://arxiv.org/html/2509.12098v1

[2] Dagdelen, J., et al. (2024). "Structured information extraction from scientific text with large language models." Nature Communications, 15, 1418. https://doi.org/10.1038/s41467-024-45563-x

---

**Tech Stack**: Python, Google Gemini API, Javascript, Playwright, PostgreSQL, NeonDB  
**Related**: Information Extraction, NLP, Data Engineering

</div>
</div>
