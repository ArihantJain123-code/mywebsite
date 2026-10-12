# 🌐 Master SEO, GEO & AEO Strategy Guide
**Platform:** OnlineDegrees ([https://www.getonlinedegrees.online/](https://www.getonlinedegrees.online/))  
**Last Updated:** October 12, 2026  
**Status:** Fully Deployed & Verified  

---

## Executive Overview

This document details the multi-engine search architecture implemented across **OnlineDegrees**, optimizing the website for:
1. **SEO (Search Engine Optimization):** Google & Bing algorithmic search rankings.
2. **GEO (Generative Engine Optimization):** Citation, retrieval, and recommendation by AI models (ChatGPT, SearchGPT, Perplexity AI, Google Gemini, Claude, Apple Intelligence).
3. **AEO (Answer Engine Optimization):** Zero-click direct answers in Google AI Overviews, Featured Snippets (Position 0), People Also Ask (PAA), and voice search (Google Assistant, Siri, Alexa).

---

## 🏛️ Tri-Pillar Architecture Breakdown

```
                                    OnlineDegrees
                         [https://www.getonlinedegrees.online]
                                       |
        +------------------------------+------------------------------+
        |                              |                              |
      ▼ SEO                          ▼ GEO                          ▼ AEO
Search Engines                 Generative AI                  Answer Engines
(Google / Bing)             (ChatGPT / Perplexity / Gemini)  (AI Overviews / Siri)
  • Clean Canonical URLs       • llms.txt & llms-full.txt      • Speakable Schema
  • XML Sitemaps (IndexNow)    • 14 AI Crawlers Unlocked       • FAQPage Structured Data
  • Internal Link Equity       • Factual Citation Grounding    • HowTo & WebApp Schemas
  • Core Web Vitals (Defer)    • Quantifiable Data Matrices    • 45-Word Snippet Blocks
```

---

## 1. 🤖 GEO (Generative Engine Optimization) Implementations

Generative Engine Optimization ensures that when users ask AI tools questions like *"What is the passing mark for CAT 2026?"*, *"Is Amity Online MBA valid for government jobs?"*, or *"Which university offers the cheapest online MBA in India?"*, the AI retrieves and cites **OnlineDegrees**.

### A. The `llms.txt` and `llms-full.txt` Standard
Following the Jeremy Howard / Answer.ai standard adopted across modern LLMs:
- **[`llms.txt`](file:///d:/mywebsite/llms.txt):** Executive knowledge digest providing AI models with a high-level summary of statutory approvals (UGC-DEB Clause 22, AICTE, NAAC, WES), core degree hubs, interactive tools (CAT Score Calculator, Compare Board, Resume Builder), and verified university highlights.
- **[`llms-full.txt`](file:///d:/mywebsite/llms-full.txt):** In-depth RAG grounding manifest containing:
  - **Statutory Regulatory Framework:** Full legal citation of UGC (ODL and Online Programmes) Regulations 2020 Clause 22.
  - **CAT 2026 Raw Marks vs Percentile Benchmark Table:** Accurate score-to-percentile calibrations across the 66-question (198-mark) pattern.
  - **CAT Normalization Algorithms:** Equipercentile equating across Slot 1, Slot 2, and Slot 3.
  - **University Comparison Table:** Tuition fees, NAAC grades, placement percentages, and hiring partners across top universities.
  - **34 Verified University Reviews Directory:** Clean canonical URLs for all institution profiles.
  - **Non-Tech to IT Transition Roadmaps:** Bridge course structures for online MCA/BCA.
  - **Grounding FAQs:** Formatted specifically for chunk retrieval in RAG pipelines.

### B. Unrestricted AI Crawler Access in `robots.txt`
In [robots.txt](file:///d:/mywebsite/robots.txt), explicit crawl permissions and direct links to the LLM manifests are granted to **14 major AI crawlers**:
- **OpenAI:** `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`
- **Anthropic:** `ClaudeBot`, `anthropic-ai`
- **Perplexity:** `PerplexityBot`
- **Google:** `Google-Extended`, `GoogleOther`
- **Meta:** `Meta-ExternalAgent`
- **Apple:** `Applebot-Extended`
- **Amazon:** `Amazonbot`
- **Cohere:** `cohere-ai`
- **ByteDance:** `ByteSpider`
- **Foundational / Knowledge Graphs:** `CCBot` (Common Crawl), `Diffbot`

---

## 2. 🎯 AEO (Answer Engine Optimization) Implementations

Answer Engine Optimization targets direct answer extracts, featured snippets, Google AI Overviews, and voice queries.

### A. Speakable Specification Schema (`schema.org/SpeakableSpecification`)
Implemented across:
- [index.html](file:///d:/mywebsite/index.html) (`.genz-hero-subtitle`, `.faq-answer-inner`, `.trust-card-body`)
- [cat-score-calculator.html](file:///d:/mywebsite/cat-score-calculator.html) (`.cat-hero-sub`, `.cat-faq-body`, `.guide-box p`)
- Degree hubs ([`online-mba.html`](file:///d:/mywebsite/online-mba.html), `online-mca.html`, `online-bca.html`, `online-bba.html`, `online-mcom.html`)
- Core tools ([`compare.html`](file:///d:/mywebsite/compare.html), `blog.html`, `resume-builder.html`)
- All 43 pre-rendered editorial articles and university reviews via [build_all_blogs.ps1](file:///d:/mywebsite/build_all_blogs.ps1).

**Benefit:** Voice search agents (Google Assistant, Siri, Alexa) read verbatim sentences from these targeted elements when users ask spoken questions.

### B. Snippet Formula & Direct Answer Blocks
- Every editorial article includes a pre-rendered **Quick Summary AEO Box** (`.aeo-answer-block`) placed directly above the article body.
- Accordion FAQs are authored in the **45–60 word snippet format**: an active-voice, factual answer in the first sentence, followed by specific regulatory or numeric facts.

### C. Rich Schema.org JSON-LD Hierarchy
The site now serves a comprehensive graph of pre-rendered structured data:
- `WebSite` with `SearchAction`
- `Organization` with contact points and headquarters info
- `BreadcrumbList` for breadcrumb hierarchy in SERPs
- `FAQPage` with high-impact, natural language student questions
- `WebApplication` / `SoftwareApplication` on tools (CAT Calculator, Resume Builder, Compare Board)
- `HowTo` schema detailing response sheet verification procedures
- `EducationalOrganization` on all 34 individual university reviews

---

## 3. 🔍 Technical & On-Page SEO Overhaul

### A. Canonical URLs & Query Elimination
- The SPA router in [index.html](file:///d:/mywebsite/index.html) dynamically maps legacy query parameter views (`/?view=catalog&course=mba`, `/?view=compare`) directly to clean canonical URLs (`/online-mba`, `/compare`, `/cat-score-calculator`).
- In [robots.txt](file:///d:/mywebsite/robots.txt), `Disallow: /*?view=*` prevents crawlers from wasting crawl budget on duplicate query pages.

### B. Internal Link Network
- The new flagship tool, [CAT 2026 Score Calculator](file:///d:/mywebsite/cat-score-calculator.html), is integrated into the site header navigation and sidebar across the entire domain:
  - Homepage navigation bar
  - Degree hubs (`online-mba.html`, `online-mca.html`, `online-bca.html`, etc.)
  - Tools (`compare.html`, `resume-builder.html`, `blog.html`, `contact.html`)
  - All 43 university reviews and pillar guides
- Contextual cross-links connect the CAT Calculator to Online MBA programs as a direct Plan-B alternative for students with scores below the 85th percentile.

### C. Sitemaps & Instant IndexNow Submission
- **`sitemap_index.xml`:** Parent sitemap linking core pages and articles.
- **`sitemap.xml`:** 14 core landing pages and tools.
- **`sitemap_articles.xml`:** 43 pre-rendered editorial guides and university reviews.
- All sitemaps are refreshed with `lastmod: 2026-10-12`.

---

## 🛠️ Webmaster Quick Command Reference

Whenever you update university data, publish new blog articles, or modify course details, run the following automated pipeline:

### 1. Re-generate Degree Hubs SEO
```powershell
powershell -ExecutionPolicy Bypass -File d:\mywebsite\sync_degree_hubs_seo.ps1
```

### 2. Re-generate Core Tools & Pillar Articles
```powershell
powershell -ExecutionPolicy Bypass -File d:\mywebsite\build_full_site.ps1
```

### 3. Re-generate All 43 Blog & Review Pages
```powershell
powershell -ExecutionPolicy Bypass -File d:\mywebsite\build_all_blogs.ps1
```

### 4. Refresh XML Sitemaps
```powershell
powershell -ExecutionPolicy Bypass -File d:\mywebsite\update_sitemaps.ps1
```

### 5. Instant Push to Bing / IndexNow
```powershell
powershell -ExecutionPolicy Bypass -File d:\mywebsite\ping_search_engines.ps1
```

---

## 📊 Verification & Tracking Checklist

1. **Bing & Partner Engines:**
   - [IndexNow Key](file:///d:/mywebsite/e7f2b1a8c9d4e5f6a7b8c9d0e1f2a3b4.txt) verified.
   - Pings succeed with HTTP 200 OK.
2. **Google Search Console:**
   - DNS verification active (`google-site-verification=X73PWSuzwFFpFYBdR7lBB7q6ef-8gNznk1Lm6Cx7tAw`).
   - Sitemaps submitted: `https://www.getonlinedegrees.online/sitemap_index.xml`.
   - Request indexing on `https://www.getonlinedegrees.online/cat-score-calculator` via URL Inspection.
3. **AI Search Citation Auditing:**
   - Test Perplexity AI queries: *"How to calculate CAT 2026 score from response sheet?"*, *"Is online MBA valid in India UGC DEB?"*
   - Verify that answers cite `getonlinedegrees.online`.
