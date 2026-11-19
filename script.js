"use strict";

/* ---------- Your assets and presentation timings ---------- */

const ASSET = {
  opening: "assets/mainbackground.png",
  home: "assets/mainbackground-home.png",
  bank: "assets/bank1.png",
  cutaway: "assets/bank2.png",
  name: "assets/bank-name.png",
  checklist: "assets/fairy2.png",
  chat: "assets/fairy3.png",
  welcome: ["fairy1", "fairy4", "fairy5", "fairy 6"].map(n => `assets/${n}.png`),
  residents: ["fairy7", "fairy8", "fairy9"].map(n => `assets/${n}.png`),
  sun: "assets/sun-clay.png",
  cloud1: "assets/cloud-1.png",
  cloud2: "assets/cloud-2.png",
  cloud3: "assets/cloud-3.png",
  zalo: "assets/zalo.png",
  regulation: "assets/regulation1.png",
  /*
    Put your own sticker file in assets/sticker.png (or change this path to match your file).
  */
  sticker: "assets/sticker.jpg",
  magicSound: "assets/magicalsoundeffect.mp3",
  /*
    Put your clapping/cheering audio for the star button in assets/cheering.mp3,
    and your separate ending music for the final screen in assets/finale.mp3.
  */
  cheeringSound: "assets/clapping.mp3",
  finaleSound: "assets/outro.mp3"
};

const ASSET_FALLBACK = {
  "assets/fairy 6.png": "assets/fairy6.png",
  "assets/sun-clay.png": "assets/sun.png",
  "assets/mainbackground-home.png": "assets/mainbackground.png",
  "assets/sticker.png": "assets/sticker1.png"
};

const SETTINGS = {
  lensRadius: 110,          // pixels
  fairyWait: 3000,          // delay after gray Next
  fairyFlight: 2600,        // flight across the checklist
  checkInterval: 240,       // time between green checks
  preReplyPause: 2000,      // 2-second pause before incoming message / typing / group event
  typingDuration: 2200,     // 3-dots typing animation duration
  outgoingGap: 1000         // between messages in the same TQB turn
};

const SOUND = {
  pop: "", typing: "", loading: "", bling: ASSET.magicSound,
  "3dots": "", whoop: "", correct: "", wrong: "", stress: "",
  yay: "", clapping: ASSET.cheeringSound, finale: ASSET.finaleSound
};

const $ = id => document.getElementById(id);
const panel = $("panel");
const content = $("content");
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function el(tag, cls = "", text = "") {
  const n = document.createElement(tag);
  n.className = cls;
  n.textContent = text;
  return n;
}

function button(label, run, cls = "") {
  const n = el("button", cls, label);
  n.type = "button";
  n.onclick = run;
  return n;
}

function svg(tag, attrs = {}, text = "") {
  const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs)) n.setAttribute(key, value);
  n.textContent = text;
  return n;
}

const PATH = {
  home: "M3 11 12 3l9 8 M5 10v11h5v-7h4v7h5V10",
  bank: "M3 9 12 4l9 5z M5 20h14 M7 11v6m5-6v6m5-6v6",
  chat: "M3 4h18v13H9l-6 4z M7 8h10m-10 4h7",
  people: "M9 4a3 3 0 1 0 .1 0 M3 20v-2a6 6 0 0 1 12 0v2 M16 5a3 3 0 0 1 0 6m1 3a5 5 0 0 1 4 5",
  doc: "M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6m-6 4h6",
  data: "M4 6c0-4 16-4 16 0s-16 4-16 0z M4 6v12c0 4 16 4 16 0V6 M4 12c0 4 16 4 16 0",
  loop: "M20 10a8 8 0 0 0-14-4L3 9m0-5v5h5 M4 14a8 8 0 0 0 14 4l3-3m0 5v-5h-5",
  calendar: "M3 6h18v15H3z M7 3v6m10-6v6 M3 11h18 M7 15h2m4 0h2",
  stress: "M2 14h5l3-9 4 15 3-9 2 3h3",
  lens: "M10 3a7 7 0 1 0 .1 0 M15 15l6 6",
  scroll: "M5 4h13v15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2 M8 8h7m-7 4h7",
  update: "M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
  save: "M4 3h14l3 3v15H3V3z M7 3v6h9V3 M7 21v-8h10v8",
  reset: "M4 10a8 8 0 1 1 1 8 M4 4v6h6",
  restartAll: "M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5 M9 12l2 2 4-4",
  sound: "M3 10h4l5-5v14l-5-5H3z M15 9q4 3 0 6m3-9q7 6 0 12",
  mute: "M3 10h4l5-5v14l-5-5H3z M16 9l5 6m0-6-5 6",
  close: "M5 5l14 14M19 5 5 19",
  next: "M8 4l8 8-8 8", prev: "M16 4l-8 8 8 8",
  play: "M6 3l14 9-14 9z", pause: "M8 4v16m8-16v16",
  star: "M12 2l2.6 7.2L22 12l-7.4 2.7L12 22l-2.7-7.3L2 12l7.3-2.8z",
  finale: "M8 4h8v5a4 4 0 0 1-8 0V4z M8 6H5a2 2 0 0 0 0 4h3 M16 6h3a2 2 0 0 1 0 4h-3 M12 13v5 M8 20h8",
  lock: "M5 10h14v11H5z M8 10V7a4 4 0 0 1 8 0v3",
  check: "M3 12l6 6L21 5"
};

function icon(key, label, run) {
  const b = button("", run, "icon");
  b.title = label;
  b.setAttribute("aria-label", label);
  const s = svg("svg", {
    viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    "stroke-width": 1.65, "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true"
  });
  s.append(svg("path", { d: PATH[key] }));
  b.append(s);
  return b;
}

const imageCache = new Map();
function loadSingleImage(path) {
  if (!imageCache.has(path)) {
    imageCache.set(path, new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img.src);
      img.onerror = () => resolve("");
      img.src = path;
    }));
  }
  return imageCache.get(path);
}

async function imageURL(path) {
  const primary = await loadSingleImage(path);
  if (primary) return primary;
  const alt = ASSET_FALLBACK[path];
  return alt ? loadSingleImage(alt) : "";
}

async function artwork(node, path) {
  const url = await imageURL(path);
  if (!url) return false;
  node.style.backgroundImage = `url("${url}")`;
  node.textContent = "";
  return true;
}

async function setImage(id, path) {
  const url = await imageURL(path);
  if (url) { $(id).src = url; $(id).hidden = false; }
  return Boolean(url);
}

let muted = false;
let audio;
const clips = new Set();
const missingSounds = new Set();
const tones = {
  pop: [610], typing: [310], loading: [330, 440], bling: [784, 988, 1175, 1568],
  "3dots": [350, 380, 410], whoop: [480, 710], correct: [660, 880],
  wrong: [270, 205], stress: [196, 185, 174], yay: [523, 659, 784, 1047],
  finale: [523, 659, 784, 1047, 1319]
};

function synth(name) {
  if (muted) return;
  try {
    const Engine = window.AudioContext || window.webkitAudioContext;
    if (!Engine) return;
    audio ??= new Engine();
    audio.resume().catch(() => {});
    if (name === "clapping") {
      for (let i = 0; i < 8; i++) {
        const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * .07), audio.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * .085 * Math.exp(-6 * j / data.length);
        const source = audio.createBufferSource();
        source.buffer = buffer; source.connect(audio.destination);
        source.start(audio.currentTime + i * .09);
      }
      return;
    }
    (tones[name] || tones.pop).forEach((hz, i) => {
      const osc = audio.createOscillator(), gain = audio.createGain();
      const start = audio.currentTime + i * .085, end = start + (name === "typing" ? .045 : .19);
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(.032, start + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, end);
      osc.connect(gain).connect(audio.destination);
      osc.start(start); osc.stop(end + .01);
    });
  } catch { /* Audio must never block the presentation. */ }
}

function sound(name) {
  if (muted) return;
  const path = SOUND[name];
  if (!path || missingSounds.has(path)) { synth(name); return; }
  const a = new Audio(path);
  clips.add(a);
  a.onended = () => clips.delete(a);
  a.play().catch(() => {
    clips.delete(a);
    missingSounds.add(path);
    synth(name);
  });
}

/* ---------- Content: licensing, IRRBB Governance, Documents, Models & Methods ---------- */

const CHECKS = [
  ["Fund charter capital", "At least VND 3,000 billion for a commercial bank. Decree 86/2019, Art. 2."],
  ["Verify individual founders", "Full civil capacity and financial ability to contribute. Law, Art. 29."],
  ["Verify corporate founders", "Lawful operations and financial ability to contribute. Art. 29."],
  ["Check the source of funds", "Founders use eligible own funds. Decree 162/2024."],
  ["Check corporate founder profits", "Three consecutive profitable years before the application year and through supplemental filing. Decree 162/2024."],
  ["Check corporate obligations", "Tax and social insurance obligations fulfilled at application. Decree 162/2024."],
  ["Register shareholders", "At least 100 for this joint-stock bank. Law, Art. 60."],
  ["Check ownership limits", "General caps: individual 5%, organization 10%, shareholder and related persons 15%. Statutory exceptions apply. Art. 63."],
  ["Check founder holdings", "Founders together hold at least 50% of charter capital for the first five years after licensing. Art. 63."],
  ["Check corporate founder share", "Legal-person founders hold at least half of all founder shares during that period. Art. 63."],
  ["Restrict founder transfers", "In the first five years, covered shares may transfer only to other founders, subject to ownership rules. Art. 64."],
  ["Verify leadership qualifications", "Managers, executives and Supervisory Board members meet Art. 41 criteria. Art. 29."],
  ["Adopt the charter", "The charter complies with banking and other applicable law. Art. 29."],
  ["File a feasible business plan", "The establishment proposal and business plan address system stability and fair competition. Art. 29."],
  ["Complete IRRBB readiness review", "Strategy, limits, independent measurement, stress tests and internal reporting. Circular 83, Arts. 53–55. TQB game gate."]
];

const ZONES = ["Shareholders", "Strategic governance", "Executive governance", "First line", "Second line", "Enabling infrastructure · IT & Data", "Third line · Internal Audit"];
const TINT = ["#e7ebe3", "#f2dde1", "#deebe9", "#ddecd9", "#f3e6ce", "#e0eae8", "#e8e3f0"];

// ID, English, Vietnamese, zone, x, y, short duty, missing-unit hint
const UNITS = [
  ["agm", "General Meeting of Shareholders", "Đại hội đồng cổ đông", 0, 425, 20, ""],
  ["bod", "Board of Directors", "Hội đồng quản trị", 1, 425, 111, "Sets hard risk limits"],
  ["rmc", "Board Risk Management Committee", "Ủy ban quản lý rủi ro", 1, 165, 111, "Reviews policies & reports"],
  ["bks", "Supervisory Board", "Ban kiểm soát", 1, 700, 111, "Oversees audit & compliance"],
  ["ceo", "CEO", "Tổng giám đốc", 2, 425, 204, "Chairs ALCO & execution"],
  ["alco", "ALCO", "Hội đồng quản lý tài sản và nợ phải trả", 2, 425, 287, "Approves FTP & hedges", "Executive committee"],
  ["retail", "Retail & Corporate Banking", "Khối khách hàng", 3, 65, 397, "Takes deposits, makes loans"],
  ["treasury", "Treasury & Financial Markets", "Khối nguồn vốn", 3, 265, 397, "Trades swaps & bonds"],
  ["alm", "ALM & FTP Desk", "Ban ALM & FTP", 3, 265, 479, "Pools branch rate risk", "Central funding desk"],
  ["dev", "Model Development Team", "Bộ phận xây dựng mô hình", 3, 265, 561, "Builds behavioral math models", "Model Development Team"],
  ["cro", "Risk Management Division", "Khối quản lý rủi ro", 4, 665, 397, "Leads risk & escalates"],
  ["risk", "IRRBB Risk Dept", "Phòng QLRR IRRBB", 4, 555, 507, "Measures gap, NII, EVE", "Risk measurement"],
  ["validation", "Independent Model Validation Unit", "Kiểm định mô hình độc lập", 4, 755, 507, "Tests models for bugs", "Independent model check"],
  ["audit", "Internal Audit", "Khối kiểm toán nội bộ", 6, 700, 668, "Audits rules & models"],
  ["it", "IT & Data Management", "CNTT & quản trị dữ liệu", 5, 265, 668, "Runs overnight data & OFSAA"]
];
const UPGRADES = {
  cro: "+ Risk Management Unit",
  treasury: "+ Interest Rate Derivatives Desk",
  audit: "+ IT & Model Auditor",
  it: "+ ALM Systems & Data Engineers"
};

// Documents tab: all "+" changed to "&", and "+300 bps emergency plan" removed
const PAPERS = [
  ["Risk Appetite Statement", 1, "Sets hard limits of −12% ΔEVE / Tier 1 and −10% ΔNII / baseline NII.", "Risk Management Division", "Board of Directors"],
  ["IRRBB Strategy & Policy", 0, "Separates banking and trading books. Early warnings: −10% EVE and −8% NII.", "IRRBB Risk Dept", "Board of Directors"],
  ["IRRBB & Behavioral Manual", 0, "Sets seven time buckets and rules for CASA, early loan payoff and deposit breakage.", "IRRBB Risk & Model Development Team", "CEO & ALCO"],
  ["Model Risk & Validation Policy", 0, "Lists models and requires independent testing before use.", "Independent Model Validation Unit", "Board of Directors"],
  ["Funds Transfer Pricing Policy", 0, "Transfers 100% of modeled branch rate risk to TQB’s central ALM pool in this exercise.", "ALM & FTP Desk", "CEO & ALCO"],
  ["Hedging & Derivatives Policy", 0, "Sets rules and counterparty limits for IRS, CCS and FRA contracts.", "Treasury & ALM Desk", "ALCO & Board Risk Management Committee"],
  ["Stress Testing & Contingency Plan", 1, "Adds six Basel shocks and TQB’s contingency framework.", "IRRBB Risk & ALM Desk", "Board of Directors & CEO"],
  ["ICAAP & Capital Policy", 1, "Sets aside capital for TQB’s rate-shock losses.", "Risk Management Division & ALM Desk", "Board of Directors"]
];

