// ==============================
// QUIZ FORMAT SPEC
// ==============================
// Format yang bisa kamu ganti cepat. Struktur:
// {
//   meta: { totalQuestions: number },
//   grammar: { questions: Array<Question> },
//   reading: {
//     passage: string,    // boleh HTML sederhana untuk paragraf
//     questions: Array<Question>
//   }
// }
//
// Question = {
//   q: "text soal",
//   options: ["A","B","C","D"], // urutan pilihan
//   correct: 0,                  // indeks jawaban benar, berbasis 0
//   explain: "alasan dan ringkasan konsep"
// }
//
// Cukup edit objek QUIZ_DATA di bawah untuk mengganti soal dan pembahasan.
// ==============================

const QUIZ_DATA = {
  meta: { totalQuestions: 15 },
  grammar: {
    questions: [
      {
        q: "Only after the lights went out ______ the key on the floor.",
        options: ["she noticed", "did she notice", "she had noticed", "has she noticed"],
        correct: 1,
        explain: "Inversion after negative/limiting adverbials: 'Only after' triggers auxiliary + subject + base verb, hence 'did she notice'."
      },
      {
        q: "Had he known the traffic would be this bad, he ______ earlier.",
        options: ["would leave", "left", "would have left", "had left"],
        correct: 2,
        explain: "Conditional Type 3 in inverted form (no 'if'): 'Had + subject + past participle, ... would have + V3'. Type 3 is past unreal."
      },
      {
        q: "Neither the manager nor the assistants ______ available at the moment.",
        options: ["is", "are", "has", "have"],
        correct: 1,
        explain: "With 'neither ... nor ...' agreement follows the nearest subject 'assistants' (plural) so 'are' is used."
      },
      {
        q: "The proposal, along with several attachments, ______ sent yesterday.",
        options: ["is", "are", "was", "were"],
        correct: 2,
        explain: "Head subject is 'proposal' (singular). Phrases like 'along with' do not change agreement, use 'was'."
      },
      {
        q: "By the time the conference starts next week, we ______ the final report.",
        options: ["will finish", "will have finished", "are finishing", "have finished"],
        correct: 1,
        explain: "Future perfect for actions completed before a future point: 'will have finished'."
      },
      {
        q: "Not until last year ______ to expand to overseas markets.",
        options: ["the company decided", "did the company decide", "has the company decided", "the company had decided"],
        correct: 1,
        explain: "Fronted negative adverbial 'Not until' requires inversion: auxiliary + subject + base verb."
      },
      {
        q: "The committee recommends that each member ______ the code of conduct carefully.",
        options: ["reads", "read", "to read", "reading"],
        correct: 1,
        explain: "Mandative subjunctive after verbs like recommend, suggest, insist: base form for all subjects, so 'read'."
      },
      {
        q: "If she ______ more patient, she might solve the puzzle.",
        options: ["were", "was", "is", "has been"],
        correct: 0,
        explain: "Conditional Type 2 for present unreal uses past form. 'Were' is preferred with all subjects in formal English."
      },
      {
        q: "Seldom ______ such a clear example of market failure.",
        options: ["we see", "do we see", "we have seen", "are we seeing"],
        correct: 1,
        explain: "'Seldom' at the beginning triggers inversion: auxiliary 'do' + subject + base verb."
      },
      {
        q: "Having ______ the dataset twice, the team proceeded to modeling.",
        options: ["cleaned", "cleaning", "to clean", "clean"],
        correct: 0,
        explain: "Perfect participle clause shows prior completion: 'Having cleaned ... then proceeded ...'."
      }
    ]
  },
  reading: {
    passage: `
      <p class="passage">
        Although battery technology has improved rapidly in the past decade, charging time remains a critical
        bottleneck for mass adoption of electric vehicles. Researchers are exploring new electrode materials and
        electrolytes that allow faster ion transport without compromising safety. However, scaling laboratory
        breakthroughs to commercial production often reveals trade-offs, such as increased cost or reduced cycle life.
      </p>
      <p class="passage">
        One promising avenue is solid-state batteries, which replace liquid electrolytes with solid materials.
        These designs can potentially increase energy density and reduce fire risk. Yet, challenges persist, including
        maintaining stable interfaces between electrodes and electrolytes during repeated charging cycles. Until those
        challenges are resolved, manufacturers are likely to combine incremental chemistry gains with smarter thermal
        management and charging algorithms to deliver practical performance improvements.
      </p>
    `,
    questions: [
      {
        q: "What is identified as a major barrier to widespread EV adoption?",
        options: ["High vehicle weight", "Charging time", "Limited color options", "Excess battery warranties"],
        correct: 1,
        explain: "The passage states that charging time remains a critical bottleneck to mass adoption."
      },
      {
        q: "Why do some lab breakthroughs fail at commercial scale?",
        options: [
          "They always require rare earth metals",
          "They violate environmental regulations",
          "Trade-offs appear, such as higher costs or lower cycle life",
          "They cannot be patented"
        ],
        correct: 2,
        explain: "Scaling to production reveals trade-offs like cost increase or reduced cycle life."
      },
      {
        q: "What potential advantage do solid-state batteries offer?",
        options: [
          "Guaranteed zero maintenance",
          "Higher energy density and lower fire risk",
          "Infinite cycle life",
          "Instant charging to 100 percent"
        ],
        correct: 1,
        explain: "Solid-state designs may increase energy density and reduce fire risk according to the passage."
      },
      {
        q: "What challenge must be addressed for solid-state batteries to succeed?",
        options: [
          "Reducing the number of electrodes to one",
          "Stabilizing interfaces during repeated charging cycles",
          "Eliminating electrolytes entirely",
          "Using only aluminum conductors"
        ],
        correct: 1,
        explain: "Maintaining stable interfaces between electrodes and electrolytes during cycling is highlighted as a key challenge."
      },
      {
        q: "What near-term strategy do manufacturers likely adopt?",
        options: [
          "Abandoning EVs in favor of hydrogen only",
          "Waiting for a single dramatic breakthrough",
          "Combining modest chemistry gains with smarter thermal control and charging algorithms",
          "Using lower-capacity batteries to reduce risks"
        ],
        correct: 2,
        explain: "Until major challenges are solved, incremental chemistry improvements plus control algorithms are expected."
      }
    ]
  }
};

