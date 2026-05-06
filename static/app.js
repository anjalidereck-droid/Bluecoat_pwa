// static/app.js
// 11+ Blue Coat practice quiz
// 15-second timer, simple adaptive difficulty, sends stats to Flask.

// ---------- VIEW SWITCHING ----------
const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const viewName = btn.dataset.view;
    views.forEach(v => v.classList.remove("active"));
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.add("active");
  });
});

// ---------- CONFIG ----------
const ALL_QUESTIONS = window.QUESTION_BANK || [];
const TIME_PER_QUESTION = 15; // seconds
const MAX_QUESTIONS = Math.min(20, ALL_QUESTIONS.length); // mini test

// ---------- ADAPTIVE SETUP ----------
let currentLevel = 2; // difficulty 1..5

function pickQuestionNearLevel(askedIds, level) {
  const unused = ALL_QUESTIONS.filter(q => !askedIds.has(q.id));
  if (!unused.length) return null;

  let pool = unused.filter(q => q.difficulty === level);
  if (!pool.length) {
    let diff = 1;
    while (!pool.length && diff <= 3) {
      pool = unused.filter(
        q =>
          q.difficulty === level - diff || q.difficulty === level + diff
      );
      diff += 1;
    }
  }
  if (!pool.length) pool = unused;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- STATE ----------
let studentName = "";
let askedIds = new Set();
let currentQuestion = null;
let currentIndex = 0;

let totalAnswered = 0;
let totalCorrect = 0;

let timerId = null;
let timeLeft = TIME_PER_QUESTION;
let questionStartTime = null;

// DOM
const nameInput = document.getElementById("student-name");
const startBtn = document.getElementById("start-quiz");
const qText = document.getElementById("quiz-question");
const qOptions = document.getElementById("quiz-options");
const qFeedback = document.getElementById("quiz-feedback");
const nextBtn = document.getElementById("next-question");
const timerEl = document.getElementById("quiz-timer");
const overallScore = document.getElementById("overall-score");
const overallQuestions = document.getElementById("overall-questions");

// ---------- OPTIONAL PROGRESS BAR (safe if missing) ----------
const progressText = document.getElementById("progress-text");
const progressBarInner = document.getElementById("progress-bar-inner");

function updateProgress() {
  if (!progressText || !progressBarInner) return;
  progressText.textContent = `Question ${Math.min(
    currentIndex + 1,
    MAX_QUESTIONS
  )} of ${MAX_QUESTIONS}`;
  const pct = (currentIndex / MAX_QUESTIONS) * 100;
  progressBarInner.style.width = `${pct}%`;
}

// ---------- HELPERS ----------
function updateDashboard() {
  const pct = totalAnswered
    ? Math.round((totalCorrect / totalAnswered) * 100)
    : 0;
  if (overallScore) overallScore.textContent = `${pct}%`;
  if (overallQuestions) overallQuestions.textContent = totalAnswered.toString();
}

function lockOptions() {
  const buttons = qOptions.querySelectorAll("button");
  buttons.forEach(b => (b.disabled = true));
}

function resetTimer() {
  clearInterval(timerId);
  timeLeft = TIME_PER_QUESTION;
  timerEl.textContent = timeLeft;

  questionStartTime = performance.now();

  timerId = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      timeoutQuestion();
    }
  }, 1000);
}

function calcTimeTaken() {
  if (questionStartTime == null) return TIME_PER_QUESTION;
  const ms = performance.now() - questionStartTime;
  return Math.round(ms / 100) / 10; // e.g. 7.3 s
}

// ---------- BACKEND API ----------
async function sendResultToServer(correct, question) {
  const payload = {
    question_id: question?.id ?? null,
    subject: question?.subject ?? null,
    difficulty: question?.difficulty ?? null,
    correct,
    time_taken: calcTimeTaken(),
    student_name: studentName || null
  };

  try {
    await fetch("/api/submit_result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn("Could not send result to server", err);
  }
}

// ---------- CORE FLOW ----------
function showQuestion() {
  if (currentIndex >= MAX_QUESTIONS) {
    endTest();
    return;
  }

  const nextQ = pickQuestionNearLevel(askedIds, currentLevel);
  if (!nextQ) {
    endTest();
    return;
  }

  currentQuestion = nextQ;
  askedIds.add(nextQ.id);
  currentIndex += 1;

  qFeedback.textContent = "";
  nextBtn.disabled = true;

  qText.textContent = `Q${currentIndex}. ${nextQ.text}`;

  qOptions.innerHTML = "";
  nextQ.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleAnswer(idx));
    qOptions.appendChild(btn);
  });

  updateProgress();
  resetTimer();
}

async function timeoutQuestion() {
  lockOptions();
  qFeedback.textContent =
    "⏰ Time's up! This question scores 0. The next one will be a bit easier.";

  totalAnswered += 1;
  updateDashboard();

  currentLevel = Math.max(1, currentLevel - 1);
  await sendResultToServer(false, currentQuestion);

  if (currentIndex >= MAX_QUESTIONS) {
    setTimeout(endTest, 800);
  } else {
    nextBtn.disabled = false;
  }
}

async function handleAnswer(chosenIndex) {
  clearInterval(timerId);
  if (!currentQuestion) return;

  const correct = chosenIndex === currentQuestion.correctIndex;

  const buttons = qOptions.querySelectorAll("button");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === currentQuestion.correctIndex) {
      btn.classList.add("correct");
    }
    if (idx === chosenIndex && !correct) {
      btn.classList.add("wrong");
    }
  });

  totalAnswered += 1;
  if (correct) {
    totalCorrect += 1;
    qFeedback.textContent =
      "🎉 Brilliant work! Get ready for a slightly trickier question.";
    currentLevel = Math.min(5, currentLevel + 1);
  } else {
    qFeedback.textContent =
      "Nice try – this one scores 0. The next one will be a bit easier.";
    currentLevel = Math.max(1, currentLevel - 1);
  }

  updateDashboard();
  await sendResultToServer(correct, currentQuestion);

  if (currentIndex >= MAX_QUESTIONS) {
    setTimeout(endTest, 800);
  } else {
    nextBtn.disabled = false;
  }
}

function endTest() {
  clearInterval(timerId);
  lockOptions();
  nextBtn.disabled = true;

  const pct = totalAnswered
    ? Math.round((totalCorrect / totalAnswered) * 100)
    : 0;

  alert(
    `🏁 Test finished, ${studentName || "superstar"}!\n\n` +
      `You answered ${totalCorrect} out of ${totalAnswered} questions correctly.\n` +
      `Score: ${pct}%\n\nAmazing effort – you are getting Blue Coat–ready!`
  );
}

// ---------- EVENT HANDLERS ----------
if (startBtn) {
  startBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert("Please type your name so the quiz can cheer you on!");
      return;
    }
    studentName = name;

    askedIds = new Set();
    currentIndex = 0;
    totalAnswered = 0;
    totalCorrect = 0;
    currentLevel = 2;
    updateDashboard();
    updateProgress();
    showQuestion();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    showQuestion();
  });
}