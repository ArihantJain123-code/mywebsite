// College Vidya Style - Online Degree Education Portal
// Core Application Logic

// --- Integrations Configuration ---
// Paste your deployed Google Apps Script Web App URL here to save submissions to Google Sheets.
// For setup guide, see: google_sheets_setup.md
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlWgDbbFjwQoHyTlrFA61VG-bupBF9arcwcGoDj2tp5AATzjEN4-LYvbCeBVI8cjAU/exec";

// Paste your deployed Activepieces Webhook URL here to trigger automations.
// For setup guide, see: activepieces_setup.md
const ACTIVEPIECES_WEBHOOK_URL = "";

// --- Global Integration Helpers ---
function sendInquiryToGoogleSheet(inquiryData) {
  if (!GOOGLE_SCRIPT_URL) {
    console.log("Google Sheets Integration: URL is not configured. Submission saved locally only.", inquiryData);
    return;
  }

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain"
    },
    body: JSON.stringify(inquiryData)
  })
    .then(() => {
      console.log("Google Sheets Integration: Request sent successfully (no-cors).");
    })
    .catch(error => {
      console.error("Google Sheets Integration Error:", error);
    });
}

function sendInquiryToActivepieces(inquiryData) {
  if (!ACTIVEPIECES_WEBHOOK_URL) {
    console.log("Activepieces Integration: Webhook URL is not configured. Submission saved locally only.", inquiryData);
    return;
  }

  fetch(ACTIVEPIECES_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(inquiryData)
  })
    .then(response => {
      if (response.ok) {
        console.log("Activepieces Integration: Request sent successfully.");
      } else {
        console.error("Activepieces Integration failed with status:", response.status);
      }
    })
    .catch(error => {
      console.error("Activepieces Integration Error:", error);
    });
}

// --- WhatsApp Redirection Helper ---
function redirectLeadToWhatsApp(inquiryData) {
  const adminPhone = "916375079973"; // Admin phone number with country code (91 for India)
  
  let message = `*New Lead Inquiry - OnlineDegrees*\n\n`;
  if (inquiryData.formType) message += `*Source:* ${inquiryData.formType}\n`;
  if (inquiryData.name) message += `*Name:* ${inquiryData.name}\n`;
  if (inquiryData.email) message += `*Email:* ${inquiryData.email}\n`;
  if (inquiryData.phone) message += `*Phone:* ${inquiryData.phone}\n`;
  if (inquiryData.location) message += `*Location:* ${inquiryData.location}\n`;
  if (inquiryData.budget) message += `*Budget:* ${inquiryData.budget}\n`;
  if (inquiryData.course) message += `*Course:* ${inquiryData.course}\n`;
  if (inquiryData.message) message += `*Message:* ${inquiryData.message}\n`;
  
  const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
}

// Unified dispatcher accessible from chatbot.js
window.submitLeadToIntegrations = function(inquiryData) {
  sendInquiryToGoogleSheet(inquiryData);
  sendInquiryToActivepieces(inquiryData);
  redirectLeadToWhatsApp(inquiryData);
};

// --- Global Application State ---
const state = {
  currentView: "home",
  selectedCourse: "mba", // Default course in catalog
  compareList: [],       // Array of university IDs (max 3)
  filters: {
    feeMax: 250000,
    naacGrades: [],
    approvals: [],
    searchQuery: ""
  },
  sortBy: "rating",
  reviewsDb: {}, // Will hold user reviews in memory, supplemented by local storage
  blogQuery: "",
  blogCategory: "all",
  blogPage: 1,
  blogPageSize: 9
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initReviews();
  initRouter();
  setupEventListeners();

  // Render default catalog course name on load
  updateCatalogCourseInfo();
});

// --- Local Storage Reviews Setup ---
function initReviews() {
  const stored = localStorage.getItem("portal_university_reviews");
  if (stored) {
    state.reviewsDb = JSON.parse(stored);
  } else {
    // Populate with default reviews from data.js
    UNIVERSITIES.forEach(uni => {
      state.reviewsDb[uni.id] = [...uni.reviews];
    });
    localStorage.setItem("portal_university_reviews", JSON.stringify(state.reviewsDb));
  }
}

// --- Router ---
function initRouter() {
  const handleRouteChange = () => {
    const hash = window.location.hash || "#home";

    // Parse query params if any, e.g. #catalog?course=bca
    const parts = hash.split("?");
    const viewName = parts[0].substring(1);

    let params = {};
    if (parts[1]) {
      const searchParams = new URLSearchParams(parts[1]);
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
    }

    navigate(viewName, params);
  };

  window.addEventListener("hashchange", handleRouteChange);

  // Trigger on initial load
  handleRouteChange();
}

