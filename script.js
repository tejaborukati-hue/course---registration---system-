const SUPABASE_URL = "https://lprjchuwcdvtrhswlxyc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jvZ5ZxHElWrwaeLv6bEYwQ_ZqMiClTE";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function register() {
  const studentName = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const course = document.getElementById("course").value;

  if (!studentName || !email || !phone || !course) {
    document.getElementById("auth-msg").textContent =
      "Please fill all fields.";
    return;
  }

  const { error } = await supabaseClient
    .from("students")
    .insert([
      {
        student_name: studentName,
        mail: email,
        phone: phone,
        course: course
      }
    ]);

  if (error) {
    document.getElementById("auth-msg").textContent =
      "Error: " + error.message;
  } else {
    document.getElementById("auth-msg").textContent =
      "Registration Successful!";

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("course").value = "";
  }
}
