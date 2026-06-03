 // Sample courses
const courses = [
  {id: 1, name: "Web Development", instructor: "Prof. Smith"},
  {id: 2, name: "Python Programming", instructor: "Prof. Lee"},
  {id: 3, name: "Data Structures", instructor: "Prof. Kumar"},
  {id: 4, name: "Machine Learning", instructor: "Prof. Patel"}
];

// DOM elements
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const dashboard = document.getElementById('dashboard');

// Toggle forms
document.getElementById('showLogin').onclick = () => {
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
};

document.getElementById('showRegister').onclick = () => {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
};

// Register
document.getElementById('registerBtn').onclick = () => {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  if (!name || !email || !password) return alert('Fill all fields');

  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  if (users.find(u => u.email === email)) {
    return alert('Email already registered');
  }

  users.push({name, email, password, courses: []});
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registration successful! Please login');
  
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
};

// Login
document.getElementById('loginBtn').onclick = () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  let users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return alert('Invalid credentials');

  localStorage.setItem('currentUser', JSON.stringify(user));
  showDashboard(user);
};

// Show dashboard
function showDashboard(user) {
  loginForm.classList.add('hidden');
  registerForm.classList.add('hidden');
  dashboard.classList.remove('hidden');
  
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = `(${user.email})`;
  
  loadCourses();
}

// Load courses
function loadCourses() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const courseList = document.getElementById('courseList');
  const enrolledDiv = document.getElementById('enrolledCourses');

  courseList.innerHTML = courses.map(course => `
    <div class="course-item">
      <span><strong>${course.name}</strong> - ${course.instructor}</span>
      <button onclick="enrollCourse(${course.id})">Register</button>
    </div>
  `).join('');

  if (currentUser.courses && currentUser.courses.length > 0) {
    enrolledDiv.innerHTML = currentUser.courses.map(c => `<div>${c.name}</div>`).join('');
  } else {
    enrolledDiv.innerHTML = 'None yet';
  }
}

// Enroll in course
function enrollCourse(courseId) {
  let currentUser = JSON.parse(localStorage.getItem('currentUser'));
  let users = JSON.parse(localStorage.getItem('users'));

  const course = courses.find(c => c.id === courseId);
  if (!currentUser.courses) currentUser.courses = [];

  if (currentUser.courses.find(c => c.id === courseId)) {
    return alert('Already registered for this course');
  }

  currentUser.courses.push(course);
  const userIndex = users.findIndex(u => u.email === currentUser.email);
  users[userIndex].courses = currentUser.courses;

  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  localStorage.setItem('users', JSON.stringify(users));

  loadCourses();
  alert(`Registered for ${course.name}`);
}

// Logout
document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('currentUser');
  dashboard.classList.add('hidden');
  loginForm.classList.remove('hidden');
};

// Check if already logged in
window.onload = () => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) showDashboard(JSON.parse(currentUser));
};
