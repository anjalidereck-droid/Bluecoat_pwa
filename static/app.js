// app.js
// Front-end logic for Entrance Exam Practice PWA.

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
// QUIZ STATE
// --------------------

// Questions come from static/questions.js
const questions = window.QUESTION_BANK || [];

let currentIndex = 0;
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

const startBtn = document.getElementById("start-quiz");
const nameInput = document.getElementById("student-name");

// --------------------
// TIMER STATE & FUNCTIONS
// --------------------

let timerId = null;
let timeLeft = 30;

// Update the number shown on screen
function updateTimerDisplay() {
  const timerEl = document.getElementById("quiz-timer");
  if (timerEl) {
    timerEl.textContent = timeLeft;
  }
}

// Start a 30-second countdown for the current question
function startTimer() {
  clearInterval(timerId);        // stop any old timer
  timeLeft = 30;                 // reset
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

// What happens when time runs out
function handleTimeOut() {
  if (qFeedback) {
    qFeedback.textContent = "Time's up! Click Next Question.";
  }
  // Disable all option buttons
  const optionButtons = document.querySelectorAll("#quiz-options .option-btn");
  optionButtons.forEach(btn => (btn.disabled = true));
}

// --------------------
// RENDER QUESTION
// --------------------

function showQuestion() {
  if (!questions.length) {
    if (qText) qText.textContent = "No questions available yet.";
    if (qOptions) qOptions.innerHTML = "";
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  // Wrap around if we go past the end
  if (currentIndex >= questions.length) {
    currentIndex = 0;
  }

  const q = questions[currentIndex];

  // Display question text
  if (qText) qText.textContent = q.text;

  // Clear old options and feedback
  if (qOptions) qOptions.innerHTML = "";
  if (qFeedback) qFeedback.textContent = "";

  // Create buttons for each option
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option-btn";
    btn.addEventListener("click", () => handleAnswer(idx));
    qOptions.appendChild(btn);
  });

  // Start the timer for this question
  startTimer();
}

// --------------------
// HANDLE ANSWERS
// --------------------

function handleAnswer(chosenIndex) {
  clearInterval(timerId); // stop timer when answered

  const q = questions[currentIndex];
  const buttons = qOptions.querySelectorAll(".option-btn");

  // Lock buttons and add styling
  buttons.forEach((btn, i) => {
    if (i === q.correctIndex) btn.classList.add("correct");
    if (i === chosenIndex && i !== q.correctIndex) btn.classList.add("wrong");
    btn.disabled = true;
  });

  const isCorrect = chosenIndex === q.correctIndex;
  totalAnswered += 1;
  if (isCorrect) {
    totalCorrect += 1;
    if (qFeedback) qFeedback.textContent = "Correct!";
  } else {
    if (qFeedback) qFeedback.textContent = "Not quite — keep going!";
  }

  // Update dashboard
  const pct = Math.round((totalCorrect / totalAnswered) * 100);
  if (overallScore) overallScore.textContent = `${isNaN(pct) ? 0 : pct}%`;
  if (overallQuestions) overallQuestions.textContent = totalAnswered.toString();
}

// --------------------
// BUTTON HANDLERS
// --------------------

// Start Quiz: require a name first
if (startBtn) {
  startBtn.addEventListener("click", () => {
    const name = nameInput ? nameInput.value.trim() : "";
    if (!name) {
      alert("Please enter your name before starting the quiz.");
      return;
    }
    currentStudent = name;

    // Reset stats for this student
    currentIndex = 0;
    totalAnswered = 0;
    totalCorrect = 0;
    if (overallScore) overallScore.textContent = "0%";
    if (overallQuestions) overallQuestions.textContent = "0";

    showQuestion();
  });
}

// Next Question button
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    currentIndex += 1;
    showQuestion();
  });
}

// --------------------
// PWA: REGISTER SERVICE WORKER (OPTIONAL)
// --------------------

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("static/service_worker.js").catch(err => {
      console.warn("Service worker registration failed:", err);
    });
  });
}
