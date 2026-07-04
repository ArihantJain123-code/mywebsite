// ============================================================
// OnlineDegrees AI Counselor Chatbot — Lead Generation Bot
// ============================================================

(function () {
  "use strict";

  // ---- Bot Configuration ----
  const BOT_NAME = "Priya";
  const BOT_AVATAR = "P";
  const STORAGE_KEY = "od_chatbot_leads";
  const SESSION_KEY = "od_chatbot_session";

  // ---- Conversation Flow States ----
  const STEPS = {
    GREETING: "greeting",
    ASK_NAME: "ask_name",
    ASK_COURSE: "ask_course",
    ASK_BUDGET: "ask_budget",
    ASK_PHONE: "ask_phone",
    ASK_EMAIL: "ask_email",
    ASK_QUERY: "ask_query",
    ANSWER_QUERY: "answer_query",
    COMPLETE: "complete",
    FREE_CHAT: "free_chat",
  };

  // ---- Knowledge Base for Quick Answers ----
  const KNOWLEDGE_BASE = [
    {
      keywords: ["fee", "cost", "price", "fees", "rupees", "budget", "cheap", "affordable"],
      answer: "💰 Fees vary by university and course:<br><br>• <b>Online MBA:</b> ₹60,000 – ₹2,50,000<br>• <b>Online BCA:</b> ₹45,000 – ₹1,20,000<br>• <b>Online BBA:</b> ₹50,000 – ₹1,30,000<br>• <b>Online MCA:</b> ₹60,000 – ₹1,80,000<br>• <b>Online M.Com:</b> ₹40,000 – ₹90,000<br><br>EMI options are available! Want me to connect you with a counselor?"
    },
    {
      keywords: ["ugc", "approved", "valid", "recognized", "government", "legitimate"],
      answer: "✅ All programs on OnlineDegrees are <b>UGC-DEB approved</b> and equivalent to regular campus degrees. They are recognized by employers across India and for higher studies."
    },
    {
      keywords: ["mba", "management", "business", "finance", "marketing", "hr"],
      answer: "🎓 Our <b>Online MBA</b> is extremely popular! Specializations include Finance, Marketing, HR, and Business Analytics. Duration: 2 years. Avg Salary: 6–15 LPA. Would you like to compare top MBA universities?"
    },
    {
      keywords: ["bca", "computer application", "programming", "web", "it", "software"],
      answer: "💻 <b>Online BCA</b> is perfect for aspiring IT professionals! You'll learn programming, web development, databases, and more. Duration: 3 years. Avg Salary: 3–7 LPA. Shall I help you find the best BCA universities?"
    },
    {
      keywords: ["bba", "bachelor business"],
      answer: "📊 <b>Online BBA</b> builds a strong foundation in business, management, and commerce. Duration: 3 years. Avg Salary: 3–8 LPA. A great start for future managers!"
    },
    {
      keywords: ["mca", "master computer", "cloud", "ai", "artificial intelligence"],
      answer: "🖥️ <b>Online MCA</b> is ideal for tech enthusiasts. Covers advanced software engineering, cloud computing, and AI. Duration: 2 years. Avg Salary: 5–12 LPA!"
    },
    {
      keywords: ["mcom", "m.com", "commerce", "accounting", "bank"],
      answer: "📈 <b>Online M.Com</b> deepens expertise in financial accounting, banking, and commercial law. Duration: 2 years. Avg Salary: 4–9 LPA. Great for CA aspirants!"
    },
    {
      keywords: ["placement", "job", "career", "salary", "lpa", "package"],
      answer: "💼 Our partner universities have placement rates of <b>85–96%</b>. Universities like Manipal Online and Amity Online have dedicated placement cells with 500+ hiring partners. Would you like to compare placement records?"
    },
    {
      keywords: ["duration", "time", "years", "semester", "how long"],
      answer: "⏱️ Course durations:<br>• <b>MBA / MCA / M.Com:</b> 2 Years (4 Semesters)<br>• <b>BCA / BBA:</b> 3 Years (6 Semesters)<br><br>You can study at your own pace from home!"
    },
    {
      keywords: ["naac", "grade", "ranking", "rank", "accreditation", "aicte"],
      answer: "🏆 All universities on our platform hold <b>NAAC A or A++ grades</b>. Many are also AICTE, WES, and QS Stars ranked for global recognition."
    },
    {
      keywords: ["emi", "installment", "pay monthly", "payment plan"],
      answer: "💳 Yes! EMI options are available starting from as low as ₹2,499/month depending on the university and course. Zero-cost EMI is available on select programs. Want details for a specific course?"
    },
    {
      keywords: ["contact", "call", "phone", "talk", "counselor", "expert", "advisor"],
      answer: "📞 You can call our counselors directly at <b>6375079973</b> (Mon–Sat, 9 AM – 7 PM). Or email us at support@onlinedegrees.com. Would you like me to arrange a callback?"
    },
    {
      keywords: ["manipal", "amity", "chandigarh", "lpu", "jain", "symbiosis"],
      answer: "🏫 We feature India's top online universities! Use our <b>Compare Board</b> to see fee structures, LMS quality, and placement stats side-by-side. Click 'Compare Board' in the navigation to get started!"
    },
    {
      keywords: ["compare", "difference", "vs", "which is better", "which university"],
      answer: "⚖️ Great question! Use our interactive <b>Compare Board</b> to put any two universities head-to-head. You'll see placement packages, fees, NAAC grades, and LMS features compared. Click 'Compare Board' in the menu!"
    },
    {
      keywords: ["scholarship", "discount", "offer", "waiver", "free"],
      answer: "🎁 Yes! Several universities offer merit-based scholarships (up to 30% fee waiver). Some also provide early-bird discounts during admission season. Our counselors can help you apply. Want me to check your eligibility?"
    },
    {
      keywords: ["eligibility", "qualify", "requirement", "eligible", "10th", "12th", "graduation"],
      answer: "📋 Eligibility:<br>• <b>BCA / BBA:</b> 10+2 pass (any stream)<br>• <b>MBA / MCA / M.Com:</b> Graduation in any discipline<br><br>Working professionals are welcome too! Most programs have no entrance exam."
    },
    {
      keywords: ["lms", "online class", "study material", "lecture", "video", "live"],
      answer: "📱 All programs include a <b>Learning Management System (LMS)</b> with recorded lectures, live webinars, study material, and assignments. You can study anytime, anywhere!"
    },
  ];

  // ---- Session / Lead State ----
  let sessionData = {
    step: STEPS.GREETING,
    lead: {
      name: "",
      course: "",
      budget: "",
      phone: "",
      email: "",
    },
    isOpen: false,
    messageCount: 0,
  };

  let typingTimeout = null;
  let isTyping = false;

  // ---- DOM References ----
  let widgetEl, toggleBtn, chatWindow, messagesContainer, inputEl, sendBtn, closeBtn, badgeEl;

  // ---- Initialize on DOM Ready ----
  document.addEventListener("DOMContentLoaded", initChatbot);

  function initChatbot() {
    injectHTML();
    cacheDOMRefs();
    attachEventListeners();

    // Restore session if exists
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        sessionData = { ...sessionData, ...parsed, isOpen: false };
      } catch (e) { /* fresh session */ }
    }

    // Show greeting bubble after 3 seconds
    setTimeout(() => {
      showGreetingBubble();
    }, 3000);
  }

  // ---- Inject HTML into body ----
  function injectHTML() {
    const html = `
      <!-- AI Chatbot Widget -->
      <div id="od-chatbot-widget" class="od-chatbot-widget" aria-label="AI Counselor Chat">

        <!-- Greeting Bubble -->
        <div id="od-chat-greeting" class="od-chat-greeting" style="display:none;">
          <p>👋 Hi! I'm <strong>Priya</strong>, your AI counselor. Need help choosing an online degree? <span class="od-greeting-close" id="od-greeting-close">✕</span></p>
        </div>

        <!-- Chat Window -->
        <div id="od-chat-window" class="od-chat-window" style="display:none;" role="dialog" aria-modal="true" aria-label="AI Counselor Chat">
          <!-- Header -->
          <div class="od-chat-header">
            <div class="od-chat-header-info">
              <div class="od-bot-avatar-header">
                <span>P</span>
                <span class="od-online-dot" title="Online"></span>
              </div>
              <div class="od-header-text">
                <h4>${BOT_NAME}</h4>
                <p>AI Degree Counselor · <span class="od-status-text">Online</span></p>
              </div>
            </div>
            <div class="od-header-actions">
              <button id="od-chat-close" class="od-icon-btn" title="Close Chat" aria-label="Close Chat">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Messages Area -->
          <div id="od-messages" class="od-messages" role="log" aria-live="polite" aria-label="Chat messages"></div>

          <!-- Typing Indicator -->
          <div id="od-typing-indicator" class="od-typing-indicator" style="display:none;">
            <div class="od-bot-avatar-small"><span>P</span></div>
            <div class="od-typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>

          <!-- Quick Reply Buttons -->
          <div id="od-quick-replies" class="od-quick-replies"></div>

          <!-- Input Area -->
          <div class="od-input-area">
            <input type="text" id="od-chat-input" class="od-chat-input" placeholder="Type your message..." aria-label="Chat message input" autocomplete="off" maxlength="200">
            <button id="od-send-btn" class="od-send-btn" aria-label="Send message">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>

          <!-- Footer -->
          <div class="od-chat-footer">
            <i class="fas fa-shield-alt"></i> Your data is private &amp; secure
          </div>
        </div>

        <!-- Toggle Floating Button -->
        <button id="od-chat-toggle" class="od-chat-toggle" aria-label="Open AI Counselor Chat" title="Chat with AI Counselor">
          <div class="od-toggle-icon od-toggle-icon--chat">
            <i class="fas fa-comment-dots"></i>
          </div>
          <div class="od-toggle-icon od-toggle-icon--close" style="display:none;">
            <i class="fas fa-times"></i>
          </div>
          <span id="od-chat-badge" class="od-chat-badge" style="display:none;">1</span>
        </button>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
  }

  function cacheDOMRefs() {
    widgetEl = document.getElementById("od-chatbot-widget");
    toggleBtn = document.getElementById("od-chat-toggle");
    chatWindow = document.getElementById("od-chat-window");
    messagesContainer = document.getElementById("od-messages");
    inputEl = document.getElementById("od-chat-input");
    sendBtn = document.getElementById("od-send-btn");
    closeBtn = document.getElementById("od-chat-close");
    badgeEl = document.getElementById("od-chat-badge");
  }

  function attachEventListeners() {
    toggleBtn.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", closeChat);

    sendBtn.addEventListener("click", handleUserSend);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleUserSend();
      }
    });

    // Greeting bubble close
    document.getElementById("od-greeting-close").addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("od-chat-greeting").style.display = "none";
    });

    document.getElementById("od-chat-greeting").addEventListener("click", () => {
      document.getElementById("od-chat-greeting").style.display = "none";
      openChat();
    });
  }

  // ---- Chat Toggle ----
  function toggleChat() {
    if (sessionData.isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  function openChat() {
    sessionData.isOpen = true;
    chatWindow.style.display = "flex";
    document.getElementById("od-chat-greeting").style.display = "none";

    // Switch toggle icons
    toggleBtn.querySelector(".od-toggle-icon--chat").style.display = "none";
    toggleBtn.querySelector(".od-toggle-icon--close").style.display = "flex";
    toggleBtn.classList.add("od-toggle--active");

    // Hide badge
    badgeEl.style.display = "none";

    // Start conversation if fresh
    if (sessionData.messageCount === 0) {
      setTimeout(() => startConversation(), 400);
    }

    // Scroll to bottom
    scrollToBottom();
    inputEl.focus();
    saveSession();
  }

  function closeChat() {
    sessionData.isOpen = false;
    chatWindow.style.display = "none";
    toggleBtn.querySelector(".od-toggle-icon--chat").style.display = "flex";
    toggleBtn.querySelector(".od-toggle-icon--close").style.display = "none";
    toggleBtn.classList.remove("od-toggle--active");
    saveSession();
  }

  // ---- Greeting Bubble ----
  function showGreetingBubble() {
    const greetingEl = document.getElementById("od-chat-greeting");
    if (!sessionData.isOpen && sessionData.messageCount === 0) {
      greetingEl.style.display = "flex";
      badgeEl.style.display = "flex";
      // Auto-hide after 8 seconds
      setTimeout(() => {
        if (!sessionData.isOpen) greetingEl.style.display = "none";
      }, 8000);
    }
  }

  // ---- Conversation Engine ----
  function startConversation() {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    botMessage(
      `${timeGreeting}! 👋 I'm <strong>Priya</strong>, your AI Degree Counselor at <strong>OnlineDegrees</strong>.<br><br>I help students find the <em>perfect online degree program</em> tailored to their career goals and budget. I'm here to guide you! 🎓`,
      () => {
        setTimeout(() => {
          botMessage("To get started, may I know your name?");
          sessionData.step = STEPS.ASK_NAME;
          saveSession();
        }, 600);
      }
    );
    sessionData.messageCount++;
  }

  function handleUserSend() {
    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = "";
    clearQuickReplies();
    userMessage(text);
    processUserInput(text);
  }

  // Handle quick reply button clicks
  window.odBotQuickReply = function (text) {
    clearQuickReplies();
    userMessage(text);
    processUserInput(text);
  };

  function processUserInput(text) {
    const lower = text.toLowerCase().trim();
    sessionData.messageCount++;

    switch (sessionData.step) {
      case STEPS.ASK_NAME:
        handleName(text);
        break;
      case STEPS.ASK_COURSE:
        handleCourse(text, lower);
        break;
      case STEPS.ASK_BUDGET:
        handleBudget(text, lower);
        break;
      case STEPS.ASK_PHONE:
        handlePhone(text);
        break;
      case STEPS.ASK_EMAIL:
        handleEmail(text);
        break;
      case STEPS.FREE_CHAT:
      case STEPS.COMPLETE:
        handleFreeChat(text, lower);
        break;
      default:
        handleFreeChat(text, lower);
    }

    saveSession();
  }

  function handleName(text) {
    const name = text.trim();
    if (name.length < 2) {
      botMessage("Please enter a valid name so I can address you properly. 😊");
      return;
    }
    sessionData.lead.name = name;
    sessionData.step = STEPS.ASK_COURSE;

    botMessage(
      `Great to meet you, <strong>${name}</strong>! 🌟<br><br>Which online degree are you interested in?`,
      () => {
        showQuickReplies([
          "Online MBA 🎓",
          "Online BCA 💻",
          "Online BBA 📊",
          "Online MCA 🖥️",
          "Online M.Com 📈",
          "Not sure yet 🤔",
        ]);
      }
    );
  }

  function handleCourse(text, lower) {
    let course = "";
    if (lower.includes("mba")) course = "Online MBA";
    else if (lower.includes("bca")) course = "Online BCA";
    else if (lower.includes("bba")) course = "Online BBA";
    else if (lower.includes("mca")) course = "Online MCA";
    else if (lower.includes("mcom") || lower.includes("m.com") || lower.includes("commerce")) course = "Online M.Com";
    else if (lower.includes("not sure") || lower.includes("don't know") || lower.includes("unsure")) {
      course = "To Be Decided";
    } else {
      course = text; // Take whatever they said
    }

    sessionData.lead.course = course;
    sessionData.step = STEPS.ASK_BUDGET;

    const courseMsg = course === "To Be Decided"
      ? "No worries! Our counselors can help you pick the right course. 😊"
      : `Excellent choice! <strong>${course}</strong> is one of the most in-demand online programs. 🚀`;

    botMessage(
      `${courseMsg}<br><br>What's your approximate <strong>budget</strong> for the full course fee?`,
      () => {
        showQuickReplies([
          "Below ₹50,000",
          "₹50,000 – ₹1 Lakh",
          "₹1 Lakh – ₹1.5 Lakh",
          "₹1.5 Lakh – ₹2 Lakh",
          "Above ₹2 Lakh",
        ]);
      }
    );
  }

  function handleBudget(text, lower) {
    sessionData.lead.budget = text;
    sessionData.step = STEPS.ASK_PHONE;

    botMessage(
      `Got it! 📋 I'll find universities matching your budget.<br><br>To connect you with a <strong>free counseling session</strong>, may I have your <strong>phone number</strong>? (10 digits)`
    );
  }

  function handlePhone(text) {
    const phone = text.replace(/\D/g, "").trim();
    if (phone.length !== 10) {
      botMessage("Please enter a valid <strong>10-digit phone number</strong> so our counselor can reach you. 📞");
      return;
    }
    sessionData.lead.phone = phone;
    sessionData.step = STEPS.ASK_EMAIL;

    botMessage(
      `Perfect! 📞 One last thing — what's your <strong>email address</strong>?<br><small style="color:#94a3b8;">(We'll send university comparison guides to your inbox)</small>`
    );
  }

  function handleEmail(text) {
    const email = text.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      botMessage("Please enter a valid email address so we can send you personalized university recommendations. 📧");
      return;
    }

    sessionData.lead.email = email;
    sessionData.step = STEPS.COMPLETE;

    // Save lead to localStorage
    saveLead(sessionData.lead);

    // Final confirmation message
    botMessage(
      `🎉 <strong>Thank you, ${sessionData.lead.name}!</strong><br><br>Your details have been received:<br>• Course: <strong>${sessionData.lead.course}</strong><br>• Budget: <strong>${sessionData.lead.budget}</strong><br>• Phone: <strong>${sessionData.lead.phone}</strong>`,
      () => {
        setTimeout(() => {
          botMessage(
            `Our expert counselor will call you within <strong>24 hours</strong> on <strong>${sessionData.lead.phone}</strong> to discuss the best universities for you! 📞<br><br>Meanwhile, feel free to:<br>• 🔍 <a href="#catalog" onclick="window.location.hash='#catalog'">Browse Courses</a><br>• ⚖️ <a href="#compare" onclick="window.location.hash='#compare'">Compare Universities</a><br>• 📞 Call us directly: <a href="tel:6375079973">6375079973</a>`,
            () => {
              setTimeout(() => {
                botMessage(
                  `Do you have any more questions about online degrees? I'm here to help! 😊`,
                  () => {
                    showQuickReplies([
                      "Tell me about fees 💰",
                      "Which university is best? 🏆",
                      "Are degrees valid? ✅",
                      "EMI options 💳",
                      "Placement details 💼",
                    ]);
                    sessionData.step = STEPS.FREE_CHAT;
                    saveSession();
                  }
                );
              }, 800);
            }
          );
        }, 600);
      }
    );
  }

  function handleFreeChat(text, lower) {
    // Try to match knowledge base
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(kw => lower.includes(kw))) {
        botMessage(item.answer, () => {
          setTimeout(() => {
            showQuickReplies([
              "Tell me more 📖",
              "Compare universities ⚖️",
              "Call me back 📞",
              "Browse courses 🎓",
            ]);
          }, 500);
        });
        return;
      }
    }

    // Intent detection fallbacks
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      botMessage(`Hello! 👋 How can I help you today? Ask me anything about online degrees!`);
      return;
    }

    if (lower.includes("thank") || lower.includes("thanks")) {
      botMessage(`You're very welcome, ${sessionData.lead.name || "there"}! 🌟 I'm always here if you need anything else. Best of luck with your online degree journey!`);
      return;
    }

    if (lower.includes("bye") || lower.includes("goodbye") || lower.includes("see you")) {
      botMessage(`Goodbye! 👋 Don't hesitate to come back anytime. Our counselors look forward to helping you. Best of luck! 🎓`);
      return;
    }

    if (lower.includes("browse") || lower.includes("catalog") || lower.includes("explore")) {
      window.location.hash = "#catalog";
      botMessage("I've navigated you to the <strong>Course Catalog</strong>! 🎓 Browse all universities and use filters to narrow down by budget, NAAC grade, and more.");
      return;
    }

    if (lower.includes("compare")) {
      window.location.hash = "#compare";
      botMessage("I've opened the <strong>Compare Board</strong>! ⚖️ Select any two universities to see a side-by-side comparison of fees, placements, and LMS features.");
      return;
    }

    if (lower.includes("call") || lower.includes("callback") || lower.includes("speak")) {
      botMessage(`You can reach our counselors at <strong>📞 6375079973</strong> (Mon–Sat, 9 AM – 7 PM).<br><br>Or email: <a href="mailto:support@onlinedegrees.com">support@onlinedegrees.com</a>`);
      return;
    }

    // Default fallback response
    const fallbacks = [
      `That's a great question! For detailed guidance, our counselors are available at <strong>📞 6375079973</strong>. Would you like me to help with something else?`,
      `I'm still learning! For this specific query, I'd recommend speaking to our expert counselors at <strong>6375079973</strong>. Can I help you with course details, fees, or placements?`,
      `Interesting question, ${sessionData.lead.name || "there"}! Our expert counselors would be best placed to answer that. Call us at <strong>📞 6375079973</strong> (Mon–Sat, 9AM–7PM).`,
    ];
    const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    botMessage(fallback, () => {
      setTimeout(() => {
        showQuickReplies([
          "Course fees 💰",
          "Eligibility criteria 📋",
          "Placement records 💼",
          "Browse universities 🏫",
        ]);
      }, 400);
    });
  }

  // ---- Message Rendering ----
  function botMessage(html, callback) {
    showTypingIndicator();

    const delay = Math.min(800 + html.length * 5, 2200);

    typingTimeout = setTimeout(() => {
      hideTypingIndicator();

      const msgEl = document.createElement("div");
      msgEl.className = "od-message od-message--bot";
      msgEl.innerHTML = `
        <div class="od-bot-avatar-small"><span>${BOT_AVATAR}</span></div>
        <div class="od-message-bubble od-message-bubble--bot">${html}</div>
      `;
      messagesContainer.appendChild(msgEl);

      // Animate in
      requestAnimationFrame(() => {
        msgEl.classList.add("od-message--visible");
      });

      scrollToBottom();

      if (typeof callback === "function") {
        callback();
      }
    }, delay);
  }

  function userMessage(text) {
    clearTimeout(typingTimeout);
    hideTypingIndicator();

    const msgEl = document.createElement("div");
    msgEl.className = "od-message od-message--user od-message--visible";
    msgEl.innerHTML = `
      <div class="od-message-bubble od-message-bubble--user">${escapeHtml(text)}</div>
    `;
    messagesContainer.appendChild(msgEl);
    scrollToBottom();
  }

  function showQuickReplies(options) {
    const container = document.getElementById("od-quick-replies");
    if (!container) return;
    container.innerHTML = "";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "od-quick-reply-btn";
      btn.textContent = opt;
      btn.setAttribute("aria-label", `Quick reply: ${opt}`);
      btn.onclick = () => odBotQuickReply(opt);
      container.appendChild(btn);
    });
    container.style.display = "flex";
  }

  function clearQuickReplies() {
    const container = document.getElementById("od-quick-replies");
    if (container) {
      container.innerHTML = "";
      container.style.display = "none";
    }
  }

  function showTypingIndicator() {
    const indicator = document.getElementById("od-typing-indicator");
    if (indicator) indicator.style.display = "flex";
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById("od-typing-indicator");
    if (indicator) indicator.style.display = "none";
  }

  function scrollToBottom() {
    if (messagesContainer) {
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 50);
    }
  }

  // ---- Persistence ----
  function saveLead(lead) {
    let leads = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) leads = JSON.parse(stored);
    } catch (e) {}
    
    const timestamp = new Date().toISOString();
    leads.push({ ...lead, date: timestamp, source: "AI Chatbot" });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    console.log("📋 New lead captured:", lead);

    // Map lead to the unified structure used by the dispatcher
    const inquiry = {
      formType: "AI Chatbot Lead",
      name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      location: lead.location || "AI Chatbot Session",
      budget: lead.budget || "",
      course: lead.course || "",
      message: lead.message || "Lead captured during conversational counseling session.",
      date: timestamp
    };

    // Send to global dispatcher if defined in app.js
    if (typeof window.submitLeadToIntegrations === "function") {
      window.submitLeadToIntegrations(inquiry);
    } else {
      console.warn("Global lead integrations dispatcher not found.");
    }
  }

  function saveSession() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        step: sessionData.step,
        lead: sessionData.lead,
        messageCount: sessionData.messageCount,
      }));
    } catch (e) {}
  }

  // ---- Utilities ----
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

})();
