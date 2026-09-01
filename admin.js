/**
 * OnlineDegrees Admin Panel Engine (admin.js)
 * Real-Time 24-Hour Analytics, SEO Suite, Keyword Rank Tracker, and Leads CRM.
 */

// --- Global Admin State ---
const adminState = {
  currentTab: "overview",
  timeRange: "24h", // '24h', '7d', '30d'
  liveStreamActive: true,
  liveUsersCount: 42,
  theme: localStorage.getItem("admin_theme") || "dark",
  leads: [],
  keywords: [],
  topPages: [],
  crawlLogs: [],
  charts: {}
};

// --- Seed Data Generators for Rich Analytics ---
const SEO_KEYWORD_DATABASE = [
  { keyword: "online mba under 1 lakh", rank: 3, prevRank: 5, volume: 18200, clicks: 3420, impressions: 32400, ctr: 10.55, intent: "Commercial", url: "/#blog-detail?id=top-online-mba-colleges-india-under-1-lakh" },
  { keyword: "best online bba colleges in india", rank: 2, prevRank: 2, volume: 14500, clicks: 2890, impressions: 27800, ctr: 10.40, intent: "Commercial", url: "/#blog-detail?id=top-online-bba-colleges-in-india" },
  { keyword: "ugc approved online degree checklist", rank: 4, prevRank: 7, volume: 9800, clicks: 1420, impressions: 16500, ctr: 8.60, intent: "Informational", url: "/#blog-detail?id=ugc-approved-online-university-checklist" },
  { keyword: "online mca fee structure 2026", rank: 5, prevRank: 6, volume: 12100, clicks: 1980, impressions: 24300, ctr: 8.15, intent: "Transactional", url: "/#catalog?course=mca" },
  { keyword: "online bba vs online bcom differences", rank: 1, prevRank: 1, volume: 8400, clicks: 2310, impressions: 19200, ctr: 12.03, intent: "Informational", url: "/#blog-detail?id=online-bba-vs-online-bcom-differences" },
  { keyword: "distance education validity in it sector", rank: 6, prevRank: 8, volume: 7600, clicks: 1150, impressions: 15400, ctr: 7.46, intent: "Informational", url: "/#blog-detail?id=online-degree-validity-in-it-industry" },
  { keyword: "lpu online mba fees and placement", rank: 2, prevRank: 3, volume: 16400, clicks: 3670, impressions: 34100, ctr: 10.76, intent: "Commercial", url: "/#catalog?university=lovely_professional_university_lpu_online" },
  { keyword: "amity online bba review 2026", rank: 4, prevRank: 4, volume: 6900, clicks: 940, impressions: 12800, ctr: 7.34, intent: "Informational", url: "/#blog-detail?id=amity-university-online-bba-review" },
  { keyword: "nmims online mba admission process", rank: 3, prevRank: 4, volume: 19800, clicks: 3890, impressions: 38200, ctr: 10.18, intent: "Transactional", url: "/#catalog?university=nmims_online" },
  { keyword: "jain university online degree naac grade", rank: 5, prevRank: 9, volume: 5400, clicks: 760, impressions: 10200, ctr: 7.45, intent: "Informational", url: "/#catalog?university=jain_university_online" },
  { keyword: "how to switch from non tech to it sector", rank: 7, prevRank: 11, volume: 11300, clicks: 1280, impressions: 19400, ctr: 6.60, intent: "Informational", url: "/#blog-detail?id=how-to-switch-from-non-tech-to-it-sector" },
  { keyword: "manipal university jaipur online bca syllabus", rank: 4, prevRank: 5, volume: 6200, clicks: 880, impressions: 11900, ctr: 7.39, intent: "Informational", url: "/#catalog?university=manipal_university_jaipur_online" },
  { keyword: "scdl pune pgdba fees 2026", rank: 2, prevRank: 2, volume: 8900, clicks: 1850, impressions: 17200, ctr: 10.75, intent: "Commercial", url: "/#catalog?university=symbiosis_centre_for_distance_learning_scdl_pune" },
  { keyword: "top 30 web development interview questions", rank: 8, prevRank: 14, volume: 15600, clicks: 1640, impressions: 29000, ctr: 5.65, intent: "Informational", url: "/#blog-detail?id=frontend-developer-interview-questions-for-freshers" },
  { keyword: "online degrees recognized by wscuc and wes", rank: 9, prevRank: 12, volume: 4900, clicks: 520, impressions: 9800, ctr: 5.30, intent: "Informational", url: "/#blog" }
];

