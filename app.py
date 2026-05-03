"""
app.py

Simple Flask backend for the Entrance Exam Practice app.

Responsibilities:
- Serve the main HTML page (single-page app).
- Serve static assets (CSS, JS, manifest, service worker).
- Provide a place to later add APIs (e.g. save scores, tutor dashboard).
"""

from flask import Flask, render_template, send_from_directory, jsonify, request
import os

# Create the Flask application instance.
# static_folder and template_folder tell Flask where to find files.
app = Flask(
    __name__,
    static_folder="static",
    template_folder="templates"
)

# ---------------------------
# ROUTES FOR FRONT-END PAGES
# ---------------------------

@app.route("/")
def index():
    """
    Main route for the app.

    Returns:
        Rendered index.html template.
        This template pulls in CSS/JS from /static.
    """
    return render_template("index.html")


# --------------------------------------
# ROUTES FOR MANIFEST AND SERVICE WORKER
# --------------------------------------

@app.route("/manifest.json")
def manifest():
    """
    Route to serve the PWA manifest.

    Browsers expect manifest.json to be at the root (e.g. /manifest.json),
    but the actual file lives inside the static folder.
    """
    return send_from_directory(app.static_folder, "manifest.json")


@app.route("/service_worker.js")
def service_worker():
    """
    Route to serve the service worker.

    Service workers must be served from the same origin and path scope
    as the files they control. Serving it from /service_worker.js
    allows it to control the whole app.
    """
    # Important: set correct mimetype so browsers treat it as JS
    return send_from_directory(app.static_folder, "service_worker.js", mimetype="application/javascript")


# --------------------------------------
# (OPTIONAL) SIMPLE IN-MEMORY API EXAMPLE
# --------------------------------------

# In-memory store for statistics.
# In production you would replace this with a real database.
STATS = {
    "total_questions_answered": 0,
    "total_correct": 0
}

@app.route("/api/submit_result", methods=["POST"])
def submit_result():
    """
    Example API endpoint to receive quiz results from the front end.

    Expected JSON body:
        {
            "correct": true/false
        }

    The data is added to an in-memory counter.
    This is just to show how you could connect Python to your front-end app.
    """
    data = request.get_json() or {}
    is_correct = bool(data.get("correct", False))

    STATS["total_questions_answered"] += 1
    if is_correct:
        STATS["total_correct"] += 1

    return jsonify({"status": "ok", "stats": STATS})


@app.route("/api/stats")
def get_stats():
    """
    Example API endpoint to fetch overall statistics.

    Returns:
        JSON with total questions answered and total correct.
    """
    return jsonify(STATS)


# ---------------------------
# MAIN ENTRY POINT
# ---------------------------

if __name__ == "__main__":
    """
    Run the Flask development server.

    debug=True enables automatic reload on code changes
    and provides detailed error pages.
    """
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)