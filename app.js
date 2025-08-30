// Admin password
let adminPassword = "admin123";

// Students
const students = {
  "TVC001": { name: "John David", password: "pass001" },
  "TVC002": { name: "Mary Joseph", password: "pass002" },
  "TVC003": { name: "Samuel Paul", password: "pass003" }
};

// Subjects and Questions
const subjects = {
  "General Science": [
    { q: "What is the chemical symbol of Water?", options: ["O2","H2O","CO2","NaCl"], answer: "H2O" },
    { q: "Which planet is called the Red Planet?", options: ["Earth","Mars","Venus","Jupiter"], answer: "Mars" }
  ]
};

let currentStudent = null;
let currentSubject = null;

// Login
function login() {
  const studentID = document.getElementById("studentName").value.trim();
  const pass = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  if (!studentID) { error.textContent = "Enter your Name/ID!"; return; }

  if (pass === adminPassword && studentID.toLowerCase() === "admin") {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    error.textContent = "";
    displayStudents();
    displaySubjects();
    return;
  }

  if (students[studentID] && students[studentID].password === pass) {
    currentStudent = students[studentID].name;
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("subject-screen").classList.remove("hidden");
    populateSubjectSelect();
    error.textContent = "";
  } else {
    error.textContent = "Invalid ID or Password!";
  }
}

// Populate subject select for students
function populateSubjectSelect() {
  const select = document.getElementById("subject-select");
  select.innerHTML = "";
  for (const s in subjects) {
    const option = document.createElement("option");
    option.value = s;
    option.textContent = s;
    select.appendChild(option);
  }
}

// Start Exam
function startExam() {
  const select = document.getElementById("subject-select");
  currentSubject = select.value;
  document.getElementById("subject-screen").classList.add("hidden");
  document.getElementById("exam-screen").classList.remove("hidden");
  document.getElementById("exam-title").textContent = currentSubject + " Exam";
  loadExam();
}

// Load exam
function loadExam() {
  const form = document.getElementById("exam-form");
  form.innerHTML = "";
  subjects[currentSubject].forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `<p><b>${i+1}. ${q.q}</b></p>` +
      q.options.map(opt => `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`).join("");
    form.appendChild(div);
  });
}

// Submit exam
function submitExam() {
  let score = 0;
  subjects[currentSubject].forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && selected.value === q.answer) { score++; }
  });
  document.getElementById("exam-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");
  document.getElementById("result-text").textContent =
    `${currentStudent}, you scored ${score} out of ${subjects[currentSubject].length}`;
}

// Logout
function logout() {
  document.getElementById("result-screen").classList.add("hidden");
  document.getElementById("subject-screen").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
  currentStudent = null;
  currentSubject = null;
}

// Admin: Change password
function changePassword() {
  const newPass = document.getElementById("newPassword").value;
  if (newPass) { adminPassword = newPass; document.getElementById("admin-message").textContent = "Admin password updated!"; }
}

// Admin: Student management
function addStudent() {
  const id = document.getElementById("newStudentID").value.trim();
  const name = document.getElementById("newStudentName").value.trim();
  const pass = document.getElementById("newStudentPass").value.trim();
  const message = document.getElementById("student-message");
  if (!id || !name || !pass) { message.textContent = "All fields required!"; message.className = "error"; return; }
  if (students[id]) { message.textContent = "Student ID exists!"; message.className = "error"; return; }
  students[id] = { name, password: pass };
  message.textContent = `Student ${name} added!`; message.className = "success";
  document.getElementById("newStudentID").value = "";
  document.getElementById("newStudentName").value = "";
  document.getElementById("newStudentPass").value = "";
  displayStudents();
}
function displayStudents() {
  const list = document.getElementById("student-list");
  list.innerHTML = "";
  for (const id in students) { const li = document.createElement("li"); li.textContent = `${id} - ${students[id].name}`; list.appendChild(li); }
}

// Admin: Subject management
function addSubject() {
  const name = document.getElementById("newSubjectName").value.trim();
  const message = document.getElementById("subject-message");
  if (!name) { message.textContent = "Enter subject name!"; message.className = "error"; return; }
  if (subjects[name]) { message.textContent = "Subject exists!"; message.className = "error"; return; }
  subjects[name] = [];
  message.textContent = `Subject ${name} added!`; message.className = "success";
  document.getElementById("newSubjectName").value = "";
  displaySubjects();
}
function displaySubjects() {
  const list = document.getElementById("subject-list");
  list.innerHTML = "";
  const questionSelect = document.getElementById("question-subject-select");
  questionSelect.innerHTML = "";
  for (const s in subjects) {
    const li = document.createElement("li"); li.textContent = s; list.appendChild(li);
    const option = document.createElement("option"); option.value = s; option.textContent = s; questionSelect.appendChild(option);
  }
}

// Admin: Question management
function addQuestion() {
  const subject = document.getElementById("question-subject-select").value;
  const qText = document.getElementById("question-text").value.trim();
  const o1 = document.getElementById("question-option1").value.trim();
  const o2 = document.getElementById("question-option2").value.trim();
  const o3 = document.getElementById("question-option3").value.trim();
  const o4 = document.getElementById("question-option4").value.trim();
  const answer = document.getElementById("question-answer").value.trim();
  const message = document.getElementById("question-message");
  if (!qText || !o1 || !o2 || !o3 || !o4 || !answer) { message.textContent = "All fields required!"; message.className = "error"; return; }
  subjects[subject].push({ q: qText, options: [o1,o2,o3,o4], answer: answer });
  message.textContent = "Question added!"; message.className = "success";
  document.getElementById("question-text").value = "";
  document.getElementById("question-option1").value = "";
  document.getElementById("question-option2").value = "";
  document.getElementById("question-option3").value = "";
  document.getElementById("question-option4").value = "";
  document.getElementById("question-answer").value = "";
}