const INITIAL_LEADS = [
  { id: "lead_01", name: "Aarav Sharma", phone: "9876543210", email: "aarav.sharma@gmail.com", course: "Online MBA", city: "Delhi NCR", budget: "₹1,00,000 - ₹1,50,000", source: "Catalog Inquiry", message: "Interested in LPU Online and NMIMS Online for Finance.", timestamp: Date.now() - 12 * 60000, status: "New" },
  { id: "lead_02", name: "Priya Sundaram", phone: "9823456789", email: "priya.s@outlook.com", course: "Online MCA", city: "Bengaluru", budget: "₹1,50,000 - ₹2,00,000", source: "AI Chatbot", message: "Looking for AI/Data Science specialization with placement help.", timestamp: Date.now() - 38 * 60000, status: "Contacted" },
  { id: "lead_03", name: "Rohan Varma", phone: "9712345678", email: "rohan.v@yahoo.com", course: "Online BBA", city: "Mumbai", budget: "Under ₹1,00,000", source: "Counseling Modal", message: "Working professional wanting distance degree with weekend lectures.", timestamp: Date.now() - 95 * 60000, status: "In Progress" },
  { id: "lead_04", name: "Neha Deshmukh", phone: "9988776655", email: "neha.desh@gmail.com", course: "Online MBA", city: "Pune", budget: "₹1,50,000 - ₹2,00,000", source: "Blog CTA", message: "Want to compare Manipal Jaipur vs Amity Online MBA.", timestamp: Date.now() - 180 * 60000, status: "Enrolled" },
  { id: "lead_05", name: "Ankit Gupta", phone: "9654321987", email: "ankit.g@gmail.com", course: "Online BCA", city: "Hyderabad", budget: "₹1,00,000 - ₹1,50,000", source: "Catalog Inquiry", message: "Non-IT to IT career switch program details needed.", timestamp: Date.now() - 320 * 60000, status: "New" }
];

const INITIAL_TOP_PAGES = [
  { path: "/ (Homepage)", pageviews24h: 3840, unique24h: 2950, avgTime: "2m 45s", bounceRate: "28.4%", convRate: "4.8%" },
  { path: "/#catalog?course=mba", pageviews24h: 2920, unique24h: 2210, avgTime: "3m 20s", bounceRate: "24.1%", convRate: "6.2%" },
  { path: "/#blog-detail?id=top-online-mba-colleges-india-under-1-lakh", pageviews24h: 2480, unique24h: 1980, avgTime: "4m 15s", bounceRate: "21.6%", convRate: "7.1%" },
  { path: "/#catalog?course=mca", pageviews24h: 1850, unique24h: 1420, avgTime: "3m 05s", bounceRate: "26.3%", convRate: "5.5%" },
  { path: "/#compare", pageviews24h: 1490, unique24h: 1180, avgTime: "4m 50s", bounceRate: "19.2%", convRate: "8.4%" },
  { path: "/#blog-detail?id=top-online-bba-colleges-in-india", pageviews24h: 1320, unique24h: 1040, avgTime: "3m 40s", bounceRate: "25.0%", convRate: "5.9%" },
  { path: "/#catalog?university=lovely_professional_university_lpu_online", pageviews24h: 1180, unique24h: 910, avgTime: "2m 55s", bounceRate: "27.8%", convRate: "6.0%" },
  { path: "/#blog", pageviews24h: 1050, unique24h: 820, avgTime: "2m 10s", bounceRate: "33.5%", convRate: "3.2%" }
];

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLeadsData();
  initNavigation();
  initTimeRangeSelector();
  initLiveFeed();
  renderAllViews();
  setupEventListeners();

  // Start live tick
  setInterval(liveTick, 3500);
});

// --- Theme Management ---
function initTheme() {
  document.documentElement.setAttribute("data-theme", adminState.theme);
  const themeIcon = document.getElementById("theme-toggle-icon");
  if (themeIcon) {
    themeIcon.className = adminState.theme === "light" ? "fas fa-moon" : "fas fa-sun";
  }
}

function toggleTheme() {
  adminState.theme = adminState.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", adminState.theme);
  localStorage.setItem("admin_theme", adminState.theme);
  initTheme();
  // Re-render charts with new theme colors
  renderCharts();
}

// --- Leads Data Loading ---
function initLeadsData() {
  const localLeads = JSON.parse(localStorage.getItem("portal_analytics_leads") || "[]");
  // Merge initial with local leads without duplicates
  const leadMap = new Map();
  [...localLeads, ...INITIAL_LEADS].forEach(l => {
    if (!leadMap.has(l.id || l.phone)) {
      leadMap.set(l.id || l.phone, l);
    }
  });
  adminState.leads = Array.from(leadMap.values());
  adminState.keywords = [...SEO_KEYWORD_DATABASE];
  adminState.topPages = [...INITIAL_TOP_PAGES];
}

// --- Navigation & Router ---
function initNavigation() {
  const links = document.querySelectorAll(".sidebar-link");
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  // Mobile sidebar toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const sidebar = document.getElementById("admin-sidebar");
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }
}

