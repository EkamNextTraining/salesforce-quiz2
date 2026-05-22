// =====================================================================
//  SF ADMIN TERMINAL QUIZ — Core Logic
//  ✏️  Replace SCRIPT_URL with your Google Apps Script Web App URL
// =====================================================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlx1-TMkL6Ntfl2ZDK9CwiHfcutEP3nByJ3KxEh9NbI1Sg_aGET2NE_tiKGq-DhDth/exec";

// ── State ──────────────────────────────────────────────────────────
let currentIdx   = 0;
let answers      = {}; // { questionIndex: answer }
let timerSecs    = 45 * 60;
let timerHandle  = null;
let candidateInfo = {};

// ── Start Quiz ─────────────────────────────────────────────────────
function startQuiz() {
  const name  = document.getElementById("inName").value.trim();
  const email = document.getElementById("inEmail").value.trim();
  const batch = document.getElementById("inBatch").value.trim();
  const role  = document.getElementById("inRole").value;

  const err = document.getElementById("errMsg");
  if (!name || !email || !batch || !role) {
    err.textContent = ">> ERROR: All fields are required before launching.";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.textContent = ">> ERROR: Invalid email format.";
    return;
  }
  err.textContent = "";

  candidateInfo = { name, email, batch, role, startTime: new Date().toISOString() };

  // Populate sidebar
  document.getElementById("sidebarName").textContent  = name;
  document.getElementById("sidebarBatch").textContent = batch;

  // Build question map
  buildQMap();

  showScreen("screen-quiz");
  renderQuestion(0);
  startTimer();
}

// ── Timer ──────────────────────────────────────────────────────────
function startTimer() {
  updateTimer();
  timerHandle = setInterval(() => {
    timerSecs--;
    updateTimer();
    if (timerSecs <= 0) { clearInterval(timerHandle); doSubmit(); }
    if (timerSecs <= 300) document.getElementById("sidebarTimer").classList.add("urgent");
  }, 1000);
}

function updateTimer() {
  const m = String(Math.floor(timerSecs / 60)).padStart(2, "0");
  const s = String(timerSecs % 60).padStart(2, "0");
  document.getElementById("sidebarTimer").textContent = `${m}:${s}`;
}

// ── Question Map ───────────────────────────────────────────────────
function buildQMap() {
  const map = document.getElementById("qMap");
  map.innerHTML = "";
  QUESTIONS.forEach((q, i) => {
    const d = document.createElement("div");
    d.className = "q-dot";
    d.textContent = String(i + 1).padStart(2, "0");
    d.id = `qdot-${i}`;
    d.onclick = () => goTo(i);
    map.appendChild(d);
  });
}

function updateQMap() {
  QUESTIONS.forEach((q, i) => {
    const d = document.getElementById(`qdot-${i}`);
    if (!d) return;
    d.className = "q-dot" +
      (i === currentIdx ? " current" :
       answers[i] !== undefined && answers[i] !== "" ? " answered" : "");
  });
}

// ── Navigate ───────────────────────────────────────────────────────
function goTo(idx) {
  if (idx < 0 || idx >= QUESTIONS.length) return;
  saveCurrentAnswer();
  currentIdx = idx;
  renderQuestion(idx);
}

function renderQuestion(idx) {
  const q    = QUESTIONS[idx];
  const card = document.getElementById("qcard");

  card.classList.remove("visible");
  setTimeout(() => {
    // Type badge
    const badge = document.getElementById("qTypeBadge");
    badge.textContent = q.type === "mcq" ? "MCQ" : q.type === "coding" ? "LIVE CODING" : "SCENARIO";
    badge.className = "q-type-badge " +
      (q.type === "mcq" ? "badge-mcq" : q.type === "coding" ? "badge-coding" : "badge-scenario");

    document.getElementById("qNum").textContent    = `Q${String(idx+1).padStart(2,"0")} / ${QUESTIONS.length}`;
    document.getElementById("qCatTag").textContent = q.category;

    // Scenario box
    const sBox  = document.getElementById("scenarioBox");
    const sText = document.getElementById("scenarioText");
    const sLabel = document.getElementById("scenarioLabel");
    sText.textContent = q.scenario;
    sBox.className = "scenario-box" + (q.type === "coding" ? " coding" : "");
    sLabel.textContent = q.type === "coding" ? "REQUIREMENT" : "SCENARIO";
    if (q.type === "coding") sBox.querySelector(".scenario-icon").textContent = "💻";
    else sBox.querySelector(".scenario-icon").textContent = "🏢";

    // Question text
    document.getElementById("qText").textContent = q.question;

    // Answer area
    const area = document.getElementById("answerArea");
    area.innerHTML = "";

    if (q.type === "mcq") {
      area.innerHTML = buildMCQ(q, idx);
    } else if (q.type === "coding") {
      area.innerHTML = buildCodeEditor(q, idx);
    } else {
      area.innerHTML = buildDescriptive(q, idx);
    }

    // Nav state
    document.getElementById("btnPrev").disabled = idx === 0;
    document.getElementById("btnNext").disabled = idx === QUESTIONS.length - 1;
    document.getElementById("qProgressText").textContent =
      `${Object.keys(answers).filter(k => answers[k] !== "").length} of ${QUESTIONS.length} answered`;

    updateQMap();
    card.classList.add("visible");
  }, 200);
}

