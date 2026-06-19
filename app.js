// College Vidya Style - Online Degree Education Portal
// Core Application Logic

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
  blogCategory: "all"
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
  
  // Handle specific view parameters
  if (viewName === "catalog") {
    if (params.course) {
      state.selectedCourse = params.course.toLowerCase();
    }
    updateCatalogCourseInfo();
    renderCatalog();
  } else if (viewName === "compare") {
    renderCompareMatrix();
  } else if (viewName === "blog") {
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
window.toggleCompare = function(uniId, event) {
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



window.startCounselingWithUni = function(uniId) {
  const uni = UNIVERSITIES.find(u => u.id === uniId);
  if (!uni) return;
  
  // Open details and focus overview/counseling tab, or trigger counseling form
  openModal(uniId);
  // Auto-scroll to sidebar form in modal
  setTimeout(() => {
    const formName = document.getElementById("detail-form-name");
    if (formName) {
      formName.scrollIntoView({ behavior: "smooth" });
      formName.focus();
    }
  }, 400);
};

// --- UNIVERSITY DETAIL MODAL ACTIONS ---
window.openModal = function(uniId) {
  const uni = UNIVERSITIES.find(u => u.id === uniId);
  if (!uni) return;
  
  const overlay = document.getElementById("modal-overlay");
  const bannerName = document.getElementById("modal-uni-name");
  const bannerNaac = document.getElementById("modal-banner-naac");
  const bannerRating = document.getElementById("modal-banner-rating");
  const bannerLogo = document.getElementById("modal-banner-logo");
  
  if (!overlay) return;
  
  // Reset tabs to Overview
  document.querySelectorAll(".modal-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".modal-tab-pane").forEach(pane => pane.classList.remove("active"));
  
  const overviewTabBtn = document.querySelector('.modal-tab-btn[data-tab="overview"]');
  const overviewPane = document.getElementById("tab-overview");
  if (overviewTabBtn) overviewTabBtn.classList.add("active");
  if (overviewPane) overviewPane.classList.add("active");
  
  // Set modal header details
  bannerName.textContent = uni.name;
  bannerNaac.textContent = `NAAC ${uni.naacGrade}`;
  bannerRating.innerHTML = `<i class="fas fa-star" style="color: #FBBF24;"></i> ${uni.rating} (${uni.reviewsCount} reviews)`;
  
  bannerLogo.style.background = uni.logoColor;
  bannerLogo.textContent = uni.logoInitials;
  
  // Populate Tab 1: Overview
  document.getElementById("modal-overview-desc").textContent = uni.description;
  
  const featuresList = document.getElementById("modal-overview-features-list");
  featuresList.innerHTML = uni.features.map(f => `<li>${f}</li>`).join("");
  
  const partnersGrid = document.getElementById("modal-overview-partners-grid");
  partnersGrid.innerHTML = uni.placementPartners.map(p => `
    <div class="partner-logo-item">${p}</div>
  `).join("");
  
  // Set inline form target hidden field
  const modalCtaBtn = document.getElementById("modal-cta-submit-btn");
  if (modalCtaBtn) {
    modalCtaBtn.onclick = (e) => {
      e.preventDefault();
      const name = document.getElementById("detail-form-name").value;
      const phone = document.getElementById("detail-form-phone").value;
      if (!name || !phone) {
        alert("Please enter your name and phone number.");
        return;
      }
      alert(`Success! Advisors for ${uni.name} will call you back on ${phone} to assist with the admission process.`);
      // Clear form
      document.getElementById("detail-form-name").value = "";
      document.getElementById("detail-form-phone").value = "";
    };
  }
  
  // Populate Tab 2: Fees & Course List
  const courseDetails = uni.courses[state.selectedCourse];
  const feesTbody = document.getElementById("modal-fees-table-tbody");
  if (feesTbody) {
    feesTbody.innerHTML = `
      <tr>
        <td><strong>${COURSES_DATA[state.selectedCourse]?.name || state.selectedCourse.toUpperCase()}</strong></td>
        <td>${courseDetails?.duration || 'N/A'}</td>
        <td>₹${courseDetails ? courseDetails.feeSemester.toLocaleString("en-IN") : 'N/A'}</td>
        <td><strong>₹${courseDetails ? courseDetails.feeTotal.toLocaleString("en-IN") : 'N/A'}</strong></td>
      </tr>
    `;
  }
  
  const emiText = document.getElementById("modal-fees-emi-detail");
  if (emiText) {
    emiText.innerHTML = `
      <div class="uni-highlight-item" style="font-size: 1rem; color: var(--text-main); font-weight:600;">
        <i class="fas fa-wallet" style="color:var(--secondary);"></i>
        <span>Flexible Payment Options: EMI starts at just <strong>${uni.emiStarts}</strong>. No-cost financing options available on all major credit cards.</span>
      </div>
    `;
  }
  
  // Populate Tab 3: Placements
  const placementRateVal = document.getElementById("modal-placement-rate-val");
  if (placementRateVal) {
    placementRateVal.textContent = `${uni.placementRate}%`;
  }
  const placementPartnersList = document.getElementById("modal-placement-partners-list");
  if (placementPartnersList) {
    placementPartnersList.innerHTML = uni.placementPartners.map(p => `
      <div class="partner-logo-item" style="padding: 16px; font-size:1rem; font-weight:700;">${p}</div>
    `).join("");
  }
  
  // Populate Tab 4: Reviews
  renderModalReviews(uniId);
  
  // Handle Review submission in modal
  const reviewForm = document.getElementById("modal-add-review-form");
  if (reviewForm) {
    // Unbind previous listener to avoid multiple handles
    const newForm = reviewForm.cloneNode(true);
    reviewForm.parentNode.replaceChild(newForm, reviewForm);
    
    // Set active review rating selector
    let selectedRating = 5;
    const starContainer = newForm.querySelector(".rating-select-wrapper");
    if (starContainer) {
      starContainer.innerHTML = "";
      for (let i = 1; i <= 5; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "rating-star-btn selected";
        btn.innerHTML = `<i class="fas fa-star"></i>`;
        btn.setAttribute("data-rating", i);
        btn.onclick = () => {
          selectedRating = i;
          // Color stars
          starContainer.querySelectorAll(".rating-star-btn").forEach((s, idx) => {
            if (idx < i) {
              s.classList.add("selected");
            } else {
              s.classList.remove("selected");
            }
          });
        };
        starContainer.appendChild(btn);
      }
    }
    
    newForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const author = newForm.querySelector("#rev-author").value;
      const text = newForm.querySelector("#rev-text").value;
      
      if (!author || !text) {
        alert("Please fill in both name and feedback fields.");
        return;
      }
      
      const newReview = {
        student: author,
        course: COURSES_DATA[state.selectedCourse].name,
        rating: selectedRating,
        date: new Date().toISOString().split('T')[0],
        comment: text
      };
      
      // Save review to DB state and localStorage
      if (!state.reviewsDb[uniId]) {
        state.reviewsDb[uniId] = [];
      }
      state.reviewsDb[uniId].unshift(newReview);
      localStorage.setItem("portal_university_reviews", JSON.stringify(state.reviewsDb));
      
      // Clear inputs
      newForm.querySelector("#rev-author").value = "";
      newForm.querySelector("#rev-text").value = "";
      
      // Re-render
      renderModalReviews(uniId);
      alert("Thank you! Your student review has been posted successfully.");
    });
  }

  // Display overlay
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden"; // Disable page scroll
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
  
  // Render empty state if needed
  if (filteredBlogs.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1; width: 100%;">
        <i class="fas fa-search"></i>
        <h3>No Articles Found</h3>
        <p>We couldn't find any articles matching your search query or category. Try search terms like 'MBA', 'Validity', or 'NAAC'.</p>
      </div>
    `;
    return;
  }
  
  // Render cards
  filteredBlogs.forEach(blog => {
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
