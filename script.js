const SUPABASE_URL = "https://lprjchuwcdvtrhswlxyc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jvZ5ZxHElWrwaeLv6bEYwQ_ZqMiClTE";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
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