function navigate(viewName, params = {}) {
  // Hide all sections
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });

  // Update navigation link active class
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("data-target") === viewName || (viewName === "blog-detail" && link.getAttribute("data-target") === "blog")) {
      link.classList.add("active");
    }
  });

  // Activate target section
  const targetSection = document.getElementById(`${viewName}-view`);
  if (targetSection) {
    targetSection.classList.add("active");
    state.currentView = viewName;
  } else {
    // Fallback to home
    document.getElementById("home-view").classList.add("active");
    state.currentView = "home";
  }

  // Update SEO metadata dynamically
  updateSEO(viewName, params);


  // Handle specific view parameters
  if (viewName === "catalog") {
    if (params.course) {
      state.selectedCourse = params.course.toLowerCase();
      state.filters.searchQuery = "";
      const searchInput = document.getElementById("catalog-search");
      if (searchInput) searchInput.value = "";
    } else if (params.university) {
      const university = UNIVERSITIES.find(u => u.id === params.university);
      if (university) {
        state.filters.searchQuery = university.name.toLowerCase();
        const searchInput = document.getElementById("catalog-search");
        if (searchInput) searchInput.value = university.name;
        
        // Ensure the active course is one that this university offers
        if (university.courses && !university.courses[state.selectedCourse]) {
          const offered = Object.keys(university.courses);
          if (offered.length > 0) {
            state.selectedCourse = offered[0];
            // Sync course select dropdown visually
            const courseSelect = document.getElementById("catalog-course-select");
            if (courseSelect) courseSelect.value = offered[0];
          }
        }
      }
    } else {
      state.filters.searchQuery = "";
      const searchInput = document.getElementById("catalog-search");
      if (searchInput) searchInput.value = "";
    }
    updateCatalogCourseInfo();
    renderCatalog();
  } else if (viewName === "compare") {
    renderCompareMatrix();
  } else if (viewName === "blog") {
    state.blogPage = 1;
    if (params.search) {
      state.blogQuery = decodeURIComponent(params.search).toLowerCase().trim();
      // Update inputs
      const navSearch = document.getElementById("nav-blog-search");
      const mobSearch = document.getElementById("mobile-blog-search");
      if (navSearch) navSearch.value = params.search;
      if (mobSearch) mobSearch.value = params.search;
      // Toggle nav search clear button
      const clearBtn = document.getElementById("nav-blog-search-clear");
      if (clearBtn) clearBtn.style.display = params.search ? "inline-flex" : "none";
    } else {
      state.blogQuery = "";
      const navSearch = document.getElementById("nav-blog-search");
      const mobSearch = document.getElementById("mobile-blog-search");
      if (navSearch) navSearch.value = "";
      if (mobSearch) mobSearch.value = "";
      const clearBtn = document.getElementById("nav-blog-search-clear");
      if (clearBtn) clearBtn.style.display = "none";
    }

    if (params.category) {
      state.blogCategory = decodeURIComponent(params.category);
    } else {
      state.blogCategory = "all";
    }

    // Sync category sidebar buttons visually
    const catBtns = document.querySelectorAll(".blog-category-btn");
    catBtns.forEach(btn => {
      if (btn.getAttribute("data-category") === state.blogCategory) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    renderBlogsList();
    renderTrendingBlogs();
  } else if (viewName === "blog-detail") {
    const blogId = params.id;
    if (blogId) {
      renderBlogDetail(blogId);
    } else {
      window.location.hash = "#blog";
    }
  } else if (viewName === "resume-builder") {
    initResumeBuilder();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// --- Event Listeners Helper ---
function setupEventListeners() {
  // Navigation links
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      const view = e.target.getAttribute("data-target");
      window.location.hash = `#${view}`;
    });
  });

  // Home Quick Course Cards
  document.querySelectorAll(".degree-card").forEach(card => {
    card.addEventListener("click", () => {
      const course = card.getAttribute("data-course");
      window.location.hash = `#catalog?course=${course}`;
    });
  });



  // Browse Courses CTA
  const browseCta = document.getElementById("home-browse-cta");
  if (browseCta) {
    browseCta.addEventListener("click", () => {
      window.location.hash = `#catalog?course=mba`;
    });
  }

  // Logo Navigation Home
  const logo = document.getElementById("navbar-logo");
  if (logo) {
    logo.addEventListener("click", () => {
      window.location.hash = "#home";
    });
  }

  // Sidebar Course Dropdown Selector
  const courseSelect = document.getElementById("catalog-course-select");
  if (courseSelect) {
    courseSelect.addEventListener("change", (e) => {
      state.selectedCourse = e.target.value;
      updateCatalogCourseInfo();
      renderCatalog();
    });
  }

  // Budget Filter Slider
  const feeSlider = document.getElementById("filter-fee");
  const feeValue = document.getElementById("filter-fee-value");
  if (feeSlider) {
    feeSlider.addEventListener("input", (e) => {
      state.filters.feeMax = parseInt(e.target.value);
      feeValue.textContent = `₹${state.filters.feeMax.toLocaleString("en-IN")}`;
      renderCatalog();
    });
  }

  // NAAC Filters
  document.querySelectorAll(".filter-naac").forEach(chk => {
    chk.addEventListener("change", () => {
      const selected = [];
      document.querySelectorAll(".filter-naac:checked").forEach(c => {
        selected.push(c.value);
      });
      state.filters.naacGrades = selected;
      renderCatalog();
    });
  });

  // Approval Filters
  document.querySelectorAll(".filter-approval").forEach(chk => {
    chk.addEventListener("change", () => {
      const selected = [];
      document.querySelectorAll(".filter-approval:checked").forEach(c => {
        selected.push(c.value);
      });
      state.filters.approvals = selected;
      renderCatalog();
    });
  });

  // Search input
  const searchInput = document.getElementById("catalog-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.filters.searchQuery = e.target.value.toLowerCase().trim();
      renderCatalog();
    });
  }

  // Sort Selector
  const sortSelect = document.getElementById("catalog-sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderCatalog();
    });
  }

  // Clear Filters
  const clearBtn = document.getElementById("clear-filters-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      resetFilters();
    });
  }

  // Compare Floating Tray Click
  const compareTrayBtn = document.getElementById("compare-tray-action-btn");
  if (compareTrayBtn) {
    compareTrayBtn.addEventListener("click", () => {
      window.location.hash = "#compare";
    });
  }



  // Close Modal Detail
  const modalClose = document.getElementById("modal-detail-close");
  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  // Close modal when clicking overlay
  const modalOverlay = document.getElementById("modal-overlay");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Modal Tab Switchers
  document.querySelectorAll(".modal-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetTab = e.target.getAttribute("data-tab");

      document.querySelectorAll(".modal-tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".modal-tab-pane").forEach(p => p.classList.remove("active"));

      e.target.classList.add("active");
      document.getElementById(`tab-${targetTab}`).classList.add("active");
    });
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });
  }

  // --- BLOG EVENT LISTENERS ---
  // Desktop Nav Search
  const navBlogSearchInput = document.getElementById("nav-blog-search");
  const navBlogSearchClear = document.getElementById("nav-blog-search-clear");

  if (navBlogSearchInput) {
    navBlogSearchInput.addEventListener("input", (e) => {
      const value = e.target.value;
      state.blogQuery = value.toLowerCase().trim();

      // Update mobile search input as well to stay in sync
      const mobBlogSearchInput = document.getElementById("mobile-blog-search");
      if (mobBlogSearchInput) mobBlogSearchInput.value = value;

      if (navBlogSearchClear) {
        navBlogSearchClear.style.display = value ? "inline-flex" : "none";
      }

      if (state.currentView !== "blog" && state.currentView !== "blog-detail") {
        window.location.hash = `#blog?search=${encodeURIComponent(value)}`;
      } else {
        if (state.currentView === "blog-detail") {
          window.location.hash = `#blog?search=${encodeURIComponent(value)}`;
        } else {
          state.blogPage = 1;
          renderBlogsList();
        }
      }
    });
  }

  if (navBlogSearchClear) {
    navBlogSearchClear.addEventListener("click", () => {
      if (navBlogSearchInput) navBlogSearchInput.value = "";
      const mobBlogSearchInput = document.getElementById("mobile-blog-search");
      if (mobBlogSearchInput) mobBlogSearchInput.value = "";
      navBlogSearchClear.style.display = "none";
      state.blogQuery = "";
      if (state.currentView === "blog") {
        state.blogPage = 1;
        renderBlogsList();
      } else {
        window.location.hash = "#blog";
      }
    });
  }

  // Mobile Nav Search
  const mobBlogSearchInput = document.getElementById("mobile-blog-search");
  if (mobBlogSearchInput) {
    mobBlogSearchInput.addEventListener("input", (e) => {
      const value = e.target.value;
      state.blogQuery = value.toLowerCase().trim();

      // Sync desktop search input
      if (navBlogSearchInput) navBlogSearchInput.value = value;
      if (navBlogSearchClear) navBlogSearchClear.style.display = value ? "inline-flex" : "none";

      if (state.currentView !== "blog" && state.currentView !== "blog-detail") {
        window.location.hash = `#blog?search=${encodeURIComponent(value)}`;
      } else {
        if (state.currentView === "blog-detail") {
          window.location.hash = `#blog?search=${encodeURIComponent(value)}`;
        } else {
          state.blogPage = 1;
          renderBlogsList();
        }
      }
    });
  }

  // Blog Page Search Status Clear Button
  const blogStatusClearBtn = document.getElementById("blog-search-clear-btn");
  if (blogStatusClearBtn) {
    blogStatusClearBtn.addEventListener("click", () => {
      if (navBlogSearchInput) navBlogSearchInput.value = "";
      if (mobBlogSearchInput) mobBlogSearchInput.value = "";
      if (navBlogSearchClear) navBlogSearchClear.style.display = "none";
      state.blogQuery = "";
      state.blogPage = 1;
      renderBlogsList();
    });
  }

  // Blog Categories buttons
  const categoryContainer = document.getElementById("blog-categories-list");
  if (categoryContainer) {
    categoryContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".blog-category-btn");
      if (!btn) return;

      categoryContainer.querySelectorAll(".blog-category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      state.blogCategory = btn.getAttribute("data-category");
      state.blogPage = 1;
      renderBlogsList();
    });
  }

  // Blog Detail Back Button
  const blogDetailBackBtn = document.getElementById("blog-detail-back-btn");
  if (blogDetailBackBtn) {
    blogDetailBackBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (state.blogQuery) {
        window.location.hash = `#blog?search=${encodeURIComponent(state.blogQuery)}`;
      } else {
        window.location.hash = "#blog";
      }
    });
  }

  // --- CONTACT FORM EVENT LISTENERS ---
  const contactForm = document.getElementById("contact-form");
  const contactSuccess = document.getElementById("contact-success");
  const contactResetBtn = document.getElementById("contact-reset-btn");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("contact-name").value.trim();
      const email = document.getElementById("contact-email").value.trim();
      const phone = document.getElementById("contact-phone").value.trim();
      const course = document.getElementById("contact-course").value;
      const message = document.getElementById("contact-message").value.trim();

      const inquiry = {
        formType: "Contact Form",
        name,
        email,
        phone,
        course,
        message,
        date: new Date().toISOString()
      };

      let inquiries = [];
      const stored = localStorage.getItem("portal_contact_inquiries");
      if (stored) {
        inquiries = JSON.parse(stored);
      }
      inquiries.push(inquiry);
      localStorage.setItem("portal_contact_inquiries", JSON.stringify(inquiries));

      // Send to integrations (Google Sheets + Activepieces)
      window.submitLeadToIntegrations(inquiry);

      contactForm.style.display = "none";
      if (contactSuccess) {
        contactSuccess.style.display = "block";
      }
    });
  }

  if (contactResetBtn) {
    contactResetBtn.addEventListener("click", () => {
      if (contactForm) {
        contactForm.reset();
        contactForm.style.display = "flex";
      }
      if (contactSuccess) {
        contactSuccess.style.display = "none";
      }
    });
  }

  // --- INQUIRY MODAL LOGIC ---
  const inquiryModal = document.getElementById("inquiry-modal");
  const inquiryOpenBtn = document.getElementById("open-inquiry-modal");
  const inquiryCloseBtn = document.getElementById("inquiry-modal-close");
  const inquiryForm = document.getElementById("inquiry-form");
  const inquirySuccess = document.getElementById("inquiry-success");
  const inquiryResetBtn = document.getElementById("inquiry-reset-btn");

  if (inquiryOpenBtn) {
    inquiryOpenBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (inquiryModal) inquiryModal.style.display = "flex";
    });
  }
  if (inquiryCloseBtn) {
    inquiryCloseBtn.addEventListener("click", () => {
      if (inquiryModal) inquiryModal.style.display = "none";
    });
  }
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("inquiry-name").value.trim();
      const email = document.getElementById("inquiry-email").value.trim();
      const phone = document.getElementById("inquiry-phone").value.trim();
      const location = document.getElementById("inquiry-location").value.trim();
      const budget = document.getElementById("inquiry-budget").value;
      const course = document.getElementById("inquiry-course").value;
      const message = document.getElementById("inquiry-message").value.trim();

      const inquiry = {
        formType: "Inquiry Form",
        name,
        email,
        phone,
        location,
        budget,
        course,
        message,
        date: new Date().toISOString()
      };

      let inquiries = [];
      const stored = localStorage.getItem("portal_inquiry_submissions");
      if (stored) inquiries = JSON.parse(stored);
      inquiries.push(inquiry);
      localStorage.setItem("portal_inquiry_submissions", JSON.stringify(inquiries));

      // Send to integrations (Google Sheets + Activepieces)
      window.submitLeadToIntegrations(inquiry);

      inquiryForm.style.display = "none";
      if (inquirySuccess) inquirySuccess.style.display = "block";
    });
  }
  if (inquiryResetBtn) {
    inquiryResetBtn.addEventListener("click", () => {
      if (inquiryForm) {
        inquiryForm.reset();
        inquiryForm.style.display = "flex";
      }
      if (inquirySuccess) inquirySuccess.style.display = "none";
      if (inquiryModal) inquiryModal.style.display = "none";
    });
  }

  // (Integration helpers moved to global scope at the top of app.js)

  // --- Accordion FAQs toggle logic
  const accordionTitles = document.querySelectorAll(".contact-accordion .accordion-title");
  accordionTitles.forEach(title => {
    title.addEventListener("click", () => {
      const item = title.parentElement;
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".contact-accordion .accordion-item").forEach(el => {
        el.classList.remove("open");
      });

      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });
}

// --- Filter Operations ---
function resetFilters() {
  state.filters.feeMax = 250000;
  state.filters.naacGrades = [];
  state.filters.approvals = [];
  state.filters.searchQuery = "";

  // Reset DOM elements
  const feeSlider = document.getElementById("filter-fee");
  if (feeSlider) feeSlider.value = 250000;

  const feeValue = document.getElementById("filter-fee-value");
  if (feeValue) feeValue.textContent = "₹2,50,000";

  document.querySelectorAll(".filter-naac, .filter-approval").forEach(chk => {
    chk.checked = false;
  });

  const searchInput = document.getElementById("catalog-search");
  if (searchInput) searchInput.value = "";

  renderCatalog();
}

function updateCatalogCourseInfo() {
  const courseMeta = COURSES_DATA[state.selectedCourse];
  if (!courseMeta) return;

  // Update selects and titles
  const select = document.getElementById("catalog-course-select");
  if (select) select.value = state.selectedCourse;

  const headerName = document.getElementById("catalog-course-name");
  if (headerName) headerName.textContent = courseMeta.name;

  const desc = document.getElementById("catalog-course-desc");
  if (desc) desc.textContent = courseMeta.description;

  // Catalog meta stats box
  const duration = document.getElementById("course-meta-duration");
  const salary = document.getElementById("course-meta-salary");
  const eligibility = document.getElementById("course-meta-eligibility");

  if (duration) duration.textContent = courseMeta.duration;
  if (salary) salary.textContent = courseMeta.avgSalary;
  if (eligibility) eligibility.textContent = courseMeta.eligibility;
}