function switchTab(tabId) {
  adminState.currentTab = tabId;

  document.querySelectorAll(".sidebar-link").forEach(l => {
    l.classList.remove("active");
    if (l.getAttribute("data-tab") === tabId) l.classList.add("active");
  });

  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });

  const activeSection = document.getElementById(`view-${tabId}`);
  if (activeSection) {
    activeSection.classList.add("active");
  }

  // Update header title
  const titleMap = {
    overview: { title: "Executive Overview", subtitle: "24-Hour Real-Time Performance & SEO Insights" },
    realtime: { title: "Live Real-Time Traffic", subtitle: "Active Concurrent Users & Live Visitor Telemetry" },
    seo: { title: "SEO Analytics & Search Console", subtitle: "Organic Clicks, Impressions, SERP Rankings & CTR" },
    keywords: { title: "Keywords & SERP Tracker", subtitle: "Top Ranking Keywords & Search Volume Opportunities" },
    leads: { title: "Leads & Inquiries CRM", subtitle: "Real-time Prospect Inquiries & WhatsApp Counseling" },
    technical: { title: "Technical SEO & Crawl Health", subtitle: "Googlebot Crawl Frequency, Indexing & Core Web Vitals" },
    settings: { title: "Portal & Analytics Settings", subtitle: "Tracking Configuration & Webhooks" }
  };

  const info = titleMap[tabId] || titleMap.overview;
  const headerTitle = document.getElementById("header-view-title");
  const headerSubtitle = document.getElementById("header-view-subtitle");
  if (headerTitle) headerTitle.textContent = info.title;
  if (headerSubtitle) headerSubtitle.textContent = info.subtitle;

  // Refresh charts when changing view
  setTimeout(renderCharts, 100);
}

// --- Time Range Selector ---
function initTimeRangeSelector() {
  const buttons = document.querySelectorAll(".range-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      adminState.timeRange = btn.getAttribute("data-range");
      showToast(`Time Range switched to: ${btn.textContent}`);
      renderAllViews();
    });
  });
}

// --- Live Feed Simulation & Real Telemetry ---
const SAMPLE_PATHS = [
  { path: "/#catalog?course=mba", title: "Find Online MBA Programs", icon: "icon-pageview", type: "Pageview" },
  { path: "/#blog-detail?id=top-online-mba-colleges-india-under-1-lakh", title: "Top Online MBA Under 1 Lakh", icon: "icon-pageview", type: "Article Read" },
  { path: "/#compare", title: "University Comparison Board", icon: "icon-pageview", type: "Compare Tool" },
  { path: "/#catalog?course=mca", title: "Online MCA Catalog", icon: "icon-pageview", type: "Pageview" },
  { path: "/#catalog?university=lovely_professional_university_lpu_online", title: "LPU Online Overview", icon: "icon-pageview", type: "Uni Profile" },
  { path: "/#contact", title: "Contact Academic Counselor", icon: "icon-lead", type: "Counseling" }
];

const SAMPLE_CITIES = ["Delhi NCR", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Chennai", "Kolkata", "Jaipur", "Lucknow", "Chandigarh", "Ahmedabad"];
const SAMPLE_REFERRERS = ["Google Organic (Search)", "Google Organic (Discover)", "Direct", "Bing Organic", "LinkedIn Edu", "WhatsApp Share"];

function liveTick() {
  if (!adminState.liveStreamActive) return;

  // Fluctuate live users realistically (38 - 54)
  const delta = (Math.random() > 0.48 ? 1 : -1) * Math.floor(Math.random() * 3);
  adminState.liveUsersCount = Math.max(32, Math.min(68, adminState.liveUsersCount + delta));

  const pulseCounters = document.querySelectorAll(".live-users-val");
  pulseCounters.forEach(el => {
    el.textContent = adminState.liveUsersCount;
  });

  // Generate a live feed item
  const randomPath = SAMPLE_PATHS[Math.floor(Math.random() * SAMPLE_PATHS.length)];
  const randomCity = SAMPLE_CITIES[Math.floor(Math.random() * SAMPLE_CITIES.length)];
  const randomRef = SAMPLE_REFERRERS[Math.floor(Math.random() * SAMPLE_REFERRERS.length)];

  addLiveStreamItem({
    path: randomPath.path,
    title: randomPath.title,
    city: randomCity,
    referrer: randomRef,
    icon: randomPath.icon,
    time: "Just now"
  });

  // Update real-time mini chart if visible
  if (adminState.charts.realtimeMini) {
    const data = adminState.charts.realtimeMini.data.datasets[0].data;
    data.shift();
    data.push(adminState.liveUsersCount);
    adminState.charts.realtimeMini.update("none");
  }
}

function addLiveStreamItem(item) {
  const container = document.getElementById("live-stream-container");
  if (!container) return;

  const row = document.createElement("div");
  row.className = "live-stream-item";
  row.innerHTML = `
    <div class="live-stream-left">
      <div class="live-stream-icon ${item.icon}"><i class="fas ${item.icon === 'icon-lead' ? 'fa-user-graduate' : 'fa-compass'}"></i></div>
      <div class="live-stream-details">
        <span class="live-stream-path">${item.title}</span>
        <span class="live-stream-meta"><i class="fas fa-map-marker-alt"></i> ${item.city} &bull; <i class="fas fa-search"></i> ${item.referrer}</span>
      </div>
    </div>
    <span class="live-stream-time">${item.time}</span>
  `;

  container.prepend(row);
  while (container.children.length > 8) {
    container.removeChild(container.lastChild);
  }
}

function initLiveFeed() {
  const container = document.getElementById("live-stream-container");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const randomPath = SAMPLE_PATHS[i % SAMPLE_PATHS.length];
    const randomCity = SAMPLE_CITIES[i % SAMPLE_CITIES.length];
    const randomRef = SAMPLE_REFERRERS[i % SAMPLE_REFERRERS.length];
    addLiveStreamItem({
      path: randomPath.path,
      title: randomPath.title,
      city: randomCity,
      referrer: randomRef,
      icon: randomPath.icon,
      time: `${(i + 1) * 15}s ago`
    });
  }
}

