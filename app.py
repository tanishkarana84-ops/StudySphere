from flask import Flask, render_template, request, jsonify
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# =========================
# HOME
# =========================

@app.route("/")
def home():
    return render_template("index.html")


# =========================
# NOTES PAGE
# =========================

@app.route("/notes")
def notes():
    return render_template("notes.html")


# =========================
# QUIZ PAGE
# =========================

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")


# =========================
# STUDY PLANNER PAGE
# =========================

@app.route("/planner")
def planner():
    return render_template("planner.html")

# =========================
# PERSONALIZED LEARNING PAGE
# =========================

@app.route("/learning")
def learning():
    return render_template("learning.html")


# =========================
# GENERATE AI NOTES
# =========================

@app.route("/ask", methods=["POST"])
def ask():

    data = request.get_json()

    question = data.get("message", "")

    prompt = f"""
You are StudySphere AI, an expert educational tutor.

Generate well-structured study notes.

Use ONLY these headings:

📖 Overview

🧠 Key Concepts

📚 Detailed Explanation

💡 Real Life Example

⚠️ Common Mistakes

📝 Quick Revision

Instructions:

- Explain in very simple language.
- Use bullet points wherever possible.
- Give real-world examples.
- Keep the notes easy to revise.
- Do not skip any heading.

Topic:

{question}
"""

    try:

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.5

        )

        answer = response.choices[0].message.content

        return jsonify({
            "reply": answer
        })

    except Exception as e:

        return jsonify({
            "reply": str(e)
        }), 500


# =========================
# GENERATE QUIZ
# =========================

@app.route("/generate_quiz", methods=["POST"])
def generate_quiz():

    data = request.get_json()

    topic = data.get("topic", "")

    prompt = f"""
You are an expert teacher.

Generate exactly 10 Multiple Choice Questions.

Topic:

{topic}

Rules:

1. Four options (A, B, C, D).
2. Mention the correct answer.
3. Give one-line explanation.
4. Medium difficulty.

Format:

Question 1

A.
B.
C.
D.

Answer:

Explanation:

Repeat for all 10 questions.
"""

    try:

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.5

        )

        quiz = response.choices[0].message.content

        return jsonify({
            "quiz": quiz
        })

    except Exception as e:

        return jsonify({
            "quiz": str(e)
        }), 500
# =========================
# GENERATE STUDY PLAN
# =========================

# =========================
# GENERATE STUDY PLAN
# =========================

@app.route("/generate_plan", methods=["POST"])
def generate_plan():

    data = request.get_json()

    hours = data.get("hours", "")
    days = data.get("days", "")
    goal = data.get("goal", "")

    prompt = f"""
You are StudySphere AI.

Create a personalized day-wise study plan.

Study Hours Per Day:
{hours}

Number of Days:
{days}

Goal:
{goal}

Instructions:

- Create a study plan for exactly {days} days.
- Each day should contain approximately {hours} hours of study.
- For every day include:
  • Topics to Study
  • Revision
  • Practice Questions
  • Short Breaks
- Keep the schedule realistic.
- Increase the difficulty gradually.
- Use headings and bullet points.
- End with a short motivational message.
"""

    try:

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.5

        )

        plan = response.choices[0].message.content

        return jsonify({
            "plan": plan
        })

    except Exception as e:

        return jsonify({
            "plan": str(e)
        }), 500
# =========================
# GENERATE PERSONALIZED LEARNING
# =========================

@app.route("/generate_learning", methods=["POST"])
def generate_learning():

    data = request.get_json()

    topic = data.get("topic", "")
    level = data.get("level", "")
    goal = data.get("goal", "")

    prompt = f"""
You are StudySphere AI.

Create a personalized learning roadmap.

Current Topic:
{topic}

Skill Level:
{level}

Learning Goal:
{goal}

Include:

📊 Current Level Assessment

🎯 Personalized Learning Path

📚 Topics to Learn First

⚡ Topics to Revise

💻 Practice Recommendations

📝 Weekly Milestones

🚀 AI Tips

Use headings and bullet points.
"""

    try:

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role":"user",
                    "content":prompt
                }
            ],

            temperature=0.5

        )

        learning = response.choices[0].message.content

        return jsonify({
            "learning": learning
        })

    except Exception as e:

        return jsonify({
            "learning": str(e)
        }), 500
# =========================
# RUN APP
# =========================

if __name__ == "__main__":
    app.run(debug=True)