// --- Render Course Catalog ---
function renderCatalog() {
  const container = document.getElementById("universities-list-container");
  if (!container) return;

  container.innerHTML = "";

  // Get universities offering the selected course
  let list = UNIVERSITIES.filter(uni => uni.courses[state.selectedCourse]);

  // Filter 1: Max Fee
  list = list.filter(uni => uni.courses[state.selectedCourse].feeTotal <= state.filters.feeMax);

  // Filter 2: NAAC Grade
  if (state.filters.naacGrades.length > 0) {
    list = list.filter(uni => state.filters.naacGrades.includes(uni.naacGrade));
  }

  // Filter 3: Approvals
  if (state.filters.approvals.length > 0) {
    list = list.filter(uni => {
      // Check if university has all selected approvals
      return state.filters.approvals.every(approval => {
        return uni.approvals.some(app => app.toLowerCase().includes(approval.toLowerCase()));
      });
    });
  }

  // Filter 4: Search query
  if (state.filters.searchQuery) {
    list = list.filter(uni =>
      uni.name.toLowerCase().includes(state.filters.searchQuery) ||
      uni.shortName.toLowerCase().includes(state.filters.searchQuery)
    );
  }

  // Sorting
  if (state.sortBy === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  } else if (state.sortBy === "fee-low") {
    list.sort((a, b) => a.courses[state.selectedCourse].feeTotal - b.courses[state.selectedCourse].feeTotal);
  } else if (state.sortBy === "fee-high") {
    list.sort((a, b) => b.courses[state.selectedCourse].feeTotal - a.courses[state.selectedCourse].feeTotal);
  } else if (state.sortBy === "placement") {
    list.sort((a, b) => b.placementRate - a.placementRate);
  }

  // Check empty state
  if (list.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <i class="fas fa-university"></i>
        <h3>No Universities Found</h3>
        <p>Try resetting the filters or searching for another key term.</p>
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  // Render cards
  list.forEach(uni => {
    const courseDetail = uni.courses[state.selectedCourse];
    const isCompared = state.compareList.includes(uni.id);

    const card = document.createElement("div");
    card.className = "uni-card";
    card.setAttribute("data-id", uni.id);

    // Generate inline approvals HTML
    const approvalsHtml = uni.approvals.map(app => `<span class="uni-approval-tag">${app}</span>`).join("");

    // Generate features list
    const featuresHtml = uni.features.slice(0, 2).map(f => `
      <div class="uni-highlight-item">
        <i class="fas fa-check-circle"></i>
        <span>${f}</span>
      </div>
    `).join("");

    card.innerHTML = `
      <!-- Compare Checkbox -->
      <label class="uni-compare-checkbox ${isCompared ? 'checked' : ''}" onclick="toggleCompare('${uni.id}', event)">
        <input type="checkbox" ${isCompared ? 'checked' : ''} style="margin-right: 4px; pointer-events:none;"> Compare
      </label>
      
      <!-- Left Column: Logo & Rating -->
      <div class="uni-card-left">
        <div class="uni-logo-badge" style="background: ${uni.logoColor}">${uni.logoInitials}</div>
        <span class="uni-badge-naac">NAAC ${uni.naacGrade}</span>
        <div class="uni-rating-badge">
          <i class="fas fa-star"></i>
          <span>${uni.rating}</span>
        </div>
      </div>
      
      <!-- Middle Column: Name, Approvals, Features -->
      <div class="uni-card-middle">
        <div class="uni-name-row">
          <h3>${uni.name}</h3>
        </div>
        <div class="uni-approvals-tags">
          ${approvalsHtml}
        </div>
        <p class="uni-desc">${uni.description}</p>
        <div class="uni-highlights-row">
          ${featuresHtml}
          <div class="uni-highlight-item">
            <i class="fas fa-percent"></i>
            <span>Placement Rate: <strong>${uni.placementRate}%</strong></span>
          </div>
        </div>
      </div>
      
      <!-- Right Column: Fees & Actions -->
      <div class="uni-card-right">
        <div class="uni-fee-container">
          <div class="uni-fee-label">TOTAL FEES</div>
          <div class="uni-fee-amount">₹${courseDetail.feeTotal.toLocaleString("en-IN")}</div>
          <div class="uni-fee-sem">₹${courseDetail.feeSemester.toLocaleString("en-IN")} / Sem</div>
          <div class="uni-highlight-item" style="justify-content: flex-end; margin-top: 4px; font-size: 0.75rem;">
            <i class="fas fa-credit-card"></i>
            <span>EMI starts at ${uni.emiStarts}</span>
          </div>
        </div>
        <div class="uni-actions-col">
          <button class="btn btn-primary" onclick="openModal('${uni.id}')">View Details</button>
          <button class="btn btn-accent" onclick="startCounselingWithUni('${uni.id}')">Apply for Counseling</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- Comparison Logic ---
window.toggleCompare = function (uniId, event) {
  // Prevent label default double-trigger when nested inside grid
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const index = state.compareList.indexOf(uniId);

  if (index > -1) {
    // Remove
    state.compareList.splice(index, 1);
  } else {
    // Add
    if (state.compareList.length >= 2) {
      alert("You can compare a maximum of 2 universities at once!");
      return;
    }
    state.compareList.push(uniId);
  }

  updateCompareTray();

  // Re-render only checkboxes visually to save reflow if in catalog
  if (state.currentView === "catalog") {
    renderCatalog();
  }
};

function updateCompareTray() {
  const tray = document.getElementById("compare-tray");
  const container = document.getElementById("compare-tray-items");
  const countBadge = document.getElementById("compare-badge-count");
  const navBadge = document.getElementById("nav-compare-badge");

  if (!tray || !container) return;

  const count = state.compareList.length;

  // Update navbar badge
  if (navBadge) {
    navBadge.textContent = count;
    navBadge.style.display = count > 0 ? "flex" : "none";
  }

  if (count === 0) {
    tray.classList.remove("show");
    return;
  }

  tray.classList.add("show");
  container.innerHTML = `<span class="compare-tray-title">Compare (Max 2):</span>`;

  state.compareList.forEach(id => {
    const uni = UNIVERSITIES.find(u => u.id === id);
    if (!uni) return;

    const pill = document.createElement("div");
    pill.className = "compare-pill";
    pill.innerHTML = `
      <span>${uni.shortName}</span>
      <button onclick="toggleCompare('${uni.id}', event)">
        <i class="fas fa-times"></i>
      </button>
    `;
    container.appendChild(pill);
  });

  // Update action button text
  const actionBtn = document.getElementById("compare-tray-action-btn");
  if (actionBtn) {
    actionBtn.textContent = `Compare Now (${count}/2)`;
  }
}

// --- Render Comparison Matrix Page ---
// Helper to estimate average package range per course and university rating/placement
function getUniversityAvgSalary(uni, course) {
  const baseSalaries = {
    "mba": { min: 4, max: 12 },
    "mca": { min: 4, max: 10 },
    "bca": { min: 3, max: 6 },
    "bba": { min: 3, max: 7 },
    "mcom": { min: 3.5, max: 7.5 }
  };
  const courseRange = baseSalaries[course] || { min: 3, max: 8 };

  // Calculate a factor between 0.1 and 1.0 based on placement rate and rating
  const factor = ((uni.placementRate || 80) - 70) / 20 * 0.5 + ((uni.rating || 4.0) - 4.0) * 0.5;
  const scaledFactor = Math.max(0.1, Math.min(1.0, factor));

  const minSalary = courseRange.min + scaledFactor * (courseRange.max - courseRange.min) * 0.8;
  const maxSalary = minSalary + 1.5 + (1 - scaledFactor) * 1.5;

  return {
    min: Math.round(minSalary * 10) / 10,
    max: Math.round(maxSalary * 10) / 10
  };
}

// --- Render Comparison Matrix Page ---
function renderCompareMatrix() {
  const select1 = document.getElementById("compare-select-1");
  const select2 = document.getElementById("compare-select-2");

  if (!select1 || !select2) return;

  // 1. Populate selectors dynamically if they are empty
  if (select1.options.length === 0) {
    UNIVERSITIES.forEach(uni => {
      const opt1 = new Option(uni.name, uni.id);
      const opt2 = new Option(uni.name, uni.id);
      select1.add(opt1);
      select2.add(opt2);
    });

    // Bind change events
    select1.addEventListener("change", () => {
      state.compareList[0] = select1.value;
      updateSelectDisables(select1, select2);
      updateCompareTray();
      renderCompareData();
    });

    select2.addEventListener("change", () => {
      state.compareList[1] = select2.value;
      updateSelectDisables(select1, select2);
      updateCompareTray();
      renderCompareData();
    });
  }

  // 2. Set initial values based on global comparison state
  if (state.compareList.length >= 2) {
    select1.value = state.compareList[0];
    select2.value = state.compareList[1];
  } else if (state.compareList.length === 1) {
    select1.value = state.compareList[0];
    // Find a different default for the second select
    const default2 = UNIVERSITIES.find(u => u.id !== state.compareList[0])?.id || UNIVERSITIES[0].id;
    select2.value = default2;
    state.compareList = [state.compareList[0], default2];
  } else {
    // Both empty, pick first two
    select1.value = UNIVERSITIES[0]?.id;
    select2.value = UNIVERSITIES[1]?.id;
    state.compareList = [UNIVERSITIES[0]?.id, UNIVERSITIES[1]?.id];
  }

  updateSelectDisables(select1, select2);
  updateCompareTray();
  renderCompareData();
}

function updateSelectDisables(select1, select2) {
  const val1 = select1.value;
  const val2 = select2.value;

  Array.from(select1.options).forEach(opt => {
    opt.disabled = (opt.value === val2);
  });
  Array.from(select2.options).forEach(opt => {
    opt.disabled = (opt.value === val1);
  });
}

function renderCompareData() {
  const select1 = document.getElementById("compare-select-1");
  const select2 = document.getElementById("compare-select-2");
  if (!select1 || !select2) return;

  const id1 = select1.value;
  const id2 = select2.value;

  const uniA = UNIVERSITIES.find(u => u.id === id1);
  const uniB = UNIVERSITIES.find(u => u.id === id2);
  if (!uniA || !uniB) return;

  const course = state.selectedCourse || "mba";

  // --- A. Render Performance & Value Charts ---
  // Average Salary
  const salaryA = getUniversityAvgSalary(uniA, course);
  const salaryB = getUniversityAvgSalary(uniB, course);
  const salaryTextA = `₹${salaryA.min}-${salaryA.max} LPA`;
  const salaryTextB = `₹${salaryB.min}-${salaryB.max} LPA`;

  const maxSalaryScale = 16.0;
  const salaryPctA = Math.min(100, (salaryA.max / maxSalaryScale) * 100);
  const salaryPctB = Math.min(100, (salaryB.max / maxSalaryScale) * 100);

  const salaryBarsContainer = document.getElementById("compare-salary-bars");
  if (salaryBarsContainer) {
    salaryBarsContainer.innerHTML = `
      <div class="chart-bar-item">
        <div class="chart-bar-label-row">
          <span class="chart-bar-uni-name">${uniA.name}</span>
          <span class="chart-bar-value salary">${salaryTextA}</span>
        </div>
        <div class="chart-bar-track">
          <div class="chart-bar-fill fill-salary-1" style="width: ${salaryPctA}%"></div>
        </div>
      </div>
      <div class="chart-bar-item">
        <div class="chart-bar-label-row">
          <span class="chart-bar-uni-name">${uniB.name}</span>
          <span class="chart-bar-value salary">${salaryTextB}</span>
        </div>
        <div class="chart-bar-track">
          <div class="chart-bar-fill fill-salary-2" style="width: ${salaryPctB}%"></div>
        </div>
      </div>
    `;
  }

  // Total Tuition Fee
  const feeTotalA = uniA.courses[course]?.feeTotal || 0;
  const feeTotalB = uniB.courses[course]?.feeTotal || 0;
  const feeTextA = `₹${(feeTotalA / 100000).toFixed(2)} Lakhs`;
  const feeTextB = `₹${(feeTotalB / 100000).toFixed(2)} Lakhs`;

  const maxFeeScale = 250000.0;
  const feePctA = Math.min(100, (feeTotalA / maxFeeScale) * 100);
  const feePctB = Math.min(100, (feeTotalB / maxFeeScale) * 100);

  const feeBarsContainer = document.getElementById("compare-fee-bars");
  if (feeBarsContainer) {
    feeBarsContainer.innerHTML = `
      <div class="chart-bar-item">
        <div class="chart-bar-label-row">
          <span class="chart-bar-uni-name">${uniA.name}</span>
          <span class="chart-bar-value fee">${feeTextA}</span>
        </div>
        <div class="chart-bar-track">
          <div class="chart-bar-fill fill-fee" style="width: ${feePctA}%"></div>
        </div>
      </div>
      <div class="chart-bar-item">
        <div class="chart-bar-label-row">
          <span class="chart-bar-uni-name">${uniB.name}</span>
          <span class="chart-bar-value fee">${feeTextB}</span>
        </div>
        <div class="chart-bar-track">
          <div class="chart-bar-fill fill-fee" style="width: ${feePctB}%"></div>
        </div>
      </div>
    `;
  }

  // --- B. Render Comparison Table ---
  const table = document.getElementById("compare-table-element");
  if (!table) return;

  // Table Head
  const headHtml = `
    <thead>
      <tr>
        <th>Features</th>
        <th>
          <div class="compare-header-card">
            <div class="compare-header-logo" style="background: ${uniA.logoColor}">${uniA.logoInitials}</div>
            <div class="compare-header-info">
              <h3>${uniA.name}</h3>
              <div class="compare-header-stars">
                <i class="fas fa-star"></i>
                <span>★ ${uniA.rating} / 5.0</span>
              </div>
            </div>
          </div>
        </th>
        <th>
          <div class="compare-header-card">
            <div class="compare-header-logo" style="background: ${uniB.logoColor}">${uniB.logoInitials}</div>
            <div class="compare-header-info">
              <h3>${uniB.name}</h3>
              <div class="compare-header-stars">
                <i class="fas fa-star"></i>
                <span>★ ${uniB.rating} / 5.0</span>
              </div>
            </div>
          </div>
        </th>
      </tr>
    </thead>
  `;

  // Table rows fields
  const rows = [
    {
      label: "Accreditations",
      render: (uni) => `
        <span class="compare-emerald-tag">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
          UGC-DEB, NAAC ${uni.naacGrade}
        </span>
      `
    },
    {
      label: "Total Fee Program",
      render: (uni) => `<span class="compare-detail-fee">₹${(uni.courses[course]?.feeTotal || 0).toLocaleString("en-IN")}</span>`
    },
    {
      label: "Semester Fee",
      render: (uni) => `<span class="compare-sem-fee">₹${(uni.courses[course]?.feeSemester || 0).toLocaleString("en-IN")} / Sem</span>`
    },
    {
      label: "Average Package",
      render: (uni) => `<span class="compare-pkg-text">${uni === uniA ? salaryTextA : salaryTextB}</span>`
    },
    {
      label: "Approvals",
      render: (uni) => `
        <div class="compare-approval-bubble-list">
          ${uni.approvals.map(app => `<span class="compare-approval-bubble">${app}</span>`).join("")}
        </div>
      `
    },
    {
      label: "LMS Quality Rating",
      render: (uni) => `<strong>${uni.lmsRating} / 5.0</strong>`
    },
    {
      label: "Placement Rate",
      render: (uni) => `
        <strong>${uni.placementRate}% Placement Assistance</strong>
        <div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">Top Hiring Partners: ${uni.placementPartners.slice(0, 3).join(", ")}</div>
      `
    },
    {
      label: "Key Features",
      render: (uni) => `
        <ul class="compare-features-bullet-list">
          ${uni.features.map(f => `<li><i class="fas fa-check"></i> <span>${f}</span></li>`).join("")}
        </ul>
      `
    },
    {
      label: "EMI Option",
      render: (uni) => `Starts at <strong>${uni.emiStarts}</strong>`
    },
    {
      label: "Action",
      render: (uni) => `
        <div class="compare-actions-cell">
          <button class="btn btn-primary" onclick="openModal('${uni.id}')">View Details</button>
          <button class="btn btn-accent" onclick="startCounselingWithUni('${uni.id}')">Get Counseling</button>
        </div>
      `
    }
  ];

  let rowsHtml = "";
  rows.forEach(row => {
    rowsHtml += `
      <tr>
        <td>${row.label}</td>
        <td>${row.render(uniA)}</td>
        <td>${row.render(uniB)}</td>
      </tr>
    `;
  });

  table.innerHTML = `
    ${headHtml}
    <tbody>
      ${rowsHtml}
    </tbody>
  `;
}

window.startCounselingWithUni = function (uniId) {
  // Open inquiry modal directly
  const inquiryModal = document.getElementById("inquiry-modal");
  if (inquiryModal) {
    inquiryModal.style.display = "flex";
  }
};

// --- UNIVERSITY DETAIL MODAL ACTIONS ---
window.openModal = function (uniId) {
  // Open inquiry modal instead of the university detail modal
  const inquiryModal = document.getElementById("inquiry-modal");
  if (inquiryModal) {
    inquiryModal.style.display = "flex";
  }
};

function renderModalReviews(uniId) {
  const container = document.getElementById("modal-reviews-list");
  if (!container) return;

  container.innerHTML = "";

  const reviews = state.reviewsDb[uniId] || [];

  if (reviews.length === 0) {
    container.innerHTML = `<p style="color:var(--text-light); text-align:center; padding: 20px;">No reviews yet. Be the first to add a review!</p>`;
    return;
  }

  reviews.forEach(rev => {
    const div = document.createElement("div");
    div.className = "review-card";
    div.style.marginBottom = "16px";

    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      starsHtml += `<i class="fas fa-star" style="color: ${i <= rev.rating ? '#FBBF24' : '#E2E8F0'}"></i>`;
    }

    div.innerHTML = `
      <div class="review-stars">${starsHtml}</div>
      <p class="review-text">"${rev.comment}"</p>
      <div class="review-author">
        <div class="author-avatar">${rev.student.charAt(0)}</div>
        <div class="author-info">
          <h4>${rev.student}</h4>
          <p>${rev.course} student | Posted on ${rev.date}</p>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) overlay.style.display = "none";
  document.body.style.overflow = ""; // Enable page scroll
}

// Attach helpers to window for easy inline access in HTML templates
window.startCounselingWithUni = startCounselingWithUni;
window.resetFilters = resetFilters;

// --- BLOG PAGE RENDERING FUNCTIONS ---
function renderBlogsList() {
  const grid = document.getElementById("blog-posts-grid");
  const statusContainer = document.getElementById("blog-search-status");
  const searchTermSpan = document.getElementById("blog-search-term");
  const paginationContainer = document.getElementById("blog-pagination");

  if (!grid) return;

  grid.innerHTML = "";

  // Filter blogs
  let filteredBlogs = BLOGS_DATA;

  // Filter by category
  if (state.blogCategory !== "all") {
    filteredBlogs = filteredBlogs.filter(blog => blog.category === state.blogCategory);
  }

  // Filter by search query
  if (state.blogQuery) {
    filteredBlogs = filteredBlogs.filter(blog =>
      blog.title.toLowerCase().includes(state.blogQuery) ||
      blog.excerpt.toLowerCase().includes(state.blogQuery) ||
      blog.category.toLowerCase().includes(state.blogQuery) ||
      blog.content.toLowerCase().includes(state.blogQuery)
    );
  }

  // Show / Hide search status
  if (statusContainer && searchTermSpan) {
    if (state.blogQuery) {
      searchTermSpan.textContent = state.blogQuery;
      statusContainer.style.display = "flex";
    } else {
      statusContainer.style.display = "none";
    }
  }

  // Hide categories card if BLOGS_DATA is empty
  const categoryContainer = document.getElementById("blog-categories-list");
  if (categoryContainer) {
    const categoryCard = categoryContainer.closest(".blog-sidebar-card");
    if (categoryCard) {
      categoryCard.style.display = BLOGS_DATA.length === 0 ? "none" : "block";
    }
  }

  // Render empty state if needed
  if (filteredBlogs.length === 0) {
    const countTextEl = document.getElementById("blog-count-text");
    if (countTextEl) {
      countTextEl.innerHTML = "Showing <strong>0</strong> articles";
    }

    if (BLOGS_DATA.length === 0) {
      grid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1; width: 100%;">
          <i class="fas fa-book-open"></i>
          <h3>No Articles Published</h3>
          <p>Stay tuned! Expert guides, legal validity checks, and placement analytics will be published here soon.</p>
        </div>
      `;
    } else {
      grid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1; width: 100%;">
          <i class="fas fa-search"></i>
          <h3>No Articles Found</h3>
          <p>We couldn't find any articles matching your search query or category. Try search terms like 'MBA', 'Validity', or 'NAAC'.</p>
        </div>
      `;
    }
    if (paginationContainer) paginationContainer.style.display = "none";
    return;
  }

  // Calculate pagination variables
  const totalBlogs = filteredBlogs.length;
  const totalPages = Math.ceil(totalBlogs / state.blogPageSize);
  
  // Clamp current page to valid range
  if (state.blogPage > totalPages) {
    state.blogPage = Math.max(1, totalPages);
  }
  
  const startIndex = (state.blogPage - 1) * state.blogPageSize;
  const endIndex = startIndex + state.blogPageSize;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  // Update blog stats bar count
  const countTextEl = document.getElementById("blog-count-text");
  if (countTextEl) {
    const from = startIndex + 1;
    const to = Math.min(endIndex, totalBlogs);
    countTextEl.innerHTML = `Showing <strong>${from}-${to}</strong> of <strong>${totalBlogs}</strong> articles`;
  }

  // Render cards
  paginatedBlogs.forEach(blog => {
    const card = document.createElement("div");
    card.className = "blog-card";
    card.addEventListener("click", () => {
      window.location.hash = `#blog-detail?id=${blog.id}`;
    });

    // Format date nicely
    const dateFormatted = new Date(blog.date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    card.innerHTML = `
      <div class="blog-card-meta">
        <span class="blog-card-category">${blog.category}</span>
        <span class="blog-card-readtime"><i class="far fa-clock"></i> ${blog.readTime}</span>
      </div>
      <h3>${blog.title}</h3>
      <p>${blog.excerpt}</p>
      <div class="blog-card-footer">
        <span class="blog-card-author">By ${blog.author}</span>
        <span class="blog-card-more-btn">Read Article <i class="fas fa-arrow-right"></i></span>
      </div>
    `;
    grid.appendChild(card);
  });

  // Render pagination controls
  renderBlogPagination(totalPages);
}

function renderBlogPagination(totalPages) {
  const container = document.getElementById("blog-pagination");
  if (!container) return;

  container.innerHTML = "";

  if (totalPages <= 1) {
    container.style.display = "none";
    return;
  }
  container.style.display = "flex";

  // Prev Button
  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevBtn.disabled = state.blogPage === 1;
  prevBtn.addEventListener("click", () => {
    if (state.blogPage > 1) {
      state.blogPage--;
      renderBlogsList();
      const viewEl = document.getElementById("blog-view");
      if (viewEl) viewEl.scrollIntoView({ behavior: "smooth" });
    }
  });
  container.appendChild(prevBtn);

  // Page Numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, state.blogPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    if (i === state.blogPage) {
      pageBtn.className = "active";
    }
    pageBtn.addEventListener("click", () => {
      state.blogPage = i;
      renderBlogsList();
      const viewEl = document.getElementById("blog-view");
      if (viewEl) viewEl.scrollIntoView({ behavior: "smooth" });
    });
    container.appendChild(pageBtn);
  }

  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextBtn.disabled = state.blogPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (state.blogPage < totalPages) {
      state.blogPage++;
      renderBlogsList();
      const viewEl = document.getElementById("blog-view");
      if (viewEl) viewEl.scrollIntoView({ behavior: "smooth" });
    }
  });
  container.appendChild(nextBtn);
}

