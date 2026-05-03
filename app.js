bySubject.innerHTML = Object.entries(stats)
  .map(([s, v]) => {
    return `<li>${s}: ${Math.round((v.c / v.a) * 100)}% accuracy (${v.c}/${v.a})</li>`;
  })
  .join("");

const avgDiff = h.reduce((sum, x) => sum + x.difficulty, 0) / h.length;
diff.textContent = `Average difficulty reached: ${avgDiff.toFixed(2)} (1 = easy, 3 = hard).`;


// Start adaptive quiz
document.getElementById("start-quiz").addEventListener("click", () => {
  const subject = document.getElementById("quiz-subject").value;
  const count = Number(document.getElementById("quiz-count").value);
  Object.assign(state.quiz, {
    mode: "adaptive",
    subject,
    difficulty: 1,
    index: 0,
    total: count,
    score: 0,
    correct: 0,
    attempted: 0,
    streak: 0
  });
  document.getElementById("quiz-feedback").textContent = "";
  nextAdaptiveQuestion();
});

function nextAdaptiveQuestion() {
  const container = document.getElementById("quiz-container");
  const timerEl = document.getElementById("quiz-timer");

  if (state.quiz.index >= state.quiz.total) {
    stopTimer();
    container.innerHTML = `<p>Quiz complete! Final score: ${state.quiz.score}</p>`;
    document.getElementById("quiz-feedback").textContent = "";
    return;
  }

  const q = pickQuestion(state.quiz.subject, state.quiz.difficulty);
  state.quiz.currentQuestion = q;
  state.quiz.index++;
  updateQuizStatus();

  renderQuestion(container, q, (chosenIndex, btn, panel) => {
    handleAnswer("quiz", chosenIndex, btn, panel);
  });

  startTimer(timerEl, () => handleTimeout("quiz"));
}

function handleAnswer(mode, chosenIndex, btn, panel) {
  const q = state.quiz.currentQuestion;
  stopTimer();

  const correctIndex = q.answer - 1;
  const correct = chosenIndex === correctIndex;

  panel.querySelectorAll(".option-btn").forEach((b, i) => {
    b.disabled = true;
    if (i === correctIndex) b.classList.add("correct");
    if (i === chosenIndex && !correct) b.classList.add("incorrect");
  });

  const feedbackEl = document.getElementById(mode === "quiz" ? "quiz-feedback" : "mock-feedback");
  feedbackEl.textContent = correct ? "Correct!" : "Incorrect.";
  feedbackEl.className = "feedback " + (correct ? "correct" : "incorrect");

  state.quiz.attempted++;
  if (correct) {
    state.quiz.correct++;
    state.quiz.score++;
    state.quiz.streak++;
  } else {
    state.quiz.streak = 0;
  }

  recordHistory({
    question: q,
    chosen: chosenIndex,
    correctIndex,
    correct,
    subject: state.quiz.subject || "mixed",
    difficulty: state.quiz.difficulty
  });

  adjustDifficulty(correct);
  updateQuizStatus();

  setTimeout(() => {
    if (mode === "quiz") nextAdaptiveQuestion();
    else nextMockQuestion();
  }, 800);
}

function handleTimeout(mode) {
  const q = state.quiz.currentQuestion;
  const panel = document.getElementById(mode === "quiz" ? "quiz-container" : "mock-container");
  const correctIndex = q.answer - 1;

  panel.querySelectorAll(".option-btn").forEach((b, i) => {
    b.disabled = true;
    if (i === correctIndex) b.classList.add("correct");
  });

  const feedbackEl = document.getElementById(mode === "quiz" ? "quiz-feedback" : "mock-feedback");
  feedbackEl.textContent = "Time up.";
  feedbackEl.className = "feedback incorrect";

  state.quiz.attempted++;
  state.quiz.streak = 0;

  recordHistory({
    question: q,
    chosen: -1,
    correctIndex,
    correct: false,
    subject: state.quiz.subject || "mixed",
    difficulty: state.quiz.difficulty
  });

  adjustDifficulty(false);
  updateQuizStatus();

  setTimeout(() => {
    if (mode === "quiz") nextAdaptiveQuestion();
    else nextMockQuestion();
  }, 800);
}

// Practice mode
document.getElementById("start-practice").addEventListener("click", () => {
  const subject = document.getElementById("practice-subject").value;
  const difficulty = Number(document.getElementById("practice-difficulty").value);
  const container = document.getElementById("practice-container");
  const q = pickQuestion(subject, difficulty);

  renderQuestion(container, q, (chosenIndex, btn, panel) => {
    const correctIndex = q.answer - 1;
    const correct = chosenIndex === correctIndex;
    panel.querySelectorAll(".option-btn").forEach((b, i) => {
      b.disabled = true;
      if (i === correctIndex) b.classList.add("correct");
      if (i === chosenIndex && !correct) b.classList.add("incorrect");
    });
    recordHistory({ question: q, chosen: chosenIndex, correctIndex, correct, subject, difficulty });
  });
});

// Mock test
document.getElementById("start-mock").addEventListener("click", () => {
  Object.assign(state.quiz, {
    mode: "mock",
    subject: null,
    difficulty: 1,
    index: 0,
    total: 30,
    score: 0,
    correct: 0,
    attempted: 0,
    streak: 0
  });
  document.getElementById("mock-feedback").textContent = "";
  nextMockQuestion();
});

function nextMockQuestion() {
  const container = document.getElementById("mock-container");
  const timerEl = document.getElementById("quiz-timer");

  if (state.quiz.index >= state.quiz.total) {
    stopTimer();
    container.innerHTML = `<p>Mock test complete! Final score: ${state.quiz.score}</p>`;
    document.getElementById("mock-feedback").textContent = "";
    return;
  }

  const subjects = Object.keys(state.questions);
  const subject = subjects[Math.floor(Math.random() * subjects.length)];
  state.quiz.subject = subject;

  const q = pickQuestion(subject, state.quiz.difficulty);
  state.quiz.currentQuestion = q;
  state.quiz.index++;
  updateQuizStatus();

  renderQuestion(container, q, (chosenIndex, btn, panel) => {
    handleAnswer("mock", chosenIndex, btn, panel);
  });

  startTimer(timerEl, () => handleTimeout("mock"));
}

// Tutor dashboard
document.getElementById("tutor-assign").addEventListener("click", () => {
  const name = document.getElementById("tutor-student").value.trim();
  const subject = document.getElementById("tutor-subject").value;
  const count = Number(document.getElementById("tutor-count").value);
  if (!name) return;

  const container = document.getElementById("tutor-assignments");
  const item = document.createElement("div");
  item.className = "review-item";
  item.innerHTML = `<strong>${name}</strong><p>${count} questions in ${subject}</p>`;
  if (container.querySelector("p")) container.innerHTML = "";
  container.appendChild(item);
});