// Derive flattened questions array
const QUESTIONS = [
  ...QUIZ_DATA.grammar.questions,
  ...QUIZ_DATA.reading.questions
];

// Key
const ANSWER_KEY = QUESTIONS.map(q => q.correct);

// ==============================
// UI Elements
// ==============================
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

const totalQuestions = QUESTIONS.length;
totalCountEl.textContent = String(totalQuestions);
document.getElementById("total-questions").textContent = String(totalQuestions);

let startTime = Date.now();

// ==============================
// Render
// ==============================
function renderQuestions() {
  questionsBox.innerHTML = "";

  // Render grammar first
  QUIZ_DATA.grammar.questions.forEach((item, idx) => {
    const card = renderQuestionCard(item, idx);
    questionsBox.appendChild(card);
  });

  // Inject reading passage card
  const passageCard = document.createElement("div");
  passageCard.className = "q-card";
  passageCard.innerHTML = `<h3 class="q-title"><span class="q-index">Reading Passage</span></h3>${QUIZ_DATA.reading.passage}`;
  questionsBox.appendChild(passageCard);

  // Render reading questions with continued numbering
  const startIdx = QUIZ_DATA.grammar.questions.length;
  QUIZ_DATA.reading.questions.forEach((item, i) => {
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

  const expl = document.createElement("div");
  expl.className = "ex-inline hidden";
  expl.id = `explain-q${idx}`;
  card.appendChild(expl);

  return card;
}

function handleProgress() {
  const answered = getAnswers().filter(v => v !== null).length;
  answeredCountEl.textContent = String(answered);
  const percent = Math.round((answered / totalQuestions) * 100);
  progressBar.style.width = `${percent}%`;
}

function getAnswers() {
  return QUESTIONS.map((_, idx) => {
    const selected = form.querySelector(`input[name="q${idx}"]:checked`);
    return selected ? Number(selected.value) : null;
  });
}

// ==============================
// Results + Explanations
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

  // Score
  let correctCount = 0;
  answers.forEach((a, i) => { if (a === ANSWER_KEY[i]) correctCount++; });

  // Time
  const timeMs = Date.now() - startTime;

  // Score ring
  scoreValue.textContent = String(correctCount);
  scoreTotal.textContent = String(totalQuestions);
  const percent = Math.round((correctCount / totalQuestions) * 100);
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
  const btn = document.getElementById("btn-submit");
  const original = btn.textContent;
  btn.textContent = text;
  btn.style.filter = "brightness(1.25)";
  setTimeout(() => { btn.textContent = original; btn.style.filter = ""; }, 1500);
}

function lockFormSelections(){
  const allInputs = form.querySelectorAll("input[type=radio]");
  allInputs.forEach(inp => inp.disabled = true);

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

  // Scroll ke atas dalam area scroll saja
  document.querySelector('.scroll-area').scrollTo({top:0, behavior:"smooth"});
}

// ==============================
// Events + init
// ==============================
document.getElementById("btn-submit").addEventListener("click", showResults);
document.getElementById("btn-reset").addEventListener("click", resetQuiz);
document.getElementById("btn-try-again").addEventListener("click", resetQuiz);

renderQuestions();

// Inject gradient for score ring
(function injectSvgDefs(){
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
})();
