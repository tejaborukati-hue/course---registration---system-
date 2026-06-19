const API_URL = "http://127.0.0.1:5000";

// DOM Elements
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboard");

// Toggle Forms
document.getElementById("showLogin").onclick = () => {
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
};

document.getElementById("showRegister").onclick = () => {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
};

// ---------------- REGISTER ----------------
document.getElementById("registerBtn").onclick = async () => {

    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    });

    const data = await response.json();

    if (response.ok) {
        alert(data.message);

        registerForm.classList.add("hidden");
        loginForm.classList.remove("hidden");

    } else {
        alert(data.error);
    }
};

// ---------------- LOGIN ----------------
document.getElementById("loginBtn").onclick = async () => {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${API_URL}/api/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    });

    const data = await response.json();

    if (response.ok) {

        localStorage.setItem("student_id", data.id);

        loginForm.classList.add("hidden");
        dashboard.classList.remove("hidden");

        document.getElementById("userName").textContent = email;
        document.getElementById("userEmail").textContent = email;

        loadCourses();
        loadMyCourses();

    } else {

        alert(data.error);

    }

};

// ---------------- LOAD COURSES ----------------
async function loadCourses() {

    const response = await fetch(`${API_URL}/api/courses`);

    const courses = await response.json();

    document.getElementById("courseList").innerHTML = courses.map(course => `

        <div class="course-item">

            <b>${course.code}</b><br>

            ${course.title}<br>

            Instructor : ${course.instructor}<br>

            Seats Left : ${course.seats_left}<br><br>

            <button onclick="registerCourse(${course.id})">

            Register

            </button>

        </div>

        <hr>

    `).join("");

}

// ---------------- REGISTER COURSE ----------------
async function registerCourse(courseId) {

    const student_id = localStorage.getItem("student_id");

    const response = await fetch(`${API_URL}/api/register-course`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            student_id,
            course_id: courseId

        })

    });

    const data = await response.json();

    alert(data.message || data.error);

    loadMyCourses();
    loadCourses();

}

// ---------------- MY COURSES ----------------
async function loadMyCourses() {

    const student_id = localStorage.getItem("student_id");

    const response = await fetch(`${API_URL}/api/my-courses/${student_id}`);

    const courses = await response.json();

    if (courses.length === 0) {

        document.getElementById("enrolledCourses").innerHTML = "None yet";

        return;

    }

    document.getElementById("enrolledCourses").innerHTML = courses.map(course => `

        <div>

        ${course.code} - ${course.title}

        </div>

    `).join("");

}

// ---------------- LOGOUT ----------------
document.getElementById("logoutBtn").onclick = () => {

    localStorage.removeItem("student_id");

    dashboard.classList.add("hidden");

    loginForm.classList.remove("hidden");

};

// ---------------- AUTO LOGIN ----------------
window.onload = () => {

    const student = localStorage.getItem("student_id");

    if (student) {

        loginForm.classList.add("hidden");
        dashboard.classList.remove("hidden");

        loadCourses();
        loadMyCourses();

    }

};