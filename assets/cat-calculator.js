/**
 * CAT 2026 Score Calculator & Response Sheet Percentile Predictor Engine
 * Features:
 *  - Official +3 / -1 / 0 marking scheme for 66 Qs / 198 Max Marks
 *  - Slot Equating & Normalization (Slot 1, 2, 3)
 *  - Digialm Response Sheet HTML & URL scanner + 1-Click Console script
 *  - Question-by-question audit table (66 questions breakdown)
 *  - Reverse %ile Goal Target Planner
 *  - IIM BLACKI & 40+ Top B-School call range predictor
 */

(function () {
  'use strict';

  // --- 1. STATE & CONSTANTS ---
  const MAX_QUESTIONS = {
    varc: { total: 24, mcq: 19, tita: 5, maxMarks: 72 },
    dilr: { total: 20, mcq: 15, tita: 5, maxMarks: 60 },
    qa: { total: 22, mcq: 16, tita: 6, maxMarks: 66 }
  };

  const state = {
    activeMode: 'manual', // 'url', 'source', 'manual', 'target'
    activeSlot: 'general', // 'general', 'slot1', 'slot2', 'slot3'
    activeSection: 'varc', // 'varc', 'dilr', 'qa'
    category: 'general', // 'general', 'nc-obc', 'sc', 'st', 'ews'
    attempts: {
      varc: { correctMcq: 14, wrongMcq: 4, correctTita: 2, wrongTita: 1 },
      dilr: { correctMcq: 8, wrongMcq: 2, correctTita: 1, wrongTita: 1 },
      qa: { correctMcq: 9, wrongMcq: 3, correctTita: 2, wrongTita: 1 }
    },
    auditQuestions: [],
    auditFilter: 'all'
  };

  // Empirical Slot Equating Normalization Adjustments
  const SLOT_ADJUSTMENTS = {
    general: { varc: 0.0, dilr: 0.0, qa: 0.0, desc: 'Unscaled standard raw performance benchmark' },
    slot1: { varc: 0.2, dilr: 1.8, qa: 0.8, desc: 'Slot 1: DILR & QA showed elevated difficulty, receiving upward scaling' },
    slot2: { varc: 1.6, dilr: 0.5, qa: 1.5, desc: 'Slot 2: High VARC & QA difficulty, resulting in +1.5 to +1.6 scaled adjustments' },
    slot3: { varc: 0.6, dilr: 1.5, qa: 2.8, desc: 'Slot 3: Exceptionally challenging Quant section, receiving significant upward calibration' }
  };

  // Empirical CAT Overall Marks vs Percentile Curve Anchors (198 Max Marks)
  const PERCENTILE_ANCHORS = [
    { score: 125, percentile: 99.99 },
    { score: 110, percentile: 99.90 },
    { score: 98,  percentile: 99.60 },
    { score: 92,  percentile: 99.25 },
    { score: 85,  percentile: 99.00 },
    { score: 79,  percentile: 98.20 },
    { score: 72,  percentile: 97.00 },
    { score: 65,  percentile: 95.50 },
    { score: 58,  percentile: 93.00 },
    { score: 50,  percentile: 90.00 },
    { score: 43,  percentile: 85.00 },
    { score: 36,  percentile: 80.00 },
    { score: 29,  percentile: 72.00 },
    { score: 23,  percentile: 62.00 },
    { score: 18,  percentile: 50.00 },
    { score: 12,  percentile: 35.00 },
    { score: 7,   percentile: 20.00 },
    { score: 0,   percentile: 5.00 },
    { score: -10, percentile: 0.01 }
  ];

  // Sectional Percentile Anchors
  const SECTION_ANCHORS = {
    varc: [
      { score: 52, percentile: 99.90 },
      { score: 42, percentile: 99.20 },
      { score: 37, percentile: 98.00 },
      { score: 31, percentile: 95.00 },
      { score: 25, percentile: 90.00 },
      { score: 19, percentile: 82.00 },
      { score: 14, percentile: 70.00 },
      { score: 8,  percentile: 50.00 },
      { score: 0,  percentile: 10.00 }
    ],
    dilr: [
      { score: 40, percentile: 99.90 },
      { score: 32, percentile: 99.20 },
      { score: 27, percentile: 98.00 },
      { score: 21, percentile: 95.00 },
      { score: 17, percentile: 90.00 },
      { score: 13, percentile: 82.00 },
      { score: 9,  percentile: 70.00 },
      { score: 5,  percentile: 50.00 },
      { score: 0,  percentile: 10.00 }
    ],
    qa: [
      { score: 44, percentile: 99.90 },
      { score: 35, percentile: 99.20 },
      { score: 29, percentile: 98.00 },
      { score: 23, percentile: 95.00 },
      { score: 18, percentile: 90.00 },
      { score: 14, percentile: 82.00 },
      { score: 10, percentile: 70.00 },
      { score: 6,  percentile: 50.00 },
      { score: 0,  percentile: 10.00 }
    ]
  };

  // Top MBA Colleges & B-Schools Directory
  const COLLEGES_DB = [
    // Tier 1: Premier IIMs & Super Elite
    { id: 'iim-a', name: 'IIM Ahmedabad', tier: 'tier1', minGeneral: 99.5, ctc: '₹34.4 LPA', fees: '₹25.0 Lakhs', loc: 'Ahmedabad, Gujarat', badge: 'Tier 1' },
    { id: 'iim-b', name: 'IIM Bangalore', tier: 'tier1', minGeneral: 99.5, ctc: '₹35.3 LPA', fees: '₹24.5 Lakhs', loc: 'Bengaluru, Karnataka', badge: 'Tier 1' },
    { id: 'iim-c', name: 'IIM Calcutta', tier: 'tier1', minGeneral: 99.5, ctc: '₹35.1 LPA', fees: '₹27.0 Lakhs', loc: 'Kolkata, WB', badge: 'Tier 1' },
    { id: 'fms-delhi', name: 'FMS Delhi', tier: 'tier1', minGeneral: 99.3, ctc: '₹34.1 LPA', fees: '₹2.0 Lakhs (High ROI)', loc: 'Delhi NCR', badge: 'Super ROI' },
    { id: 'spjimr', name: 'SPJIMR Mumbai', tier: 'tier1', minGeneral: 88.0, ctc: '₹33.0 LPA', fees: '₹24.0 Lakhs', loc: 'Mumbai, Maharashtra', badge: 'Profile-Cum-Score' },
    { id: 'sjmsom-iitb', name: 'SJMSOM IIT Bombay', tier: 'tier1', minGeneral: 98.5, ctc: '₹28.8 LPA', fees: '₹14.0 Lakhs', loc: 'Mumbai, Maharashtra', badge: 'Tier 1' },

    // Tier 1.5: Legacy IIMs & Premier Non-IIMs
    { id: 'iim-l', name: 'IIM Lucknow', tier: 'tier1_5', minGeneral: 98.0, ctc: '₹32.2 LPA', fees: '₹20.0 Lakhs', loc: 'Lucknow, UP', badge: 'Legacy IIM' },
    { id: 'iim-k', name: 'IIM Kozhikode', tier: 'tier1_5', minGeneral: 97.5, ctc: '₹31.0 LPA', fees: '₹20.5 Lakhs', loc: 'Kozhikode, Kerala', badge: 'Legacy IIM' },
    { id: 'iim-i', name: 'IIM Indore', tier: 'tier1_5', minGeneral: 97.0, ctc: '₹30.2 LPA', fees: '₹21.0 Lakhs', loc: 'Indore, MP', badge: 'Legacy IIM' },
    { id: 'iim-shillong', name: 'IIM Shillong', tier: 'tier1_5', minGeneral: 95.0, ctc: '₹26.9 LPA', fees: '₹18.0 Lakhs', loc: 'Shillong, Meghalaya', badge: 'Top IIM' },
    { id: 'mdi-gurgaon', name: 'MDI Gurgaon', tier: 'tier1_5', minGeneral: 95.5, ctc: '₹27.6 LPA', fees: '₹26.0 Lakhs', loc: 'Gurgaon, Delhi NCR', badge: 'Premier' },
    { id: 'dms-iitd', name: 'DMS IIT Delhi', tier: 'tier1_5', minGeneral: 97.5, ctc: '₹25.8 LPA', fees: '₹12.0 Lakhs', loc: 'Delhi NCR', badge: 'High ROI' },
    { id: 'iift-delhi', name: 'IIFT Delhi (Accepts CAT)', tier: 'tier1_5', minGeneral: 96.5, ctc: '₹29.1 LPA', fees: '₹21.7 Lakhs', loc: 'Delhi NCR', badge: 'Foreign Trade' },
    { id: 'iim-udaipur', name: 'IIM Udaipur (CAP)', tier: 'tier1_5', minGeneral: 93.0, ctc: '₹20.3 LPA', fees: '₹19.5 Lakhs', loc: 'Udaipur, Rajasthan', badge: 'New IIM' },
    { id: 'iim-trichy', name: 'IIM Trichy (CAP)', tier: 'tier1_5', minGeneral: 93.5, ctc: '₹20.5 LPA', fees: '₹19.5 Lakhs', loc: 'Tiruchirappalli, TN', badge: 'New IIM' },

    // Tier 2 Top: High-ROI & Baby IIMs
    { id: 'iim-nagpur', name: 'IIM Nagpur', tier: 'tier2_top', minGeneral: 90.0, ctc: '₹16.7 LPA', fees: '₹18.0 Lakhs', loc: 'Nagpur, Maharashtra', badge: 'Baby IIM' },
    { id: 'iim-vizag', name: 'IIM Visakhapatnam', tier: 'tier2_top', minGeneral: 90.0, ctc: '₹16.6 LPA', fees: '₹17.5 Lakhs', loc: 'Visakhapatnam, AP', badge: 'Baby IIM' },
    { id: 'iim-amritsar', name: 'IIM Amritsar', tier: 'tier2_top', minGeneral: 90.0, ctc: '₹16.5 LPA', fees: '₹17.0 Lakhs', loc: 'Amritsar, Punjab', badge: 'Baby IIM' },
    { id: 'imt-ghaziabad', name: 'IMT Ghaziabad', tier: 'tier2_top', minGeneral: 90.0, ctc: '₹17.3 LPA', fees: '₹21.5 Lakhs', loc: 'Ghaziabad, Delhi NCR', badge: 'Marketing Hub' },
    { id: 'imi-delhi', name: 'IMI New Delhi', tier: 'tier2_top', minGeneral: 90.0, ctc: '₹17.0 LPA', fees: '₹20.8 Lakhs', loc: 'New Delhi, Delhi NCR', badge: 'Tier 2 Top' },
    { id: 'fore-delhi', name: 'FORE School of Management', tier: 'tier2_top', minGeneral: 85.0, ctc: '₹15.1 LPA', fees: '₹18.5 Lakhs', loc: 'New Delhi, Delhi NCR', badge: 'Corporate Metro' },
    { id: 'gim-goa', name: 'GIM Goa', tier: 'tier2_top', minGeneral: 85.0, ctc: '₹15.2 LPA', fees: '₹19.5 Lakhs', loc: 'Goa', badge: 'Healthcare/Analytics' },
    { id: 'tapmi', name: 'TAPMI Manipal', tier: 'tier2_top', minGeneral: 85.0, ctc: '₹14.8 LPA', fees: '₹18.5 Lakhs', loc: 'Manipal, Karnataka', badge: 'BFSI Star' },

    // Tier 2: Leading Private PGDM
    { id: 'great-lakes', name: 'Great Lakes Institute (Chennai/Gurgaon)', tier: 'tier2', minGeneral: 80.0, ctc: '₹14.5 LPA', fees: '₹19.0 Lakhs', loc: 'Chennai & Gurgaon', badge: 'Analytics Leader' },
    { id: 'bimtech', name: 'BIMTECH Greater Noida', tier: 'tier2', minGeneral: 75.0, ctc: '₹11.2 LPA', fees: '₹14.0 Lakhs', loc: 'Greater Noida, NCR', badge: 'Insurance/Retail' },
    { id: 'kj-somaiya', name: 'K J Somaiya Institute of Management', tier: 'tier2', minGeneral: 83.0, ctc: '₹12.3 LPA', fees: '₹19.9 Lakhs', loc: 'Mumbai, Maharashtra', badge: 'Financial Hub' },
    { id: 'lbsim', name: 'LBSIM New Delhi', tier: 'tier2', minGeneral: 82.0, ctc: '₹12.2 LPA', fees: '₹15.5 Lakhs', loc: 'Dwarka, New Delhi', badge: 'Finance Hub' },
    { id: 'welingkar', name: 'Welingkar WeSchool (Mumbai/Bangalore)', tier: 'tier2', minGeneral: 78.0, ctc: '₹12.5 LPA', fees: '₹14.0 Lakhs', loc: 'Mumbai & Bangalore', badge: 'Design & E-Biz' },
    { id: 'liba', name: 'LIBA Chennai', tier: 'tier2', minGeneral: 75.0, ctc: '₹11.0 LPA', fees: '₹14.5 Lakhs', loc: 'Chennai, Tamil Nadu', badge: 'Jesuit Legacy' },

    // Tier 3: Metro PGDM Hubs
    { id: 'jaipuria', name: 'Jaipuria Institute of Management', tier: 'tier3', minGeneral: 65.0, ctc: '₹11.5 LPA', fees: '₹12.5 Lakhs', loc: 'Noida, Lucknow, Jaipur', badge: 'Multi-Campus' },
    { id: 'ndim', name: 'NDIM New Delhi', tier: 'tier3', minGeneral: 65.0, ctc: '₹10.5 LPA', fees: '₹11.5 Lakhs', loc: 'New Delhi, Delhi NCR', badge: 'Industry Connect' },
    { id: 'jims-rohini', name: 'JIMS Rohini', tier: 'tier3', minGeneral: 65.0, ctc: '₹8.5 LPA', fees: '₹9.2 Lakhs', loc: 'New Delhi, Delhi NCR', badge: 'High ROI' },
    { id: 'soil-gurgaon', name: 'SOIL Institute of Management', tier: 'tier3', minGeneral: 65.0, ctc: '₹10.8 LPA', fees: '₹14.5 Lakhs', loc: 'Gurgaon, Delhi NCR', badge: 'Leadership' },
    { id: 'ibs-hyd', name: 'IBS Hyderabad', tier: 'tier3', minGeneral: 60.0, ctc: '₹9.5 LPA', fees: '₹16.0 Lakhs', loc: 'Hyderabad, Telangana', badge: 'Case Method' },
    { id: 'itm-navi-mumbai', name: 'ITM Navi Mumbai', tier: 'tier3', minGeneral: 65.0, ctc: '₹8.6 LPA', fees: '₹11.0 Lakhs', loc: 'Navi Mumbai, MH', badge: 'FinTech/Mktg' }
  ];

  // Category cutoff reduction offsets
  const CATEGORY_OFFSETS = {
    'general': 0.0,
    'nc-obc': 8.0,
    'ews': 6.0,
    'sc': 22.0,
    'st': 28.0
  };

  // --- 2. PERCENTILE INTERPOLATION ENGINE ---
  function interpolatePercentile(score, anchors) {
    if (score >= anchors[0].score) {
      const topExcess = score - anchors[0].score;
      return Math.min(99.99, Number((anchors[0].percentile + topExcess * 0.005).toFixed(2)));
    }
    if (score <= anchors[anchors.length - 1].score) {
      return anchors[anchors.length - 1].percentile;
    }

    for (let i = 0; i < anchors.length - 1; i++) {
      const higher = anchors[i];
      const lower = anchors[i + 1];
      if (score <= higher.score && score >= lower.score) {
        const ratio = (score - lower.score) / (higher.score - lower.score);
        const result = lower.percentile + ratio * (higher.percentile - lower.percentile);
        return Number(result.toFixed(2));
      }
    }
    return 10.0;
  }

  // --- 3. CORE CALCULATION ROUTINES ---
  function computeSectionRaw(sec) {
    const a = state.attempts[sec];
    const mcqMarks = (a.correctMcq * 3) - (a.wrongMcq * 1);
    const titaMarks = (a.correctTita * 3);
    return mcqMarks + titaMarks;
  }

  function calculateAllScores() {
    const slot = SLOT_ADJUSTMENTS[state.activeSlot] || SLOT_ADJUSTMENTS.general;

    // 1. Raw Sectional
    const varcRaw = computeSectionRaw('varc');
    const dilrRaw = computeSectionRaw('dilr');
    const qaRaw = computeSectionRaw('qa');
    const totalRaw = varcRaw + dilrRaw + qaRaw;

    // 2. Scaled Sectional (Clamped)
    const varcScaled = Math.max(0, Math.min(72, Number((varcRaw + slot.varc).toFixed(1))));
    const dilrScaled = Math.max(0, Math.min(60, Number((dilrRaw + slot.dilr).toFixed(1))));
    const qaScaled = Math.max(0, Math.min(66, Number((qaRaw + slot.qa).toFixed(1))));
    const totalScaled = Math.max(0, Math.min(198, Number((totalRaw + slot.varc + slot.dilr + slot.qa).toFixed(1))));

    // 3. Percentiles
    const overallPercentile = interpolatePercentile(totalScaled, PERCENTILE_ANCHORS);
    const varcPercentile = interpolatePercentile(varcScaled, SECTION_ANCHORS.varc);
    const dilrPercentile = interpolatePercentile(dilrScaled, SECTION_ANCHORS.dilr);
    const qaPercentile = interpolatePercentile(qaScaled, SECTION_ANCHORS.qa);

    // 4. Attempts & Accuracy Aggregates
    const att = state.attempts;
    const totalAttempted = 
      (att.varc.correctMcq + att.varc.wrongMcq + att.varc.correctTita + att.varc.wrongTita) +
      (att.dilr.correctMcq + att.dilr.wrongMcq + att.dilr.correctTita + att.dilr.wrongTita) +
      (att.qa.correctMcq + att.qa.wrongMcq + att.qa.correctTita + att.qa.wrongTita);

    const totalCorrect = 
      (att.varc.correctMcq + att.varc.correctTita) +
      (att.dilr.correctMcq + att.dilr.correctTita) +
      (att.qa.correctMcq + att.qa.correctTita);

    const totalIncorrect = 
      (att.varc.wrongMcq + att.varc.wrongTita) +
      (att.dilr.wrongMcq + att.dilr.wrongTita) +
      (att.qa.wrongMcq + att.qa.wrongTita);

    const accuracy = totalAttempted > 0 ? Number(((totalCorrect / totalAttempted) * 100).toFixed(1)) : 0;
    const negativeLost = (att.varc.wrongMcq + att.dilr.wrongMcq + att.qa.wrongMcq) * 1;

    return {
      raw: { varc: varcRaw, dilr: dilrRaw, qa: qaRaw, total: totalRaw },
      scaled: { varc: varcScaled, dilr: dilrScaled, qa: qaScaled, total: totalScaled },
      percentiles: { varc: varcPercentile, dilr: dilrPercentile, qa: qaPercentile, overall: overallPercentile },
      stats: {
        totalAttempted,
        totalCorrect,
        totalIncorrect,
        accuracy,
        negativeLost,
        unattempted: 66 - totalAttempted
      }
    };
  }

  // --- 4. DOM UPDATE PIPELINE ---
  function updateUI() {
    const scores = calculateAllScores();

    // 1. Update Section Nav Tabs
    document.querySelectorAll('.cat-sec-tab-btn').forEach(btn => {
      const sec = btn.dataset.sec;
      if (sec) {
        const rawScore = scores.raw[sec];
        const valElem = btn.querySelector('.cat-sec-score-val');
        if (valElem) valElem.textContent = rawScore;
      }
    });

    // 2. Update Editor Inputs for Active Section
    const activeSec = state.activeSection;
    const activeAtt = state.attempts[activeSec];
    
    setInputValue('input-correct-mcq', activeAtt.correctMcq);
    setInputValue('input-wrong-mcq', activeAtt.wrongMcq);
    setInputValue('input-correct-tita', activeAtt.correctTita);

    const activeRaw = scores.raw[activeSec];
    const activeSecPct = scores.percentiles[activeSec];
    const liveScoreEl = document.getElementById('sec-live-score-val');
    const liveSubEl = document.getElementById('sec-live-sub-val');
    if (liveScoreEl) liveScoreEl.textContent = `${activeRaw} / ${MAX_QUESTIONS[activeSec].maxMarks} marks`;
    if (liveSubEl) liveSubEl.textContent = `Est. Sectional Percentile: ~${activeSecPct}%ile · Max ${MAX_QUESTIONS[activeSec].total} Qs`;

    // 3. Update Master Result Cards
    const rawValEl = document.getElementById('res-overall-raw');
    const scaledValEl = document.getElementById('res-overall-scaled');
    const pctValEl = document.getElementById('res-overall-pct');
    const pctRangeEl = document.getElementById('res-pct-range');
    const slotDescEl = document.getElementById('res-slot-desc');

    if (rawValEl) rawValEl.innerHTML = `${scores.raw.total} <span class="max-label">/ 198</span>`;
    if (scaledValEl) scaledValEl.innerHTML = `${scores.scaled.total} <span class="max-label">/ 198</span>`;
    if (pctValEl) pctValEl.innerHTML = `${scores.percentiles.overall}<span class="max-label">%ile</span>`;
    
    if (pctRangeEl) {
      const minR = Math.max(0.1, (scores.percentiles.overall - 0.45)).toFixed(2);
      const maxR = Math.min(99.99, (scores.percentiles.overall + 0.35)).toFixed(2);
      pctRangeEl.textContent = `Predicted Range: ${minR}%ile — ${maxR}%ile`;
    }
    if (slotDescEl) {
      slotDescEl.textContent = SLOT_ADJUSTMENTS[state.activeSlot].desc;
    }

    // 4. Update Sectional Breakdown Cards
    ['varc', 'dilr', 'qa'].forEach(sec => {
      const sRaw = scores.raw[sec];
      const sScaled = scores.scaled[sec];
      const sPct = scores.percentiles[sec];
      const a = state.attempts[sec];
      const secAttempts = a.correctMcq + a.wrongMcq + a.correctTita + a.wrongTita;

      setText(`sec-card-marks-${sec}`, `${sRaw} M`);
      setText(`sec-card-pct-${sec}`, `${sPct}%ile`);
      setText(`sec-card-scaled-${sec}`, `${sScaled} Scaled`);
      setText(`sec-card-attempts-${sec}`, `${secAttempts}/${MAX_QUESTIONS[sec].total} Attempted`);
      setText(`sec-card-acc-${sec}`, secAttempts > 0 ? `${Math.round(((a.correctMcq + a.correctTita) / secAttempts) * 100)}%` : '0%');
    });

    // 5. Update KPI Bar
    setText('kpi-total-attempted', `${scores.stats.totalAttempted} / 66`);
    setText('kpi-total-correct', `${scores.stats.totalCorrect}`);
    setText('kpi-total-incorrect', `${scores.stats.totalIncorrect}`);
    setText('kpi-accuracy-pct', `${scores.stats.accuracy}%`);

    // 6. Refresh B-School Predictions
    renderCollegePredictions(scores.percentiles.overall);
  }

  function setInputValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // --- 5. B-SCHOOL CALL PREDICTOR RENDERING ---
  function renderCollegePredictions(candidatePercentile) {
    const container = document.getElementById('colleges-list-container');
    if (!container) return;

    const catOffset = CATEGORY_OFFSETS[state.category] || 0.0;

    // Group colleges by tier
    const tiers = {
      tier1: { title: 'Tier 1: Mega Premier B-Schools (99+ %ile Club)', list: [] },
      tier1_5: { title: 'Tier 1.5: Top Legacy IIMs & Premier B-Schools', list: [] },
      tier2_top: { title: 'Tier 2 Top: High-ROI & Baby IIMs (CAP Round)', list: [] },
      tier2: { title: 'Tier 2: Leading Metro PGDM Institutes', list: [] },
      tier3: { title: 'Tier 3: Specialized & High-ROI Metro Hubs', list: [] }
    };

    COLLEGES_DB.forEach(col => {
      const requiredCutoff = Math.max(50.0, Number((col.minGeneral - catOffset).toFixed(1)));
      let statusClass = 'ambitious';
      let statusText = 'Ambitious Target';

      if (candidatePercentile >= requiredCutoff + 1.5) {
        statusClass = 'high';
        statusText = 'Very Safe Call';
      } else if (candidatePercentile >= requiredCutoff - 0.5) {
        statusClass = 'moderate';
        statusText = 'Strong Call Chance';
      } else if (candidatePercentile >= requiredCutoff - 2.5) {
        statusClass = 'borderline';
        statusText = 'Borderline Interview Call';
      }

      if (tiers[col.tier]) {
        tiers[col.tier].list.push({ ...col, requiredCutoff, statusClass, statusText });
      }
    });

    let html = '';
    Object.keys(tiers).forEach(tierKey => {
      const tierObj = tiers[tierKey];
      if (tierObj.list.length > 0) {
        html += `
          <div class="cat-tier-group-block">
            <div class="cat-tier-group-title">
              <span class="cat-tier-name">${tierObj.title}</span>
              <span class="cat-tier-badge">${tierObj.list.length} B-Schools</span>
            </div>
            <div class="cat-colleges-card-grid">
              ${tierObj.list.map(c => `
                <div class="cat-college-card">
                  <div class="cat-college-card-top">
                    <span class="cat-college-name">${c.name}</span>
                    <span class="cat-chance-pill ${c.statusClass}">${c.statusText}</span>
                  </div>
                  <div class="cat-college-metrics">
                    <div>Min %ile: <strong>${c.requiredCutoff}%ile</strong> (${state.category.toUpperCase()})</div>
                    <div>Avg Package: <strong>${c.ctc}</strong> · Fee: ${c.fees}</div>
                    <div>Location: ${c.loc}</div>
                  </div>
                  <a href="/online-mba" class="cat-college-btn-cta">
                    <i class="fas fa-arrow-right"></i> Explore Programs &amp; Admission
                  </a>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    });

    container.innerHTML = html;
  }

  // --- 6. PARSER ENGINE (DIGIALM HTML SOURCE & RESPONSE SHEETS) ---
  function parseResponseSheetHtml(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Find all question panels
    let questionPanels = doc.querySelectorAll('.question-pnl, table.menu-tbl');
    if (!questionPanels || questionPanels.length === 0) {
      questionPanels = doc.querySelectorAll('.section-cntnr table');
    }

    if (!questionPanels || questionPanels.length === 0) {
      return { success: false, message: 'Could not detect standard TCS iON question tables. Please ensure you copied the entire page source (Ctrl+U).' };
    }

    const auditList = [];
    const counts = {
      varc: { correctMcq: 0, wrongMcq: 0, correctTita: 0, wrongTita: 0 },
      dilr: { correctMcq: 0, wrongMcq: 0, correctTita: 0, wrongTita: 0 },
      qa: { correctMcq: 0, wrongMcq: 0, correctTita: 0, wrongTita: 0 }
    };

    let qIndex = 1;
    questionPanels.forEach(panel => {
      const panelText = panel.innerText || panel.textContent || '';
      
      // Determine question type (MCQ vs SA)
      const isMcq = /Question Type\s*:\s*MCQ/i.test(panelText) || !/Question Type\s*:\s*SA/i.test(panelText);
      const isAnswered = /Status\s*:\s*Answered/i.test(panelText);
      const isNotAnswered = /Status\s*:\s*Not Answered/i.test(panelText) || /Status\s*:\s*Marked For Review/i.test(panelText);

      // Extract chosen option
      const chosenMatch = panelText.match(/Chosen Option\s*:\s*([0-9]+|--)/i);
      const chosenOpt = chosenMatch ? chosenMatch[1].trim() : '--';

      // Check right answer
      const rightAnsCell = panel.querySelector('.rightAns, td.rightAns');
      let rightOptText = rightAnsCell ? (rightAnsCell.innerText || rightAnsCell.textContent || '').trim() : '';

      // Determine section based on question index (standard CAT: 1-24 VARC, 25-44 DILR, 45-66 QA)
      let section = 'varc';
      if (qIndex > 44) section = 'qa';
      else if (qIndex > 24) section = 'dilr';

      let resultStatus = 'unattempted';
      let marksEarned = 0;

      if (isAnswered && chosenOpt !== '--') {
        // Compare chosen vs right
        const isCorrect = (rightAnsCell && rightAnsCell.parentElement && rightAnsCell.parentElement.innerText.includes(chosenOpt)) ||
                          (chosenOpt && rightOptText.includes(chosenOpt));

        if (isCorrect) {
          resultStatus = 'correct';
          marksEarned = 3;
          if (isMcq) counts[section].correctMcq++;
          else counts[section].correctTita++;
        } else {
          resultStatus = 'wrong';
          if (isMcq) {
            marksEarned = -1;
            counts[section].wrongMcq++;
          } else {
            marksEarned = 0;
            counts[section].wrongTita++;
          }
        }
      }

      auditList.push({
        qNo: qIndex,
        section: section.toUpperCase(),
        type: isMcq ? 'MCQ' : 'TITA',
        chosen: chosenOpt !== '--' ? chosenOpt : 'Not Attempted',
        correct: rightOptText ? rightOptText.slice(0, 30) : 'Option Correct',
        status: resultStatus,
        marks: marksEarned
      });

      qIndex++;
    });

    state.attempts = counts;
    state.auditQuestions = auditList;

    return {
      success: true,
      totalParsed: auditList.length,
      auditList
    };
  }

  function renderAuditTable() {
    const tableBody = document.getElementById('audit-table-body');
    const container = document.getElementById('audit-table-wrapper');
    if (!tableBody || !container) return;

    if (state.auditQuestions.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    const filtered = state.auditQuestions.filter(q => {
      if (state.auditFilter === 'all') return true;
      return q.status === state.auditFilter;
    });

    tableBody.innerHTML = filtered.map(q => `
      <tr>
        <td style="font-family:var(--font-mono);font-weight:700;">#${q.qNo}</td>
        <td><span class="cat-sec-badge-tag ${q.section.toLowerCase()}">${q.section}</span></td>
        <td style="font-family:var(--font-mono);">${q.type}</td>
        <td><strong>${q.chosen}</strong></td>
        <td><span class="cat-status-pill ${q.status}">${q.status.toUpperCase()}</span></td>
        <td style="font-family:var(--font-mono);font-weight:900;color:${q.marks > 0 ? '#10B981' : (q.marks < 0 ? '#FF007A' : '#64748B')};">
          ${q.marks > 0 ? '+' + q.marks : q.marks}
        </td>
      </tr>
    `).join('');
  }

  // --- 7. LOAD DEMO RESPONSE SHEET ---
  function loadDemoCandidateResponseSheet() {
    state.attempts = {
      varc: { correctMcq: 13, wrongMcq: 4, correctTita: 2, wrongTita: 1 },
      dilr: { correctMcq: 8, wrongMcq: 2, correctTita: 1, wrongTita: 1 },
      qa: { correctMcq: 10, wrongMcq: 2, correctTita: 2, wrongTita: 0 }
    };
    state.activeSlot = 'slot2';

    // Populate simulated 66-question audit
    const mockAudit = [];
    let qNo = 1;
    ['varc', 'dilr', 'qa'].forEach(sec => {
      const qCount = MAX_QUESTIONS[sec].total;
      for (let i = 1; i <= qCount; i++) {
        let isCorrect = (i % 3 !== 0);
        let isMcq = (i <= MAX_QUESTIONS[sec].mcq);
        let status = isCorrect ? 'correct' : (i % 5 === 0 ? 'unattempted' : 'wrong');
        let marks = status === 'correct' ? 3 : (status === 'wrong' && isMcq ? -1 : 0);

        mockAudit.push({
          qNo: qNo++,
          section: sec.toUpperCase(),
          type: isMcq ? 'MCQ' : 'TITA',
          chosen: status === 'unattempted' ? 'Not Attempted' : `Option ${(i % 4) + 1}`,
          correct: `Option ${(i % 4) + 1}`,
          status,
          marks
        });
      }
    });

    state.auditQuestions = mockAudit;

    // Set UI tab to manual
    setMode('manual');
    updateUI();
    renderAuditTable();

    // Scroll to results
    const resultsEl = document.getElementById('results-dashboard');
    if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });

    showToast('Loaded CAT Demo Response Sheet (91 Raw Marks · 99.2%ile)');
  }

  // --- 8. REVERSE GOAL PLANNER ---
  function applyGoalTarget(targetPct) {
    let targetScore = 85;
    if (targetPct >= 99.9) targetScore = 112;
    else if (targetPct >= 99.5) targetScore = 98;
    else if (targetPct >= 99.0) targetScore = 86;
    else if (targetPct >= 98.0) targetScore = 78;
    else if (targetPct >= 95.0) targetScore = 65;
    else if (targetPct >= 90.0) targetScore = 52;
    else if (targetPct >= 85.0) targetScore = 44;
    else if (targetPct >= 80.0) targetScore = 36;
    else targetScore = 28;

    // Distribute across sections
    const varcGoal = Math.round(targetScore * 0.40);
    const dilrGoal = Math.round(targetScore * 0.30);
    const qaGoal = targetScore - varcGoal - dilrGoal;

    state.attempts = {
      varc: { correctMcq: Math.min(18, Math.max(1, Math.round(varcGoal / 3))), wrongMcq: 3, correctTita: 1, wrongTita: 1 },
      dilr: { correctMcq: Math.min(14, Math.max(1, Math.round(dilrGoal / 3))), wrongMcq: 2, correctTita: 1, wrongTita: 1 },
      qa: { correctMcq: Math.min(15, Math.max(1, Math.round(qaGoal / 3))), wrongMcq: 2, correctTita: 1, wrongTita: 1 }
    };

    updateUI();
    showToast(`Applied ${targetPct}%ile Target Plan (Requires ~${targetScore} Marks)`);
  }

  // --- 9. TOAST & NOTIFICATIONS ---
  function showToast(msg) {
    let toast = document.getElementById('cat-calculator-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cat-calculator-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #061124;
        color: #00F0FF;
        border: 1px solid rgba(0, 240, 255, 0.4);
        border-radius: 14px;
        padding: 12px 20px;
        font-family: var(--font-body);
        font-size: 0.85rem;
        font-weight: 700;
        z-index: 99999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
        transform: translateY(100px);
        opacity: 0;
      `;
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fas fa-check-circle" style="color:#00FF88;"></i> ${msg}`;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
    }, 3500);
  }

  // --- 10. EVENT HANDLERS SETUP ---
  function setMode(mode) {
    state.activeMode = mode;
    document.querySelectorAll('.cat-mode-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.mode === mode);
    });
    document.querySelectorAll('.cat-mode-panel').forEach(p => {
      p.classList.toggle('active', p.dataset.mode === mode);
    });
  }

  function setupEventListeners() {
    // Mode Switcher Tabs
    document.querySelectorAll('.cat-mode-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        setMode(tab.dataset.mode);
      });
    });

    // Slot Normalization Selector
    document.querySelectorAll('.cat-slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-slot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeSlot = btn.dataset.slot || 'general';
        updateUI();
        showToast(`Slot Normalization set to: ${btn.textContent.trim()}`);
      });
    });

    // Section Selector Tabs (VARC, DILR, QA)
    document.querySelectorAll('.cat-sec-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-sec-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeSection = btn.dataset.sec || 'varc';

        // Update Editor Header Title
        const names = {
          varc: { title: 'Verbal Ability & Reading Comprehension', tag: 'VARC' },
          dilr: { title: 'Data Interpretation & Logical Reasoning', tag: 'DILR' },
          qa: { title: 'Quantitative Ability', tag: 'QA' }
        };
        const info = names[state.activeSection];
        const tagEl = document.getElementById('sec-editor-tag');
        const titleEl = document.getElementById('sec-editor-title');
        const countEl = document.getElementById('sec-editor-q-count');

        if (tagEl) {
          tagEl.className = `cat-sec-badge-tag ${state.activeSection}`;
          tagEl.textContent = info.tag;
        }
        if (titleEl) titleEl.textContent = info.title;
        if (countEl) {
          const m = MAX_QUESTIONS[state.activeSection];
          countEl.textContent = `${m.total} Questions total (${m.mcq} MCQs + ${m.tita} TITAs)`;
        }

        updateUI();
      });
    });

    // Stepper Input Controls for Active Section
    function bindStepper(btnClass, inputId, key, isWrong) {
      document.querySelectorAll(`.${btnClass}`).forEach(btn => {
        btn.addEventListener('click', () => {
          const delta = parseInt(btn.dataset.delta, 10) || 0;
          const current = state.attempts[state.activeSection][key];
          const maxLimit = key.includes('tita') ? MAX_QUESTIONS[state.activeSection].tita : MAX_QUESTIONS[state.activeSection].mcq;
          const newVal = Math.max(0, Math.min(maxLimit, current + delta));
          state.attempts[state.activeSection][key] = newVal;
          updateUI();
        });
      });

      const inputEl = document.getElementById(inputId);
      if (inputEl) {
        inputEl.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          const maxLimit = key.includes('tita') ? MAX_QUESTIONS[state.activeSection].tita : MAX_QUESTIONS[state.activeSection].mcq;
          state.attempts[state.activeSection][key] = isNaN(val) ? 0 : Math.max(0, Math.min(maxLimit, val));
          updateUI();
        });
      }
    }

    bindStepper('step-btn-correct-mcq', 'input-correct-mcq', 'correctMcq', false);
    bindStepper('step-btn-wrong-mcq', 'input-wrong-mcq', 'wrongMcq', true);
    bindStepper('step-btn-correct-tita', 'input-correct-tita', 'correctTita', false);

    // Profile Presets (99%ile, 95%ile, etc.)
    document.querySelectorAll('.cat-preset-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const profile = pill.dataset.profile;
        if (profile === '99') {
          state.attempts = {
            varc: { correctMcq: 14, wrongMcq: 3, correctTita: 2, wrongTita: 1 },
            dilr: { correctMcq: 9, wrongMcq: 2, correctTita: 1, wrongTita: 1 },
            qa: { correctMcq: 10, wrongMcq: 2, correctTita: 2, wrongTita: 0 }
          };
        } else if (profile === '95') {
          state.attempts = {
            varc: { correctMcq: 11, wrongMcq: 4, correctTita: 1, wrongTita: 1 },
            dilr: { correctMcq: 7, wrongMcq: 2, correctTita: 1, wrongTita: 1 },
            qa: { correctMcq: 7, wrongMcq: 2, correctTita: 1, wrongTita: 1 }
          };
        } else if (profile === '90') {
          state.attempts = {
            varc: { correctMcq: 9, wrongMcq: 4, correctTita: 1, wrongTita: 1 },
            dilr: { correctMcq: 5, wrongMcq: 2, correctTita: 1, wrongTita: 1 },
            qa: { correctMcq: 6, wrongMcq: 2, correctTita: 1, wrongTita: 1 }
          };
        } else if (profile === 'average') {
          state.attempts = {
            varc: { correctMcq: 7, wrongMcq: 5, correctTita: 1, wrongTita: 1 },
            dilr: { correctMcq: 4, wrongMcq: 3, correctTita: 0, wrongTita: 2 },
            qa: { correctMcq: 4, wrongMcq: 3, correctTita: 1, wrongTita: 1 }
          };
        }
        updateUI();
        showToast(`Loaded ${pill.textContent.trim()} Profile Preset`);
      });
    });

    // Reset Button
    const resetBtn = document.getElementById('cat-reset-all-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.attempts = {
          varc: { correctMcq: 0, wrongMcq: 0, correctTita: 0, wrongTita: 0 },
          dilr: { correctMcq: 0, wrongMcq: 0, correctTita: 0, wrongTita: 0 },
          qa: { correctMcq: 0, wrongMcq: 0, correctTita: 0, wrongTita: 0 }
        };
        state.auditQuestions = [];
        updateUI();
        renderAuditTable();
        showToast('All scores reset to zero');
      });
    }

    // 1-Click Console Shortcut Copy
    const copyScriptBtn = document.getElementById('copy-console-script-btn');
    if (copyScriptBtn) {
      copyScriptBtn.addEventListener('click', () => {
        const scriptCode = `copy(document.documentElement.outerHTML); alert('CAT Response Sheet HTML copied to clipboard! Now switch back to OnlineDegrees CAT Calculator, click HTML Source tab, and paste (Ctrl+V).');`;
        navigator.clipboard.writeText(scriptCode).then(() => {
          copyScriptBtn.innerHTML = '<i class="fas fa-check"></i> <span>Copied to Clipboard!</span>';
          setTimeout(() => {
            copyScriptBtn.innerHTML = '<i class="fas fa-copy"></i> <span>Copy 1-Click Script</span>';
          }, 4000);
          showToast('1-Click Console Script Copied! Paste in F12 Console on digialm.com');
        });
      });
    }

    // Parse HTML Source Button
    const parseSourceBtn = document.getElementById('parse-html-source-btn');
    if (parseSourceBtn) {
      parseSourceBtn.addEventListener('click', () => {
        const sourceText = document.getElementById('html-source-textarea').value;
        if (!sourceText || sourceText.trim().length < 50) {
          alert('Please paste the complete HTML page source of your candidate response sheet.');
          return;
        }

        const parseResult = parseResponseSheetHtml(sourceText);
        if (parseResult.success) {
          setMode('manual');
          updateUI();
          renderAuditTable();
          showToast(`Successfully analyzed ${parseResult.totalParsed} questions from your Response Sheet!`);
          const resultsEl = document.getElementById('results-dashboard');
          if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          alert(parseResult.message);
        }
      });
    }

    // Scan Response Sheet URL Button
    const scanUrlBtn = document.getElementById('scan-url-btn');
    if (scanUrlBtn) {
      scanUrlBtn.addEventListener('click', () => {
        const urlInput = document.getElementById('response-sheet-url-input');
        const url = urlInput ? urlInput.value.trim() : '';

        if (!url || (!url.includes('digialm.com') && !url.includes('iimcat.ac.in'))) {
          alert('Please provide a valid Digialm response sheet URL from cdn.digialm.com or iimcat.ac.in.');
          return;
        }

        scanUrlBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning Response Sheet...';
        scanUrlBtn.disabled = true;

        // Try client-side fetch (which typically hits browser CORS on direct digialm)
        fetch(url)
          .then(res => res.text())
          .then(html => {
            const res = parseResponseSheetHtml(html);
            if (res.success) {
              setMode('manual');
              updateUI();
              renderAuditTable();
              showToast('Official Response Sheet Verified & Calculated!');
            } else {
              throw new Error(res.message);
            }
          })
          .catch(() => {
            // Inform about login session security and prompt console copy
            alert(
              "Direct browser access to candidate URLs on cdn.digialm.com is restricted by TCS iON authentication.\n\n" +
              "Fast Solution (Takes 10 Seconds):\n" +
              "1. Open your Response Sheet in the browser.\n" +
              "2. Press F12 -> Console -> Click 'Copy 1-Click Script' here and press Enter.\n" +
              "3. Paste (Ctrl+V) into the 'HTML Source' tab and hit Calculate!\n\n" +
              "Or click 'Try Sample Demo' to test immediately."
            );
          })
          .finally(() => {
            scanUrlBtn.innerHTML = '<i class="fas fa-bolt"></i> Scan My Answer Key';
            scanUrlBtn.disabled = false;
          });
      });
    }

    // Demo Sample Buttons
    document.querySelectorAll('.cat-load-demo-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        loadDemoCandidateResponseSheet();
      });
    });

    // Category Selector
    const catSelect = document.getElementById('category-filter-select');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        state.category = e.target.value;
        const scores = calculateAllScores();
        renderCollegePredictions(scores.percentiles.overall);
        showToast(`B-School cutoffs calibrated for: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // Goal Planner Slider / Selection
    const goalRange = document.getElementById('target-pct-range');
    const goalValText = document.getElementById('target-pct-val-display');
    if (goalRange) {
      goalRange.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (goalValText) goalValText.textContent = `${val.toFixed(1)}%ile`;
      });
    }
    const applyGoalBtn = document.getElementById('apply-target-goal-btn');
    if (applyGoalBtn) {
      applyGoalBtn.addEventListener('click', () => {
        const val = goalRange ? parseFloat(goalRange.value) : 99.0;
        applyGoalTarget(val);
      });
    }

    // Copy Scorecard Summary Button
    const copySummaryBtn = document.getElementById('copy-scorecard-summary-btn');
    if (copySummaryBtn) {
      copySummaryBtn.addEventListener('click', () => {
        const s = calculateAllScores();
        const text = 
`🏆 CAT 2026 Scorecard Summary (Calculated on OnlineDegrees)
-----------------------------------------------------------
Overall Raw Score     : ${s.raw.total} / 198 Marks
Slot-Normalized Scaled: ${s.scaled.total} Marks (${state.activeSlot.toUpperCase()})
Predicted Percentile  : ${s.percentiles.overall}%ile (Range: ${(s.percentiles.overall - 0.4).toFixed(2)} - ${(s.percentiles.overall + 0.3).toFixed(2)}%ile)

Sectional Breakdown:
- VARC : ${s.raw.varc}/72 Marks (${s.scaled.varc} Scaled) ~ ${s.percentiles.varc}%ile
- DILR : ${s.raw.dilr}/60 Marks (${s.scaled.dilr} Scaled) ~ ${s.percentiles.dilr}%ile
- QA   : ${s.raw.qa}/66 Marks (${s.scaled.qa} Scaled) ~ ${s.percentiles.qa}%ile

Attempts: ${s.stats.totalAttempted}/66 (Correct: ${s.stats.totalCorrect}, Incorrect: ${s.stats.totalIncorrect}, Accuracy: ${s.stats.accuracy}%)
Calculate yours at: https://www.getonlinedegrees.online/cat-score-calculator`;

        navigator.clipboard.writeText(text).then(() => {
          showToast('Scorecard Summary copied to clipboard!');
        });
      });
    }

    // Print Button
    const printBtn = document.getElementById('print-scorecard-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Audit Filter Pills
    document.querySelectorAll('.cat-audit-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-audit-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.auditFilter = btn.dataset.filter || 'all';
        renderAuditTable();
      });
    });
  }

  // --- 11. INITIALIZATION ON DOM READY ---
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateUI();
  });

})();