// ── Build Answer Areas ─────────────────────────────────────────────
function buildMCQ(q, idx) {
  const saved = answers[idx];
  return `<div class="mcq-options">
    ${q.options.map((opt, i) => `
      <button class="mcq-opt${saved === i ? " selected" : ""}" onclick="selectMCQ(${idx},${i})">
        <span class="opt-key">[${["A","B","C","D"][i]}]</span>
        <span>${opt}</span>
      </button>`).join("")}
  </div>`;
}

function buildDescriptive(q, idx) {
  const saved = answers[idx] || "";
  return `
    <textarea class="desc-area" id="desc-${idx}" placeholder="${q.placeholder}"
      oninput="autoSaveDesc(${idx})">${saved}</textarea>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <p class="desc-hint">💡 Write a detailed step-by-step answer. There's no word limit — be thorough.</p>
      <span class="char-count" id="cc-${idx}">${saved.length} chars</span>
    </div>`;
}

function buildCodeEditor(q, idx) {
  const saved = answers[idx] || "";
  return `
    <div class="code-editor-wrap">
      <div class="code-editor-bar">
        <span>solution.${q.language === "SOQL" ? "soql" : q.language.startsWith("LWC") ? "js" : "apex"}</span>
        <span class="lang-tag">${q.language}</span>
      </div>
      <textarea class="code-area" id="code-${idx}" placeholder="${q.placeholder}"
        oninput="autoSaveCode(${idx})" spellcheck="false">${saved}</textarea>
    </div>
    <p class="code-hint">💡 ${q.codeHint}</p>`;
}

// ── Selection / Auto-save ──────────────────────────────────────────
function selectMCQ(qIdx, optIdx) {
  answers[qIdx] = optIdx;
  document.querySelectorAll(".mcq-opt").forEach((b, i) => {
    b.classList.toggle("selected", i === optIdx);
  });
  updateQMap();
  document.getElementById("qProgressText").textContent =
    `${Object.keys(answers).filter(k => answers[k] !== "").length} of ${QUESTIONS.length} answered`;
}

function autoSaveDesc(qIdx) {
  const ta = document.getElementById(`desc-${qIdx}`);
  if (!ta) return;
  answers[qIdx] = ta.value;
  const cc = document.getElementById(`cc-${qIdx}`);
  if (cc) cc.textContent = ta.value.length + " chars";
  updateQMap();
}

function autoSaveCode(qIdx) {
  const ta = document.getElementById(`code-${qIdx}`);
  if (!ta) return;
  answers[qIdx] = ta.value;
  updateQMap();
}

function saveCurrentAnswer() {
  const q = QUESTIONS[currentIdx];
  if (q.type === "scenario") autoSaveDesc(currentIdx);
  if (q.type === "coding")   autoSaveCode(currentIdx);
}

// ── Final Submit ───────────────────────────────────────────────────
function finalSubmit() {
  const answered = Object.keys(answers).filter(k => answers[k] !== "" && answers[k] !== undefined).length;
  const unanswered = QUESTIONS.length - answered;

  if (unanswered > 0) {
    const go = confirm(`You have ${unanswered} unanswered question(s).\n\nSubmit anyway?`);
    if (!go) return;
  }
  saveCurrentAnswer();
  doSubmit();
}

function doSubmit() {
  clearInterval(timerHandle);
  const timeTaken = 45 * 60 - timerSecs;
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;
  const timeStr = `${mins}m ${secs}s`;

  // MCQ score
  let mcqScore = 0;
  QUESTIONS.forEach((q, i) => {
    if (q.type === "mcq" && answers[i] === q.answer) mcqScore++;
  });

  showResultScreen(mcqScore, timeStr);
  sendToSheets(mcqScore, timeStr);
}

