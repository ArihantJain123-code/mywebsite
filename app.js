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
  wizard: {
    currentStep: 1,
    totalSteps: 5,
    answers: {
      qualification: "",
      course: "",
      budget: "",
      goal: ""
    },
    userContact: {
      name: "",
      email: "",
      phone: ""
    }
  },
  reviewsDb: {} // Will hold user reviews in memory, supplemented by local storage
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
    if (link.getAttribute("data-target") === viewName) {
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
  } else if (viewName === "wizard") {
    resetWizard();
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

  // Main Home CTA - Counseling Wizard
  const homeCta = document.getElementById("home-counseling-cta");
  if (homeCta) {
    homeCta.addEventListener("click", () => {
      window.location.hash = "#wizard";
    });
  }

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

  // Wizard Navigation
  const nextBtn = document.getElementById("wizard-next-btn");
  const prevBtn = document.getElementById("wizard-prev-btn");
  if (nextBtn) nextBtn.addEventListener("click", handleWizardNext);
  if (prevBtn) prevBtn.addEventListener("click", handleWizardPrev);

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
    if (state.compareList.length >= 3) {
      alert("You can compare a maximum of 3 universities at once!");
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
  container.innerHTML = `<span class="compare-tray-title">Compare (Max 3):</span>`;
  
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
    actionBtn.textContent = `Compare Now (${count}/3)`;
  }
}

// --- Render Comparison Matrix Page ---
function renderCompareMatrix() {
  const container = document.getElementById("compare-matrix-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  if (state.compareList.length === 0) {
    container.innerHTML = `
      <div class="compare-empty-state">
        <i class="fas fa-balance-scale"></i>
        <h3>Your Comparison Board is Empty</h3>
        <p>Go to the course listing page, check the "Compare" box on up to 3 universities, and see their stats side-by-side.</p>
        <button class="btn btn-primary" style="margin-top: 20px;" onclick="window.location.hash='#catalog'">Go to Course Catalog</button>
      </div>
    `;
    return;
  }
  
  // Load compared university profiles
  const comparedUnis = state.compareList.map(id => UNIVERSITIES.find(u => u.id === id)).filter(Boolean);
  
  // Prepare Table Structure
  const table = document.createElement("table");
  table.className = "compare-table";
  
  // 1. HEADERS ROW (Logo, Name, Remove btn)
  let headerHtml = `<th class="compare-th-label">University Profile</th>`;
  comparedUnis.forEach(uni => {
    headerHtml += `
      <th class="compare-header-cell">
        <button class="compare-remove-btn" onclick="toggleCompare('${uni.id}', event)"><i class="fas fa-times-circle"></i></button>
        <div class="compare-uni-card-header">
          <div class="uni-logo-badge" style="background: ${uni.logoColor}; margin: 0 auto; width: 60px; height: 60px; font-size: 1.5rem;">${uni.logoInitials}</div>
          <div class="compare-uni-name" style="text-align: center;">${uni.name}</div>
        </div>
      </th>
    `;
  });
  
  // Build details rows
  const fields = [
    { label: "NAAC Grade", key: "naacGrade", type: "text" },
    { 
      label: "Course Fee Total", 
      key: "feeTotal", 
      type: "custom",
      render: (uni) => {
        const fee = uni.courses[state.selectedCourse]?.feeTotal;
        return fee ? `<span class="compare-fee-val">₹${fee.toLocaleString("en-IN")}</span>` : "N/A";
      }
    },
    { 
      label: "Semester Fee", 
      key: "feeSemester", 
      type: "custom",
      render: (uni) => {
        const fee = uni.courses[state.selectedCourse]?.feeSemester;
        return fee ? `₹${fee.toLocaleString("en-IN")}` : "N/A";
      }
    },
    { 
      label: "Approvals", 
      key: "approvals", 
      type: "custom",
      render: (uni) => {
        const list = uni.approvals.map(app => `<div class="compare-approval-item">${app}</div>`).join("");
        return `<div class="compare-approvals-list">${list}</div>`;
      }
    },
    { 
      label: "LMS Quality Rating", 
      key: "lmsRating", 
      type: "custom",
      render: (uni) => `<strong>${uni.lmsRating} / 5.0</strong>`
    },
    { 
      label: "Placement Assistance", 
      key: "placementRate", 
      type: "custom",
      render: (uni) => `
        <div class="compare-rating-val">${uni.placementRate}% Placement</div>
        <div style="font-size: 0.8rem; margin-top: 4px; color: var(--text-light)">Top partners: ${uni.placementPartners.slice(0, 3).join(", ")}</div>
      `
    },
    { 
      label: "Key Features", 
      key: "features", 
      type: "custom",
      render: (uni) => {
        const list = uni.features.map(f => `<li>${f}</li>`).join("");
        return `<ul class="compare-features-list">${list}</ul>`;
      }
    },
    { 
      label: "EMI Starts At", 
      key: "emiStarts", 
      type: "text"
    },
    {
      label: "Action",
      key: "action",
      type: "custom",
      render: (uni) => `
        <div style="display:flex; flex-direction:column; gap: 8px;">
          <button class="btn btn-primary" style="padding: 8px 16px; font-size:0.85rem;" onclick="openModal('${uni.id}')">View Details</button>
          <button class="btn btn-accent" style="padding: 8px 16px; font-size:0.85rem;" onclick="startCounselingWithUni('${uni.id}')">Get counseling</button>
        </div>
      `
    }
  ];
  
  let rowsHtml = "";
  fields.forEach(field => {
    rowsHtml += `<tr><td class="compare-th-label">${field.label}</td>`;
    comparedUnis.forEach(uni => {
      let cellVal = "";
      if (field.type === "text") {
        cellVal = uni[field.key] || "N/A";
      } else if (field.type === "custom") {
        cellVal = field.render(uni);
      }
      rowsHtml += `<td class="compare-value-cell">${cellVal}</td>`;
    });
    rowsHtml += `</tr>`;
  });
  
  table.innerHTML = `
    <thead>
      <tr>${headerHtml}</tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  `;
  
  container.appendChild(table);
}

