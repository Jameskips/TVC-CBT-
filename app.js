app.js

// Default admin password
let adminPassword = "admin123";

// Sample Exam Questions
const questions = [
  { q: "What is the chemical symbol of Water?", options: ["O2", "H2O", "CO2", "NaCl"], answer: "H2O" },
  { q: "Which planet is called the Red Planet?", options: ["Earth", "Mars", "Venus", "Jupiter"], answer: "Mars" },
  { q: "The process of plants making food is called?", options: ["Respiration", "Digestion", "Photosynthesis", "Transpiration"], answer: "Photosynthesis" },
  { q: "Which gas do humans need to survive?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Helium"], answer: "Oxygen" },
  { q: "Who is known as the father of Physics?", options: ["Newton", "Einstein", "Galileo", "Faraday"], answer: "Newton" }
];

function login() {
  const name = document.getElementById("studentName").value;
  const pass = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  if (!name) {
    error.textContent = "Enter your Name/ID!";
    return;
  }

  if (pass === adminPassword) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    error.textContent = "";
  } else if (pass === "student123") {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("exam-screen").classList.remove("hidden");
    loadExam();
    error.textContent = "";
  } else {
    error.textContent = "Invalid Password!";
  }
}

function loadExam() {
  const form = document.getElementById("exam-form");
  form.innerHTML = "";

  questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `<p><b>${i+1}. ${q.q}</b></p>` +
      q.options.map(opt => `
        <label>
          <input type="radio" name="q${i}" value="${opt}"> ${opt}
        </label><br>`).join("");
    form.appendChild(div);
  });
}

function submitExam() {
  let score = 0;

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && selected.value === q.answer) {
      score++;
    }
  });

  document.getElementById("exam-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");
  document.getElementById("result-text").textContent =
    `You scored ${score} out of ${questions.length}`;
}

function logout() {
  document.getElementById("result-screen").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
}

function changePassword() {
  const newPass = document.getElementById("newPassword").value;
  if (newPass) {
    adminPassword = newPass;
    document.getElementById("admin-message").textContent =
      "Password updated successfully!";
  }
}


---