function renderBlogDetail(blogId) {
  const blog = BLOGS_DATA.find(b => b.id === blogId);
  if (!blog) {
    window.location.hash = "#blog";
    return;
  }

  // Inject details
  const titleEl = document.getElementById("blog-article-title");
  const catEl = document.getElementById("blog-article-category");
  const readEl = document.getElementById("blog-article-readtime");
  const authorEl = document.getElementById("blog-article-author");
  const dateEl = document.getElementById("blog-article-date");
  const avatarEl = document.getElementById("blog-article-avatar");
  const bodyEl = document.getElementById("blog-article-body");

  if (titleEl) titleEl.textContent = blog.title;
  if (catEl) {
    catEl.textContent = blog.category;
    catEl.style.cursor = "pointer";
    catEl.onclick = () => {
      window.location.hash = `#blog?category=${encodeURIComponent(blog.category)}`;
    };
  }
  if (readEl) readEl.innerHTML = `<i class="far fa-clock"></i> ${blog.readTime}`;
  if (authorEl) authorEl.textContent = blog.author;
  if (dateEl) {
    const formattedDate = new Date(blog.date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    dateEl.textContent = `Posted on ${formattedDate}`;
  }
  if (avatarEl) avatarEl.textContent = blog.author.charAt(0);
  if (bodyEl) bodyEl.innerHTML = blog.content;

  // Render Related Posts
  renderRelatedBlogs(blog);
}

function renderRelatedBlogs(currentBlog) {
  const grid = document.getElementById("blog-related-grid");
  if (!grid) return;

  grid.innerHTML = "";

  // Filter other blogs matching category
  let related = BLOGS_DATA.filter(b => b.id !== currentBlog.id && b.category === currentBlog.category);

  // If we don't have enough, pull in other posts
  if (related.length < 3) {
    const fillers = BLOGS_DATA.filter(b => b.id !== currentBlog.id && b.category !== currentBlog.category);
    related = [...related, ...fillers].slice(0, 3);
  } else {
    related = related.slice(0, 3);
  }

  related.forEach(blog => {
    const card = document.createElement("div");
    card.className = "blog-card";
    card.addEventListener("click", () => {
      window.location.hash = `#blog-detail?id=${blog.id}`;
    });

    card.innerHTML = `
      <div class="blog-card-meta">
        <span class="blog-card-category" style="font-size:0.75rem; padding: 2px 8px;">${blog.category}</span>
        <span class="blog-card-readtime"><i class="far fa-clock"></i> ${blog.readTime}</span>
      </div>
      <h3 style="font-size: 1.1rem; line-height: 1.3;">${blog.title}</h3>
      <p style="font-size: 0.85rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${blog.excerpt}</p>
      <div class="blog-card-footer">
        <span class="blog-card-author">By ${blog.author}</span>
        <span class="blog-card-more-btn" style="font-size:0.75rem;">Read <i class="fas fa-arrow-right"></i></span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderTrendingBlogs() {
  const container = document.getElementById("blog-popular-list");
  if (!container) return;

  container.innerHTML = "";

  // Hide popular card if BLOGS_DATA is empty
  const card = container.closest(".blog-sidebar-card");
  if (card) {
    card.style.display = BLOGS_DATA.length === 0 ? "none" : "block";
  }

  if (BLOGS_DATA.length === 0) return;

  // Take first 3 blogs as popular/trending posts
  const trending = BLOGS_DATA.slice(0, 3);

  trending.forEach(blog => {
    const item = document.createElement("div");
    item.className = "blog-popular-item";
    item.addEventListener("click", () => {
      window.location.hash = `#blog-detail?id=${blog.id}`;
    });

    const formattedDate = new Date(blog.date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    item.innerHTML = `
      <h4>${blog.title}</h4>
      <span>${formattedDate} &bull; ${blog.readTime}</span>
    `;
    container.appendChild(item);
  });
}

