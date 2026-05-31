const API_URL = 'http://localhost:5000/api'; // Change this to your Render URL later

let studentId = localStorage.getItem('studentId');
if (studentId) showDashboard();

async function register() {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  });
  const data = await res.json();
  document.getElementById('auth-msg').textContent = data.message || data.error;
}

async function login() {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  });
  const data = await res.json();
  if (data.id) {
    studentId = data.id;
    localStorage.setItem('studentId', studentId);
    showDashboard();
  } else {
    document.getElementById('auth-msg').textContent = data.error;
  }
}

function showDashboard() {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  loadCourses();
  loadMyCourses();
}

async function loadCourses() {
  const res = await fetch(`${API_URL}/courses`);
  const courses = await res.json();
  document.getElementById('courses').innerHTML = courses.map(c => `
    <div class="course-card">
      <strong>${c.code}</strong> - ${c.title}<br>
      Instructor: ${c.instructor}<br>
      Seats left: ${c.seats_left}
      <button onclick="registerCourse(${c.id})">Register</button>
    </div>
  `).join('');
}

async function loadMyCourses() {
  const res = await fetch(`${API_URL}/my-courses/${studentId}`);
  const courses = await res.json();
  document.getElementById('my-courses').innerHTML = courses.length ?
    courses.map(c => `<div class="course-card">${c.code} - ${c.title}</div>`).join('') :
    '<p>No courses yet</p>';
}

async function registerCourse(courseId) {
  const res = await fetch(`${API_URL}/register-course`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({student_id: studentId, course_id: courseId})
  });
  const data = await res.json();
  alert(data.message || data.error);
  loadCourses();
  loadMyCourses();
}

function logout() {
  localStorage.removeItem('studentId');
  location.reload();
}
