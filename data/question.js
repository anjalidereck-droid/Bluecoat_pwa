// data/questions.js
// 10 questions per subject, difficulty 1 = easy, 2 = medium, 3 = hard

const questions = {
  maths: [
    { id: "m1", difficulty: 1, question: "What is 7 + 5?", options: ["10", "11", "12", "13"], answer: 2 },
    { id: "m2", difficulty: 1, question: "What is 9 − 4?", options: ["3", "4", "5", "6"], answer: 3 },
    { id: "m3", difficulty: 1, question: "What is 6 × 2?", options: ["8", "10", "12", "14"], answer: 3 },
    { id: "m4", difficulty: 2, question: "What is 36 ÷ 4?", options: ["6", "7", "8", "9"], answer: 4 },
    { id: "m5", difficulty: 2, question: "What is 15 × 3?", options: ["30", "35", "40", "45"], answer: 4 },
    { id: "m6", difficulty: 2, question: "What is 72 ÷ 8?", options: ["7", "8", "9", "10"], answer: 2 },
    { id: "m7", difficulty: 3, question: "What is 3/4 of 32?", options: ["20", "22", "24", "26"], answer: 3 },
    { id: "m8", difficulty: 3, question: "What is 15% of 200?", options: ["20", "25", "30", "35"], answer: 3 },
    { id: "m9", difficulty: 3, question: "What is 2.5 × 4?", options: ["8", "9", "10", "12"], answer: 3 },
    { id: "m10", difficulty: 3, question: "What is 180 ÷ 12?", options: ["12", "13", "14", "15"], answer: 4 }
  ],

  english: [
    { id: "e1", difficulty: 1, question: "Choose the synonym for 'happy'.", options: ["sad", "angry", "joyful", "tired"], answer: 3 },
    { id: "e2", difficulty: 1, question: "Which word is a noun?", options: ["run", "blue", "table", "quickly"], answer: 3 },
    { id: "e3", difficulty: 1, question: "She ___ to school.", options: ["go", "goes", "going", "gone"], answer: 2 },
    { id: "e4", difficulty: 2, question: "Antonym of 'brave'.", options: ["bold", "fearless", "cowardly", "strong"], answer: 3 },
    { id: "e5", difficulty: 2, question: "Correct punctuation:", options: ["Its raining today.", "It's raining today.", "Its' raining today.", "Its raining, today"], answer: 2 },
    { id: "e6", difficulty: 2, question: "Which is an adjective?", options: ["quickly", "happiness", "green", "jump"], answer: 3 },
    { id: "e7", difficulty: 3, question: "'A piece of cake' means:", options: ["dessert", "easy", "birthday", "recipe"], answer: 2 },
    { id: "e8", difficulty: 3, question: "He was tired, ___ he finished.", options: ["and", "so", "but", "because"], answer: 2 },
    { id: "e9", difficulty: 3, question: "Which is a simile?", options: ["Sun smiled", "Quiet as a mouse", "Wind howled", "Time flew"], answer: 2 },
    { id: "e10", difficulty: 3, question: "Meaning of 'reluctant'.", options: ["eager", "unwilling", "excited", "certain"], answer: 2 }
  ],

  spelling: [
    { id: "s1", difficulty: 1, question: "Correct spelling:", options: ["becaus", "because", "becuase", "beacause"], answer: 2 },
    { id: "s2", difficulty: 1, question: "Correct spelling:", options: ["freind", "friend", "frend", "friand"], answer: 2 },
    { id: "s3", difficulty: 1, question: "Correct spelling:", options: ["beleive", "believe", "belive", "beleve"], answer: 2 },
    { id: "s4", difficulty: 2, question: "Correct spelling:", options: ["seperate", "separite", "separate", "seperete"], answer: 3 },
    { id: "s5", difficulty: 2, question: "Correct spelling:", options: ["definate", "definite", "defenite", "definete"], answer: 2 },
    { id: "s6", difficulty: 2, question: "Correct spelling:", options: ["neccessary", "necessary", "necesary", "neccesary"], answer: 2 },
    { id: "s7", difficulty: 3, question: "Correct spelling:", options: ["accomodate", "accommodate", "acommodate", "accomadate"], answer: 2 },
    { id: "s8", difficulty: 3, question: "Correct spelling:", options: ["occured", "occured", "occurred", "ocurred"], answer: 3 },
    { id: "s9", difficulty: 3, question: "Correct spelling:", options: ["embarrass", "embarass", "embaras", "embarrase"], answer: 1 },
    { id: "s10", difficulty: 3, question: "Correct spelling:", options: ["posession", "possesion", "possession", "possesion"], answer: 3 }
  ],

  mental_arithmetic: [
    { id: "ma1", difficulty: 1, question: "13 + 9 =", options: ["20", "21", "22", "23"], answer: 3 },
    { id: "ma2", difficulty: 1, question: "25 − 7 =", options: ["16", "17", "18", "19"], answer: 4 },
    { id: "ma3", difficulty: 1, question: "4 × 7 =", options: ["24", "26", "28", "30"], answer: 3 },
    { id: "ma4", difficulty: 2, question: "96 ÷ 8 =", options: ["10", "11", "12", "13"], answer: 3 },
    { id: "ma5", difficulty: 2, question: "18 × 4 =", options: ["64", "68", "70", "72"], answer: 4 },
    { id: "ma6", difficulty: 2, question: "150 − 47 =", options: ["101", "102", "103", "104"], answer: 2 },
    { id: "ma7", difficulty: 3, question: "3/5 of 40 =", options: ["20", "22", "24", "26"], answer: 3 },
    { id: "ma8", difficulty: 3, question: "12.5 × 4 =", options: ["40", "45", "50", "55"], answer: 3 },
    { id: "ma9", difficulty: 3, question: "320 ÷ 16 =", options: ["18", "19", "20", "21"], answer: 3 },
    { id: "ma10", difficulty: 3, question: "8% of 250 =", options: ["18", "19", "20", "22"], answer: 3 }
  ],

  verbal_reasoning: [
    { id: "v1", difficulty: 1, question: "Odd one out: cat, dog, cow, chair.", options: ["cat", "dog", "cow", "chair"], answer: 4 },
    { id: "v2", difficulty: 1, question: "Most similar pair:", options: ["hot:cold", "big:large", "day:night", "tall:short"], answer: 2 },
    { id: "v3", difficulty: 1, question: "Book is to read as fork is to ___", options: ["write", "eat", "draw", "sleep"], answer: 2 },
    { id: "v4", difficulty: 2, question: "Unscramble: T A E R H", options: ["earth", "heart", "hater", "rathe"], answer: 2 },
    { id: "v5", difficulty: 2, question: "Meaning of 'rapid'.", options: ["slow", "quick", "late", "weak"], answer: 2 },
    { id: "v6", difficulty: 2, question: "Odd one out:", options: ["always", "never", "sometimes", "often"], answer: 2 },
    { id: "v7", difficulty: 3, question: "teacher:school = doctor:___", options: ["office", "hospital", "clinic", "patient"], answer: 2 },
    { id: "v8", difficulty: 3, question: "Opposite of 'scarce'.", options: ["rare", "plentiful", "few", "little"], answer: 2 },
    { id: "v9", difficulty: 3, question: "'listen:hear' is like:", options: ["eat:food", "read:book", "look:see", "sleep:bed"], answer: 3 },
    { id: "v10", difficulty: 3, question: "Does not belong:", options: ["argue", "quarrel", "agree", "dispute"], answer: 3 }
  ],

  non_verbal_reasoning: [
    { id: "n1", difficulty: 1, question: "Triangle has ___ sides.", options: ["2", "3", "4", "5"], answer: 2 },
    { id: "n2", difficulty: 1, question: "Odd one out:", options: ["circle", "square", "triangle", "ball"], answer: 4 },
    { id: "n3", difficulty: 1, question: "Which has no straight sides?", options: ["square", "triangle", "circle", "rectangle"], answer: 3 },
    { id: "n4", difficulty: 2, question: "▲, ●, ▲, ●, ?", options: ["▲", "●", "■", "◆"], answer: 1 },
    { id: "n5", difficulty: 2, question: "Mirror image of 'L'?", options: ["L", "┘", "└", "Γ"], answer: 3 },
    { id: "n6", difficulty: 2, question: "◼, ◻, ◼, ◻, ?", options: ["◼", "◻", "●", "▲"], answer: 1 },
    { id: "n7", difficulty: 3, question: "Shape rotates 90° four times.", options: ["same", "upside down", "sideways", "disappears"], answer: 1 },
    { id: "n8", difficulty: 3, question: "Which net makes a cube?", options: ["strip", "cross", "row of 3", "row of 4"], answer: 2 },
    { id: "n9", difficulty: 3, question: "Which is symmetrical?", options: ["blob", "scalene", "square", "random line"], answer: 3 },
    { id: "n10", difficulty: 3, question: "Lines of symmetry in rectangle?", options: ["0", "1", "2", "4"], answer: 3 }
  ]
};

export default questions;