const SYSTEMS_CARDS = [
  ["Core Banking & Treasury Systems", "Record loans, deposits, bonds and derivatives with their balances and contract terms."],
  ["Data Warehouse & Reconciliation", "Load positions overnight, select banking-book records and reconcile balances with the general ledger."],
  ["ALM & IRRBB Engine", "Generate repricing cash flows, apply customer behavior assumptions and calculate ΔNII and ΔEVE."],
  ["Market Data & ALCO Dashboard", "Load daily market rates and yield curves. Display risk measures, early warnings and limit breaches."]
];

const CONTRACT_CARDS = [
  ["Contract Details", [
    "Customer segment · Retail or corporate.",
    "Book classification · Banking book.",
    "Currency and balance · Contract currency and outstanding amount."
  ]],
  ["Interest Rate Terms", [
    "Rate type and current rate · Fixed or floating, and the rate currently applied.",
    "Reference rate and spread · For example, 3-month VNIBOR plus the contractual spread.",
    "Cap and floor · Maximum and minimum contractual rates, if applicable."
  ]],
  ["Payment & Repricing Schedule", [
    "Next reset date · When a floating rate next changes.",
    "Maturity date · When the contract ends, if specified.",
    "Repayment schedule · When principal and interest are due."
  ]],
  ["Outside IRRBB Scope", [
    "Trading-book position · A position assigned to the trading book."
  ]]
];

const METHODS_ROWS = [
  ["Contractual Cash-Flow Slotting",
    "Contract balances, rate terms, payment schedules and next reset dates.",
    "Contractual repricing cash flows by currency and time bucket.",
    "Show when assets and liabilities reprice before adjusting for customer behavior."],
  ["Non-Maturity Deposit Model (NMD)",
    "CASA balance history, customer segments and deposit rates.",
    "Estimated core and non-core balances and their repricing schedule.",
    "Estimate how long deposits without a maturity date provide stable funding."],
  ["Loan Prepayment Model (CPR)",
    "Fixed-rate retail loan balances, repayment schedules and historical prepayments.",
    "Estimated conditional prepayment rates and revised principal cash flows.",
    "Estimate how much principal borrowers will repay early and when TQB will receive it."],
  ["Term Deposit Early Redemption Model (TDRR)",
    "Term deposit balances, maturities, early withdrawal terms and withdrawal history.",
    "Estimated early redemption rates and revised deposit cash outflows.",
    "Estimate how much funding TQB may lose before deposits mature."],
  ["IRRBB Stress Testing Engine",
    "Behavior-adjusted cash flows, yield curves, rate shocks and a baseline earnings projection.",
    "Repricing gaps, ΔNII, ΔEVE and limit status under each scenario.",
    "Measure earnings and economic value sensitivity across rate shocks."]
];

/* ---------- 4 IRRBB Activities (7 steps grouped into 1..4, using ":" instead of "·") ---------- */

const ACTIVITY_COLORS = {
  1: { name: "Identify", bg: "#efe3f6", stroke: "#8a50b5", text: "#6a3294" },
  2: { name: "Measure", bg: "#dfeefb", stroke: "#2b72b8", text: "#1d568f" },
  3: { name: "Monitor", bg: "#fdebd8", stroke: "#d47326", text: "#a85311" },
  4: { name: "Control", bg: "#def2e3", stroke: "#3c8f56", text: "#236939" }
};

// [groupNum, stepName, who, tool, input, action, output, decision]
const SOP = [
  [1, "Identify Risk",
    "Retail, Corporate, branches, Treasury and ALM with IRRBB Risk. Product Development joins for new products.",
    "Portfolio records + product portal",
    "Existing positions or new proposal",
    "Identify where rate changes can hurt the bank, including timing gaps, different reference rates and customer options.",
    "Risk register or new-product assessment",
    "Qualifying new product → Risk appraisal and formal approval."],
  [2, "Prepare Data",
    "IT & Data, Finance and source teams",
    "Core banking + treasury systems → data warehouse",
    "Contracts, ledger and off-balance-sheet records",
    "Check balances, dates, currencies and banking-book coverage. Flag currencies requiring separate measurement.",
    "Checked dataset + exceptions",
    "Unexplained difference or missing required date → 07:00 alert to the source owner."],
  [2, "Place Cash Flows",
    "ALM supplies inputs. IRRBB Risk measures. Model Validation reviews assumptions.",
    "ALM cash-flow engine",
    "Contracts + customer behavior assumptions",
    "Place payments and rate resets into 19 EVE buckets. Adjust for deposit behavior, loan prepayment and early withdrawal.",
    "Adjusted cash flows + gaps, shown in 7 summary bands",
    "Use the split only if customer data and regulatory caps support it."],
  [2, "Run Rate Shocks",
    "Independent IRRBB Risk, with Treasury, business teams and Compliance supporting scenario design",
    "Risk engine + yield curves",
    "Cash flows + market rates",
    "Calculate repricing gaps. Run 6 shocks for economic value (ΔEVE) and 2 parallel shocks for one-year interest income (ΔNII).",
    "Gap profile + worst modeled losses",
    "Scheduled review or documented market trigger → rerun."],
  [3, "Check Limits",
    "IRRBB Risk + Chief Risk Officer",
    "ALCO dashboard",
    "Modeled losses + approved limits",
    "Compare losses with limits. Warn early and escalate breaches.",
    "Green, amber or red + triggering metric",
    "Amber → ALM and ALCO prepare action. Red → immediate management escalation."],
  [3, "Report Results",
    "IRRBB Risk, Finance and the internal capital assessment team. CEO approves annual filings.",
    "Reporting portal",
    "Gaps, losses, breaches, hedge results + corrective actions",
    "Report internally at least quarterly and as needed. Submit annual risk and capital assessment reports to the State Bank of Vietnam under Article 9.",
    "Internal IRRBB report + annual SBV filings",
    "Annual filings → within 90 days of financial year-end. Escalate urgent breaches immediately."],
  [4, "Adjust Funding and Hedge",
    "ALCO advises. CEO or delegated authority approves. ALM, Treasury and branches execute. Risk verifies.",
    "FTP pricing + treasury systems",
    "Risk report + proposed actions",
    "Choose an action, execute it and measure the remaining exposure.",
    "Before/after losses + limit status",
    "Within limits → close the breach. Still outside → revise and escalate."]
];

/* ---------- Tasks (All tasks + IRRBB Calendar) ---------- */

const TASK_DOCS = [
  ["Daily · 07:00", "Overnight Data Reconciliation and Exceptions", "IT’s batch status, Finance’s ledger reconciliation, missing fields and the team responsible for each correction."],
  ["Daily · 09:00", "Daily IRRBB Dashboard", "Latest limit status, when ΔNII and ΔEVE were last calculated, overnight rate moves and large loan or deposit movements."],
  ["Monday morning", "Weekly Funding and Repricing Report", "Repricing gaps by time band and material currency, deposit inflows and outflows, early withdrawals and loan prepayments."],
  ["Monthly · before ALCO", "ALM Balance Sheet and Funding Proposal", "The first-line proposal. ALM compares expected earnings, funding costs and possible actions, including FTP changes, longer-term deposits and hedges."],
  ["Monthly · before ALCO", "Independent IRRBB Risk Report", "The second-line assessment. Risk shows limit usage, the six ΔEVE shocks, the two ΔNII shocks and TQB’s separate +300 bp scenario."],
  ["Monthly · after ALCO", "ALCO Minutes and Action Tracker", "ALCO’s recommendation, the authorized decision, action owner, deadline and post-action risk result."],
  ["Quarterly and as needed", "Internal IRRBB Report — Article 55", "Repricing gaps, ΔNII and ΔEVE stress results as applicable, limit compliance, hedges and their results, recommendations and corrective actions."],
  ["Annually and as needed", "Model Risk Report and Validation Schedule", "Model inventory, material changes, validation results, limitations and outstanding fixes."],
  ["Annually", "Risk Appetite, IRRBB Strategy and Limit Review", "Review of the bank’s risk appetite, IRRBB strategy, internal limits and proposed changes."],
  ["Annually · within 60 days of year-end", "Annual Internal Audit Report — Appendix IV", "The Supervisory Board approves the report for submission to the State Bank of Vietnam (SBV)."],
  ["Annually · within 90 days of year-end", "Annual SBV Reports — Appendices I, II and III", "I: Control Activities Self-Assessment, approved by the Board. II: Risk Management Report, approved by the CEO. III: Internal Capital Adequacy Assessment Report, approved by the CEO."],
  ["On trigger · immediately", "IRRBB Early Warning or Limit Breach Notice", "Which measure triggered, size of exposure, who was notified, proposed action and the result of the rerun. Keep this accessible from the daily dashboard."]
];

const CYCLES = ["Daily", "Weekly (Monday)", "Monthly (ALCO cycle)", "Quarterly", "Annual"];
const DEPTS = [
  ["Retail Banking, Corporate Banking and Branches", [
    "Book loan and deposit terms accurately. Record reset dates, reference rates and caps/floors. Refer exceptional pricing for approval.",
    "Report deposit flows by tenor, early withdrawals, prepayments and unusual customer behavior.",
    "Propose product or pricing changes. Adjust offers and sales targets after approval.",
    "Review margins, customer behavior and product-level returns.",
    "Supply loan and deposit growth assumptions for business planning and ICAAP."
  ]],
  ["Asset and Liability Management and Funds Transfer Pricing (ALM & FTP)", [
    "Monitor balance-sheet changes. Quote internal funding rates for large or unusual deals.",
    "Analyze repricing gaps and funding trends. Propose an FTP adjustment if conditions warrant it.",
    "Prepare the ALM Balance Sheet and Funding Proposal. Compare pricing changes, longer-term funding and hedge alternatives.",
    "Review duration and repricing targets against the forecast.",
    "Review FTP methodology and supply balance-sheet and earnings projections for the 3–5-year ICAAP horizon."
  ]],
  ["Treasury and Financial Markets", [
    "Manage cash and interbank funding. Capture market rates. Execute authorized trades within dealer limits.",
    "Review banking-book bond duration and valuation. Obtain executable hedge quotes.",
    "Implement approved actions, e.g. a pay-fixed swap, a bond-duration change or longer-term CD funding. Operations confirms trades and reconciles positions.",
    "Review counterparty exposures, available limits and collateral with Risk.",
    "Propose the wholesale funding and issuance plan with Finance."
  ]],
  ["IT and Data Management", [
    "23:00–04:00: load contracts. By 07:00: issue the exception list. IT fixes processing errors. Source teams correct contract data.",
    "Review recurring failures, backup status and batch performance.",
    "Test approved product mappings and engine changes before release.",
    "Review unresolved data-quality issues with Finance and Risk.",
    "Review the management information system. Schedule recovery tests under the applicable IT continuity rules."
  ]],
  ["Finance and Accounting", [
    "Reconcile loaded balances with the general ledger. Investigate unexplained differences with the source owner.",
    "Explain material movements in balances and interest income.",
    "Supply actual NII, net interest margin and the agreed earnings baseline. Compare actual results with forecasts.",
    "Update capital projections with Risk and the ICAAP team.",
    "Coordinate Appendix III and the capital plan. The CEO approves the report. The Board approves the capital plan on the CEO’s proposal."
  ]],
  ["Market Risk and IRRBB", [
    "Check data coverage, market moves and latest limit usage. Trigger a fresh run after material changes. Escalate warnings and breaches.",
    "Run gaps by time band and material currency. Compare observed deposit and loan behavior with assumptions.",
    "Prepare the Independent IRRBB Risk Report. Run six ΔEVE shocks, two parallel ΔNII shocks and the separate TQB scenario.",
    "Prepare the Article 55 report and track corrective actions.",
    "Review limits and behavioral assumptions. Coordinate Appendix II for CEO approval."
  ]],
  ["Model Risk Management and Independent Validation", [
    "Record material model issues and overrides. Route software incidents to IT.",
    "Review performance alerts and unusual behavior.",
    "Challenge backtesting results for deposit behavior, prepayments and early withdrawals. Investigate material deviations.",
    "Update TQB’s model inventory and outstanding findings.",
    "Issue the model risk report. For applicable bank-developed models, validate before use, after material changes and at least annually. Purchased models have separate assessment requirements."
  ]],
  ["Asset and Liability Committee (ALCO) and CEO", [
    "Receive material escalations. Convene an emergency meeting when needed.",
    "Review the weekly funding and repricing report where action is needed.",
    "TQB’s CEO chairs ALCO. Compare ALM’s proposal with Risk’s independent assessment. Record the recommendation, authorized decision and owner.",
    "Check whether actions reduced exposure. Monthly ALCO meetings satisfy the at-least-quarterly meeting requirement.",
    "Review funding priorities and proposed balance-sheet strategy."
  ]],
  ["Management Risk Council", [
    "Receive significant risk escalations under TQB policy.",
    "Follow up on unresolved limit issues.",
    "Challenge significant breaches and remediation plans as needed.",
    "Meet at least quarterly. Review limit usage and advise the CEO.",
    "Review proposed risk-policy and limit changes."
  ]],
  ["Board Risk Management Committee and Board of Directors", [
    "Receive material issues escalated to Board level under TQB policy.",
    "—",
    "—",
    "Under TQB’s calendar, the committee reviews IRRBB trends and advises the Board. The Board oversees management’s response.",
    "Review risk appetite and strategy. The Board approves the capital plan and the Appendix I report."
  ]],
  ["Internal Audit and Supervisory Board", [
    "Receive material control issues through the audit reporting channel.",
    "—",
    "Follow up on findings due for closure.",
    "Report significant overdue findings under the audit plan.",
    "Internal Audit tests IRRBB and IT controls according to its risk-based plan. The Supervisory Board approves Appendix IV, due to the SBV within 60 days."
  ]]
];

