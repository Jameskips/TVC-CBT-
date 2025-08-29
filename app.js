// Default admin password
let adminPassword = "admin123";

// Student accounts (you can add/remove students here)
const students = {
  "TVC001": { name: "John David", password: "pass001" },
  "TVC002": { name: "Mary Joseph", password: "pass002" },
  "TVC003": { name: "Samuel Paul", password: "pass003" }
};

// Sample Exam Questions
const questions = [
  { q: "What is the chemical symbol of Water?", options: ["O2", "H2O", "CO2", "NaCl"], answer: "H2O" },
  { q: "Which planet is called the Red Planet?", options: ["Earth", "Mars", "Venus", "Jupiter"], answer: "Mars" },
  { q: "The process of plants making food is called?", options: ["Respiration", "Digestion", "Photosynthesis", "Transpiration"], answer: "Photosynthesis" },
  { q: "Which gas do humans need to survive?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Helium"], answer: "Oxygen" },
  { q: "Who is known as the father of Physics?", options: ["Newton", "Einstein", "Galileo", "Faraday"], answer: "Newton" }
];

let currentStudent = null;

function login() {
  const studentID = document.getElementById("studentName").value.trim();
  const pass = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  if (!studentID) {
    error.textContent = "Enter your Name/ID!";
    return;
  }

  // Admin login
  if (pass === adminPassword && studentID.toLowerCase() === "admin") {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    error.textContent = "";
    return;
  }

  // Student login
  if (students[studentID] && students[studentID].password === pass) {
    currentStudent = students[studentID].name;
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("exam-screen").classList.remove("hidden");
    loadExam();
    error.textContent = "";
  } else {
    error.textContent = "Invalid ID or Password!";
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
    `${currentStudent}, you scored ${score} out of ${questions.length}`;
}

function logout() {
  document.getElementById("result-screen").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
  currentStudent = null;
}

function changePassword() {
  const newPass = document.getElementById("newPassword").value;
  if (newPass) {
    adminPassword = newPass;
    document.getElementById("admin-message").textContent =
      "Admin password updated successfully!";
  }
}


---
