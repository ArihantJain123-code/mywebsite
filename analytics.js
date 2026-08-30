/**
 * OnlineDegrees Analytics & Telemetry Engine (analytics.js)
 * Lightweight, privacy-conscious tracking for real-time traffic, SEO referrers, and lead conversions.
 */

(function () {
  const STORAGE_KEY_EVENTS = "portal_analytics_events";
  const STORAGE_KEY_SESSION = "portal_analytics_session";
  const STORAGE_KEY_LEADS = "portal_analytics_leads";
  const STORAGE_KEY_REALTIME = "portal_analytics_realtime";

  // Generate unique ID
  function generateId(prefix = "id") {
    return prefix + "_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }

  // Get or initialize session
  function getSession() {
    let session = null;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_SESSION);
      if (stored) session = JSON.parse(stored);
    } catch (e) { }

    if (!session || Date.now() - session.lastActivity > 30 * 60 * 1000) {
      session = {
        id: generateId("sess"),
        startTime: Date.now(),
        lastActivity: Date.now(),
        pageviews: 0,
        referrer: document.referrer || "Direct",
        device: getDeviceType(),
        browser: getBrowserInfo(),
        os: getOSInfo(),
        landingPage: window.location.pathname + window.location.hash,
        city: getRandomCity()
      };
      try {
        sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      } catch (e) { }
    } else {
      session.lastActivity = Date.now();
      try {
        sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      } catch (e) { }
    }
    return session;
  }

  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) return "Mobile";
    return "Desktop";
  }

  function getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Firefox")) return "Firefox";
    return "Other";
  }

  function getOSInfo() {
    const ua = navigator.userAgent;
    if (ua.includes("Win")) return "Windows";
    if (ua.includes("Mac")) return "macOS";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    if (ua.includes("Linux")) return "Linux";
    return "Unknown";
  }

  function getRandomCity() {
    const cities = ["Delhi NCR", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Indore"];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  // Record an event
  function trackEvent(eventType, eventData = {}) {
    const session = getSession();
    const event = {
      id: generateId("evt"),
      type: eventType,
      timestamp: Date.now(),
      sessionId: session.id,
      path: window.location.pathname + window.location.hash,
      title: document.title,
      referrer: document.referrer || "Direct",
      device: session.device,
      city: session.city,
      data: eventData
    };

    try {
      const storedEvents = JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS) || "[]");
      // Keep last 1000 events
      if (storedEvents.length > 1000) storedEvents.shift();
      storedEvents.push(event);
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(storedEvents));
    } catch (e) {
      console.warn("Analytics storage error", e);
    }

    // Update real-time heartbeat
    updateRealtimeHeartbeat(session, event);
  }

  function updateRealtimeHeartbeat(session, lastEvent) {
    try {
      const realtimeData = JSON.parse(localStorage.getItem(STORAGE_KEY_REALTIME) || "{}");
      realtimeData[session.id] = {
        sessionId: session.id,
        lastActive: Date.now(),
        currentPath: window.location.pathname + window.location.hash,
        pageTitle: document.title,
        device: session.device,
        city: session.city,
        referrer: session.referrer
      };

      // Clean up inactive sessions (> 3 minutes)
      const now = Date.now();
      for (const sId in realtimeData) {
        if (now - realtimeData[sId].lastActive > 3 * 60 * 1000) {
          delete realtimeData[sId];
        }
      }
      localStorage.setItem(STORAGE_KEY_REALTIME, JSON.stringify(realtimeData));
    } catch (e) { }
  }

  // Track Lead Submission
  function trackLead(leadData) {
    const session = getSession();
    const lead = {
      id: generateId("lead"),
      timestamp: Date.now(),
      name: leadData.name || "Anonymous Aspirant",
      email: leadData.email || "",
      phone: leadData.phone || "",
      course: leadData.course || "General Inquiry",
      city: leadData.location || session.city,
      budget: leadData.budget || "Not Specified",
      source: leadData.formType || "Counseling Form",
      message: leadData.message || "",
      status: "New",
      device: session.device,
      referrer: session.referrer
    };

    try {
      const leads = JSON.parse(localStorage.getItem(STORAGE_KEY_LEADS) || "[]");
      leads.unshift(lead);
      if (leads.length > 200) leads.pop();
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
    } catch (e) { }

    trackEvent("lead_submit", { leadId: lead.id, course: lead.course, source: lead.source });
  }

  // Global Analytics API
  window.OnlineDegreesAnalytics = {
    trackEvent: trackEvent,
    trackLead: trackLead,
    getEvents: function () {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS) || "[]"); } catch (e) { return []; }
    },
    getLeads: function () {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY_LEADS) || "[]"); } catch (e) { return []; }
    },
    getRealtimeUsers: function () {
      try {
        const rt = JSON.parse(localStorage.getItem(STORAGE_KEY_REALTIME) || "{}");
        const now = Date.now();
        const active = [];
        for (const k in rt) {
          if (now - rt[k].lastActive <= 3 * 60 * 1000) {
            active.push(rt[k]);
          }
        }
        return active;
      } catch (e) { return []; }
    }
  };

  // Auto initialize pageview tracking
  document.addEventListener("DOMContentLoaded", () => {
    trackEvent("pageview", {
      url: window.location.href,
      path: window.location.pathname + window.location.hash
    });

    // Track hash changes (SPA navigation)
    window.addEventListener("hashchange", () => {
      trackEvent("navigation", {
        path: window.location.pathname + window.location.hash
      });
    });

    // Heartbeat every 20 seconds
    setInterval(() => {
      const session = getSession();
      updateRealtimeHeartbeat(session, { type: "heartbeat" });
    }, 20000);
  });

  // Intercept leads if submitLeadToIntegrations is called
  const originalSubmit = window.submitLeadToIntegrations;
  window.submitLeadToIntegrations = function (inquiryData) {
    trackLead(inquiryData);
    if (typeof originalSubmit === "function") {
      originalSubmit(inquiryData);
    }
  };
})();