// --- Dynamic SEO and Meta Tag Updates ---
function updateSEO(viewName, params = {}) {
  let title = "OnlineDegrees | Compare & Choose Top Online Degree Programs";
  let description = "Find the best online degree programs from top UGC-DEB approved universities. Compare fees, LMS, placements, and ratings in one place.";
  let ogType = "website";
  let ogImage = "https://www.getonlinedegrees.online/assets/logo.png";
  let schemaData = null;

  // Determine dynamic metadata based on the active viewName
  if (viewName === "catalog") {
    if (params.course) {
      const courseUpper = params.course.toUpperCase();
      title = `Best Online ${courseUpper} Programs | Fees & Reviews | OnlineDegrees`;
      description = `Compare top UGC-DEB and AICTE approved Online ${courseUpper} programs in India. Compare semester fees, duration, LMS platforms, and placement support.`;
      
      const courseKey = params.course.toLowerCase();
      const courseInfo = typeof COURSES_DATA !== 'undefined' ? COURSES_DATA[courseKey] : null;

      // Dynamic Course Schema
      schemaData = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": courseInfo ? courseInfo.name : `Online ${courseUpper}`,
        "description": courseInfo ? courseInfo.description : description,
        "educationalCredentialAwarded": courseInfo ? courseInfo.fullName : `${courseUpper} Degree`,
        "provider": {
          "@type": "Organization",
          "name": "OnlineDegrees",
          "url": "https://www.getonlinedegrees.online/"
        }
      };

      if (courseInfo) {
        schemaData.hasCourseInstance = {
          "@type": "CourseInstance",
          "courseMode": "online",
          "duration": courseInfo.duration
        };
      }
    } else if (params.university) {
      // Find university details to personalize SEO
      const uniId = params.university;
      const university = UNIVERSITIES.find(u => u.id === uniId);
      if (university) {
        title = `${university.name} Online Programs, Fees & Placements | OnlineDegrees`;
        description = `Explore programs offered by ${university.name} Online. Read real student reviews, check total tuition fees, EMI options, NAAC rating, and hiring partners.`;
        
        // Dynamic Educational Organization Schema
        schemaData = {
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": university.name,
          "description": description,
          "url": `https://www.getonlinedegrees.online/#catalog?university=${uniId}`,
          "logo": ogImage,
          "sameAs": university.website || "",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          },
          "award": `NAAC Grade ${university.naacGrade || "A+"}`,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": university.rating || "4.5",
            "reviewCount": university.reviews ? university.reviews.length : "10"
          }
        };
      } else {
        title = "Accredited Online University Programs | OnlineDegrees";
        description = "Find and filter UGC approved online degrees (MBA, MCA, BCA, BBA, M.Com) from top-rated online colleges in India.";
      }
    } else {
      title = "Find Online Degree Programs | Compare Colleges | OnlineDegrees";
      description = "Find and filter UGC approved online degrees (MBA, MCA, BCA, BBA, M.Com) from top-rated online colleges in India.";
    }
  } else if (viewName === "compare") {
    title = "Compare Online Universities Side-by-Side | OnlineDegrees";
    description = "Use our comparison board to compare fees, approvals, placement ratings, student support, and learning systems of top online colleges.";
  } else if (viewName === "blog") {
    if (params.category && params.category !== "all") {
      title = `${params.category} - Expert Guides & Insights | OnlineDegrees`;
      description = `Browse our expert guides, comparisons, and reviews on online degree programs under the category: ${params.category}.`;
    } else {
      title = "Expert Blogs & Guides on Online Education | OnlineDegrees";
      description = "Stay informed with expert insights, university reviews, career guidelines, and distance education regulations in India.";
    }
  } else if (viewName === "blog-detail") {
    const blogId = params.id;
    const blog = BLOGS_DATA.find(b => b.id === blogId);
    if (blog) {
      title = `${blog.title} | OnlineDegrees`;
      description = blog.excerpt || "Read our educational insight and guide on online degree programs and top accredited universities in India.";
      ogType = "article";
      
      // Dynamic Article Schema
      schemaData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": description,
        "datePublished": blog.date,
        "dateModified": blog.date,
        "image": [ ogImage ],
        "author": {
          "@type": "Person",
          "name": blog.author || "Academic Counselors Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "OnlineDegrees",
          "logo": {
            "@type": "ImageObject",
            "url": ogImage
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": window.location.href
        }
      };
    }
  } else if (viewName === "contact") {
    title = "Free Expert Counseling & Contact Support | OnlineDegrees";
    description = "Have queries about online degrees, tuition fees, or admission deadlines? Get in touch with our counseling experts today for 100% free guidance.";
  } else if (viewName === "resume-builder") {
    title = "Free Interactive Resume Builder | OnlineDegrees";
    description = "Create a premium, professional, ATS-friendly resume in real-time. Choose templates, fonts, accents, and export to PDF instantly.";
  } else {
    // Default / Home
    title = "OnlineDegrees | Compare & Choose Top Online Degree Programs";
    description = "Find the best online degree programs from top UGC-DEB approved universities. Compare fees, LMS, placements, and ratings in one place.";
    
    // Website and Organization Schema
    schemaData = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "OnlineDegrees",
        "url": "https://www.getonlinedegrees.online/"
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "OnlineDegrees",
        "url": "https://www.getonlinedegrees.online/",
        "logo": ogImage,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-6375079973",
          "contactType": "customer service"
        }
      }
    ];
  }

  // 1. Update Title tag
  document.title = title;

  // 2. Update Meta Description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", description);
  }

  // 3. Update Canonical Link
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute("href", window.location.origin + window.location.pathname + window.location.hash);
  }

  // 4. Update Open Graph Meta Tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", window.location.href);

  const ogTypeTag = document.querySelector('meta[property="og:type"]');
  if (ogTypeTag) ogTypeTag.setAttribute("content", ogType);

  const ogImageTag = document.querySelector('meta[property="og:image"]');
  if (ogImageTag) ogImageTag.setAttribute("content", ogImage);

  // 5. Update Twitter Meta Tags
  const twTitle = document.querySelector('meta[property="twitter:title"]');
  if (twTitle) twTitle.setAttribute("content", title);

  const twDesc = document.querySelector('meta[property="twitter:description"]');
  if (twDesc) twDesc.setAttribute("content", description);

  const twUrl = document.querySelector('meta[property="twitter:url"]');
  if (twUrl) twUrl.setAttribute("content", window.location.href);

  // 6. Inject dynamic JSON-LD Schema
  let schemaScript = document.getElementById("seo-schema-ld-json");
  if (!schemaScript) {
    schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.id = "seo-schema-ld-json";
    document.head.appendChild(schemaScript);
  }

  if (schemaData) {
    schemaScript.textContent = JSON.stringify(schemaData, null, 2);
  } else {
    const defaultSchema = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "OnlineDegrees",
        "url": "https://www.getonlinedegrees.online/"
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "OnlineDegrees",
        "url": "https://www.getonlinedegrees.online/",
        "logo": ogImage,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-6375079973",
          "contactType": "customer service"
        }
      }
    ];
    schemaScript.textContent = JSON.stringify(defaultSchema, null, 2);
  }
}

