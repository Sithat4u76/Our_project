const scriptURL =
  "https://script.google.com/macros/s/AKfycbx7hdE89EZIgCzeVJdsSPPdiOUeBilYg7gVVEALl0k7CGRQWoZsfolmSyZ1OPyLlopB/exec "; // Replace with your script URL
const form = document.getElementById("authForm");
const messageDiv = document.getElementById("message");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const toggleLink = document.getElementById("toggleLink");
const toggleText = document.getElementById("toggleText");
const nameGroup = document.getElementById("nameGroup");

let isRegistering = false;

function toggleForm() {
  isRegistering = !isRegistering;
  nameGroup.style.display = isRegistering ? "block" : "none";
  formTitle.textContent = isRegistering ? "Create Account" : "Sign In";
  submitBtn.textContent = isRegistering ? "Register" : "Sign In";
  toggleText.textContent = isRegistering
    ? "Already have an account? "
    : "Don't have an account? ";
}

toggleLink.addEventListener("click", function (e) {
  e.preventDefault();
  toggleForm();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData);

  const url = `${scriptURL}?action=${isRegistering ? "insert" : "search"}`;

  messageDiv.textContent = isRegistering ? "Registering..." : "Logging in...";
  messageDiv.className = "message";

  fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      messageDiv.textContent = isRegistering
        ? "Registration successful!"
        : "Login successful!";
      messageDiv.className = "message success";

      if (!isRegistering) {
        localStorage.setItem("user", JSON.stringify(payload));
        setTimeout(() => {
          window.location.href = "html/setting.html";
        }, 1000);
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      messageDiv.textContent = "Something went wrong. Please try again.";
      messageDiv.className = "message error";
    });
});

