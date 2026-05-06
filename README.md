# 11+ Exam Practice – Prototype

This repository contains a **prototype** web app for practising 11+ style entrance exam questions.  
It is built for local use on a laptop and is currently focused on a simple, timed multiple‑choice quiz with a small dashboard of scores.

The app is still under active development and is **not** a finished product or official exam tool.

## What the prototype does

### Dashboard

- Shows **Average Score** for the current run.
- Shows **Total Questions Answered**.
- Updates automatically as the student works through the quiz.

### Quiz

- Asks for a **“Quiz hero name”** before starting.
- Displays one question at a time with four options.
- Shows a **15‑second countdown timer** for each question.
- If the time runs out, the question:
  - scores **0**, and  
  - the next question is made slightly easier.
- If the student answers correctly:
  - the score increases, and  
  - the next question is made slightly harder.
- Questions do **not repeat** within a single mini‑test.
- At the end of the test, an alert shows:
  - total correct  
  - total attempted  
  - percentage score

### Backend analytics (prototype only)

- A Flask API records simple aggregate stats in memory:
  - total questions answered  
  - total correct  
  - total time spent answering  
- The data resets whenever the server restarts.  
  It is intended as a starting point for future teacher dashboards.

## Tech stack

- **Frontend:**  
  - HTML template at `templates/index.html`  
  - CSS styling in `static/styles.css`  
  - Quiz logic and timer in `static/app.js`  
  - Question bank in `static/questions.js`

- **Backend:**  
  - Python 3  
  - Flask (`app.py`) serving the HTML and JSON endpoints

- **Extras (optional PWA pieces):**  
  - `static/manifest.json`  
  - `static/service_worker.js`

## Project structure

```text
11PLUS_EXAM_APP/
├─ app.py                  # Flask app (routes + simple analytics API)
├─ templates/
│  └─ index.html           # Single-page layout: Dashboard + Quiz views
├─ static/
│  ├─ app.js               # Front-end quiz logic, timer, adaptive steps
│  ├─ questions.js         # Sample question bank (window.QUESTION_BANK)
│  ├─ styles.css           # Styling for dashboard and quiz screens
│  ├─ manifest.json        # PWA manifest (experimental)
│  └─ service_worker.js    # Service worker (experimental)
└─ README.md
```

## Running the app locally

### 1. Install dependencies

Make sure Python 3 is installed. Then in a terminal in this folder:

```bash
pip install flask
```

### 2. Start the Flask development server

From the project root (`11PLUS_EXAM_APP`):

```bash
python app.py
```

You should see:

```text
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

Open that URL in your browser.

### 3. Use the prototype

1. On load, you see the **Dashboard** (Average Score / Total Questions Answered).  
2. Click **Quiz** in the top‑right navigation.  
3. Type a name in **Quiz hero name** and click **Start Quiz**.  
4. Answer questions before the 15‑second timer runs out.  
5. At the end of the mini‑test, view the summary in the alert and on the dashboard.

## Customising the question bank

All questions are defined in `static/questions.js` as a JavaScript array:

```js
{
  id: 1,
  subject: "maths",          // e.g. maths | english | spag | verbal | nvr
  text: "What is 9 × 6?",
  options: ["42", "48", "54", "64"],
  correctIndex: 2,           // index in options[]
  difficulty: 2              // 1 = easier … 5 = harder
}
```

To change or extend the practice content:

1. Open `static/questions.js`.  
2. Edit existing question objects or add new ones.  
3. Keep `id` values unique and set `difficulty` to control how the adaptive logic picks questions.

## Status and next steps

This app is currently a **prototype**. Planned improvements include:

- Better visual design and animations for children.  
- More realistic question types per 11+ paper section.  
- Per‑student history and more detailed analytics (with a database).  
- Richer Non‑Verbal Reasoning using images instead of text descriptions.

---

This project is a personal educational prototype 