// --- AI COUNSELING / MATCHMAKER WIZARD ---
function resetWizard() {
  state.wizard.currentStep = 1;
  state.wizard.answers = { qualification: "", course: "", budget: "", goal: "" };
  state.wizard.userContact = { name: "", email: "", phone: "" };
  
  updateWizardUI();
}

function updateWizardUI() {
  const currentStep = state.wizard.currentStep;
  const totalSteps = state.wizard.totalSteps;
  
  // Update progress bar
  const pct = (currentStep / totalSteps) * 100;
  const progressBar = document.getElementById("wizard-progress-bar");
  if (progressBar) progressBar.style.width = `${pct}%`;
  
  // Show active step, hide others
  document.querySelectorAll(".wizard-step").forEach((step, idx) => {
    if (idx + 1 === currentStep) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });
  
  // Handle footer navigation buttons
  const prevBtn = document.getElementById("wizard-prev-btn");
  const nextBtn = document.getElementById("wizard-next-btn");
  
  if (prevBtn) {
    prevBtn.style.display = currentStep === 1 || currentStep === totalSteps ? "none" : "block";
  }
  
  if (nextBtn) {
    if (currentStep === totalSteps - 1) {
      nextBtn.textContent = "See Recommendations";
    } else if (currentStep === totalSteps) {
      nextBtn.style.display = "none"; // Final slide has no next
    } else {
      nextBtn.textContent = "Next Step";
    }
  }
}

window.selectWizardOption = function(questionKey, value, element) {
  // Save answer
  state.wizard.answers[questionKey] = value;
  
  // Toggle CSS active class in grid options
  const container = element.parentElement;
  container.querySelectorAll(".wizard-option-card").forEach(card => {
    card.classList.remove("selected");
  });
  element.classList.add("selected");
  
  // Auto-advance after a brief delay for smoother UX (steps 1, 2, 3, 4)
  setTimeout(() => {
    handleWizardNext();
  }, 300);
};

function handleWizardNext() {
  const currentStep = state.wizard.currentStep;
  
  // Validations before moving forward
  if (currentStep === 1 && !state.wizard.answers.qualification) {
    alert("Please select your current qualification.");
    return;
  }
  if (currentStep === 2 && !state.wizard.answers.course) {
    alert("Please select a course of interest.");
    return;
  }
  if (currentStep === 3 && !state.wizard.answers.budget) {
    alert("Please select your budget limit.");
    return;
  }
  if (currentStep === 4 && !state.wizard.answers.goal) {
    alert("Please select your primary career goal.");
    return;
  }
  
  // If moving from form validation (Step 4 -> Step 5 result trigger)
  if (currentStep === 4) {
    state.wizard.currentStep = 5;
    calculateRecommendations();
    updateWizardUI();
    return;
  }
  
  // Increment step
  if (state.wizard.currentStep < state.wizard.totalSteps) {
    state.wizard.currentStep++;
    updateWizardUI();
  }
}

function handleWizardPrev() {
  if (state.wizard.currentStep > 1) {
    state.wizard.currentStep--;
    updateWizardUI();
  }
}