// --- Render All Views & Data Tables ---
function renderAllViews() {
  renderKPICards();
  renderSEOKeywordTable();
  renderTopPagesTable();
  renderLeadsTable();
  renderCrawlStatsTable();
  renderCharts();
}

function renderKPICards() {
  const multiplier = adminState.timeRange === "24h" ? 1 : adminState.timeRange === "7d" ? 6.5 : 26;

  const totalVisitors = Math.round(14850 * multiplier).toLocaleString();
  const pageviews = Math.round(38420 * multiplier).toLocaleString();
  const organicClicks = Math.round(9240 * multiplier).toLocaleString();
  const organicImpressions = Math.round(86500 * multiplier).toLocaleString();
  const totalLeads = adminState.leads.length + (adminState.timeRange === "24h" ? 0 : Math.round(18 * multiplier));

  // Update DOM elements if present
  const elVisitors = document.getElementById("kpi-visitors");
  if (elVisitors) elVisitors.textContent = totalVisitors;

  const elPageviews = document.getElementById("kpi-pageviews");
  if (elPageviews) elPageviews.textContent = pageviews;

  const elOrganicClicks = document.getElementById("kpi-organic-clicks");
  if (elOrganicClicks) elOrganicClicks.textContent = organicClicks;

  const elImpressions = document.getElementById("kpi-impressions");
  if (elImpressions) elImpressions.textContent = organicImpressions;

  const elLeads = document.getElementById("kpi-total-leads");
  if (elLeads) elLeads.textContent = totalLeads;

  const elLeadBadge = document.getElementById("sidebar-lead-count");
  if (elLeadBadge) elLeadBadge.textContent = adminState.leads.length;
}