// ==========================================================================
// RESUME BUILDER ENGINE & CONTROLLERS
// ==========================================================================

const SAMPLE_RESUME_DATA = {
  template: "modern",
  font: "font-inter",
  spacing: "spacing-normal",
  accentColor: "#4F46E5",
  personal: {
    name: "Amit Sengupta",
    title: "Lead Software Architect",
    email: "amit.sengupta@email.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka",
    website: "amitsengupta.dev",
    linkedin: "linkedin.com/in/amitsengupta",
    github: "github.com/amitsengupta",
    summary: "Dynamic and results-driven Software Architect with 8+ years of experience designing scalable web applications and cloud architectures. Expertise in JavaScript/TypeScript ecosystems, Node.js, React, and AWS cloud solutions. Passionate about writing clean, maintainable code and mentoring junior engineers."
  },
  experience: [
    {
      id: "exp-1",
      title: "Senior Software Engineer / Team Lead",
      company: "Tech Mahindra Online Solutions",
      location: "Bengaluru",
      start: "Jan 2023",
      end: "Present",
      desc: "• Architected and developed a micro-frontend educational platform servicing over 100k monthly active users.\n• Promoted to Team Lead within 1 year; managed a cross-functional team of 6 software engineers.\n• Integrated headless CMS and AWS Cognito, reducing loading latency by 35% and improving security audits."
    },
    {
      id: "exp-2",
      title: "Software Engineer II",
      company: "Wipro Digital Hub",
      location: "Pune",
      start: "Jun 2020",
      end: "Dec 2022",
      desc: "• Built responsive web interfaces using React.js, Tailwind CSS, and Redux Toolkit.\n• Implemented automated CI/CD pipelines using GitHub Actions, decreasing build failures by 20%.\n• Optimized database query speeds by 40% through indexing and caching with Redis."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Online MCA (Master of Computer Applications)",
      school: "Chandigarh University Online",
      location: "Chandigarh, India",
      date: "2023 - 2025",
      grade: "CGPA: 9.1/10"
    },
    {
      id: "edu-2",
      degree: "Bachelor of Computer Applications (BCA)",
      school: "Sikkim Manipal University Online",
      location: "Sikkim, India",
      date: "2017 - 2020",
      grade: "Grade: First Class"
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Cloud Compare Engine",
      tech: "React, Node.js, Express, AWS",
      link: "cloudcompare.onlinedegrees.com",
      desc: "An interactive side-by-side comparison engine analyzing cloud pricing databases, utilized by over 50 enterprise clients."
    },
    {
      id: "proj-2",
      title: "Open Education Portal",
      tech: "Next.js, GraphQL, PostgreSQL",
      link: "github.com/amitsengupta/open-edu",
      desc: "Contributed to an open-source platform hosting digital textbooks, integrating international translation APIs."
    }
  ],
  skills: "JavaScript, TypeScript, React, Node.js, HTML5/CSS3, Python, PostgreSQL, AWS (S3/EC2/Lambda), Docker, Git, RESTful APIs, System Design",
  certs: "AWS Certified Solutions Architect (Associate), Certified Scrum Master (CSM)",
  langs: "English (Professional), Hindi (Native)"
};

function initResumeBuilder() {
  const saved = localStorage.getItem("online_degrees_resume");
  if (saved) {
    state.resumeData = JSON.parse(saved);
  } else {
    state.resumeData = JSON.parse(JSON.stringify(SAMPLE_RESUME_DATA));
    saveResumeState();
  }
  
  syncStateToForm();
  renderResumePreview();
  setupResumeBuilderEventListeners();
}

function saveResumeState() {
  localStorage.setItem("online_degrees_resume", JSON.stringify(state.resumeData));
}

function loadResumeSampleData() {
  state.resumeData = JSON.parse(JSON.stringify(SAMPLE_RESUME_DATA));
  saveResumeState();
  syncStateToForm();
  renderResumePreview();
}

function clearResumeState() {
  state.resumeData = {
    template: "modern",
    font: "font-inter",
    spacing: "spacing-normal",
    accentColor: "#4F46E5",
    personal: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: ""
    },
    experience: [],
    education: [],
    projects: [],
    skills: "",
    certs: "",
    langs: ""
  };
  saveResumeState();
  syncStateToForm();
  renderResumePreview();
}