// Recommendation Engine algorithm
function calculateRecommendations() {
  const answers = state.wizard.answers;
  const course = answers.course.toLowerCase(); // mba, bca, bba, etc.
  
  // Filter base list of universities offering this course
  let matchingUnis = UNIVERSITIES.filter(uni => uni.courses[course]);
  
  const scoredUnis = matchingUnis.map(uni => {
    let score = 50; // Starting baseline
    const courseFee = uni.courses[course].feeTotal;
    
    // 1. Budget Matching Scoring
    // Budget values: "budget-low" (<60k), "budget-mid" (60k-1.2L), "budget-high" (1.2L-1.7L), "budget-premium" (>1.7L)
    if (answers.budget === "budget-low") {
      if (courseFee <= 60000) score += 40;
      else if (courseFee <= 100000) score += 20;
      else score -= 20;
    } else if (answers.budget === "budget-mid") {
      if (courseFee > 60000 && courseFee <= 120000) score += 40;
      else if (courseFee <= 60000) score += 30; // lower is fine
      else score -= 10;
    } else if (answers.budget === "budget-high") {
      if (courseFee > 100000 && courseFee <= 170000) score += 40;
      else if (courseFee <= 100000) score += 30; // lower is fine
      else score -= 5;
    } else if (answers.budget === "budget-premium") {
      if (courseFee > 150000) score += 40;
      else score += 25; // Any is fine
    }
    
    // 2. Career Goal Matching Scoring
    // Goals: "goal-job" (Placement), "goal-hike" (Hike), "goal-degree" (Resume), "goal-study" (Govt/CA)
    if (answers.goal === "goal-job") {
      // Weight placement support highly
      score += (uni.placementRate - 50) * 0.8; 
    } else if (answers.goal === "goal-hike") {
      // Weight LMS Quality & Academics (NAAC grade)
      score += (uni.lmsRating / 5.0) * 30;
      if (uni.naacGrade === "A++") score += 10;
    } else if (answers.goal === "goal-degree") {
      // Weight low fee structure & brand name
      if (courseFee < 100000) score += 20;
      if (uni.id === "ignou") score += 15; // standard govt degree
    } else if (answers.goal === "goal-study") {
      // Academics focus
      if (uni.id === "ignou" || uni.id === "manipal") score += 20;
    }
    
    // Cap score at 99%, minimum at 40%
    const finalScore = Math.min(99, Math.max(40, Math.round(score)));
    
    return {
      uni,
      score: finalScore
    };
  });
  
  // Sort by score high to low
  scoredUnis.sort((a, b) => b.score - a.score);
  
  // Select top 3 recommendations
  const topRecommendations = scoredUnis.slice(0, 3);
  
  // Render details onto final step DOM
  const container = document.getElementById("wizard-recommendations-list");
  if (!container) return;
  
  container.innerHTML = "";
  
  topRecommendations.forEach((rec, index) => {
    const uni = rec.uni;
    const div = document.createElement("div");
    div.className = "rec-item-card";
    
    div.innerHTML = `
      <div class="rec-item-left">
        <div class="rec-rank-badge">#${index + 1}</div>
        <div class="uni-logo-badge" style="background: ${uni.logoColor}; width: 45px; height: 45px; font-size: 1.1rem;">${uni.logoInitials}</div>
        <div class="rec-uni-info">
          <h4>${uni.name}</h4>
          <p>Total Course Fee: <strong>₹${uni.courses[course].feeTotal.toLocaleString("en-IN")}</strong> | Rating: <strong>${uni.rating}★</strong></p>
          <span class="rec-match-score">${rec.score}% Match Quality</span>
        </div>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary" style="padding: 8px 14px; font-size:0.8rem;" onclick="openModal('${uni.id}')">Details</button>
        <button class="btn btn-accent" style="padding: 8px 14px; font-size:0.8rem;" onclick="submitCounselingInquiry('${uni.id}')">Talk to Expert</button>
      </div>
    `;
    container.appendChild(div);
  });
}

window.submitWizardContact = function(event) {
  event.preventDefault();
  
  // Save contact state
  state.wizard.userContact.name = document.getElementById("wiz-name").value;
  state.wizard.userContact.email = document.getElementById("wiz-email").value;
  state.wizard.userContact.phone = document.getElementById("wiz-phone").value;
  
  // Go to step 5 results page
  handleWizardNext();
};

window.submitCounselingInquiry = function(uniId) {
  const uni = UNIVERSITIES.find(u => u.id === uniId);
  const uniName = uni ? uni.name : "featured college";
  
  // Mock counseling registration
  alert(`Thank you! Your request for free counseling at ${uniName} has been received. Our senior academic advisors will call you back on your registered number within 15 minutes!`);
};

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
window.submitCounselingInquiry = submitCounselingInquiry;
window.resetFilters = resetFilters;
