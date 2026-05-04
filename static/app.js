// app.js
// Entrance Exam Practice PWA
// Friendly 50-question quiz for 10-year-olds.

// --------------------
// VIEW SWITCHING (Dashboard / Quiz)
// --------------------

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

// --------------------
// QUIZ CONFIG
// --------------------

// Subject order: 15 maths, 15 english, 10 verbal, 10 non-verbal
const SUBJECT_SEQUENCE = [
  ...Array(15).fill("maths"),
  ...Array(15).fill("english"),
  ...Array(10).fill("verbal_reasoning"),
  ...Array(10).fill("non_verbal_reasoning")
];

const MAX_QUESTIONS = SUBJECT_SEQUENCE.length; // 50

// --------------------
// QUIZ STATE
// --------------------

// Questions come from static/questions.js
const questions = window.QUESTION_BANK || [];

let currentQuestionIndex = null; // index in questions[]
let questionsAsked = 0;
let totalAnswered = 0;
let totalCorrect = 0;
let currentStudent = "";

// DOM references
const qText = document.getElementById("quiz-question");
const qOptions = document.getElementById("quiz-options");
const qFeedback = document.getElementById("quiz-feedback");
const nextBtn = document.getElementById("next-question");
const overallScore = document.getElementById("overall-score");
const overallQuestions = document.getElementById("overall-questions");

const nameInput = document.getElementById("student-name");
const startBtn = document.getElementById("start-quiz");

// --------------------
// TIMER STATE & FUNCTIONS
// --------------------

let timerId = null;
let timeLeft = 30;

function updateTimerDisplay() {
  const timerEl = document.getElementById("quiz-timer");
  if (timerEl) {
    timerEl.textContent = timeLeft;
  }
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = 30;
  updateTimerDisplay();

  timerId = setInterval(() => {
    timeLeft -= 1;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleTimeOut();
    }
  }, 1000);
}

function handleTimeOut() {
  if (qFeedback) {
    qFeedback.textContent = "⏰ Time's up! Click Next Question.";
  }
  const optionButtons = document.querySelectorAll("#quiz-options .option-btn");
  optionButtons.forEach(btn => (btn.disabled = true));

  totalAnswered += 1;
  updateDashboard();
}

// --------------------
// HELPER: pick question for current subject
// --------------------

function pickQuestionForCurrentSubject() {
  if (!questions.length) return null;

  const subject = SUBJECT_SEQUENCE[questionsAsked]; // which subject we need now

  // Filter questions matching this subject
  const pool = questions.filter(q => q.subject === subject);

  if (!pool.length) {
    // Fallback: if no questions for this subject, use all questions
    return questions[Math.floor(Math.random() * questions.length)];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// --------------------
// RENDER QUESTION
// --------------------

function showQuestion() {
  // If we've already asked 50, end test
  if (questionsAsked >= MAX_QUESTIONS) {
    endTest();
    return;
  }

  if (!questions.length) {
    if (qText) qText.textContent = "No questions available yet.";
    if (qOptions) qOptions.innerHTML = "";
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  const chosen = pickQuestionForCurrentSubject();
  if (!chosen) {
    if (qText) qText.textContent = "No questions available yet.";
    return;
  }

  // Remember which question this is (index in full array)
  currentQuestionIndex = questions.indexOf(chosen);

  const q = chosen;

  // Friendly prompt
  if (qText) qText.textContent = q.text;

  // Clear old options and feedback
  if (qOptions) qOptions.innerHTML = "";
  if (qFeedback) qFeedback.textContent = "";

  // Make fun, clickable option buttons
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option-btn";
    btn.addEventListener("click", () => handleAnswer(idx));
    qOptions.appendChild(btn);
  });

  // Start timer for this question
  startTimer();

  // Count this question as asked
  questionsAsked += 1;
}

// --------------------
// HANDLE ANSWERS
// --------------------

function handleAnswer(chosenIndex) {
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  if (!q) return;

  const buttons = qOptions.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    if (i === q.correctIndex) btn.classList.add("correct");
    if (i === chosenIndex && i !== q.correctIndex) btn.classList.add("wrong");
    btn.disabled = true;
  });

  const isCorrect = chosenIndex === q.correctIndex;
  totalAnswered += 1;
  if (isCorrect) {
    totalCorrect += 1;
    if (qFeedback) qFeedback.textContent = "🎉 Brilliant! That's correct!";
  } else {
    if (qFeedback) qFeedback.textContent = "Almost there! Try the next one 💪";
  }

  updateDashboard();

  // If that was the last question, end the test right away
  if (questionsAsked >= MAX_QUESTIONS) {
    endTest();
  }
}

// --------------------
// DASHBOARD
// --------------------

function updateDashboard() {
  const pct = Math.round((totalCorrect / totalAnswered) * 100);
  if (overallScore) overallScore.textContent = `${isNaN(pct) ? 0 : pct}%`;
  if (overallQuestions) overallQuestions.textContent = totalAnswered.toString();
}

// --------------------
// END OF TEST
// --------------------

function endTest() {
  clearInterval(timerId);

  const pct = totalAnswered
    ? Math.round((totalCorrect / totalAnswered) * 100)
    : 0;

  alert(
    `🏁 End of test, ${currentStudent || "superstar"}!\n\n` +
      `You scored ${totalCorrect} out of ${totalAnswered}.\n` +
      `That's ${pct}%. Well done!`
  );

  if (nextBtn) nextBtn.disabled = true;
}

// --------------------
// BUTTON HANDLERS
// --------------------

// Start Quiz: ask for a friendly name first
if (startBtn) {
  startBtn.addEventListener("click", () => {
    const name = nameInput ? nameInput.value.trim() : "";
    if (!name) {
      alert("Please type your name so we know who the quiz champion is!");
      return;
    }
    currentStudent = name;

    // Reset everything for a fresh 50-question test
    questionsAsked = 0;
    totalAnswered = 0;
    totalCorrect = 0;
    currentQuestionIndex = null;
    if (overallScore) overallScore.textContent = "0%";
    if (overallQuestions) overallQuestions.textContent = "0";
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.style.display = "inline-block";
    }

    showQuestion();
  });
}

// Next Question: move to the next one
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    showQuestion();
  });
}

// --------------------
// PWA: REGISTER SERVICE WORKER (OPTIONAL)
// --------------------

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("static/service_worker.js")
      .catch(err => {
        console.warn("Service worker registration failed:", err);
      });
  });
}