function syncStateToForm() {
  const data = state.resumeData;
  const p = data.personal || {};
  
  // Personal Details fields
  const setName = document.getElementById("resume-name");
  if (setName) setName.value = p.name || "";
  const setTitle = document.getElementById("resume-title");
  if (setTitle) setTitle.value = p.title || "";
  const setEmail = document.getElementById("resume-email");
  if (setEmail) setEmail.value = p.email || "";
  const setPhone = document.getElementById("resume-phone");
  if (setPhone) setPhone.value = p.phone || "";
  const setLoc = document.getElementById("resume-location");
  if (setLoc) setLoc.value = p.location || "";
  const setWeb = document.getElementById("resume-website");
  if (setWeb) setWeb.value = p.website || "";
  const setLnk = document.getElementById("resume-linkedin");
  if (setLnk) setLnk.value = p.linkedin || "";
  const setGit = document.getElementById("resume-github");
  if (setGit) setGit.value = p.github || "";
  const setSum = document.getElementById("resume-summary");
  if (setSum) setSum.value = p.summary || "";

  // Dynamic Lists fields
  renderExperienceFormList();
  renderEducationFormList();
  renderProjectsFormList();

  // Skills, Certs, Languages fields
  const setSkl = document.getElementById("resume-skills-input");
  if (setSkl) setSkl.value = data.skills || "";
  const setCrt = document.getElementById("resume-certs-input");
  if (setCrt) setCrt.value = data.certs || "";
  const setLng = document.getElementById("resume-langs-input");
  if (setLng) setLng.value = data.langs || "";

  // Style Property fields
  const setTpl = document.getElementById("resume-template-select");
  if (setTpl) setTpl.value = data.template || "modern";
  const setFnt = document.getElementById("resume-font-select");
  if (setFnt) setFnt.value = data.font || "font-inter";
  const setSpc = document.getElementById("resume-spacing-select");
  if (setSpc) setSpc.value = data.spacing || "spacing-normal";
  const setCol = document.getElementById("custom-accent-color");
  if (setCol) setCol.value = data.accentColor || "#4F46E5";

  // Sync active accent color class preset circles
  document.querySelectorAll(".accent-color-btn").forEach(btn => {
    if (btn.getAttribute("data-color") === data.accentColor) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function renderExperienceFormList() {
  const container = document.getElementById("experience-list-container");
  if (!container) return;
  container.innerHTML = "";

  const items = state.resumeData.experience || [];
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "dynamic-item-card";
    card.innerHTML = `
      <button type="button" class="btn-remove-item" data-id="${item.id}">
        <i class="fas fa-times"></i> Remove
      </button>
      <div class="form-group-row">
        <div class="form-group">
          <label>Job Title</label>
          <input type="text" class="form-control exp-input" data-id="${item.id}" data-field="title" value="${item.title || ''}" placeholder="e.g. Senior Developer">
        </div>
        <div class="form-group">
          <label>Company / Employer</label>
          <input type="text" class="form-control exp-input" data-id="${item.id}" data-field="company" value="${item.company || ''}" placeholder="e.g. Wipro Solutions">
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label>Start Date</label>
          <input type="text" class="form-control exp-input" data-id="${item.id}" data-field="start" value="${item.start || ''}" placeholder="e.g. Jan 2023">
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="text" class="form-control exp-input" data-id="${item.id}" data-field="end" value="${item.end || ''}" placeholder="e.g. Present or Dec 2024">
        </div>
      </div>
      <div class="form-group">
        <label>Location (Optional)</label>
        <input type="text" class="form-control exp-input" data-id="${item.id}" data-field="location" value="${item.location || ''}" placeholder="e.g. Bengaluru">
      </div>
      <div class="form-group">
        <label>Description / Achievements</label>
        <textarea class="form-control exp-input" data-id="${item.id}" data-field="desc" rows="3" placeholder="Key responsibilities and achievements...">${item.desc || ''}</textarea>
      </div>
    `;
    container.appendChild(card);
  });

  // Attach event listeners to exp inputs
  container.querySelectorAll(".exp-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const val = e.target.value;
      const targetItem = state.resumeData.experience.find(i => i.id === id);
      if (targetItem) {
        targetItem[field] = val;
        saveResumeState();
        renderResumePreview();
      }
    });
  });

  // Attach event listener to delete button
  container.querySelectorAll(".btn-remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      state.resumeData.experience = state.resumeData.experience.filter(i => i.id !== id);
      saveResumeState();
      renderExperienceFormList();
      renderResumePreview();
    });
  });
}

function renderEducationFormList() {
  const container = document.getElementById("education-list-container");
  if (!container) return;
  container.innerHTML = "";

  const items = state.resumeData.education || [];
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "dynamic-item-card";
    card.innerHTML = `
      <button type="button" class="btn-remove-item" data-id="${item.id}">
        <i class="fas fa-times"></i> Remove
      </button>
      <div class="form-group-row">
        <div class="form-group">
          <label>Degree / Qualification</label>
          <input type="text" class="form-control edu-input" data-id="${item.id}" data-field="degree" value="${item.degree || ''}" placeholder="e.g. Online MCA">
        </div>
        <div class="form-group">
          <label>School / University</label>
          <input type="text" class="form-control edu-input" data-id="${item.id}" data-field="school" value="${item.school || ''}" placeholder="e.g. Chandigarh University Online">
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label>Graduation Year / Dates</label>
          <input type="text" class="form-control edu-input" data-id="${item.id}" data-field="date" value="${item.date || ''}" placeholder="e.g. 2023 - 2025">
        </div>
        <div class="form-group">
          <label>Grade / GPA (Optional)</label>
          <input type="text" class="form-control edu-input" data-id="${item.id}" data-field="grade" value="${item.grade || ''}" placeholder="e.g. CGPA: 9.1/10">
        </div>
      </div>
      <div class="form-group">
        <label>Location (Optional)</label>
        <input type="text" class="form-control edu-input" data-id="${item.id}" data-field="location" value="${item.location || ''}" placeholder="e.g. Chandigarh, India">
      </div>
    `;
    container.appendChild(card);
  });

  // Attach event listeners to edu inputs
  container.querySelectorAll(".edu-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const val = e.target.value;
      const targetItem = state.resumeData.education.find(i => i.id === id);
      if (targetItem) {
        targetItem[field] = val;
        saveResumeState();
        renderResumePreview();
      }
    });
  });

  // Attach delete listeners
  container.querySelectorAll(".btn-remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      state.resumeData.education = state.resumeData.education.filter(i => i.id !== id);
      saveResumeState();
      renderEducationFormList();
      renderResumePreview();
    });
  });
}

function renderProjectsFormList() {
  const container = document.getElementById("projects-list-container");
  if (!container) return;
  container.innerHTML = "";

  const items = state.resumeData.projects || [];
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "dynamic-item-card";
    card.innerHTML = `
      <button type="button" class="btn-remove-item" data-id="${item.id}">
        <i class="fas fa-times"></i> Remove
      </button>
      <div class="form-group-row">
        <div class="form-group">
          <label>Project Title</label>
          <input type="text" class="form-control proj-input" data-id="${item.id}" data-field="title" value="${item.title || ''}" placeholder="e.g. Cloud Compare Engine">
        </div>
        <div class="form-group">
          <label>Tech Stack</label>
          <input type="text" class="form-control proj-input" data-id="${item.id}" data-field="tech" value="${item.tech || ''}" placeholder="e.g. React, Node.js">
        </div>
      </div>
      <div class="form-group">
        <label>Project Link (Optional)</label>
        <input type="text" class="form-control proj-input" data-id="${item.id}" data-field="link" value="${item.link || ''}" placeholder="e.g. cloudcompare.onlinedegrees.com">
      </div>
      <div class="form-group">
        <label>Short Description</label>
        <textarea class="form-control proj-input" data-id="${item.id}" data-field="desc" rows="2" placeholder="Brief project summary...">${item.desc || ''}</textarea>
      </div>
    `;
    container.appendChild(card);
  });

  // Attach event listeners to proj inputs
  container.querySelectorAll(".proj-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const val = e.target.value;
      const targetItem = state.resumeData.projects.find(i => i.id === id);
      if (targetItem) {
        targetItem[field] = val;
        saveResumeState();
        renderResumePreview();
      }
    });
  });

  // Attach delete listeners
  container.querySelectorAll(".btn-remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      state.resumeData.projects = state.resumeData.projects.filter(i => i.id !== id);
      saveResumeState();
      renderProjectsFormList();
      renderResumePreview();
    });
  });
}

function getContactInfoHTML(p) {
  let html = "";
  if (p.email) html += `<span><i class="far fa-envelope"></i> ${p.email}</span>`;
  if (p.phone) html += `<span><i class="fas fa-phone-alt"></i> ${p.phone}</span>`;
  if (p.location) html += `<span><i class="fas fa-map-marker-alt"></i> ${p.location}</span>`;
  if (p.website) html += `<span><i class="fas fa-globe"></i> ${p.website}</span>`;
  if (p.linkedin) html += `<span><i class="fab fa-linkedin"></i> ${p.linkedin}</span>`;
  if (p.github) html += `<span><i class="fab fa-github"></i> ${p.github}</span>`;
  return html;
}

function getSkillsHTML() {
  const skills = state.resumeData.skills || "";
  if (!skills.trim()) return "";
  const list = skills.split(",").map(s => s.trim()).filter(s => s.length > 0);
  return `
    <div class="resume-section">
      <h2><i class="fas fa-tools"></i> Skills</h2>
      <div class="resume-skills-grid">
        ${list.map(s => `<span class="resume-skill-badge">${s}</span>`).join("")}
      </div>
    </div>
  `;
}

function getCertificationsHTML() {
  const certs = state.resumeData.certs || "";
  if (!certs.trim()) return "";
  const list = certs.split(",").map(c => c.trim()).filter(c => c.length > 0);
  const items = list.map(c => `<li>${c}</li>`).join("");
  return `
    <div class="resume-section">
      <h2><i class="fas fa-certificate"></i> Certifications</h2>
      <ul style="padding-left:20px; font-size:0.9em; color:#334155; margin-top:5px; line-height:1.4;">
        ${items}
      </ul>
    </div>
  `;
}

function getLanguagesHTML() {
  const langs = state.resumeData.langs || "";
  if (!langs.trim()) return "";
  const list = langs.split(",").map(l => l.trim()).filter(l => l.length > 0);
  return `
    <div class="resume-section">
      <h2><i class="fas fa-language"></i> Languages</h2>
      <p style="font-size:0.9em; color:#334155; margin-top:5px;">${list.join(", ")}</p>
    </div>
  `;
}

function renderExperiencePreview() {
  const exp = state.resumeData.experience || [];
  if (exp.length === 0) return "";
  
  const itemsHTML = exp.map(item => `
    <div class="resume-item">
      <div class="resume-item-header">
        <span class="resume-item-title" style="color:#0f172a; font-weight:700;">${item.title || 'Job Title'}</span>
        <span class="resume-item-date" style="font-size:0.85em; font-weight:600; color:#64748b; white-space:nowrap;">${item.start || ''} - ${item.end || ''}</span>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.85em; color:#475569; font-weight:600; margin-bottom:4px;">
        <span class="resume-item-company" style="font-style:italic;">${item.company || 'Company'}</span>
        <span style="font-size:0.95em; color:#64748b;">${item.location || ''}</span>
      </div>
      ${item.desc ? `<p class="resume-item-desc">${item.desc}</p>` : ""}
    </div>
  `).join("");
  
  return `
    <div class="resume-section">
      <h2><i class="fas fa-briefcase"></i> Experience</h2>
      ${itemsHTML}
    </div>
  `;
}

