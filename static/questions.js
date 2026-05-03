// questions.js
// Simple question bank attached to the global window object.
// Each question has: subject, text, options, and the index of the correct option.

window.QUESTION_BANK = [
  {
    subject: "maths",
    text: "What is 9 × 6?",
    options: ["42", "48", "52", "54"],
    correctIndex: 3
  },
  {
    subject: "english",
    text: "Which word is a synonym of 'rapid'?",
    options: ["slow", "quick", "tired", "quiet"],
    correctIndex: 1
  },
  {
    subject: "verbal_reasoning",
    text: "Find the odd one out: BOOK, PAGE, CHAPTER, PENCIL",
    options: ["BOOK", "PAGE", "CHAPTER", "PENCIL"],
    correctIndex: 3
  }
  // Add more questions as needed
];