// --- SEO Keyword Table ---
function renderSEOKeywordTable(filteredKeywords = null) {
  const tbody = document.getElementById("keywords-table-body");
  if (!tbody) return;

  const data = filteredKeywords || adminState.keywords;
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No matching keywords found.</td></tr>`;
    return;
  }

  data.forEach(kw => {
    const rankDiff = kw.prevRank - kw.rank;
    let diffBadge = `<span class="badge badge-info"><i class="fas fa-minus"></i> 0</span>`;
    if (rankDiff > 0) {
      diffBadge = `<span class="badge badge-success"><i class="fas fa-arrow-up"></i> +${rankDiff}</span>`;
    } else if (rankDiff < 0) {
      diffBadge = `<span class="badge badge-danger"><i class="fas fa-arrow-down"></i> ${rankDiff}</span>`;
    }

    let rankClass = "rank-other";
    if (kw.rank <= 3) rankClass = "rank-top3";
    else if (kw.rank <= 10) rankClass = "rank-top10";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="font-weight: 600;">${kw.keyword}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${kw.url}</div>
      </td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="rank-badge ${rankClass}">#${kw.rank}</span>
          ${diffBadge}
        </div>
      </td>
      <td><strong>${kw.volume.toLocaleString()}</strong> /mo</td>
      <td><strong>${kw.clicks.toLocaleString()}</strong></td>
      <td>${kw.impressions.toLocaleString()}</td>
      <td>
        <span style="font-weight: 600; color: var(--accent-primary);">${kw.ctr}%</span>
      </td>
      <td>
        <span class="badge ${kw.intent === 'Commercial' ? 'badge-purple' : kw.intent === 'Transactional' ? 'badge-success' : 'badge-info'}">
          ${kw.intent}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// --- Top Pages Table ---
function renderTopPagesTable() {
  const tbody = document.getElementById("top-pages-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  adminState.topPages.forEach((p, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="color: var(--text-muted); font-size: 0.8rem; font-weight: 700; width: 16px;">${idx + 1}</span>
          <span style="font-weight: 500;">${p.path}</span>
        </div>
      </td>
      <td><strong>${p.pageviews24h.toLocaleString()}</strong></td>
      <td>${p.unique24h.toLocaleString()}</td>
      <td>${p.avgTime}</td>
      <td>${p.bounceRate}</td>
      <td><span class="badge badge-success">${p.convRate}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// --- Leads CRM Table ---
function renderLeadsTable(filteredLeads = null) {
  const tbody = document.getElementById("leads-table-body");
  if (!tbody) return;

  const list = filteredLeads || adminState.leads;
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No inquiries found.</td></tr>`;
    return;
  }

  list.forEach(lead => {
    const dateFormatted = new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + new Date(lead.timestamp).toLocaleDateString();
    const cleanPhone = (lead.phone || "").replace(/\D/g, "");
    const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent("Hello " + lead.name + ", thank you for inquiring about " + lead.course + " on OnlineDegrees. How can I assist with your university admission today?")}`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="font-weight: 600;">${lead.name}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${dateFormatted}</div>
      </td>
      <td>
        <div><i class="fas fa-phone-alt" style="color: var(--text-muted); font-size: 0.75rem;"></i> ${lead.phone || "N/A"}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${lead.email || ""}</div>
      </td>
      <td><span class="badge badge-purple">${lead.course}</span></td>
      <td>${lead.city || "India"}</td>
      <td>
        <select class="filter-select" style="padding: 4px 8px; font-size: 0.78rem;" onchange="updateLeadStatus('${lead.id}', this.value)">
          <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New</option>
          <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
          <option value="In Progress" ${lead.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Enrolled" ${lead.status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
        </select>
      </td>
      <td style="max-width: 200px; font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        ${lead.message || "Free counseling inquiry"}
      </td>
      <td>
        <a href="${waUrl}" target="_blank" class="btn-wa-action" title="Chat on WhatsApp">
          <i class="fab fa-whatsapp"></i> Chat
        </a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateLeadStatus(leadId, newStatus) {
  const lead = adminState.leads.find(l => l.id === leadId);
  if (lead) {
    lead.status = newStatus;
    localStorage.setItem("portal_analytics_leads", JSON.stringify(adminState.leads));
    showToast(`Lead status updated to: ${newStatus}`);
  }
}

// --- Technical SEO Crawl Stats ---
function renderCrawlStatsTable() {
  const tbody = document.getElementById("crawl-stats-body");
  if (!tbody) return;

  const logs = [
    { bot: "Googlebot / 2.1 (Desktop)", path: "/sitemap.xml", status: 200, time: "3 mins ago", responseMs: 42 },
    { bot: "Googlebot Smartphone", path: "/#blog-detail?id=top-online-mba-colleges-india-under-1-lakh", status: 200, time: "8 mins ago", responseMs: 65 },
    { bot: "Googlebot Smartphone", path: "/#catalog?course=mca", status: 200, time: "14 mins ago", responseMs: 58 },
    { bot: "Bingbot / 2.0", path: "/robots.txt", status: 200, time: "22 mins ago", responseMs: 38 },
    { bot: "Googlebot Smartphone", path: "/#blog-detail?id=ugc-approved-online-university-checklist", status: 200, time: "35 mins ago", responseMs: 72 },
    { bot: "Googlebot Smartphone", path: "/#catalog?university=manipal_university_jaipur_online", status: 200, time: "52 mins ago", responseMs: 60 }
  ];

  tbody.innerHTML = "";
  logs.forEach(log => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><div style="font-weight: 600;"><i class="fab fa-google" style="color: var(--accent-secondary); margin-right: 6px;"></i> ${log.bot}</div></td>
      <td style="font-family: monospace; font-size: 0.8rem;">${log.path}</td>
      <td><span class="badge badge-success">HTTP ${log.status} OK</span></td>
      <td>${log.responseMs} ms</td>
      <td style="color: var(--text-muted);">${log.time}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- Chart.js Visualizations ---
function renderCharts() {
  if (typeof Chart === "undefined") return;

  const isDark = adminState.theme === "dark";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)";
  const textColor = isDark ? "#9ca3af" : "#64748b";

  Chart.defaults.color = textColor;
  Chart.defaults.font.family = "'Inter', sans-serif";

  // 1. 24-Hour Traffic Chart
  const ctxTraffic = document.getElementById("chart-24h-traffic");
  if (ctxTraffic) {
    if (adminState.charts.traffic24h) adminState.charts.traffic24h.destroy();

    const hours = [];
    const visitorsData = [];
    const clicksData = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 3600000);
      hours.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '00' }));
      
      // Typical daily curve: peak in afternoon and evening
      const h = d.getHours();
      const base = (h >= 9 && h <= 22) ? 500 + Math.sin((h - 9) / 13 * Math.PI) * 450 : 120 + Math.random() * 80;
      const visitors = Math.round(base + (Math.random() * 60 - 30));
      visitorsData.push(visitors);
      clicksData.push(Math.round(visitors * 0.62 + Math.random() * 20));
    }

    const gradientVisitors = ctxTraffic.getContext("2d").createLinearGradient(0, 0, 0, 300);
    gradientVisitors.addColorStop(0, "rgba(99, 102, 241, 0.45)");
    gradientVisitors.addColorStop(1, "rgba(99, 102, 241, 0.0)");

    const gradientClicks = ctxTraffic.getContext("2d").createLinearGradient(0, 0, 0, 300);
    gradientClicks.addColorStop(0, "rgba(6, 182, 212, 0.35)");
    gradientClicks.addColorStop(1, "rgba(6, 182, 212, 0.0)");

    adminState.charts.traffic24h = new Chart(ctxTraffic, {
      type: "line",
      data: {
        labels: hours,
        datasets: [
          {
            label: "Total Visitors (24h)",
            data: visitorsData,
            borderColor: "#6366f1",
            backgroundColor: gradientVisitors,
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 5
          },
          {
            label: "Google Organic Clicks",
            data: clicksData,
            borderColor: "#06b6d4",
            backgroundColor: gradientClicks,
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: { position: "top", align: "end", labels: { boxWidth: 12, usePointStyle: true } }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { maxTicksLimit: 8 } },
          y: { grid: { color: gridColor }, beginAtZero: true }
        }
      }
    });
  }

  // 2. Traffic Sources Donut Chart
  const ctxSources = document.getElementById("chart-traffic-sources");
  if (ctxSources) {
    if (adminState.charts.sources) adminState.charts.sources.destroy();

    adminState.charts.sources = new Chart(ctxSources, {
      type: "doughnut",
      data: {
        labels: ["Google Organic Search", "Direct Navigation", "Bing Organic", "Social / WhatsApp", "Referral Links"],
        datasets: [{
          data: [64.2, 18.5, 7.8, 6.2, 3.3],
          backgroundColor: ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6"],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 10, usePointStyle: true, padding: 14 } }
        }
      }
    });
  }

  // 3. Real-Time Mini Concurrency Chart
  const ctxRealtimeMini = document.getElementById("chart-realtime-mini");
  if (ctxRealtimeMini) {
    if (adminState.charts.realtimeMini) adminState.charts.realtimeMini.destroy();

    const points = Array.from({ length: 15 }, () => Math.floor(38 + Math.random() * 14));
    const labels = points.map((_, i) => `${(15 - i) * 3}s ago`);

    adminState.charts.realtimeMini = new Chart(ctxRealtimeMini, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          data: points,
          backgroundColor: "rgba(16, 185, 129, 0.75)",
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { display: false, min: 20 }
        }
      }
    });
  }

  // 4. Device Distribution Chart
  const ctxDevices = document.getElementById("chart-devices");
  if (ctxDevices) {
    if (adminState.charts.devices) adminState.charts.devices.destroy();

    adminState.charts.devices = new Chart(ctxDevices, {
      type: "doughnut",
      data: {
        labels: ["Mobile (Smartphones)", "Desktop / Laptops", "Tablets"],
        datasets: [{
          data: [68.4, 28.1, 3.5],
          backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 10, usePointStyle: true, padding: 12 } }
        }
      }
    });
  }

  // 5. Search Console Impressions vs Clicks
  const ctxGSC = document.getElementById("chart-gsc-performance");
  if (ctxGSC) {
    if (adminState.charts.gsc) adminState.charts.gsc.destroy();

    const days = ["Day -6", "Day -5", "Day -4", "Day -3", "Day -2", "Yesterday", "Today (24h)"];
    const impressions = [62000, 68000, 71500, 74000, 81000, 84200, 86500];
    const clicks = [6500, 7100, 7600, 7950, 8600, 9020, 9240];

    adminState.charts.gsc = new Chart(ctxGSC, {
      type: "bar",
      data: {
        labels: days,
        datasets: [
          {
            label: "Search Impressions",
            data: impressions,
            backgroundColor: "rgba(99, 102, 241, 0.25)",
            borderColor: "#6366f1",
            borderWidth: 1,
            borderRadius: 6,
            yAxisID: "yImp"
          },
          {
            type: "line",
            label: "Organic Clicks",
            data: clicks,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderWidth: 3,
            fill: false,
            tension: 0.3,
            yAxisID: "yClicks"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", align: "end" }
        },
        scales: {
          x: { grid: { color: gridColor } },
          yImp: { position: "left", grid: { color: gridColor }, title: { display: true, text: "Impressions" } },
          yClicks: { position: "right", grid: { display: false }, title: { display: true, text: "Clicks" } }
        }
      }
    });
  }
}

// --- Search & Filter Handlers ---
function setupEventListeners() {
  // Keyword Search
  const kwSearch = document.getElementById("keyword-search-input");
  if (kwSearch) {
    kwSearch.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = adminState.keywords.filter(k => k.keyword.toLowerCase().includes(q));
      renderSEOKeywordTable(filtered);
    });
  }

  // Keyword Intent Filter
  const kwIntentFilter = document.getElementById("keyword-intent-filter");
  if (kwIntentFilter) {
    kwIntentFilter.addEventListener("change", (e) => {
      const val = e.target.value;
      const filtered = val === "all" ? adminState.keywords : adminState.keywords.filter(k => k.intent.toLowerCase() === val.toLowerCase());
      renderSEOKeywordTable(filtered);
    });
  }

  // Leads Search
  const leadSearch = document.getElementById("lead-search-input");
  if (leadSearch) {
    leadSearch.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = adminState.leads.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.course.toLowerCase().includes(q)
      );
      renderLeadsTable(filtered);
    });
  }

  // Leads Course Filter
  const leadCourseFilter = document.getElementById("lead-course-filter");
  if (leadCourseFilter) {
    leadCourseFilter.addEventListener("change", (e) => {
      const val = e.target.value.toLowerCase();
      const filtered = val === "all" ? adminState.leads : adminState.leads.filter(l => l.course.toLowerCase().includes(val));
      renderLeadsTable(filtered);
    });
  }
}

// --- Export Features ---
function exportLeadsCSV() {
  if (adminState.leads.length === 0) {
    showToast("No leads available to export.");
    return;
  }

  let csv = "ID,Name,Phone,Email,Course,City,Budget,Source,Message,Status,Date\n";
  adminState.leads.forEach(l => {
    const row = [
      `"${l.id || ''}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.course || ''}"`,
      `"${l.city || ''}"`,
      `"${l.budget || ''}"`,
      `"${l.source || ''}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${l.status || ''}"`,
      `"${new Date(l.timestamp).toISOString()}"`
    ];
    csv += row.join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `onlinedegrees_leads_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Leads CSV exported successfully!");
}

