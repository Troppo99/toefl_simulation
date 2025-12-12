// ==============================
// Loader soal eksternal dari questions.json
// ==============================

let QUESTIONS = [];          // flat array gabungan grammar + reading
let ANSWER_KEY = [];         // array index jawaban benar
let startTime = Date.now();  // timer

// Elemen UI
const form = document.getElementById("quiz-form");
const questionsBox = document.getElementById("questions");
const totalCountEl = document.getElementById("total-count");
const answeredCountEl = document.getElementById("answered-count");
const progressBar = document.getElementById("progress-bar");
const results = document.getElementById("results");
const scoreValue = document.getElementById("score-value");
const scoreTotal = document.getElementById("score-total");
const scorePercent = document.getElementById("score-percent");
const elapsedTime = document.getElementById("elapsed-time");
const scoreCircle = document.getElementById("score-circle");
const loaderEl = document.getElementById("loader");
const loadErrEl = document.getElementById("load-error");
const btnSubmit = document.getElementById("btn-submit");
const btnReset = document.getElementById("btn-reset");
const btnTryAgain = document.getElementById("btn-try-again");

// Events
btnSubmit.addEventListener("click", showResults);
btnReset.addEventListener("click", resetQuiz);
btnTryAgain.addEventListener("click", resetQuiz);

// Start
fetchQuestions();

// ==============================
// Fetch dan render
// ==============================
async function fetchQuestions(){
  try{
    const res = await fetch("questions3.json", {cache:"no-store"});
    if(!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    // Validasi bentuk dasar
    if(!data || !data.grammar || !Array.isArray(data.grammar.questions) || !data.reading){
      throw new Error("Struktur JSON tidak valid");
    }

    // Flatten
    const g = data.grammar.questions;
    const r = data.reading.questions || [];
    QUESTIONS = [...g, ...r];
    ANSWER_KEY = QUESTIONS.map(q => q.correct);

    // Update total
    const totalQ = QUESTIONS.length;
    totalCountEl.textContent = String(totalQ);
    document.getElementById("total-questions").textContent = String(totalQ);
    scoreTotal.textContent = String(totalQ);

    // Render
    renderQuestions(data);

    // UI enable
    loaderEl.classList.add("hidden");
    btnSubmit.disabled = false;
    btnReset.disabled = false;
  }catch(err){
    console.error(err);
    loaderEl.classList.add("hidden");
    loadErrEl.classList.remove("hidden");
  }

  // Inject gradient untuk ring skor
  injectSvgDefs();
}

function renderQuestions(data){
  questionsBox.innerHTML = "";

  // Grammar
  data.grammar.questions.forEach((item, idx) => {
    const card = renderQuestionCard(item, idx);
    questionsBox.appendChild(card);
  });

  // Reading passage
  if (data.reading && data.reading.passage){
    const passageCard = document.createElement("div");
    passageCard.className = "q-card";
    passageCard.innerHTML = `<h3 class="q-title"><span class="q-index">Reading Passage</span></h3>${data.reading.passage}`;
    questionsBox.appendChild(passageCard);
  }

  // Reading questions
  const startIdx = data.grammar.questions.length;
  (data.reading.questions || []).forEach((item, i) => {
    const card = renderQuestionCard(item, startIdx + i);
    questionsBox.appendChild(card);
  });
}

function renderQuestionCard(item, idx){
  const card = document.createElement("div");
  card.className = "q-card";

  const title = document.createElement("h3");
  title.className = "q-title";
  title.innerHTML = `<span class="q-index">#${idx + 1}</span> ${item.q}`;
  card.appendChild(title);

  const optionsWrap = document.createElement("div");
  optionsWrap.className = "options";

  item.options.forEach((opt, oi) => {
    const id = `q${idx}_opt${oi}`;

    const label = document.createElement("label");
    label.className = "option";
    label.setAttribute("for", id);

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = `q${idx}`;
    radio.id = id;
    radio.value = String(oi);
    radio.addEventListener("change", handleProgress);

    const span = document.createElement("span");
    span.textContent = `${String.fromCharCode(65 + oi)}. ${opt}`;

    label.appendChild(radio);
    label.appendChild(span);
    optionsWrap.appendChild(label);
  });

  card.appendChild(optionsWrap);

  // Inline explanation container
  const expl = document.createElement("div");
  expl.className = "ex-inline hidden";
  expl.id = `explain-q${idx}`;
  card.appendChild(expl);

  return card;
}

// ==============================
// Progress dan jawaban
// ==============================
function handleProgress() {
  const answered = getAnswers().filter(v => v !== null).length;
  answeredCountEl.textContent = String(answered);
  const percent = Math.round((answered / QUESTIONS.length) * 100);
  progressBar.style.width = `${percent}%`;
}

function getAnswers() {
  return QUESTIONS.map((_, idx) => {
    const selected = form.querySelector(`input[name="q${idx}"]:checked`);
    return selected ? Number(selected.value) : null;
  });
}

// ==============================
// Hasil + Pembahasan inline
// ==============================
function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2,"0")}:${String(r).padStart(2,"0")}`;
}

function showResults() {
  const answers = getAnswers();
  const firstUnanswered = answers.findIndex(a => a === null);
  if (firstUnanswered !== -1) {
    const target = document.querySelector(`input[name="q${firstUnanswered}"]`);
    target?.scrollIntoView({behavior:"smooth", block:"center"});
    pulseAlert(`Soal #${firstUnanswered + 1} belum dijawab.`);
    return;
  }

  // Skor
  let correctCount = 0;
  answers.forEach((a, i) => { if (a === ANSWER_KEY[i]) correctCount++; });

  // Waktu
  const timeMs = Date.now() - startTime;

  // Score ring
  scoreValue.textContent = String(correctCount);
  scoreTotal.textContent = String(QUESTIONS.length);
  const percent = Math.round((correctCount / QUESTIONS.length) * 100);
  scorePercent.textContent = `${percent}%`;
  elapsedTime.textContent = formatTime(timeMs);
  scoreCircle.setAttribute("stroke-dasharray", `${percent}, 100`);

  // Lock and highlight
  lockFormSelections();

  // Inline explanations
  QUESTIONS.forEach((q, i) => {
    const wrap = document.getElementById(`explain-q${i}`);
    if (!wrap) return;
    const isCorrect = answers[i] === ANSWER_KEY[i];

    const yourAns = `${String.fromCharCode(65 + answers[i])}. ${q.options[answers[i]]}`;
    const keyAns  = `${String.fromCharCode(65 + ANSWER_KEY[i])}. ${q.options[ANSWER_KEY[i]]}`;

    wrap.innerHTML = `
      <h4>
        <span class="badge ${isCorrect ? "ok":"no"}">${isCorrect ? "Correct" : "Incorrect"}</span>
        <span style="margin-left:8px">Explanation</span>
      </h4>
      <p><strong>Your answer:</strong> ${yourAns}</p>
      <p><strong>Key:</strong> ${keyAns}</p>
      <p><strong>Why:</strong> ${q.explain}</p>
    `;
    wrap.classList.remove("hidden");
  });

  results.hidden = false;
  results.scrollIntoView({behavior:"smooth", block:"start"});
}

