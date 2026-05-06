from flask import Flask, render_template, send_from_directory, jsonify, request
import os
from datetime import datetime

# ---------------------------------------------------------
# FLASK APP SETUP
# ---------------------------------------------------------

app = Flask(
    __name__,
    static_folder="static",      # where app.js, styles.css, questions.js live
    template_folder="templates", # where index.html lives
)

# ---------------------------------------------------------
# MAIN PAGE
# ---------------------------------------------------------

@app.route("/")
def index():
    # This forces Flask to use templates/index.html
    return render_template("index.html")

# ---------------------------------------------------------
# PWA ROUTES (optional)
# ---------------------------------------------------------

@app.route("/manifest.json")
def manifest():
    return send_from_directory(app.static_folder, "manifest.json")


@app.route("/service_worker.js")
def service_worker():
    return send_from_directory(
        app.static_folder,
        "service_worker.js",
        mimetype="application/javascript",
    )

# ---------------------------------------------------------
# SIMPLE ANALYTICS API
# ---------------------------------------------------------

STATS = {
    "total_questions_answered": 0,
    "total_correct": 0,
    "total_time_seconds": 0.0,
    "last_update": None,
}


def update_stats(is_correct: bool, time_taken: float) -> None:
    STATS["total_questions_answered"] += 1
    if is_correct:
        STATS["total_correct"] += 1

    try:
        t = float(time_taken)
    except (TypeError, ValueError):
        t = 0.0

    STATS["total_time_seconds"] += max(t, 0.0)
    STATS["last_update"] = datetime.utcnow().isoformat() + "Z"


@app.route("/api/submit_result", methods=["POST"])
def submit_result():
    data = request.get_json(silent=True) or {}

    correct = bool(data.get("correct", False))
    time_taken = data.get("time_taken", 0)

    update_stats(correct, time_taken)

    total = STATS["total_questions_answered"]
    correct_total = STATS["total_correct"]
    avg_time = (
        STATS["total_time_seconds"] / total if total > 0 else 0.0
    )
    pct = round((correct_total / total) * 100) if total > 0 else 0

    return jsonify(
        {
            "status": "ok",
            "stats": {
                "total_questions_answered": total,
                "total_correct": correct_total,
                "percentage": pct,
                "average_time_seconds": round(avg_time, 2),
                "last_update": STATS["last_update"],
            },
        }
    )


@app.route("/api/stats", methods=["GET"])
def get_stats():
    total = STATS["total_questions_answered"]
    correct_total = STATS["total_correct"]
    avg_time = (
        STATS["total_time_seconds"] / total if total > 0 else 0.0
    )
    pct = round((correct_total / total) * 100) if total > 0 else 0

    return jsonify(
        {
            "total_questions_answered": total,
            "total_correct": correct_total,
            "percentage": pct,
            "average_time_seconds": round(avg_time, 2),
            "last_update": STATS["last_update"],
        }
    )

# ---------------------------------------------------------
# RUN SERVER
# ---------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)