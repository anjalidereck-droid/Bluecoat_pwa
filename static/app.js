// app.js
// Front-end logic for navigation, quiz flow, and sending results
// to the Flask backend example API.

const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const viewName = btn.dataset.view;
    views.forEach(v => v.classList.remove("active"));
    document.getElementById(`view-${viewName}`).classList.add("active");
  });
});

// Quiz state
const questions = window.QUESTION_BANK || [];
let currentIndex = 0;
let totalAnswered = 0;
let totalCorrect = 0;

// DOM references
const qText = document.getElementById("quiz-question");
const qOptions = document.getElementById("quiz-options");
const qFeedback = document.getElementById("quiz-feedback");
const nextBtn = document.getElementById("next-question");
const overallScore = document.getElementById("overall-score");
const overallQuestions = document.getElementById("overall-questions");

// Render a question on the page
function showQuestion() {
  if (!questions.length) {
    qText.textContent = "No questions available yet.";
    qOptions.innerHTML = "";
    nextBtn.disabled = true;
    return;
  }

  if (currentIndex >= questions.length) {
    currentIndex = 0; // loop round for now
  }

  const q = questions[currentIndex];
  qText.textContent = q.text;
  qOptions.innerHTML = "";
  qFeedback.textContent = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option-btn";
    btn.addEventListener("click", () => handleAnswer(idx, btn));
    qOptions.appendChild(btn);
  });
}

// Handle a student answer
function handleAnswer(chosenIndex, clickedButton) {
  const q = questions[currentIndex];
  const buttons = qOptions.querySelectorAll(".option-btn");

  // Lock all buttons and show correct/wrong styles
  buttons.forEach((b, i) => {
    if (i === q.correctIndex) b.classList.add("correct");
    if (i === chosenIndex && i !== q.correctIndex) b.classList.add("wrong");
    b.disabled = true;
  });

  const isCorrect = chosenIndex === q.correctIndex;
  totalAnswered += 1;
  if (isCorrect) {
    totalCorrect += 1;
    qFeedback.textContent = "Correct!";
  } else {
    qFeedback.textContent = "Not quite — keep going!";
  }

  // Update dashboard
  const pct = Math.round((totalCorrect / totalAnswered) * 100);
  overallScore.textContent = `${isNaN(pct) ? 0 : pct}%`;
  overallQuestions.textContent = totalAnswered.toString();

  // Optionally send the result to the Flask backend
  sendResultToBackend(isCorrect);
}

// Go to next question
nextBtn.addEventListener("click", () => {
  currentIndex += 1;
  showQuestion();
});

// Send result to Python API (optional; uses /api/submit_result)
async function sendResultToBackend(isCorrect) {
  try {
    await fetch("/api/submit_result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correct: isCorrect })
    });
  } catch (err) {
    // For now, just log any error; the quiz still works without backend
    console.error("Error sending result to backend:", err);
  }
}

// Initial render
showQuestion();

// Register the service worker for PWA behaviour
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service_worker.js");
  });
}