/* ---------- Screen · +300 bp (Decision -> Hedging and Balance Sheet Options -> Results) ---------- */

const STRESS_TOOLS_TABLE = [
  ["Repricing Gap Analysis", "Many floating-rate loans reset within three months."],
  ["Non-Maturity Deposit Model", "Customers move money from CASA to higher-paying term deposits."],
  ["Loan Prepayment Model", "Borrowers keep their fixed-rate loans longer."],
  ["Term Deposit Early Redemption Model", "Some depositors withdraw before maturity to earn higher rates."],
  ["IRRBB Stress Testing Engine", "Funding costs rise and fixed-rate assets lose value. Both limits are breached."]
];

const STRESS_CHOICES = [
  [
    "A",
    "A · Take No Action",
    "Keep current positions and take no corrective action.",
    "Both breaches remain open. Risk escalates the unresolved exposure."
  ],
  [
    "B",
    "B · Request a Temporary Exception",
    "If TQB’s policy allows it, submit the reason, expiry date, monitoring plan and corrective actions for approval.",
    "Exposure remains elevated. Even if approved, the exception leaves both modeled losses unchanged."
  ],
  [
    "C",
    "C · Compare Hedges",
    "Ask ALM and Treasury how each option changes funding costs, repricing dates and fixed-rate exposure.",
    "Open hedge options. Preview the effect and cost before approving a package."
  ]
];

const HEDGE_CARDS = [
  {
    id: "ftp",
    title: "Adjust FTP and Apply Loan Resets",
    target: "select",
    explain: "Scheduled loan resets raise income on eligible loans. FTP rewards branches for attracting longer-term funding."
  },
  {
    id: "cd",
    title: "Issue Two-Year Certificates of Deposit",
    target: "select",
    explain: "Fixed-rate two-year CDs replace some short-term funding. TQB locks in the coupon for two years."
  },
  {
    id: "bonds",
    title: "Shorten the Bond Portfolio",
    target: "select",
    explain: "Selling long bonds and reinvesting short reduces duration risk. The sale may realize a loss."
  },
  {
    id: "swap",
    title: "Pay Fixed, Receive Floating",
    target: "select",
    explain: "TQB receives floating interest on the swap. Those receipts help offset rising funding costs."
  },
  {
    id: "faster",
    title: "Offer Faster-Resetting Loans",
    target: "new_lending",
    destLabel: "Use for new lending",
    explain: "New loans reset sooner. The benefit grows as TQB originates them."
  },
  {
    id: "casa",
    title: "Grow Transaction Deposits",
    target: "over_time",
    destLabel: "Use over time",
    explain: "Payroll and payment accounts can build stable, low-cost deposits over time."
  },
  {
    id: "ccs",
    title: "Use a Cross-Currency Swap",
    target: "matched_currency",
    destLabel: "Use for a matched currency exposure",
    explain: "A USD/VND swap can match USD funding to VND assets when TQB has that exposure."
  },
  {
    id: "cap",
    title: "Cap or Lock a Borrowing Rate",
    target: "future_borrowing",
    destLabel: "Consider for future borrowing",
    explain: "A cap limits the rate for a premium. An FRA locks the rate for a future borrowing period."
  }
];

const HEDGE_NAMED_SLOTS = [
  ["new_lending", "Use for new lending"],
  ["over_time", "Use over time"],
  ["matched_currency", "Use for a matched currency exposure"],
  ["future_borrowing", "Consider for future borrowing"]
];

/* ---------- Inspection and chat scripts ---------- */

const QUIZ = [
  ["Who approves the hard limits?", ["Board of Directors", "Treasury", "IT"], 0],
  ["Who pools branch exposure through FTP?", ["Internal Audit", "ALM & FTP Desk", "Model Validation"], 1],
  ["Who independently measures ΔNII and ΔEVE?", ["Branches", "Treasury", "IRRBB Risk Dept"], 2],
  ["Who independently tests model assumptions?", ["Independent Model Validation Unit", "Retail", "IT Operations"], 0],
  ["Who owns the IT/model audit and the exercise’s three-year cooling-off check?", ["ALCO", "Internal Audit", "ALM"], 1],
  ["Which multipliers apply when rates rise?", ["CPR ×1.2 / TDRR ×0.8", "Both ×1", "CPR ×0.8 / TDRR ×1.2"], 2]
];

const CHAT = {
  intro: [
    ["TIME", "08:30"],
    ["TQB", "📄 TQB_License_App_Final.pdf"],
    ["TQB", "Approve us please!"],
    ["SBV", "No."],
    ["TQB", "?"],
    ["SBV", "Circular 83 · Articles 53–55 & Appendix V."],
    ["SBV", "Read the regulation bro."],
    ["TQB", "What is that thing?"],
    ["SVB", "You don’t wanna know."],
    ["VCB", "Oops."],
    ["BIDV", "You missed IRRBB management bro."],
    ["TQB", "Oh."],
    ["Group", "TQB is looking for advice."],
    ["TQB", "@Warren Buffett"],
    ["Group", "Warren Buffett left the group."],
    ["Group", "Warren Buffett entered the chat."],
    ["Buffett", "“Risk comes from not knowing what you’re doing.”"],
    ["TQB", "?"],
    ["Group", "Warren Buffett left the chat."],
    ["TCB", "Learn to build it bro."],
    ["TQB", "How?"],
    ["TCB", "Hire some people."],
    ["CTG", "Build some offices."],
    ["Oracle", "Buy some products from us."],
    ["TQB", "Who are you?"],
    ["Oracle", "I am a multinational technology company specializing in database management, cloud computing, and enterprise software solutions."],
    ["TQB", "Um okay."],
    ["TQB", "So I have to hire people, build offices, sign documents, gather data, and build software?"],
    ["SBV", "yea"]
  ],
  vendor: [
    ["TIME", "11:00"],
    ["TQB", "Um does anyone have any ideas on how to manage data and compute 1,000,000,000 math formulas?"],
    ["SmallBank1", "just use a Casio FX-580VN X bro"],
    ["SmallBank2", "or Excel"],
    ["TCB", "Just ran our overnight IRRBB on Kamakura KRM and Oracle OFSAA. Perfect."],
    ["TCB", "😎"],
    ["VPB", "Our ALM and FTP engine finished 1.2 million contracts before 7 AM!"],
    ["TQB", "nice"],
    ["Oracle", "We can bid for the upgrade."],
    ["KRM", "So can we."],
    ["TQB", "damn thank you I’ll take a look."],
    ["Group", "TQB added both Oracle and Kamakura KRM to cart."],
    ["SCB", "damn bro is flexing..."]
  ],
  approval: [
    ["TIME", "13:30"],
    ["TQB", "📄 TQB_License_App_Final_Final_Final_Final_For_Real.pdf"],
    ["TQB", "@SBV Here you are."],
    ["SBV", "Approved."],
    ["SBV", "Welcome to the market. Don’t blow up."],
    ["TQB", "WE GOT THE LICENSE!!"],
    ["TQB", "Wait… now what?"],
    ["VCB", "Run it bro"],
    ["BIDV", "Welcome to nonstop meetings."],
    ["TQB", "[STICKER]"]
  ],
  shock: [
    ["TIME", "14:30"],
    ["SBV", "Hi guys!"],
    ["SBV", "We need to raise interest rates by 300bps."],
    ["VCB", "?"],
    ["VPB", "?"],
    ["TCB", "?"],
    ["TQB", "?"],
    ["TQB", "I just got my license bro."],
    ["SVB", "oops"],
    ["SBV", "😄"]
  ],
  finale: [
    ["TIME", "16:30"],
    ["TQB", "I’ve done hedging."],
    ["TQB", "Phew."],
    ["SBV", "Nice"],
    ["Group", "Warren Buffett rejoined the group."],
    ["Buffett", "Damn. Can I intern at TQB?"],
    ["TQB", "Nice try bro"],
    ["TQB", "Only if you memorized Appendix V."],
    ["Buffett", "nah I’ll pass. Gotta play GTA6."]
  ]
};

const NAMES = {
  SBV: "SBV (NHNN)",
  SVB: "Silicon Valley Bank (ghost)",
  VCB: "Vietcombank",
  BIDV: "BIDV",
  Buffett: "Warren Buffett",
  TCB: "Techcombank",
  CTG: "VietinBank",
  Oracle: "Oracle",
  VPB: "VPBank",
  SmallBank1: "Small bank 1",
  SmallBank2: "Small bank 2",
  SCB: "Saigon Commercial Bank (SCB)",
  Auditor: "TQB IT Auditor",
  KRM: "Kamakura KRM"
};

const HANDOFF = { intro: "People", vendor: "Data", approval: "Workflow", shock: "Stress test", finale: "Day 30" };

/* ---------- State, save, window controls, fairy counter and fit-to-screen ---------- */

const KEY = "tqb-fairy-lora-v4";
function fresh() {
  return {
    "Bank details": { showLimits: false },
    People: { hires: [], duties: [] },
    Documents: { done: [] },
    Data: { tab: "stack", stack: [], buckets: [], models: [] },
    Workflow: { step: 0, done: [] },
    Calendar: { view: "docs", dept: 0, cycle: 0, assigned: false },
    Inspection: { index: 0 },
    "Stress test": {
      tab: "decision",
      choice: "",
      unlockedOptions: false,
      unlockedResults: false,
      selectSlots: [null, null, null, null],
      namedSlots: {}
    },
    "Day 30": { signed: false },
    Zalo: {
      episode: "intro",
      counts: { intro: 0, vendor: 0, approval: 0, shock: 0, finale: 0 },
      buffettSummoned: false
    }
  };
}
function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; }
  catch { return {}; }
}
const game = fresh(), stored = read();
for (const k of Object.keys(game)) Object.assign(game[k], stored[k] || {});
game.Zalo.counts = { ...fresh().Zalo.counts, ...game.Zalo.counts };
if (!Array.isArray(game.Data.models)) game.Data.models = [];
if (!Array.isArray(game["Stress test"].selectSlots)) game["Stress test"].selectSlots = [null, null, null, null];
if (!game["Stress test"].namedSlots) game["Stress test"].namedSlots = {};

let app = "", selected = "", phase = "idle", homeVisible = false, lens = false;
let timer, epoch = 0, hirePause = false;
let fitObserver, activeFairyTrigger = null;
const status = text => { $("status").textContent = text || ""; };

/*
  Reset everything in localStorage and return to the Welcome screen on the same browser.
*/
function resetAllAndWelcome() {
  cancelWork();
  stopFinaleMusic();
  document.querySelectorAll(".finale-overlay").forEach(n => n.remove());
  try { localStorage.removeItem(KEY); } catch {}
  const freshState = fresh();
  for (const k of Object.keys(game)) game[k] = freshState[k];
  if (panel.open) panel.close();
  welcome();
}

/*
  2 floating fairy help tokens (only shown in Licensing Checklist and Zalo):
  - Help #1 disappears as soon as you click Fairy #1 in Licensing Checklist.
  - Help #2 disappears when you click Fairy #2 in Zalo after Warren Buffett leaves.
*/
function remainingFairies() {
  let count = 2;
  if (phase === "checking" || phase === "ready" || homeVisible || (game.Zalo?.counts?.intro || 0) > 0) count--;
  if (game.Zalo?.buffettSummoned || (game.Zalo?.counts?.intro || 0) >= 16) count--;
  return Math.max(0, count);
}

function updateFairyTray() {
  const trayEl = $("fairyTray");
  if (!trayEl) return;
  trayEl.replaceChildren();
  if (app !== "license" && app !== "Zalo") return;
  const count = remainingFairies();
  for (let i = 0; i < count; i++) {
    const btn = button("✧", () => {
      if (activeFairyTrigger) activeFairyTrigger();
    }, `fairy-token ${activeFairyTrigger ? "ready-help" : ""}`);
    const label = activeFairyTrigger
      ? "Click to use fairy help!"
      : `Fairy help (${count} left)`;
    btn.title = label;
    btn.setAttribute("aria-label", label);
    artwork(btn, i === 0 && count === 2 ? ASSET.checklist : ASSET.chat);
    trayEl.append(btn);
  }
}

/*
  Reusable flying fairy sequence with transparent background (no box).
*/
function summonFlyingFairy(assetPath, promptText, onCast) {
  $("magicFairy")?.remove();
  const fairy = button("✧", () => {
    if (fairy.disabled) return;
    fairy.disabled = true;
    activeFairyTrigger = null;
    fairy.remove();
    sound("bling");
    stars(1400);
    onCast();
    updateFairyTray();
  });
  fairy.id = "magicFairy";
  fairy.setAttribute("aria-label", "Use fairy magic");
  fairy.title = "Use fairy magic";
  panel.append(fairy);
  artwork(fairy, assetPath);

  const flight = reduced() ? 0 : SETTINGS.fairyFlight;
  if (flight) {
    fairy.animate([
      { transform: "translate(-62vw, 65%) rotate(-13deg)", opacity: 0 },
      { transform: "translate(-34vw, -15%) rotate(4deg)", opacity: 1, offset: .5 },
      { transform: "translate(0, 0) rotate(0deg)", opacity: 1 }
    ], { duration: flight, easing: "ease-in-out" });
  }
  fairy.disabled = true;
  sound("bling");
  stars(flight + 300, fairy);

  activeFairyTrigger = () => {
    if (!fairy.disabled) fairy.click();
  };
  updateFairyTray();

  timer = setTimeout(() => {
    fairy.disabled = false;
    fairy.focus({ preventScroll: true });
    if (promptText) status(promptText);
    updateFairyTray();
  }, flight);
}