function renderEducationPreview() {
  const edu = state.resumeData.education || [];
  if (edu.length === 0) return "";
  
  const itemsHTML = edu.map(item => `
    <div class="resume-item">
      <div class="resume-item-header">
        <span class="resume-item-title" style="color:#0f172a; font-weight:700;">${item.degree || 'Degree / Qualification'}</span>
        <span class="resume-item-date" style="font-size:0.85em; font-weight:600; color:#64748b; white-space:nowrap;">${item.date || ''}</span>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.85em; color:#475569; font-weight:600; margin-bottom: 2px;">
        <span class="resume-item-company" style="font-style:italic;">${item.school || 'School/University'}</span>
        <span style="color:#64748b;">${item.grade || ''}</span>
      </div>
      ${item.location ? `<p style="font-size:0.8em; color:#64748b; margin-top:2px;">Location: ${item.location}</p>` : ""}
    </div>
  `).join("");
  
  return `
    <div class="resume-section">
      <h2><i class="fas fa-graduation-cap"></i> Education</h2>
      ${itemsHTML}
    </div>
  `;
}

function renderProjectsPreview() {
  const projs = state.resumeData.projects || [];
  if (projs.length === 0) return "";
  
  const itemsHTML = projs.map(item => `
    <div class="resume-item">
      <div class="resume-item-header">
        <span class="resume-item-title" style="color:#0f172a; font-weight:700;">${item.title || 'Project Title'}</span>
        ${item.link ? `<span class="resume-item-date" style="font-size:0.8em; font-weight:600;"><a href="https://${item.link}" target="_blank" style="color:var(--resume-accent);"><i class="fas fa-external-link-alt" style="font-size:0.75rem; margin-right:2px;"></i>${item.link}</a></span>` : ""}
      </div>
      <p style="font-size:0.8em; font-weight:600; color:#475569; margin-bottom:3px;">Tech Stack: ${item.tech || ''}</p>
      ${item.desc ? `<p class="resume-item-desc">${item.desc}</p>` : ""}
    </div>
  `).join("");
  
  return `
    <div class="resume-section">
      <h2><i class="fas fa-laptop-code"></i> Projects</h2>
      ${itemsHTML}
    </div>
  `;
}

function renderModernTemplate(p) {
  return `
    <div class="resume-header">
      <div class="resume-name">${p.name || 'Your Name'}</div>
      <div class="resume-title">${p.title || 'Professional Title'}</div>
      <div class="resume-contact-info">
        ${getContactInfoHTML(p)}
      </div>
    </div>
    
    ${p.summary ? `
      <div class="resume-section">
        <h2><i class="far fa-user"></i> Summary</h2>
        <p class="resume-summary-text">${p.summary}</p>
      </div>
    ` : ""}
    
    ${renderExperiencePreview()}
    ${renderEducationPreview()}
    ${renderProjectsPreview()}
    ${getSkillsHTML()}
    ${getCertificationsHTML()}
    ${getLanguagesHTML()}
  `;
}

function renderClassicTemplate(p) {
  return `
    <div class="resume-header">
      <div class="resume-name">${p.name || 'Your Name'}</div>
      <div class="resume-title">${p.title || 'Professional Title'}</div>
      <div class="resume-contact-info">
        ${getContactInfoHTML(p)}
      </div>
    </div>
    
    ${p.summary ? `
      <div class="resume-section">
        <h2>Summary</h2>
        <p class="resume-summary-text">${p.summary}</p>
      </div>
    ` : ""}
    
    ${renderExperiencePreview()}
    ${renderEducationPreview()}
    ${renderProjectsPreview()}
    ${getSkillsHTML()}
    ${getCertificationsHTML()}
    ${getLanguagesHTML()}
  `;
}

function renderElegantSlateTemplate(p) {
  return `
    <div class="resume-header">
      <div class="resume-name">${p.name || 'Your Name'}</div>
      <div class="resume-title">${p.title || 'Professional Title'}</div>
      <div class="resume-contact-info">
        ${getContactInfoHTML(p)}
      </div>
    </div>
    
    ${p.summary ? `
      <div class="resume-section">
        <h2><i class="far fa-user"></i> Summary</h2>
        <p class="resume-summary-text">${p.summary}</p>
      </div>
    ` : ""}
    
    ${renderExperiencePreview()}
    ${renderEducationPreview()}
    ${renderProjectsPreview()}
    ${getSkillsHTML()}
    ${getCertificationsHTML()}
    ${getLanguagesHTML()}
  `;
}

function renderTwoColumnTemplate(p) {
  return `
    <aside class="resume-sidebar">
      <div class="resume-header">
        <div class="resume-name">${p.name || 'Your Name'}</div>
        <div class="resume-title" style="font-size:0.85rem; font-weight:700; color:var(--resume-accent); margin-top:2px;">${p.title || 'Title'}</div>
      </div>
      
      <div class="resume-contact-info">
        ${getContactInfoHTML(p)}
      </div>
      
      ${getSkillsHTML()}
      ${getCertificationsHTML()}
      ${getLanguagesHTML()}
    </aside>
    
    <main class="resume-main-col">
      ${p.summary ? `
        <div class="resume-section" style="margin-top:0;">
          <h2><i class="far fa-user"></i> Summary</h2>
          <p class="resume-summary-text" style="font-size:0.9em;">${p.summary}</p>
        </div>
      ` : ""}
      
      ${renderExperiencePreview()}
      ${renderEducationPreview()}
      ${renderProjectsPreview()}
    </main>
  `;
}

function renderResumePreview() {
  const sheet = document.getElementById("resume-preview-sheet-element");
  if (!sheet) return;
  
  const data = state.resumeData;
  const p = data.personal || {};
  
  sheet.className = "resume-preview-sheet";
  sheet.classList.add(`template-${data.template}`);
  sheet.classList.add(data.font);
  sheet.classList.add(data.spacing);
  sheet.style.setProperty("--resume-accent", data.accentColor);
  
  let html = "";
  if (data.template === "two-column") {
    html = renderTwoColumnTemplate(p);
  } else if (data.template === "classic") {
    html = renderClassicTemplate(p);
  } else if (data.template === "elegant-slate") {
    html = renderElegantSlateTemplate(p);
  } else {
    html = renderModernTemplate(p);
  }
  
  sheet.innerHTML = html;
}

function setupResumeBuilderEventListeners() {
  if (window.resumeBuilderListenersAttached) return;
  window.resumeBuilderListenersAttached = true;

  const bindPersonalField = (elementId, stateField) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.addEventListener("input", (e) => {
        state.resumeData.personal[stateField] = e.target.value;
        saveResumeState();
        renderResumePreview();
      });
    }
  };

  bindPersonalField("resume-name", "name");
  bindPersonalField("resume-title", "title");
  bindPersonalField("resume-email", "email");
  bindPersonalField("resume-phone", "phone");
  bindPersonalField("resume-location", "location");
  bindPersonalField("resume-website", "website");
  bindPersonalField("resume-linkedin", "linkedin");
  bindPersonalField("resume-github", "github");
  bindPersonalField("resume-summary", "summary");

  const bindStateField = (elementId, stateField) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.addEventListener("input", (e) => {
        state.resumeData[stateField] = e.target.value;
        saveResumeState();
        renderResumePreview();
      });
    }
  };
  bindStateField("resume-skills-input", "skills");
  bindStateField("resume-certs-input", "certs");
  bindStateField("resume-langs-input", "langs");

  const tempSelect = document.getElementById("resume-template-select");
  if (tempSelect) {
    tempSelect.addEventListener("change", (e) => {
      state.resumeData.template = e.target.value;
      saveResumeState();
      renderResumePreview();
    });
  }

  const fontSelect = document.getElementById("resume-font-select");
  if (fontSelect) {
    fontSelect.addEventListener("change", (e) => {
      state.resumeData.font = e.target.value;
      saveResumeState();
      renderResumePreview();
    });
  }

  const spacingSelect = document.getElementById("resume-spacing-select");
  if (spacingSelect) {
    spacingSelect.addEventListener("change", (e) => {
      state.resumeData.spacing = e.target.value;
      saveResumeState();
      renderResumePreview();
    });
  }

  document.querySelectorAll(".accent-color-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const color = btn.getAttribute("data-color");
      state.resumeData.accentColor = color;
      
      const customPicker = document.getElementById("custom-accent-color");
      if (customPicker) customPicker.value = color;

      document.querySelectorAll(".accent-color-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      saveResumeState();
      renderResumePreview();
    });
  });

  const customColorPicker = document.getElementById("custom-accent-color");
  if (customColorPicker) {
    customColorPicker.addEventListener("input", (e) => {
      const color = e.target.value;
      state.resumeData.accentColor = color;
      document.querySelectorAll(".accent-color-btn").forEach(b => b.classList.remove("active"));
      saveResumeState();
      renderResumePreview();
    });
  }

  const addExpBtn = document.getElementById("btn-add-experience");
  if (addExpBtn) {
    addExpBtn.addEventListener("click", () => {
      state.resumeData.experience.push({
        id: "exp-" + Date.now(),
        title: "",
        company: "",
        location: "",
        start: "",
        end: "",
        desc: ""
      });
      saveResumeState();
      renderExperienceFormList();
      renderResumePreview();
    });
  }

  const addEduBtn = document.getElementById("btn-add-education");
  if (addEduBtn) {
    addEduBtn.addEventListener("click", () => {
      state.resumeData.education.push({
        id: "edu-" + Date.now(),
        degree: "",
        school: "",
        location: "",
        date: "",
        grade: ""
      });
      saveResumeState();
      renderEducationFormList();
      renderResumePreview();
    });
  }

  const addProjBtn = document.getElementById("btn-add-project");
  if (addProjBtn) {
    addProjBtn.addEventListener("click", () => {
      state.resumeData.projects.push({
        id: "proj-" + Date.now(),
        title: "",
        tech: "",
        link: "",
        desc: ""
      });
      saveResumeState();
      renderProjectsFormList();
      renderResumePreview();
    });
  }

  const clearBtn = document.getElementById("btn-clear-resume");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all resume details? This cannot be undone.")) {
        clearResumeState();
      }
    });
  }

  const loadSampleBtn = document.getElementById("btn-load-sample");
  if (loadSampleBtn) {
    loadSampleBtn.addEventListener("click", () => {
      loadResumeSampleData();
    });
  }

  const downloadPdfBtn = document.getElementById("btn-download-pdf");
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", () => {
      window.print();
    });
  }
}