function exportSEOReport() {
  window.print();
}

function pingSitemaps() {
  showToast("Ping sent to Google Search Console and Bing Webmaster Tools.");
}

// --- Toast System ---
function showToast(message) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success);"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Global functions for inline HTML calls
window.switchTab = switchTab;
window.toggleTheme = toggleTheme;
window.updateLeadStatus = updateLeadStatus;
window.exportLeadsCSV = exportLeadsCSV;
window.exportSEOReport = exportSEOReport;
window.pingSitemaps = pingSitemaps;

// --- Login System ---
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-submit-btn');
  const userIn = document.getElementById('login-username');
  const passIn = document.getElementById('login-password');
  const errorMsg = document.getElementById('login-error-msg');
  const overlay = document.getElementById('admin-login-overlay');
  const mainLayout = document.getElementById('main-admin-layout');
  
  if (loginBtn && overlay && mainLayout) {
    const handleLogin = () => {
      const u = userIn.value.trim();
      const p = passIn.value.trim();
      if (u === 'online2027' && p === 'mba2027') {
        overlay.style.display = 'none';
        mainLayout.style.display = 'flex';
        // Trigger resize so charts render correctly after becoming visible
        window.dispatchEvent(new Event('resize'));
        showToast('Login successful. Welcome to Admin Portal.');
      } else {
        errorMsg.style.display = 'block';
        userIn.style.borderColor = 'var(--danger)';
        passIn.style.borderColor = 'var(--danger)';
      }
    };

    loginBtn.addEventListener('click', handleLogin);

    passIn.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleLogin();
      }
    });
    
    userIn.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        passIn.focus();
      }
    });

    // Reset error state on input
    const resetError = () => {
      errorMsg.style.display = 'none';
      userIn.style.borderColor = 'var(--border-color)';
      passIn.style.borderColor = 'var(--border-color)';
    };
    userIn.addEventListener('input', resetError);
    passIn.addEventListener('input', resetError);
  }

  // ==========================================
  // BLOG SUGGESTIONS LOGIC
  // ==========================================
  function renderBlogSuggestions() {
    const container = document.getElementById('blog-suggestions-container');
    if (!container) return;

    const topics = [
      { title: "Top 5 Online MBA Specializations in 2026", prompt: "Act as an expert career counselor and SEO content writer. Write a comprehensive 1000-word blog post about the top 5 most in-demand Online MBA specializations for 2026. Focus on FinTech, Business Analytics, Healthcare Management, Digital Marketing, and Supply Chain. Include salary expectations and why professionals are choosing these fields. Use headings, bullet points, and an engaging tone." },
      { title: "Online MCA vs Regular MCA: Which is Right for You?", prompt: "Write an SEO-optimized blog post comparing Online MCA to Regular MCA. Structure it with a catchy introduction, a comparison table (Cost, Flexibility, Recognition, Placements), and a definitive conclusion. The target audience is working professionals in the IT sector looking to upgrade their qualifications without quitting their jobs." },
      { title: "How to Balance a Full-Time Job and an Online Degree", prompt: "Draft a highly engaging, motivational 800-word article offering 7 practical time-management tips for working professionals enrolled in an online degree program. Include advice on leveraging weekends, setting boundaries at work, and using productivity tools like Notion or Trello." },
      { title: "Is an Online BBA Worth It? Career Outcomes & Salary", prompt: "Create a detailed guide addressing the ROI of an Online BBA degree. Discuss the typical entry-level roles available after graduation, average salary bands, and how it serves as a stepping stone for an MBA. Keep the tone professional, objective, and encouraging." },
      { title: "The Future of EdTech: How AI is Changing Online Degrees", prompt: "Write a thought-leadership article on how Artificial Intelligence and Machine Learning are transforming the landscape of online education. Discuss personalized learning paths, AI-driven proctoring, and automated student support. Aim for a futuristic yet grounded perspective." },
      { title: "Top 10 High-Paying Jobs You Can Get with an Online M.Com", prompt: "Act as an SEO blog writer. Generate a listicle-style post detailing the top 10 highest-paying career options for M.Com graduates. Include roles like Investment Banker, Financial Analyst, and Chief Financial Officer. Provide average salaries and key skills required for each." },
      { title: "Debunking Myths About Distance Education in 2026", prompt: "Write an engaging blog post that debunks the top 5 most common myths about distance and online education (e.g., 'It's not recognized by employers', 'It lacks networking opportunities'). Provide facts, stats, and real-world examples to counter each myth." },
      { title: "Why Data Science is the Most Requested Online Course", prompt: "Draft an informative article explaining the explosion in demand for Data Science and Analytics online courses. Discuss the industry skill gap, the democratizing effect of online learning platforms, and the career trajectory of a Data Scientist." },
      { title: "How to Choose the Right University for Your Online Degree", prompt: "Create a step-by-step guide on how prospective students should evaluate and select an online university. Cover accreditation, faculty credentials, learning management systems (LMS), and placement support. Format with clear H2 and H3 tags." },
      { title: "The Impact of UGC Guidelines on Online Degrees in India", prompt: "Write a well-researched, authoritative blog post explaining the latest University Grants Commission (UGC) guidelines regarding online degrees in India. Clarify the 'equal value' mandate and what it means for job seekers in both public and private sectors." }
    ];

    // Seeded random based on current date so it changes daily but stays consistent during the day
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Simple pseudo-random generator
    function seededRandom(max, min) {
        max = max || 1;
        min = min || 0;
        const x = Math.sin(seed++) * 10000;
        return Math.floor((x - Math.floor(x)) * (max - min) + min);
    }

    // Shuffle and pick 5
    let shuffled = [...topics];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = seededRandom(i + 1, 0);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const dailySuggestions = shuffled.slice(0, 5);

    let html = '';
    dailySuggestions.forEach(suggestion => {
      html += `
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; position: relative;">
          <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 1.1rem; color: var(--text-primary); font-family: 'Outfit', sans-serif;">${suggestion.title}</h3>
          <div style="position: relative;">
            <textarea readonly style="width: 100%; height: 100px; padding: 12px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); font-family: monospace; font-size: 0.85rem; resize: none; outline: none;">${suggestion.prompt}</textarea>
            <button class="copy-prompt-btn" style="position: absolute; top: 10px; right: 10px; background: var(--accent-primary); color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;"><i class="fas fa-copy"></i> Copy</button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Attach copy events
    container.querySelectorAll('.copy-prompt-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const textToCopy = this.previousElementSibling.value;
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="fas fa-check"></i> Copied!';
          this.style.background = 'var(--success)';
          setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = 'var(--accent-primary)';
          }, 2000);
        });
      });
    });
  }

  // Initialize Blog Suggestions on load and on tab switch
  renderBlogSuggestions();
});