function pulseAlert(text){
  const original = btnSubmit.textContent;
  btnSubmit.textContent = text;
  btnSubmit.style.filter = "brightness(1.25)";
  setTimeout(() => { btnSubmit.textContent = original; btnSubmit.style.filter = ""; }, 1500);
}

function lockFormSelections(){
  form.querySelectorAll("input[type=radio]").forEach(inp => inp.disabled = true);

  QUESTIONS.forEach((q, i) => {
    q.options.forEach((_, oi) => {
      const label = form.querySelector(`label[for="q${i}_opt${oi}"]`);
      if (!label) return;
      if (oi === ANSWER_KEY[i]) label.classList.add("correct-label");
    });
    const chosen = Number((form.querySelector(`input[name="q${i}"]:checked`)||{}).value);
    if (!Number.isNaN(chosen) && chosen !== ANSWER_KEY[i]) {
      const wrongLabel = form.querySelector(`label[for="q${i}_opt${chosen}"]`);
      wrongLabel?.classList.add("incorrect-label");
    }
  });
}

function resetQuiz(){
  form.reset();
  form.querySelectorAll("input[type=radio]").forEach(inp => inp.disabled = false);
  form.querySelectorAll(".correct-label, .incorrect-label")
    .forEach(l => l.classList.remove("correct-label","incorrect-label"));

  QUESTIONS.forEach((_, i) => {
    const wrap = document.getElementById(`explain-q${i}`);
    if (wrap){ wrap.classList.add("hidden"); wrap.innerHTML = ""; }
  });

  results.hidden = true;
  answeredCountEl.textContent = "0";
  progressBar.style.width = "0%";
  startTime = Date.now();

  document.querySelector('.scroll-area').scrollTo({top:0, behavior:"smooth"});
}

// ==============================
// Util: inject SVG gradient
// ==============================
function injectSvgDefs(){
  const svg = document.querySelector(".circular-chart");
  if(!svg) return;
  const defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
  const lg = document.createElementNS("http://www.w3.org/2000/svg","linearGradient");
  lg.setAttribute("id","grad");
  lg.setAttribute("x1","0%");
  lg.setAttribute("x2","100%");
  lg.setAttribute("y1","0%");
  lg.setAttribute("y2","0%");
  const s1 = document.createElementNS("http://www.w3.org/2000/svg","stop");
  s1.setAttribute("offset","0%");
  s1.setAttribute("stop-color","#7c9dff");
  const s2 = document.createElementNS("http://www.w3.org/2000/svg","stop");
  s2.setAttribute("offset","100%");
  s2.setAttribute("stop-color","#6cf1c6");
  lg.appendChild(s1); lg.appendChild(s2); defs.appendChild(lg);
  svg.prepend(defs);
}