// ── Result Screen ──────────────────────────────────────────────────
function showResultScreen(mcqScore, timeStr) {
  showScreen("screen-result");

  document.getElementById("rName").textContent  = candidateInfo.name;
  document.getElementById("rBatch").textContent = candidateInfo.batch;
  document.getElementById("rMcq").textContent   = `${mcqScore} / 5`;
  document.getElementById("rTime").textContent  = timeStr;

  const pct = Math.round((mcqScore / 5) * 100);
  let status;
  if (pct === 100)     status = "PERFECT — 5/5 MCQ ✓";
  else if (pct >= 60)  status = "PASSED MCQ ✓";
  else                 status = "MCQ NEEDS REVIEW ✗";

  document.getElementById("rStatus").textContent = status;
  document.getElementById("rStatus").style.color =
    pct >= 60 ? "var(--green)" : "var(--red)";

  const asciiArts = {
    pass: `
  ██████╗  █████╗ ███████╗███████╗██╗
  ██╔══██╗██╔══██╗██╔════╝██╔════╝██║
  ██████╔╝███████║███████╗███████╗██║
  ██╔═══╝ ██╔══██║╚════██║╚════██║╚═╝
  ██║     ██║  ██║███████║███████║██╗
  ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝`,
    fail: `
  ██████╗ ███████╗██╗   ██╗██╗███████╗██╗    ██╗
  ██╔══██╗██╔════╝██║   ██║██║██╔════╝██║    ██║
  ██████╔╝█████╗  ██║   ██║██║█████╗  ██║ █╗ ██║
  ██╔══██╗██╔══╝  ╚██╗ ██╔╝██║██╔══╝  ██║███╗██║
  ██║  ██║███████╗ ╚████╔╝ ██║███████╗╚███╔███╔╝
  ╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝╚══════╝ ╚══╝╚══╝`
  };

  document.getElementById("resultAscii").textContent = pct >= 60 ? asciiArts.pass : asciiArts.fail;
  document.getElementById("resultAscii").style.color = pct >= 60 ? "var(--green)" : "var(--red)";
}

// ── Send to Google Sheets ──────────────────────────────────────────
async function sendToSheets(mcqScore, timeStr) {
  const line2 = document.getElementById("submitLine2");
  const line3 = document.getElementById("submitLine3");

  // Build question answer columns
  const qData = {};
  QUESTIONS.forEach((q, i) => {
    const label = `Q${String(i+1).padStart(2,"0")}_${q.type.toUpperCase()}`;
    if (q.type === "mcq") {
      const sel = answers[i] !== undefined ? q.options[answers[i]] : "Not answered";
      const correct = q.options[q.answer];
      qData[label + "_Answer"]  = sel;
      qData[label + "_Correct"] = correct;
      qData[label + "_Result"]  = answers[i] === q.answer ? "✓" : "✗";
    } else {
      qData[label + "_Answer"]   = answers[i] || "(blank)";
      qData[label + "_Category"] = q.category;
    }
  });

  const payload = {
    timestamp:   new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    name:        candidateInfo.name,
    email:       candidateInfo.email,
    batch:       candidateInfo.batch,
    role:        candidateInfo.role,
    mcq_score:   `${mcqScore} / 5`,
    time_taken:  timeStr,
    total_answered: Object.keys(answers).filter(k => answers[k] !== "" && answers[k] !== undefined).length,
    ...qData
  };

  if (SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
    line2.innerHTML = `Connecting to Google Sheets... <span class="ok">[DEMO MODE — URL not set]</span>`;
    line3.style.display = "block";
    line3.innerHTML = `<span class="ok">>> Set SCRIPT_URL in quiz.js to enable real submission.</span>`;
    return;
  }

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    line2.innerHTML = `Connecting to Google Sheets... <span class="ok">[OK]</span>`;
    line3.style.display = "block";
    line3.innerHTML = `<span class="ok">>> Results successfully written to Google Sheets.</span>`;
  } catch (err) {
    line2.innerHTML = `Connecting to Google Sheets... <span style="color:var(--red)">[FAILED]</span>`;
    line3.style.display = "block";
    line3.innerHTML = `<span style="color:var(--red)">>> Error: ${err.message}. Check SCRIPT_URL.</span>`;
  }
}

// ── Screen Switch ──────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

// ── Retry ──────────────────────────────────────────────────────────
function retryQuiz() {
  currentIdx    = 0;
  answers       = {};
  timerSecs     = 45 * 60;
  candidateInfo = {};
  clearInterval(timerHandle);
  document.getElementById("sidebarTimer").classList.remove("urgent");
  // Reset result lines
  document.getElementById("submitLine2").innerHTML = `Connecting to Google Sheets... <span class="spinner-txt">⠋</span>`;
  document.getElementById("submitLine3").style.display = "none";
  showScreen("screen-landing");
}