function save(key = app, announce = false) {
  if (!game[key]) return;
  try {
    const snapshot = read(); snapshot[key] = game[key];
    localStorage.setItem(KEY, JSON.stringify(snapshot));
    if (announce) status("Saved in this browser.");
  } catch { status("This browser could not save progress."); }
}
function cancelWork() {
  epoch++; clearTimeout(timer);
  selected = ""; hirePause = false;
  activeFairyTrigger = null;
  $("magicFairy")?.remove();
  fitObserver?.disconnect();
}
function tool(key, label, run) { $("actions").append(icon(key, label, run)); }
function nextApp(name, label = name) { tool("next", label, () => openApp(name)); }
function note(text, cls = "") { content.append(el("p", `note ${cls}`, text)); }
function popup(title, text) {
  $("promptTitle").textContent = title; $("promptText").textContent = text;
  if (!$("promptBox").open) $("promptBox").showModal();
}
$("promptClose").onclick = () => $("promptBox").close();

function shell(title, info = "", fit = false) {
  fitObserver?.disconnect();
  activeFairyTrigger = null;
  $("magicFairy")?.remove();
  panel.dataset.app = app;
  panel.classList.toggle("fit", fit);
  $("title").textContent = title; $("subtitle").textContent = info;
  content.replaceChildren(); $("actions").replaceChildren(); $("windowTools").replaceChildren();
  status("");
  updateFairyTray();

  const soundButton = icon(muted ? "mute" : "sound", muted ? "Enable sound" : "Mute sound", () => {
    muted = !muted;
    if (muted) { clips.forEach(c => c.pause()); clips.clear(); }
    const replacement = icon(muted ? "mute" : "sound", muted ? "Enable sound" : "Mute sound", () => soundButton.click());
    soundButton.replaceChildren(...replacement.childNodes);
    soundButton.title = replacement.title;
    soundButton.setAttribute("aria-label", replacement.title);
    soundButton.setAttribute("aria-pressed", String(muted));
  });

  // Clapping / cheering sound button on the menu bar of every screen!
  const cheerButton = icon("star", "Play cheering & clapping sound", () => {
    sound("clapping");
    stars(1200);
  });

  // Celebration finale button on the menu bar of every screen!
  const finaleButton = icon("finale", "Open celebration finale", () => {
    celebrateFinale();
  });

  // Reset everything & return to Welcome screen button on the menu bar of every screen!
  const restartAllButton = icon("restartAll", "Reset all progress & return to Welcome screen", () => {
    resetAllAndWelcome();
  });

  $("windowTools").append(soundButton, cheerButton, finaleButton, restartAllButton);
  if (game[app]) $("windowTools").append(
    icon("save", "Save this window", () => save(app, true)),
    icon("reset", "Reset this window", () => {
      cancelWork(); game[app] = fresh()[app]; save(); render();
      status("Window progress reset.");
    }),
    icon("close", "Close", () => panel.close())
  );
  if (!panel.open) panel.showModal();
}

function fitSheet(width, minHeight, build, extraClass = "") {
  const sheet = el("div", `fit-sheet ${extraClass}`.trim());
  sheet.style.width = `${width}px`;
  content.append(sheet); build(sheet);
  function fit() {
    if (!sheet.isConnected) return;
    const h = Math.max(minHeight, sheet.scrollHeight);
    const scale = Math.min(content.clientWidth / width, content.clientHeight / h, 1.45);
    sheet.style.transform = `scale(${scale})`;
    sheet.style.left = `${Math.max(0, (content.clientWidth - width * scale) / 2)}px`;
    sheet.style.top = `${Math.max(0, (content.clientHeight - h * scale) / 2)}px`;
  }
  fitObserver = new ResizeObserver(fit);
  fitObserver.observe(content); fitObserver.observe(sheet);
  fit(); document.fonts?.ready.then(fit);
}
function openApp(name) {
  cancelWork(); app = name; render(); content.scrollTop = 0;
}
function beginChat(ep) { game.Zalo.episode = ep; save("Zalo"); openApp("Zalo"); }
panel.addEventListener("cancel", e => { if (app === "license") e.preventDefault(); });
panel.addEventListener("close", () => { if (!panel.open) cancelWork(); });

function tabs(parent, rows, current, run) {
  const bar = el("div", "tabs");
  rows.forEach(([id, name, disabled]) => {
    const b = button(name, () => { if (!disabled) run(id); });
    b.disabled = Boolean(disabled);
    b.setAttribute("aria-pressed", String(id === current));
    bar.append(b);
  });
  parent.append(bar);
}

/* ---------- Canvas magic, world bling, scene art and home lens ---------- */

