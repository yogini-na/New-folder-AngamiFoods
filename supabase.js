const SUPABASE_URL =
"https://dqjrxbaqaqxizrvwpzaw.supabase.co";

const SUPABASE_KEY =
"sb_publishable_xPCPc8HM6vwgzEcM_l7SBg_YfDxWf8e";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const company = document.getElementById("company").value;
  const message = document.getElementById("message").value;

  const { error } = await supabaseClient
    .from("inquiries")
    .insert([
      {
        name,
        email,
        company,
        message
      }
    ]);

  if (error) {
    alert(error.message);
  } else {
    alert("Inquiry Submitted Successfully!");
    form.reset();
  }
});