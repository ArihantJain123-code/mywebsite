# OnlineDegrees - Product & Feature Ideas

Welcome to the **OnlineDegrees** idea and roadmap planning document. This file acts as a repository of conceptual features, architectural enhancements, and content strategies to scale the portal.

---

## 🚀 Core Concept
OnlineDegrees is a premium comparison and enrollment helper portal for UGC-DEB and AICTE approved online universities in India. It empowers working professionals and students to match academic goals with verified accredited colleges.

---

## 🛠 Current Feature Set
Here is the baseline of what is currently implemented in the web application:
- **Interactive Course Catalog**: Filter universities dynamically by switchable degrees (MBA, BCA, BBA, MCA, M.Com), max tuition fee budget, NAAC grades (`A++`, `A+`, `A`), and specific accreditations (`UGC-DEB`, `AICTE`, `WES`, `QS Stars`).
- **Interactive Comparison Board**: Select and contrast two universities side-by-side with dynamic visual charts for:
  - *Average Salary Packages* (LPA scale)
  - *Total Tuition Fees* (showing budget comparison)
- **Detailed Modal Panel**: Tap on any university to view tabbed resources:
  - *Overview*: Highlights, background story, and hiring partners.
  - *Fees Structure*: Semester breakdown and EMI/loan calculations.
  - *Placements*: Statistics on job support and recruitment partners.
  - *Reviews*: Real-time student feedback list with an interactive feedback form saved in `localStorage`.
- **Integrated Blog Portal**: Search bar navigation with filtering by key terms and academic categories.

---

## 💡 Future Feature Pipeline

### 1. 🤖 AI-Powered Academic Counselor
*   **Concept**: Integrate a conversational AI chatbot that acts as a digital advisor.
*   **How it works**: The user enters their budget, educational background, interest area, and preference for live lectures vs. pre-recorded modules. The chatbot recommends the top 3 matching universities.
*   **Tech stack**: Open-source LLM API, structured JSON prompt, and custom UI window in `index.html`.

### 2. 📊 Multi-University Comparison Board (3+ Way)
*   **Concept**: Expand the current 2-university restriction to a 3-university comparison matrix.
*   **Enhancements**: 
  - Responsive table layout using horizontal scrolling for comparison cells.
  - Interactive radar charts comparing LMS ratings, fees, alumni networks, and student reviews.

### 3. 🎓 Digital Document Locker & Qualification Pre-Check
*   **Concept**: Allow students to securely upload digital versions of their high school or bachelor transcripts.
*   **Value Proposition**: Automatic validation of minimum marks required (e.g., 50% aggregate for MBA) before redirecting to counselors, saving time on both ends.

### 4. 🧪 LMS Sandbox ("Try Before You Buy")
*   **Concept**: Many universities claim to have superior LMS platforms. Let users log in to a simulated "sandbox" view of each university's online classroom.
*   **Interface**: Demo screens showcasing video playback speed controllers, PDF note-taking utilities, mock exams, and forum discussion threads.

### 5. 👥 Verified Alumni Network & Mentorship
*   **Concept**: Introduce a "Speak with an Alumnus" program.
*   **Workflow**: Users can see profiles of real alumni who graduated from specific online universities and schedule a 15-minute quick call or message them on LinkedIn.

### 6. 🔔 Admission Deadlines & Fee Drops Alert
*   **Concept**: An opt-in notification system (web push notifications or email newsletter) alerting users when:
  - University admission deadlines are 48 hours away.
  - Special scholarship discount campaigns are launched.

---

## 📈 SEO & Marketing Expansion
- **Structured Schema Markup**: Add Product/Course schema snippets on the catalog page so Google displays tuition fees and reviews directly in search engine results pages (SERPs).
- **Interactive Calculators**: Build a "Return on Investment (ROI)" calculator estimating how many months it will take to break even on course tuition fees based on post-graduation average salary gains.
- **University Comparison Landing Pages**: Generate static landing pages targeting specific search queries like `chandigarh-university-vs-amity-online-mba`.