function stars(duration = 1100, moving = null) {
  if (reduced() || !panel.open) return;
  const canvas = el("canvas", "fx"); panel.append(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return; }
  const w = canvas.width = panel.clientWidth, h = canvas.height = panel.clientHeight;
  const colors = ["#ffd9e1", "#f4afc5", "#c5e7f6", "#ffeff4", "#dceefa", "#ffe89e"];
  const points = [];
  const start = performance.now(), token = epoch;
  function add(x, y) {
    points.push({
      x, y, dx: (Math.random() - .5) * 2.2, dy: Math.random() * 1.5 - .7,
      life: 1, r: 3 + Math.random() * 6, c: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  if (!moving) for (let i = 0; i < 95; i++) add(Math.random() * w, Math.random() * h);
  function frame(now) {
    if (!panel.open || epoch !== token || now - start > duration || !canvas.isConnected) { canvas.remove(); return; }
    ctx.clearRect(0, 0, w, h);
    if (moving?.isConnected) {
      const a = moving.getBoundingClientRect(), b = canvas.getBoundingClientRect();
      for (let i = 0; i < 3; i++) add(a.left - b.left + a.width * .36 + (Math.random() - .5) * 24, a.top - b.top + a.height * .65);
    }
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i]; p.x += p.dx; p.y += p.dy; p.life -= .017;
      if (p.life <= 0) { points.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, p.life); ctx.fillStyle = p.c; ctx.beginPath();
      for (let j = 0; j < 8; j++) {
        const r = j % 2 ? p.r * .25 : p.r, a = j * Math.PI / 4;
        const x = p.x + r * Math.cos(a), y = p.y + r * Math.sin(a);
        if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* Full-screen sparkle burst when transitioning to the new bank on the home screen */
function worldBling(duration = 2400) {
  if (reduced()) return;
  const canvas = el("canvas", "fx-world");
  document.body.append(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return; }
  const w = canvas.width = window.innerWidth, h = canvas.height = window.innerHeight;
  const colors = ["#fff4b8", "#ffd1dc", "#bce6ff", "#ffffff", "#f9b8d0", "#ffe082"];
  const points = [];
  for (let i = 0; i < 160; i++) {
    points.push({
      x: w * 0.2 + Math.random() * w * 0.6,
      y: h * 0.15 + Math.random() * h * 0.65,
      dx: (Math.random() - 0.5) * 3.5,
      dy: (Math.random() - 0.5) * 3.2 - 0.5,
      life: 0.7 + Math.random() * 0.6,
      r: 4 + Math.random() * 8,
      c: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  const start = performance.now();
  function frame(now) {
    if (now - start > duration || !canvas.isConnected) { canvas.remove(); return; }
    ctx.clearRect(0, 0, w, h);
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i]; p.x += p.dx; p.y += p.dy; p.life -= 0.014;
      if (p.life <= 0) { points.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, p.life);
      ctx.fillStyle = p.c;
      ctx.beginPath();
      for (let j = 0; j < 8; j++) {
        const r = j % 2 ? p.r * 0.25 : p.r, a = j * Math.PI / 4;
        const x = p.x + r * Math.cos(a), y = p.y + r * Math.sin(a);
        if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* Finale music controller (70% volume, manual Play & Stop) */
let finaleAudio = null;

function playFinaleMusic() {
  if (muted) return;
  stopFinaleMusic();
  const path = SOUND.finale;
  if (!path || missingSounds.has(path)) {
    synth("finale");
    return;
  }
  const a = new Audio(path);
  a.volume = 0.7;
  finaleAudio = a;
  clips.add(a);
  a.onended = () => {
    clips.delete(a);
    if (finaleAudio === a) finaleAudio = null;
  };
  a.play().catch(() => {
    clips.delete(a);
    if (finaleAudio === a) finaleAudio = null;
    missingSounds.add(path);
    synth("finale");
  });
}

function stopFinaleMusic() {
  if (!finaleAudio) return;
  finaleAudio.pause();
  finaleAudio.currentTime = 0;
  clips.delete(finaleAudio);
  finaleAudio = null;
}

/* Finale celebration: closes Zalo dialog first, manual Play/Stop music at 70% volume */
function celebrateFinale() {
  if (panel.open) panel.close();
  stopFinaleMusic();
  document.querySelectorAll(".finale-overlay").forEach(n => n.remove());

  worldBling(4800);

  const overlay = el("div", "finale-overlay");
  const allFairies = [...ASSET.welcome, ...ASSET.residents, ASSET.checklist, ASSET.chat];

  for (let i = 0; i < 20; i++) {
    const f = el("span", "swarm-fairy", "✧");
    const startX = Math.random() * 92;
    const startY = Math.random() * 88;
    f.style.left = `${startX}%`;
    f.style.top = `${startY}%`;
    artwork(f, allFairies[i % allFairies.length]);
    if (!reduced()) {
      f.animate([
        { transform: "translate(0, 0) rotate(-10deg) scale(0.85)" },
        { transform: `translate(${(Math.random() - 0.5) * 280}px, ${(Math.random() - 0.5) * 230}px) rotate(12deg) scale(1.18)` },
        { transform: `translate(${(Math.random() - 0.5) * 190}px, ${(Math.random() - 0.5) * 190}px) rotate(-6deg) scale(1)` }
      ], { duration: 2300 + Math.random() * 1700, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
    }
    overlay.append(f);
  }

  const card = el("div", "finale-card");
  const btnRow = el("div", "finale-actions");
  btnRow.append(
    button("Play", () => {
      playFinaleMusic();
      worldBling(2500);
    }),
    button("Stop", () => {
      stopFinaleMusic();
    }),
    button("Back", () => {
      stopFinaleMusic();
      overlay.remove();
      home();
    }, "pink")
  );
  card.append(
    el("h2", "", "Congratulations!"),
    el("p", "", "You don’t need to work anymore!"),
    btnRow
  );
  overlay.append(card);
  document.body.append(overlay);
}

function sprite(parent, path, x, y, size, time, delay) {
  const n = el("span", "sprite", "✧");
  Object.assign(n.style, { left: x, top: y, width: size, fontSize: `calc(${size} * .55)` });
  n.style.setProperty("--time", `${time}s`); n.style.setProperty("--delay", `${delay}s`);
  parent.append(n); artwork(n, path);
}
[[ASSET.sun, "79%", "7%", "9vw"], [ASSET.cloud1, "10%", "11%", "15vw"], [ASSET.cloud2, "62%", "20%", "10vw"], [ASSET.cloud3, "38%", "14%", "11vw"]].forEach(([path, x, y, size]) => {
  const n = el("span", "sky-img"); Object.assign(n.style, { left: x, top: y, width: size, aspectRatio: "2 / 1" });
  if (path === ASSET.sun) n.style.aspectRatio = "1";
  $("sky").append(n); artwork(n, path);
});

// Spread out welcome fairies around the larger welcome card
[["-18%", "-8%", "84px"], ["96%", "-6%", "64px"], ["-16%", "78%", "58px"], ["92%", "82%", "72px"]]
  .forEach(([x, y, s], i) => sprite($("welcomeFairies"), ASSET.welcome[i], x, y, s, 4 + i, -i));

// Resident fairies on home screen: top-right fairy moved to bottom-left!
const HOME_FAIRY_POS = [[15, 28], [12, 68], [78, 56]];
ASSET.residents.forEach((path, i) => {
  const x = HOME_FAIRY_POS[i][0] + Math.random() * 4;
  const y = HOME_FAIRY_POS[i][1] + Math.random() * 5;
  sprite($("homeFairies"), path, `${x}%`, `${y}%`, `${52 + i * 13}px`, 6 + i, -Math.random() * 5);
});

let bgGeneration = 0;
async function background(path) {
  const id = ++bgGeneration;
  const url = await imageURL(path) || await imageURL(ASSET.opening);
  if (id !== bgGeneration) return;
  if (url) $("background").src = url; $("background").hidden = !url;
}

document.documentElement.style.setProperty("--lens-radius", `${SETTINGS.lensRadius}px`);
function lensPosition(x, y) {
  const r = $("bankStack").getBoundingClientRect();
  $("bankStack").style.setProperty("--lx", `${Math.max(0, Math.min(r.width, x - r.left))}px`);
  $("bankStack").style.setProperty("--ly", `${Math.max(0, Math.min(r.height, y - r.top))}px`);
}
window.addEventListener("pointermove", e => { if (lens && !panel.open) lensPosition(e.clientX, e.clientY); });
function setLens(on) {
  lens = on;
  $("lensRing").hidden = !on;
  $("bankInterior").hidden = !on || !$("bankInterior").getAttribute("src");
  const b = $("dock").querySelector('[aria-label="Inspect bank interior"]');
  b?.setAttribute("aria-pressed", String(on));
}
async function toggleLens() {
  if (lens) { setLens(false); return; }
  const url = await imageURL(ASSET.cutaway);
  if (!url) { popup("Bank interior", "Add assets/bank2.png to use the lens."); return; }
  $("bankInterior").src = url; setLens(true);
}

function welcome() {
  cancelWork(); app = ""; phase = "idle"; homeVisible = false;
  $("welcome").hidden = false; $("dock").hidden = true; $("bankFloat").hidden = true;
  $("homeFairies").hidden = true; $("bankName").value = ""; $("welcomeNext").hidden = true;
  setLens(false); background(ASSET.opening); setImage("nameArt", ASSET.name);
}
function home(withBling = false) {
  cancelWork(); app = ""; homeVisible = true;
  if (panel.open) panel.close();
  $("welcome").hidden = true; $("dock").hidden = false;
  $("bankFloat").hidden = false; $("homeFairies").hidden = false;
  background(ASSET.home);
  setImage("bankExterior", ASSET.bank).then(ok => $("bankFallback").hidden = ok);
  if (withBling) {
    sound("bling");
    setTimeout(() => sound("bling"), 280);
    worldBling(2600);
  }
}
$("bankName").oninput = e => {
  $("welcomeNext").hidden = e.target.value.trim().toUpperCase() !== "TQB"; sound("typing");
};
$("nameForm").onsubmit = e => {
  e.preventDefault();
  if ($("bankName").value.trim().toUpperCase() !== "TQB") return;
  $("welcome").hidden = true; sound("pop"); openApp("license");
};

function licensing() {
  shell("Licensing Checklist");
  const ready = phase === "ready";
  const rows = CHECKS.map(([title, detail], i) => {
    const checked = ready && i < 14;
    const row = el("div", `check ${checked ? "checked" : ""}`);
    const copy = el("div"); copy.append(el("b", "", title), el("small", "", detail));
    row.append(el("span", "square", checked ? "✓" : ""), copy); content.append(row); return row;
  });

  function startChecklistMagic() {
    if (phase !== "idle") return;
    phase = "waiting"; next.disabled = true; status("A fairy is on her way…"); sound("loading");
    timer = setTimeout(() => {
      phase = "flying";
      summonFlyingFairy(ASSET.checklist, "Click the fairy!", () => {
        phase = "checking";
        updateFairyTray();
        let i = 0;
        function tick() {
          if (i === 14) {
            phase = "ready"; next.disabled = false; next.className = "pink";
            status("14 / 15 complete. You can click next now.");
            rows[14].scrollIntoView({ block: "nearest" });
            updateFairyTray();
            next.focus({ preventScroll: true }); return;
          }
          const row = rows[i++]; row.classList.add("checked"); row.firstChild.textContent = "✓";
          row.scrollIntoView({ block: "nearest" }); status(`${i} / 15`);
          timer = setTimeout(tick, SETTINGS.checkInterval);
        }
        tick();
      });
    }, SETTINGS.fairyWait);
  }

  const next = button("Next", () => {
    if (phase === "ready") { home(true); return; }
    startChecklistMagic();
  }, ready ? "pink" : "wait");

  if (!ready) {
    activeFairyTrigger = startChecklistMagic;
    updateFairyTray();
  }
  $("actions").append(next);
  if (ready) status("14 / 15 complete. You can click next now.");
}

/* ---------- Dock (Removed Decision tree, Behavioral models, and Return to checklist; added Cheering & Full Reset) ---------- */

[
  ["home", "Home"],
  ["bank", "Bank details"],
  ["chat", "Zalo"],
  ["people", "IRRBB Governance"],
  ["doc", "Documents"],
  ["data", "Models & Methods"],
  ["loop", "4 IRRBB activities"],
  ["calendar", "Tasks"],
  ["stress", "+300 bp"],
  ["lens", "Inspect bank interior"],
  ["star", "Play cheering sound"],
  ["finale", "Celebration finale"],
  ["restartAll", "Reset all & return to Welcome"]
].forEach(([key, label]) => {
  const routeMap = {
    "IRRBB Governance": "People",
    "Models & Methods": "Data",
    "4 IRRBB activities": "Workflow",
    "Tasks": "Calendar",
    "+300 bp": "Stress test"
  };
  const targetApp = routeMap[label] || label;
  const b = icon(key, label, () => {
    if (key === "star") { sound("clapping"); worldBling(1800); return; }
    if (key === "finale") { celebrateFinale(); return; }
    if (key === "restartAll") { sound("pop"); resetAllAndWelcome(); return; }
    sound("pop");
    if (key === "lens") { toggleLens(); return; }
    if (key === "home") { home(); return; }
    openApp(targetApp);
  });
  $("dock").append(b);
  if (label === "Zalo") imageURL(ASSET.zalo).then(url => {
    if (!url) return; const img = new Image(); img.src = url; img.alt = ""; b.replaceChildren(img);
  });
});

/* ---------- Shared drag, tap and keyboard matching ---------- */

function tray(parent, title, items, done, group, onSelect, bottom = false) {
  const box = el("aside", `pool ${bottom ? "tray" : ""}`); box.append(el("h3", "", title));
  const remaining = items.filter(i => !done.includes(i.id)).sort((a, b) => a.text.localeCompare(b.text));
  for (const item of remaining) {
    const b = button(item.text, choose, `piece ${item.color || ""}`);
    if (item.tint) b.style.background = item.tint;
    b.draggable = true; b.setAttribute("aria-pressed", String(selected === `${group}/${item.id}`));
    function choose() {
      selected = `${group}/${item.id}`;
      box.querySelectorAll("button").forEach(other => other.setAttribute("aria-pressed", String(other === b)));
      onSelect?.(item);
    }
    b.ondragstart = e => { choose(); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", selected); };
    box.append(b);
  }
  parent.append(box);
}
function bindTarget(n, group, id, done, redraw) {
  function place(value) {
    if (!value || done.includes(id)) return;
    if (value !== `${group}/${id}`) {
      sound("wrong"); status("Try another slot."); n.classList.remove("shake");
      n.getBoundingClientRect(); n.classList.add("shake"); return;
    }
    done.push(id); selected = ""; sound("correct"); redraw(); stars(950);
  }
  n.onclick = () => place(selected);
  n.ondragover = e => e.preventDefault();
  n.ondrop = e => { e.preventDefault(); place(e.dataTransfer.getData("text/plain")); };
}
function slot(group, item, done, redraw, placeholder = "Drop here") {
  const filled = done.includes(item.id);
  const n = button(filled ? `✓ ${item.text}` : placeholder, () => {}, "slot");
  n.disabled = filled; if (!filled) bindTarget(n, group, item.id, done, redraw); return n;
}

/* ---------- IRRBB Governance (formerly People & roles) ---------- */

function people() {
  const p = game.People, second = p.hires.length === 9 && !hirePause;
  const done = second ? p.duties : p.hires, group = second ? "duty" : "hire";
  shell(
    "IRRBB Governance",
    second
      ? `Assign duties · ${done.length}/14`
      : `Build & Hire: Build the red missing units, hire more people for yellow existing units. ${done.length}/9`,
    true
  );
  fitSheet(1220, 0, sheet => {
    const layout = el("div", "people-layout"); sheet.append(layout);
    const map = svg("svg", { viewBox: "0 0 1010 750", class: "org-map", role: "group", "aria-label": "TQB reporting lines" });
    layout.append(map);
    const defs = svg("defs");
    ["authority", "report"].forEach((k, i) => {
      const m = svg("marker", { id: k, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" });
      m.append(svg("path", { d: "M0 0L10 5L0 10z", fill: i ? "#c94a58" : "#3b8754" })); defs.append(m);
    });
    map.append(defs);
    [[48, 1, 912, 83], [48, 88, 912, 89], [48, 182, 912, 172], [45, 367, 426, 268], [505, 367, 455, 268], [45, 643, 426, 96], [505, 643, 455, 96]]
      .forEach(([x, y, w, h], i) => {
        map.append(svg("rect", { x, y, width: w, height: h, rx: 13, fill: TINT[i], opacity: second ? .87 : .55, "data-zone": i }));
        map.append(svg("text", { x: x + 7, y: y + 15, "font-size": 13, "font-weight": 700 }, ZONES[i]));
      });
    function edge(d, label, dashed = false, both = false) {
      const marker = `url(#${dashed ? "report" : "authority"})`;
      const attrs = { d, fill: "none", stroke: dashed ? "#c94a58" : "#3b8754", "stroke-width": 1.85, "marker-end": marker };
      if (dashed) attrs["stroke-dasharray"] = "6 4"; if (both) attrs["marker-start"] = marker;
      const path = svg("path", attrs); path.append(svg("title", {}, label)); map.append(path);
    }
    edge("M513 78V111", "Elects Board"); edge("M601 49H788V111", "Elects Supervisory Board");
    edge("M425 141H341", "Board establishes Board Risk Management Committee"); edge("M513 169V204", "Appoints CEO and sets limits");
    edge("M513 262V287", "CEO chairs ALCO"); edge("M601 231H753V397", "CEO oversees Risk Management Division");
    edge("M665 419H625V314H601", "Risk Management Division participates in ALCO");
    edge("M465 345V357H153V397", "Branch proposals and ALCO mandates", false, true);
    edge("M497 345V364H353V397", "Treasury proposals and ALCO mandates", false, true);
    edge("M535 345V359H487V506H441", "ALM proposals and ALCO mandates", false, true);
    edge("M353 537V561", "ALM supervises Model Development Team");
    edge("M735 455V478H643V507", "Risk Management Division oversees IRRBB Risk");
    edge("M770 455V478H843V507", "Risk Management Division oversees Independent Model Validation Unit");
    edge("M665 436H494V638H24V141H165", "Independent escalation and quarterly Article 55 reporting", true);
    edge("M555 540H509V359H566V345", "Independent gap, NII, EVE and limit alerts to ALCO", true);
    edge("M876 697H984V141H876", "Internal Audit reports directly to the Supervisory Board", true);

    const items = [];
    for (const [id, name, vn, z, x, y, duty, hint] of UNITS) {
      const up = UPGRADES[id], built = (!hint && !up) || p.hires.includes(id);
      const active = second ? id !== "agm" && !p.duties.includes(id) : !built;
      if (second && id !== "agm") items.push({ id, text: duty, tint: TINT[z], z });
      if (!second && (hint || up)) items.push({ id, text: up || name, color: up ? "gold" : "rose", z });
      const g = svg("g", { class: active ? "target" : "", role: active ? "button" : "group", "aria-label": !built && hint ? hint : name });
      const fill = id === "agm" ? "#e7eae3" : built ? "#e1eddb" : up ? "#f9edcc" : "#f6e1e4";
      g.append(svg("rect", { x, y, width: 176, height: 58, rx: 8, fill, stroke: built ? "#92aa90" : up ? "#b69a52" : "#bd8994", "stroke-dasharray": built ? "none" : "5 3" }));
      const titleText = !built && hint ? hint : name;
      const titleFontSize = titleText.length > 26 ? 9.8 : titleText.length > 20 ? 11 : 12.5;
      const vnText = !built && hint ? "Missing unit" : vn;
      const vnFontSize = vnText.length > 30 ? 8.5 : 9.8;
      g.append(svg("text", { x: x + 88, y: y + 16, "text-anchor": "middle", "font-size": titleFontSize, "font-weight": 700 }, titleText));
      g.append(svg("text", { x: x + 88, y: y + 30, "text-anchor": "middle", "font-size": vnFontSize }, vnText));
      if (id !== "agm") {
        const label = second ? (done.includes(id) ? `✓ ${duty}` : "Drop duty here")
          : built ? (up ? `✓ ${up.slice(2)}` : "✓ Exists") : up ? "Drop specialist" : "Drop unit";
        g.append(svg("rect", { x: x + 4, y: y + 34, width: 168, height: 19, rx: 5, fill: second ? TINT[z] : "#fff9", stroke: active ? "#9fa69a" : "none", "stroke-dasharray": "3 2" }));
        g.append(svg("text", { x: x + 88, y: y + 47, "text-anchor": "middle", "font-size": 9.5 }, label));
      }
      map.append(g);
      if (active) {
        g.setAttribute("tabindex", "0");
        bindTarget(g, group, id, done, () => {
          if (!second && p.hires.length === 9) {
            hirePause = true; people(); sound("yay");
            timer = setTimeout(() => { hirePause = false; people(); }, 1000);
          } else { people(); if (p.duties.length === 14) sound("clapping"); }
        });
        g.onkeydown = e => { if (["Enter", " "].includes(e.key)) { e.preventDefault(); g.onclick(); } };
      }
    }
    tray(layout, second ? "Duty cards" : "Shopping cart", items, done, group, item => {
      map.querySelectorAll("[data-zone]").forEach(n => n.classList.toggle("highlight", second && +n.dataset.zone === item.z));
    });
  });
  status("Solid Green: authority & mandates · Dashed Red: independent reporting");
  if (p.duties.length === 14) nextApp("Documents", "Open Documents");
}

/* ---------- Documents (Drag & drop document titles; "+" changed to "&"; no +300 bps emergency plan) ---------- */

function documents() {
  const done = game.Documents.done;
  shell("Documents", `List of documents · ${done.length}/8`, true);
  fitSheet(1200, 0, sheet => {
    const grid = el("div", "docs-grid"); sheet.append(grid); const items = [];
    PAPERS.forEach(([title, exists, purpose, drafter, signer], i) => {
      const id = String(i), filled = done.includes(id);
      const item = { id, text: title, color: exists ? "gold" : "rose" };
      items.push(item);
      const card = el("article", `card ${filled ? "green" : exists ? "gold" : "rose"}`);
      card.append(
        slot("papers", item, done, documents, "Drop document name"),
        el("b", "badge", filled ? "Complete ✓" : exists ? "Exists · Upgrade" : "New"),
        el("p", "", purpose)
      );
      [["Drafts", drafter, "draft"], ["Signs", signer, "sign"]].forEach(([label, value, color]) => {
        const row = el("div", `role-row ${color}`);
        row.append(el("b", "", `${label}: `), document.createTextNode(value));
        card.append(row);
      });
      grid.append(card);
    });
    tray(sheet, "Document names", items, done, "papers", null, true);
  });
  if (done.length === 8) tool("chat", "Read vendor messages", () => beginChat("vendor"));
}

/* ---------- Models & Methods (formerly IT & Data) ---------- */

function dataApp() {
  const d = game.Data;
  shell("Models & Methods", "", true);
  fitSheet(1160, 0, sheet => {
    tabs(sheet, [["stack", "Systems"], ["buckets", "Contract Data"], ["models", "Models & Methods"]], d.tab, key => {
      selected = ""; d.tab = key; dataApp();
    });

    if (d.tab === "stack") {
      const done = d.stack, items = [];
      const board = el("div", "grid4"); sheet.append(board);
      SYSTEMS_CARDS.forEach(([title, desc], i) => {
        const id = String(i), filled = done.includes(id);
        const item = { id, text: title, color: "neutral" };
        items.push(item);
        const card = el("article", `card ${filled ? "green" : "neutral"}`);
        card.append(slot("stack", item, done, dataApp, "Drop system name"), el("p", "", desc));
        board.append(card);
      });
      tray(sheet, "System names", items, done, "stack", null, true);
      status(`${done.length}/4 matched`);
      return;
    }

    if (d.tab === "buckets") {
      const done = d.buckets, items = [];
      const board = el("div", "grid4"); sheet.append(board);
      CONTRACT_CARDS.forEach(([title, lines], i) => {
        const id = String(i), filled = done.includes(id);
        const item = { id, text: title, color: "neutral" };
        items.push(item);
        const card = el("article", `card ${filled ? "green" : "neutral"}`);
        card.append(slot("buckets", item, done, dataApp, "Drop group name"));
        lines.forEach(s => card.append(el("p", "prefill", s)));
        board.append(card);
      });
      tray(sheet, "Contract data groups", items, done, "buckets", null, true);
      status(`${done.length}/4 matched`);
      return;
    }

    // Tab 3: Models & Methods
    const done = d.models, items = [];
    const meta1 = el("p", "note");
    meta1.append(el("b", "", "Developed or configured by: "), document.createTextNode("TQB Model Development Team, with input from ALM and IRRBB Risk"));
    const meta2 = el("p", "note");
    meta2.append(el("b", "", "Independently validated by: "), document.createTextNode("Model Validation Unit"));
    sheet.append(meta1, meta2);

    const table = el("table", "models-table"), header = el("tr");
    ["Model / Method", "Input", "Output", "Purpose"].forEach(t => header.append(el("th", "", t)));
    table.append(header);
    METHODS_ROWS.forEach(([title, input, output, purpose], i) => {
      const id = String(i), r = el("tr", done.includes(id) ? "done" : "");
      const item = { id, text: title, color: "neutral" };
      items.push(item);
      const target = el("td");
      target.append(slot("methods", item, done, dataApp, "Drop model name"));
      r.append(target, el("td", "", input), el("td", "", output), el("td", "", purpose));
      table.append(r);
    });
    sheet.append(table);
    tray(sheet, "Models & methods", items, done, "methods", null, true);
    status(`${done.length}/5 matched`);
  });

  if (d.tab === "models" && d.models.length === 5) nextApp("Inspection", "Start SBV inspection");
  else if (d.tab === "stack" && d.stack.length === 4) tool("next", "Next activity", () => {
    d.tab = "buckets"; selected = ""; dataApp();
  });
  else if (d.tab === "buckets" && d.buckets.length === 4) tool("next", "Next activity", () => {
    d.tab = "models"; selected = ""; dataApp();
  });
}

/* ============================================================
   ZALO — fixed code avatars, 3s pause before replies, your own sticker & finale closure
   ============================================================ */

const ZALO_AVATARS = {
  Club:          "assets/avtCLUB.png",
  Mom:           "assets/avtMOM.png",
  EXGF:          "assets/avtEXGF.png",
  Sister:        "assets/avtSISTER.png",
  BFI65A:        "assets/avtBFI65A.png",
  BRO:           "assets/avtBRO.png",
  MNC:           "assets/avtMNC.png",
  ABDUL:         "assets/Abdul.webp",
  MAMDANI:       "assets/MAMDANI.jpg",
  EXBF:          "assets/avtEXBOYFRIEND.png",
  GF:            "assets/avtGF.png",
  SBV:           "assets/avtSBV.webp",
  SVB:           "assets/SVB.jpg",
  VCB:           "assets/avtVIET.webp",
  BIDV:          "assets/avtBIDV.png",
  Buffett:       "assets/avtWB.webp",
  TCB:           "assets/avtTECH.jpg",
  CTG:           "assets/avtTIN.webp",
  Oracle:        "assets/avtO.png",
  VPB:           "assets/avtVP.png",
  SmallBank1:    "assets/avtSMALLBANK1.png",
  SmallBank2:    "assets/avtSMALLBANK2.png",
  SCB:           "assets/avtSCB.png",
  Auditor:       "assets/avtAUDITOR.png",
  KRM:           "assets/avtKRM.jpg"
};

const ZALO_AVATAR_FALLBACK = {
  Club: "assets/avtClub.png",
  Mom: "assets/avtMom.png",
  Sister: "assets/avtSister.png",
  Buffett: "assets/avtBuffett.png",
  Oracle: "assets/avtOracle.png",
  SmallBank1: "assets/avtSmallBank.png",
  SmallBank2: "assets/avtSmallBank.png"
};

const CONTACTS = [
  ["Club", "Vietnam Bankers Flexing Club"],
  ["Mom", "Mom"],
  ["EXGF", "ex gf"],
  ["Sister", "Sister"],
  ["BFI65A", "BFI65A"],
  ["BRO", "bro"],
  ["MNC", "[BFI65A] MNC"],
  ["ABDUL", "Abdul El-Sayed"],
  ["MAMDANI", "Mamdani"],
  ["EXBF", "ex boyfriend"],
  ["GF", "gf"]
];

const ZALO_EPISODES = ["intro", "vendor", "approval", "shock", "finale"];

const ZALO_CHECKPOINT_LABELS = {
  intro: "IRRBB Governance",
  vendor: "Models & Methods",
  approval: "4 IRRBB activities",
  shock: "+300 bp",
  finale: "Day 30 review"
};

const ZALO_NEXT_LABELS = {
  intro: "Continue to the vendor conversation",
  vendor: "Continue to the SBV approval conversation",
  approval: "Continue to the rate announcement",
  shock: "Continue to the Day 30 conversation"
};

function zaloAvatar(id, name) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0])
    .join("")
    .toUpperCase();

  const node = el("span", "avatar", initials);
  node.setAttribute("aria-hidden", "true");

  const path = ZALO_AVATARS[id];
  if (path) {
    artwork(node, path).then(ok => {
      if (!ok && ZALO_AVATAR_FALLBACK[id]) artwork(node, ZALO_AVATAR_FALLBACK[id]);
    });
  }

  return node;
}

function zaloScrollToLatest(log) {
  log.scrollTop = log.scrollHeight;
  requestAnimationFrame(() => {
    if (log.isConnected) log.scrollTop = log.scrollHeight;
  });
}

function zaloText(parent, text) {
  if (text.startsWith("“") && text.endsWith("”")) {
    parent.append(el("span", "z-quote-red", text));
    return;
  }
  const tags = ["@Warren Buffett", "@SBV"];
  for (const tag of tags) {
    const index = text.indexOf(tag);
    if (index !== -1) {
      parent.append(
        document.createTextNode(text.slice(0, index)),
        el("span", "mention", tag),
        document.createTextNode(text.slice(index + tag.length))
      );
      return;
    }
  }
  parent.append(document.createTextNode(text));
}

function zaloFile(parent, text) {
  const file = el("div", "z-file");
  const filename = text.replace(/^📄\s*/, "");
  file.append(
    el("span", "z-file-badge", "PDF"),
    el("span", "z-file-name", filename)
  );
  parent.append(file);
}

/*
  Sends your own sticker directly from ASSET.sticker ("assets/sticker.png")
*/
function zaloSticker(parent) {
  const wrap = el("div", "z-sticker-fallback", "🎉");
  imageURL(ASSET.sticker).then(url => {
    if (!url) return;
    wrap.textContent = "";
    const img = new Image();
    img.className = "z-sticker-msg";
    img.alt = "TQB Sticker";
    img.src = url;
    wrap.append(img);
  });
  parent.append(wrap);
}

function zaloMessage(log, sender, text) {
  if (sender === "TIME") {
    log.append(el("div", "z-time", text));
    return;
  }
  if (sender === "Group") {
    log.append(el("div", "system", text));
    return;
  }

  const own = sender === "TQB";
  const name = NAMES[sender] || sender;
  const row = el("div", own ? "message-row own" : "message-row");
  const bubble = el("div", "bubble");

  if (!own) {
    row.append(zaloAvatar(sender, name));
    bubble.append(el("b", "", name));
  }

  if (text.startsWith("📄")) {
    zaloFile(bubble, text);
  } else if (text.startsWith("[STICKER")) {
    zaloSticker(bubble);
  } else {
    zaloText(bubble, text);
  }

  row.append(bubble);
  log.append(row);

  if (sender === "SBV" && text.includes("Appendix V")) {
    imageURL(ASSET.regulation).then(url => {
      if (!url || !bubble.isConnected) return;
      const image = new Image();
      image.className = "z-regulation";
      image.alt = "Circular 83 excerpt sent by SBV";
      image.onload = () => zaloScrollToLatest(log);
      image.src = url;
      bubble.append(image);
    });
  }
}

function zaloHistory(z) {
  if (Array.isArray(z.history)) return z.history;
  z.history = [];
  for (const episode of ZALO_EPISODES) {
    const lines = CHAT[episode];
    const delivered = Math.min(z.counts[episode] || 0, lines.length);
    for (let index = 0; index < delivered; index++) {
      z.history.push({ episode, index });
    }
  }
  return z.history;
}

function zalo() {
  clearTimeout(timer);

  const z = game.Zalo;
  const episode = ZALO_EPISODES.includes(z.episode) ? z.episode : "intro";
  z.episode = episode;

  const script = CHAT[episode];
  const token = epoch;
  const history = zaloHistory(z);

  let pendingTyping = null;

  shell("Zalo");

  const wrap = el("div", "zalo");

  const rail = el("aside", "rail");
  rail.setAttribute("aria-hidden", "true");
  rail.append(el("span", "z-brand", "Z"), el("span", "", "◉"));

  const contacts = el("aside", "contacts");
  contacts.append(el("b", "", "Messages"));
  const contactsList = el("div", "contacts-list");
  for (const [id, label] of CONTACTS) {
    const contact = el("div", id === "Club" ? "contact current" : "contact");
    contact.append(zaloAvatar(id, label), el("span", "", label));
    contactsList.append(contact);
  }
  contacts.append(contactsList);

  const conversation = el("section", "conversation");
  const head = el("header", "chat-head");
  head.append(
    zaloAvatar("Club", "Vietnam Bankers Flexing Club"),
    el("strong", "", "Vietnam Bankers Flexing Club")
  );

  const log = el("div", "log");
  log.setAttribute("role", "log");
  log.setAttribute("aria-label", "Vietnam Bankers Flexing Club messages");

  for (const entry of history) {
    const line = CHAT[entry.episode]?.[entry.index];
    if (line) zaloMessage(log, line[0], line[1]);
  }
  log.setAttribute("aria-live", "polite");

  const compose = el("div", "composer");
  conversation.append(head, log, compose);
  wrap.append(rail, contacts, conversation);
  content.append(wrap);
  zaloScrollToLatest(log);

  function alive() {
    return (
      app === "Zalo" &&
      panel.open &&
      epoch === token &&
      z.episode === episode &&
      log.isConnected
    );
  }

  function cursor() {
    return Math.min(z.counts[episode] || 0, script.length);
  }

  function showComposer(text = "Type", placeholder = true) {
    compose.replaceChildren();
    const draft = el("div", placeholder ? "z-draft placeholder" : "z-draft");
    if (placeholder) draft.textContent = "Type";
    else zaloText(draft, text);
    const controls = el("div", "z-controls");
    compose.append(draft, controls);
    return { draft, controls };
  }

  function removeTyping() {
    pendingTyping?.remove();
    pendingTyping = null;
  }

  function deliver(index) {
    if (!alive() || cursor() !== index) return false;

    removeTyping();

    const [sender, text] = script[index];
    zaloMessage(log, sender, text);

    history.push({ episode, index });
    z.counts[episode] = index + 1;

    save("Zalo");
    if (sender !== "TIME") sound("whoop");
    zaloScrollToLatest(log);

    if (sender === "Group" && text === "Warren Buffett entered the chat.") {
      sound("bling");
      stars();
    }
    if (sender === "Group" && text === "Warren Buffett left the chat.") {
      status("");
    }

    updateFairyTray();
    return true;
  }

  function waitForIncoming(index) {
    const [sender, text] = script[index];

    if (sender === "TIME") {
      if (deliver(index)) advance();
      return;
    }

    // Fairy Help #2: When Warren Buffett left the group, pause and require Fairy Help #2
    if (
      episode === "intro" &&
      sender === "Group" &&
      text === "Warren Buffett entered the chat." &&
      !z.buffettSummoned
    ) {
      const { draft, controls } = showComposer("Warren Buffett left! Use your fairy help…", false);
      let summoned = false;

      function triggerBuffettFairy() {
        if (summoned || !alive()) return;
        summoned = true;
        controls.replaceChildren();
        draft.textContent = "A fairy is flying in to summon Warren Buffett…";
        summonFlyingFairy(ASSET.chat, "Click the fairy to bring Warren Buffett into the chat!", () => {
          z.buffettSummoned = true;
          status("");
          save("Zalo");
          if (deliver(index)) advance();
        });
      }

      const callBtn = button("✧ Call Fairy Help", triggerBuffettFairy, "pink");
      controls.append(callBtn);
      activeFairyTrigger = triggerBuffettFairy;
      updateFairyTray();
      status("Warren Buffett left the group! Click Fairy Help to bring him back.");
      return;
    }

    showComposer();

    const isFastShockQ = episode === "shock" && text === "?";
    const pauseMs = isFastShockQ ? 500 : SETTINGS.preReplyPause;
    const typingMs = isFastShockQ ? 350 : SETTINGS.typingDuration;

    // Wait before incoming message, 3-dots typing, or group join/leave (0.5s for the rapid ? ? ? after +300 bps)
    timer = setTimeout(() => {
      if (!alive() || cursor() !== index) return;

      if (sender === "Group") {
        if (!deliver(index)) return;
        advance();
        return;
      }

      const name = NAMES[sender] || sender;
      const row = el("div", "message-row");
      const dots = el("div", "bubble typing");

      dots.setAttribute("aria-label", `${name} is typing`);
      dots.innerHTML = "<i></i><i></i><i></i>";

      row.append(zaloAvatar(sender, name), dots);
      pendingTyping = row;
      log.append(row);

      sound("3dots");
      zaloScrollToLatest(log);

      timer = setTimeout(() => {
        if (!deliver(index)) return;
        advance();
      }, typingMs);
    }, pauseMs);
  }

  function prepareOutgoing(index) {
    const firstText = script[index][1];

    // Direct sticker send using your own ASSET.sticker ("assets/sticker.png")
    if (firstText === "[STICKER]") {
      const { controls } = showComposer("Send sticker", false);
      const sendBtn = button("Send sticker", () => {
        if (!alive() || cursor() !== index || sendBtn.disabled) return;
        sendBtn.disabled = true;
        if (!deliver(index)) return;
        advance();
      }, "send");
      controls.append(sendBtn);
      return;
    }

    const { draft, controls } = showComposer(firstText, false);

    if (firstText.startsWith("📄")) {
      draft.replaceChildren();
      zaloFile(draft, firstText);
    }

    const send = button("Send", () => {
      if (!alive() || cursor() !== index || send.disabled) return;
      send.disabled = true;
      if (!deliver(index)) return;
      advance();
    }, "send");

    controls.append(send);
  }

  function checkpoint() {
    removeTyping();
    save("Zalo");

    const { controls } = showComposer();
    const target = HANDOFF[episode];

    // Finale: clicking the fairy closes Zalo and launches the ending celebration with cheering sound!
    if (episode === "finale") {
      const finaleFairy = button("✧", () => {
        save("Zalo");
        celebrateFinale();
      }, "icon guide");
      finaleFairy.title = "Finish & Celebrate!";
      finaleFairy.setAttribute("aria-label", "Finish & Celebrate!");
      artwork(finaleFairy, ASSET.chat);
      controls.append(finaleFairy);
      return;
    }

    const fairy = button("✧", () => {
      save("Zalo");
      openApp(target);
    }, "icon guide");

    const activityName = ZALO_CHECKPOINT_LABELS[episode];
    fairy.title = activityName;
    fairy.setAttribute("aria-label", activityName);
    artwork(fairy, ASSET.chat);
    controls.append(fairy);

    const position = ZALO_EPISODES.indexOf(episode);
    const following = ZALO_EPISODES[position + 1];

    if (following) {
      const forward = icon(
        "next",
        ZALO_NEXT_LABELS[episode],
        () => beginChat(following)
      );
      forward.classList.add("z-forward");
      controls.append(forward);
    }
  }

  function advance() {
    if (!alive()) return;
    const index = cursor();
    if (index >= script.length) {
      checkpoint();
      return;
    }
    if (script[index][0] === "TQB") {
      prepareOutgoing(index);
    } else {
      waitForIncoming(index);
    }
  }

  advance();
}

/* ---------- 4 IRRBB activities (Subtitle "0/7 steps", ":" instead of "·") ---------- */

function workflow() {
  const w = game.Workflow, i = w.step;
  shell("4 IRRBB activities", `${w.done.length}/7 steps`, true);
  fitSheet(1240, 0, sheet => {
    const layout = el("div", "wheel-layout"); sheet.append(layout);
    const wheel = svg("svg", { viewBox: "0 0 460 340", class: "wheel", "aria-label": "Four IRRBB activities loop" });
    const cx = 230, cy = 170, rx = 164, ry = 118;
    const positions = SOP.map((_, j) => {
      const a = -Math.PI / 2 + j * 2 * Math.PI / 7; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
    });
    const defs = svg("defs"), marker = svg("marker", { id: "wheelArrow", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto" });
    marker.append(svg("path", { d: "M0 0L10 5L0 10z", fill: "#89a28a" })); defs.append(marker); wheel.append(defs);
    positions.forEach(([x, y], j) => {
      const [nx, ny] = positions[(j + 1) % 7], dx = nx - x, dy = ny - y;
      wheel.append(svg("line", {
        x1: x + dx * .29, y1: y + dy * .29, x2: x + dx * .70, y2: y + dy * .70,
        stroke: "#89a28a", "stroke-width": 2, "marker-end": "url(#wheelArrow)"
      }));
    });
    positions.forEach(([x, y], j) => {
      const [groupNum, stepName] = SOP[j];
      const theme = ACTIVITY_COLORS[groupNum];
      const placed = w.done.includes(String(j));
      const node = svg("g", { role: "button", tabindex: 0, "aria-label": `${groupNum}: ${stepName}` });
      node.append(svg("rect", {
        x: x - 58, y: y - 18, width: 116, height: 36, rx: 11,
        fill: theme.bg,
        stroke: j === i ? "#1d242b" : theme.stroke,
        "stroke-width": j === i ? 2.6 : 1.5
      }));
      node.append(svg("text", { x, y: y + 4, "text-anchor": "middle", fill: theme.text },
        placed ? `${groupNum}: ${stepName.split(" ")[0]} ✓` : `Activity ${groupNum}`));
      node.onclick = () => { w.step = j; workflow(); };
      node.onkeydown = e => { if (["Enter", " "].includes(e.key)) { e.preventDefault(); node.onclick(); } };
      wheel.append(node);
    });
    layout.append(wheel);

    const [groupNum, stepName, who, what, input, act, out, decision] = SOP[i];
    const theme = ACTIVITY_COLORS[groupNum];
    const detail = el("article", "card wheel-detail");
    detail.style.borderColor = theme.stroke;

    // Color-coded flow header on the card: 1: Identify -> 2: Measure -> 3: Monitor -> 4: Control
    const flowBar = el("div", "flow-pill-bar");
    [1, 2, 3, 4].forEach(num => {
      const c = ACTIVITY_COLORS[num];
      const pill = el("span", `flow-pill ${num === groupNum ? "active" : ""}`, `${num}: ${c.name}`);
      pill.style.background = c.bg;
      pill.style.color = c.text;
      pill.style.border = `1px solid ${c.stroke}`;
      flowBar.append(pill);
      if (num < 4) flowBar.append(el("span", "", "→"));
    });
    detail.append(flowBar);

    detail.append(slot("workflow", { id: String(i), text: stepName }, w.done, workflow, "Drop step name here"));

    [
      ["Who", who],
      ["Tool", what],
      ["Input", input],
      ["Action", act],
      ["Output", out],
      ["Decision / escalation", decision]
    ].forEach(([k, v]) => {
      const p = el("p", "");
      p.append(el("b", "", `${k}: `), document.createTextNode(v));
      detail.append(p);
    });

    layout.append(detail);
    const items = SOP.map((s, j) => ({ id: String(j), text: s[1], tint: ACTIVITY_COLORS[s[0]].bg }));
    tray(sheet, "Step names", items, w.done, "workflow", null, true);
  }, "workflow-padded");
  nextApp("Calendar", "Open Tasks");
}

/* ---------- Tasks (All tasks + IRRBB Calendar with elevated top box & "←" button) ---------- */

function calendar() {
  const c = game.Calendar;
  const isCal = c.view === "calendar";
  shell("Tasks", isCal ? "IRRBB Calendar" : "All tasks");
  content.classList.toggle("cal-assigned", Boolean(c.assigned));

  if (!isCal) {
    const listWrap = el("div", "stack");
    TASK_DOCS.forEach(([when, title, desc]) => {
      const row = el("div", "task-doc-row cal-card");
      row.append(
        el("span", "task-doc-when", when),
        el("span", "task-doc-title", title),
        el("span", "", desc)
      );
      listWrap.append(row);
    });
    content.append(listWrap);

    const moveWrap = el("div", "");
    moveWrap.style.cssText = "margin-top: 12px; text-align: center;";
    const moveBtn = button("Move to calendar →", () => {
      c.view = "calendar";
      save("Calendar");
      sound("pop");
      calendar();
      content.scrollTop = 0;
    }, "pink");
    moveWrap.append(moveBtn);
    content.append(moveWrap);
    return;
  }

  // Top elevated whitish card with shadow separating controls + selected unit from All units below
  const topBox = el("div", "cal-top-box");
  const controls = el("div", "calendar-controls");
  const backBtn = button("←", () => {
    c.view = "docs";
    save("Calendar");
    calendar();
  });
  backBtn.title = "Back to All tasks";
  backBtn.setAttribute("aria-label", "Back to All tasks");

  const dept = document.createElement("select");
  dept.setAttribute("aria-label", "Unit");
  DEPTS.forEach(([name], i) => dept.add(new Option(name, String(i))));
  dept.value = String(c.dept);
  dept.onchange = () => { c.dept = +dept.value; save("Calendar"); calendar(); };
  controls.append(backBtn, dept);
  topBox.append(controls);

  tabs(topBox, CYCLES.map((s, i) => [i, s]), c.cycle, i => { c.cycle = i; save("Calendar"); calendar(); });

  const [name, cycles] = DEPTS[c.dept];
  const mainCard = el("article", "card cal-card");
  mainCard.append(el("h3", "", name), el("small", "", CYCLES[c.cycle]), el("p", "", cycles[c.cycle]));
  topBox.append(mainCard);
  content.append(topBox);

  // All units section below
  const allHeader = el("h4", "bank-section-title", `All units · ${CYCLES[c.cycle]}`);
  content.append(allHeader);
  const grid = el("div", "cal-grid");
  DEPTS.forEach(([uName, uCycles]) => {
    const itemCard = el("article", "card cal-card");
    itemCard.append(el("b", "", uName), el("p", "", uCycles[c.cycle]));
    grid.append(itemCard);
  });
  content.append(grid);

  const assignBtn = button(
    c.assigned ? "✓ Assigned successfully" : "📅 Assign to everyone involved",
    () => {
      c.assigned = true;
      save("Calendar");
      sound("yay");
      stars(1300);
      calendar();
      status("Assigned to everyone involved and synced to TQB’s calendar!");
    },
    c.assigned ? "green" : "pink"
  );
  $("actions").append(assignBtn);
  tool("chat", "Read SBV announcement", () => beginChat("shock"));
}

/* ---------- Go-live inspection ---------- */

function inspection() {
  const q = game.Inspection; shell("Go-live inspection");
  note(QUIZ.map((_, i) => i < q.index ? "✓" : "□").join("     "));
  if (q.index === QUIZ.length) { note("Six locks open.", "green"); tool("chat", "Read SBV approval", () => beginChat("approval")); return; }
  const [question, answers, correct] = QUIZ[q.index];
  content.append(el("h3", "", question)); const choices = el("div", "choices"); content.append(choices);
  answers.forEach((answer, i) => choices.append(button(answer, () => {
    if (i !== correct) { sound("wrong"); status("Try again."); return; }
    q.index++; sound(q.index === 6 ? "yay" : "correct"); inspection(); stars();
  })));
}

/* ============================================================
   SCREEN · +300 bp (Decision -> Hedging and Balance Sheet Options -> Results)
   ============================================================ */

function stress() {
  const s = game["Stress test"];
  if (!["decision", "options", "results"].includes(s.tab)) s.tab = "decision";

  const placedSelectCount = s.selectSlots.filter(Boolean).length;
  const placedNamedCount = Object.keys(s.namedSlots).length;
  const totalPlaced = placedSelectCount + placedNamedCount;
  if (totalPlaced === 8) s.unlockedResults = true;

  shell("+300 bp", "", true);
  fitSheet(1220, 0, sheet => {
    tabs(
      sheet,
      [
        ["decision", "Decision", false],
        ["options", "Hedging and Balance Sheet Options", !s.unlockedOptions],
        ["results", "Results", !s.unlockedResults]
      ],
      s.tab,
      nextTab => {
        selected = "";
        s.tab = nextTab;
        save("Stress test");
        stress();
      }
    );

    /* ---------- Tab 1 · Decision ---------- */
    if (s.tab === "decision") {
      sheet.append(el("h4", "bank-section-title", "What the five tools tell us"));
      const table = el("table", "info-table");
      const head = el("tr");
      ["Tool", "What the +300 bp scenario shows"].forEach(h => head.append(el("th", "", h)));
      table.append(head);
      STRESS_TOOLS_TABLE.forEach(([toolName, finding]) => {
        const tr = el("tr");
        tr.append(el("td", "", toolName), el("td", "", finding));
        tr.firstChild.style.fontWeight = "700";
        table.append(tr);
      });
      sheet.append(table);

      // Two breach result cards directly below the table
      const cardsGrid = el("div", "metrics");
      [
        ["🔴 12-month net interest income", "ΔNII −14.33% of baseline NII", "Hard limit −10%"],
        ["🔴 Economic value of equity", "ΔEVE −12.51% of Tier 1 capital", "Hard limit −12%"]
      ].forEach(([title, mainVal, limitText]) => {
        const box = el("div", "metric rose");
        box.append(el("b", "", title), el("strong", "", mainVal), el("small", "", limitText));
        cardsGrid.append(box);
      });
      sheet.append(cardsGrid);

      sheet.append(el("h4", "bank-section-title", "What should TQB do?"));
      const decisionBox = el("div", "stress-decision-box");
      const choicesCol = el("div", "stress-choices");
      const hoverPanel = el("div", "stress-hover-panel");
      const defaultHover = STRESS_CHOICES.find(c => c[0] === s.choice)?.[2] ||
        "Hover or focus a choice on the left to preview how it works.";
      hoverPanel.textContent = defaultHover;

      STRESS_CHOICES.forEach(([code, label, onHoverText]) => {
        const btn = button(label, () => {
          s.choice = code;
          if (code === "C") {
            s.unlockedOptions = true;
            sound("correct");
            stars(900);
          } else {
            sound("wrong");
          }
          save("Stress test");
          stress();
        });
        btn.setAttribute("aria-pressed", String(s.choice === code));
        btn.onmouseenter = () => { hoverPanel.textContent = onHoverText; };
        btn.onfocus = () => { hoverPanel.textContent = onHoverText; };
        choicesCol.append(btn);
      });

      decisionBox.append(choicesCol, hoverPanel);
      sheet.append(decisionBox);

      if (s.choice) {
        const pickedRow = STRESS_CHOICES.find(c => c[0] === s.choice);
        const fbBar = el("div", `stress-feedback-bar ${s.choice === "C" ? "green" : "rose"}`);
        fbBar.append(el("span", "", pickedRow[3]));
        if (s.choice === "C") {
          fbBar.append(button("Hedging and Balance Sheet Options →", () => {
            s.tab = "options";
            save("Stress test");
            sound("pop");
            stress();
          }, "pink"));
        }
        sheet.append(fbBar);
      }
      return;
    }

    /* ---------- Tab 2 · Hedging and Balance Sheet Options ---------- */
    if (s.tab === "options") {
      const usedIds = new Set([
        ...s.selectSlots.filter(Boolean),
        ...Object.values(s.namedSlots)
      ]);

      const instr = el("p", "note", "Choose four actions for TQB’s current exposure. Match the remaining four to when you would use them.");
      sheet.append(instr);

      const layout = el("div", "hedge-layout");
      const poolBox = el("aside", "pool");
      poolBox.append(el("h3", "", `Actions (${8 - usedIds.size} remaining)`));

      HEDGE_CARDS.filter(c => !usedIds.has(c.id)).forEach(card => {
        const b = button(card.title, choose, "piece neutral");
        b.draggable = true;
        b.setAttribute("aria-pressed", String(selected === card.id));
        function choose() {
          selected = card.id;
          poolBox.querySelectorAll("button").forEach(other => other.setAttribute("aria-pressed", String(other === b)));
        }
        b.ondragstart = e => {
          choose();
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", card.id);
        };
        poolBox.append(b);
      });

      const rightCol = el("div", "hedge-right");

      // Top section: Select for this scenario · 0/4 (four identical slots)
      const selectSec = el("div", "hedge-section-box");
      selectSec.append(el("h4", "", `Select for this scenario · ${placedSelectCount}/4`));
      const selectGrid = el("div", "hedge-slots-grid");

      s.selectSlots.forEach((cardId, slotIdx) => {
        const cardObj = HEDGE_CARDS.find(c => c.id === cardId);
        const slotEl = el("div", `hedge-slot-card ${cardObj ? "filled" : ""}`);
        if (cardObj) {
          slotEl.append(
            el("div", "hedge-slot-title", `✓ ${cardObj.title}`),
            el("div", "hedge-slot-desc", cardObj.explain)
          );
        } else {
          const dropBtn = button("Select · any slot (Drop here)", () => tryPlaceSelect(selected), "slot");
          dropBtn.ondragover = e => e.preventDefault();
          dropBtn.ondrop = e => {
            e.preventDefault();
            tryPlaceSelect(e.dataTransfer.getData("text/plain"));
          };
          function tryPlaceSelect(id) {
            if (!id) return;
            const candidate = HEDGE_CARDS.find(c => c.id === id);
            if (!candidate || candidate.target !== "select") {
              selected = "";
              sound("wrong");
              status("Try another slot.");
              slotEl.classList.remove("shake");
              slotEl.getBoundingClientRect();
              slotEl.classList.add("shake");
              stress();
              return;
            }
            s.selectSlots[slotIdx] = candidate.id;
            selected = "";
            const newTotal = s.selectSlots.filter(Boolean).length + Object.keys(s.namedSlots).length;
            if (newTotal === 8) s.unlockedResults = true;
            save("Stress test");
            sound(newTotal === 8 ? "yay" : "correct");
            stress();
            stars(900);
          }
          slotEl.append(dropBtn);
        }
        selectGrid.append(slotEl);
      });
      selectSec.append(selectGrid);
      rightCol.append(selectSec);

      // Bottom section: Four named destinations
      const namedSec = el("div", "hedge-section-box");
      namedSec.append(el("h4", "", `Other situations · ${placedNamedCount}/4`));
      const namedGrid = el("div", "hedge-slots-grid");

      HEDGE_NAMED_SLOTS.forEach(([targetKey, destLabel]) => {
        const cardId = s.namedSlots[targetKey];
        const cardObj = HEDGE_CARDS.find(c => c.id === cardId);
        const slotEl = el("div", `hedge-slot-card ${cardObj ? "filled" : ""}`);
        slotEl.append(el("div", "hedge-slot-label", destLabel));

        if (cardObj) {
          slotEl.append(
            el("div", "hedge-slot-title", `✓ ${cardObj.title}`),
            el("div", "hedge-slot-desc", cardObj.explain)
          );
        } else {
          const dropBtn = button("Drop matching action here", () => tryPlaceNamed(selected), "slot");
          dropBtn.ondragover = e => e.preventDefault();
          dropBtn.ondrop = e => {
            e.preventDefault();
            tryPlaceNamed(e.dataTransfer.getData("text/plain"));
          };
          function tryPlaceNamed(id) {
            if (!id) return;
            const candidate = HEDGE_CARDS.find(c => c.id === id);
            if (!candidate || candidate.target !== targetKey) {
              selected = "";
              sound("wrong");
              status("Try another slot.");
              slotEl.classList.remove("shake");
              slotEl.getBoundingClientRect();
              slotEl.classList.add("shake");
              stress();
              return;
            }
            s.namedSlots[targetKey] = candidate.id;
            selected = "";
            const newTotal = s.selectSlots.filter(Boolean).length + Object.keys(s.namedSlots).length;
            if (newTotal === 8) s.unlockedResults = true;
            save("Stress test");
            sound(newTotal === 8 ? "yay" : "correct");
            stress();
            stars(900);
          }
          slotEl.append(dropBtn);
        }
        namedGrid.append(slotEl);
      });
      namedSec.append(namedGrid);
      rightCol.append(namedSec);

      layout.append(poolBox, rightCol);
      sheet.append(layout);
      status(`${totalPlaced}/8 matched`);

      if (totalPlaced === 8) {
        const doneBar = el("div", "stress-feedback-bar green");
        doneBar.append(
          el("b", "", "Your package addresses both funding costs and fixed-rate exposure."),
          button("Run stress test →", () => {
            s.tab = "results";
            save("Stress test");
            sound("pop");
            stress();
          }, "pink")
        );
        sheet.append(doneBar);
      }
      return;
    }

    /* ---------- Tab 3 · Results ---------- */
    sheet.append(el("h3", "bank-section-title", "Did the package bring TQB back within limits?"));
    sheet.append(el("p", "note", "Risk reruns the same +300 bp shock with the selected actions in place."));

    const resTable = el("table", "info-table");
    const rHead = el("tr");
    ["Measure", "Before action", "After package*", "Early warning", "Hard limit", "Result"].forEach(h => rHead.append(el("th", "", h)));
    resTable.append(rHead);
    [
      ["ΔNII · 12-month earnings impact", "−14.33%", "−6.26%", "−8%", "−10%", "🟢 Within limits"],
      ["ΔEVE · Economic value impact", "−12.51%", "−6.85%", "−10%", "−12%", "🟢 Within limits"]
    ].forEach(rowVals => {
      const tr = el("tr");
      rowVals.forEach((v, idx) => {
        const td = el("td", "", v);
        if (idx === 0 || idx === 2 || idx === 5) td.style.fontWeight = "700";
        tr.append(td);
      });
      resTable.append(tr);
    });
    sheet.append(resTable);

    sheet.append(el("p", "note green", "Both measures are back within limits. Customers may still withdraw deposits or keep their fixed-rate loans. TQB can now absorb more of that risk."));
  });

  if (s.tab === "results") {
    nextApp("Day 30", "Day 30 audit");
    tool("chat", "Report hedging in Zalo", () => beginChat("finale"));
  }
}

function audit() {
  const a = game["Day 30"]; shell("Day 30 · Audit sign-off");
  note("Independent Model Validation Unit compares early withdrawals with realized behavior and recalibrates the model.");
  note("Internal Audit tests the response, documents findings and reports independently to the Supervisory Board.");
  const grid = el("div", "metrics");
  [["12M ΔNII", -6.26, -10], ["ΔEVE / Tier 1", -6.85, -12]].forEach(([label, value, limit]) => {
    const box = el("div", "metric green");
    box.append(el("small", "", label), el("strong", "", `${value.toFixed(2)}%`), el("small", "", `Limit ${limit}% · Within limit`));
    grid.append(box);
  });
  content.append(grid);
  if (!a.signed) tool("check", "Sign off and open Zalo", () => { a.signed = true; save("Day 30"); beginChat("finale"); });
  else {
    note("Review complete. Welcome to TQB!", "green");
    tool("star", "Celebrate", () => celebrateFinale());
    tool("home", "Show bank", () => home());
  }
}

/* ---------- Bank details (Pastel pink theme, compact 3-line liquidity without dots, no bullet notes) ---------- */

function bankDetails() {
  const bState = game["Bank details"];
  shell("Bank details");

  // First line in pastel pink
  note("Against Q3 2026 peers, around 7th by total assets, more customer deposits than MB and VPBank.", "pastel-pink");

  // Second line (3 highlight boxes)
  const topGrid = el("div", "grid3");
  [
    ["Total assets", "VND 1,500tn"],
    ["Customer loans", "VND 1,080tn"],
    ["Customer deposits", "VND 1,050tn"]
  ].forEach(([label, val]) => {
    const card = el("article", "card pastel-pink");
    card.append(el("small", "", label), el("h3", "", val));
    topGrid.append(card);
  });
  content.append(topGrid);

  // Capital, earnings and liquidity
  content.append(el("h4", "bank-section-title", "Capital, earnings and liquidity"));
  const capGrid = el("div", "grid4");
  [
    ["Total regulatory capital", "VND 160tn"],
    ["Tier 1 capital", "VND 140tn"],
    ["Risk-weighted assets", "VND 1,250tn"],
    ["Total capital adequacy ratio", "12.80%"],
    ["Tier 1 capital ratio", "11.20%"],
    ["Baseline 12-month NII", "VND 49tn"],
    ["Baseline NIM", "3.50%"]
  ].forEach(([m, v]) => {
    const card = el("article", "card");
    card.append(el("small", "", m), el("h3", "", v));
    capGrid.append(card);
  });

  // Liquidity assumptions card: smaller font, 3 clean lines, no small dots
  const liqCard = el("article", "card");
  liqCard.append(el("small", "", "Liquidity assumptions"));
  const liqLines = el("div", "liquidity-lines");
  [
    "LDR ~82–85%",
    "LCR & NSFR ≥100%",
    "ST funding for MLT loans ~25%"
  ].forEach(line => liqLines.append(el("div", "", line)));
  liqCard.append(liqLines);
  capGrid.append(liqCard);

  content.append(capGrid);

  // Balance-sheet structure table
  content.append(el("h4", "bank-section-title", "Balance-sheet structure"));
  const bsTable = el("table", "info-table");
  const bsHead = el("tr");
  ["Assets", "VND tn", "Funding and liabilities", "VND tn"].forEach(h => bsHead.append(el("th", "", h)));
  bsTable.append(bsHead);
  [
    ["Customer loans", "1,080", "Customer deposits", "1,050"],
    ["Banking-book bonds", "200", "Certificates of deposit and bonds issued", "150"],
    ["Interbank placements", "120", "Interbank and OMO borrowing", "110"],
    ["Rate-sensitive assets", "1,400", "Rate-sensitive liabilities", "1,310"],
    ["Other assets in the simulation", "100", "Other liabilities and equity, combined", "190"],
    ["Total assets", "1,500", "Total liabilities and equity", "1,500"]
  ].forEach(rowVals => {
    const tr = el("tr");
    rowVals.forEach((v, idx) => {
      const td = el("td", "", v);
      if (idx % 2 === 1) td.style.fontWeight = "700";
      tr.append(td);
    });
    bsTable.append(tr);
  });
  content.append(bsTable);

  // Optional Early Warning & Hard Limits section toggled by the Update icon button
  if (bState.showLimits) {
    const limWrap = el("div", "");
    limWrap.id = "bankLimitsSection";
    limWrap.append(el("h4", "bank-section-title", "IRRBB early warning & hard limits"));
    const limTable = el("table", "info-table");
    const lHead = el("tr");
    ["Measure", "Early warning", "Hard limit"].forEach(h => lHead.append(el("th", "", h)));
    limTable.append(lHead);
    [
      ["ΔEVE · Change in economic value of equity", "−10% of Tier 1 capital · −VND 14.00tn", "−12% · −VND 16.80tn"],
      ["ΔNII · Change in 12-month net interest income", "−8% of baseline NII · −VND 3.92tn", "−10% · −VND 4.90tn"],
      ["12-month cumulative repricing gap", "—", "±VND 210tn · ±15% of rate-sensitive assets"]
    ].forEach(r => {
      const tr = el("tr");
      r.forEach(c => tr.append(el("td", "", c)));
      limTable.append(tr);
    });
    limWrap.append(limTable);
    content.append(limWrap);
  }

  tool("scroll", "Review completed licensing checklist", () => { phase = "ready"; openApp("license"); });
  tool("update", "Show IRRBB early warning and hard limits", () => {
    bState.showLimits = !bState.showLimits;
    save("Bank details");
    sound("pop");
    bankDetails();
    if (bState.showLimits) {
      $("bankLimitsSection")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

function render() {
  switch (app) {
    case "license": licensing(); break;
    case "Bank details": bankDetails(); break;
    case "People": people(); break;
    case "Documents": documents(); break;
    case "Data": dataApp(); break;
    case "Workflow": workflow(); break;
    case "Calendar": calendar(); break;
    case "Zalo": zalo(); break;
    case "Inspection": inspection(); break;
    case "Stress test": stress(); break;
    case "Day 30": audit(); break;
  }
}

// Every page load starts at Welcome. Saved activities resume when opened.
welcome();