async function register() {
  const { error } = await supabase
    .from('students')
    .insert([
      {
        student_name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        course: document.getElementById('course').value
      }
    ]);

  if (error) {
    document.getElementById('auth-msg').textContent = error.message;
  } else {
    document.getElementById('auth-msg').textContent =
      'Registration Successful!';
  }
}
