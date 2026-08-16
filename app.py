from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

DATABASE = "students.db"


# ---------------- DATABASE ----------------

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Students table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    # Courses table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL,
            title TEXT NOT NULL,
            instructor TEXT NOT NULL,
            seats INTEGER NOT NULL
        )
    """)

    # Enrollments table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS enrollments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            UNIQUE(student_id, course_id),
            FOREIGN KEY(student_id) REFERENCES students(id),
            FOREIGN KEY(course_id) REFERENCES courses(id)
        )
    """)

    # Add sample courses only if courses table is empty
    cursor.execute("SELECT COUNT(*) FROM courses")
    count = cursor.fetchone()[0]

    if count == 0:
        courses = [
            ("AI101", "Introduction to Artificial Intelligence", "Dr. Kumar", 30),
            ("ML102", "Machine Learning", "Dr. Priya", 25),
            ("PY103", "Python Programming", "Mr. Ravi", 35),
            ("DB104", "Database Management Systems", "Ms. Anitha", 30),
            ("WEB105", "Web Development", "Mr. Suresh", 25)
        ]

        cursor.executemany("""
            INSERT INTO courses
            (code, title, instructor, seats)
            VALUES (?, ?, ?, ?)
        """, courses)

    conn.commit()
    conn.close()


# ---------------- HOME ----------------

@app.route("/")
def home():
    return jsonify({
        "message": "Student Registration Portal Backend is running!"
    })


# ---------------- REGISTER ----------------

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data received"
        }), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password =