from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

DATABASE = "students.db"


# =========================================================
# DATABASE
# =========================================================

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL,
            title TEXT NOT NULL,
            instructor TEXT NOT NULL,
            seats INTEGER NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS enrollments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            UNIQUE(student_id, course_id)
        )
    """)

    cursor.execute("SELECT COUNT(*) FROM courses")

    if cursor.fetchone()[0] == 0:
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


# =========================================================
# FRONTEND
# =========================================================

HTML = """
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Student Course Registration System</title>

<style>

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 20px;
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #667eea, #764ba2);
    min-height: 100vh;
}

.container {
    max-width: 600px;
    margin: auto;
}

.card {
    background: white;
    padding: 25px;
    border-radius: 15px;
    margin-top: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.hidden {
    display: none;
}

h1, h2 {
    text-align: center;
    color: #333;
}

h3 {
    color: #333;
    margin-top: 25px;
}

input {
    width: 100%;
    padding: 13px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 7px;
    font-size: 16px;
}

button {
    width: 100%;
    padding: 13px;
    margin-top: 10px;
    border: none;
    border-radius: 7px;
    background: #667eea;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background: #5568d3;
}

a {
    color: #667eea;
    font-weight: bold;
    text-decoration: none;
}

p {
    text-align: center;
}

.course {
    background: #f4f4f4;
    padding: 15px;
    margin: 10px 0;
    border-radius: 8px;
    border-left: 5px solid #667eea;
}

.course button {
    width: auto;
    padding: 8px 15px;
}

.enrolled {
    background: #e8f5e9;
    padding: 12px;
    margin: 8px 0;
    border-radius: 7px;
}

.logout {
    background: #e53935;
}

</style>

</head>

<body>

<div class="container">

<!-- REGISTER -->

<div id="registerForm" class="card">

<h2>Student Registration</h2>

<input
    type="text"
    id="regName"
    placeholder="Full Name">

<input
    type="email"
    id="regEmail"
    placeholder="Email">

<input
    type="password"
    id="regPassword"
    placeholder="Password">

<button onclick="registerStudent()">
Register
</button>

<p>
Already have an account?
<a href="#" onclick="showLogin()">Login</a>
</p>

</div>


<!-- LOGIN -->

<div id="loginForm" class="card hidden">

<h2>Student Login</h2>

<input
    type="email"
    id="loginEmail"
    placeholder="Email">

<input
    type="password"
    id="loginPassword"
    placeholder="Password">

<button onclick="loginStudent()">
Login
</button>

<p>
Don't have an account?
<a href="#" onclick="showRegister()">Register</a>
</p>

</div>


<!-- DASHBOARD -->

<div id="dashboard" class="card hidden">

<h2>
Welcome <span id="userName"></span> 🎉
</h2>

<p id="userEmail"></p>

<h3>Available Courses</h3>

<div id="