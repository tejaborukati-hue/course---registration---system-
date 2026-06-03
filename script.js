function showLogin() {
  document.getElementById("registerBox").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
}

function showRegister() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("registerBox").classList.remove("hidden");
}

// REGISTER
function register() {
  let name = document.getElementById("regName").value;
  let email = document.getElementById("regEmail").value;
  let pass = document.getElementById("regPass").value;

  if (!name || !email || !pass) {
    alert("Fill all fields");
    return;
  }

  let user = { name, email, pass };

  localStorage.setItem(email, JSON.stringify(user));

  alert("Registration successful!");
  showLogin();
}

// LOGIN
function login() {
  let email = document.getElementById("loginEmail").value;
  let pass = document.getElementById("loginPass").value;

  let userData = localStorage.getItem(email);

  if (!userData) {
    alert("User not found!");
    return;
  }

  let user = JSON.parse(userData);

  if (user.pass === pass) {
    alert("Login successful!");
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("userInfo").innerText =
      "Welcome " + user.name + " (" + user.email + ")";
  } else {
    alert("Wrong password!");
  }
}

// LOGOUT
function logout() {
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
}
