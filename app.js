// --- JSONBin.io Config ---
const BIN_ID = "68b2ba9e43b1c97be9305ef8"; 
const API_KEY = "$2a$10$fWok9ba27BiXeCpOUIUYaOKx8SDCAhODlzlPkZ.6pyu3xjClAGuhy";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Data placeholders
let students = {};
let subjects = {};
let adminPassword = "";
let currentStudent = null;
let currentSubject = null;

// --- Helper: Fetch Data from JSONBin ---
async function loadData() {
  try {
    const res = await fetch(BIN_URL + "/latest", {
      headers: { "X-Master-Key": API_KEY }
    });
    const data = await res.json();
    students = data.record.students;
    subjects = data.record.subjects;
    adminPassword = data.record.adminPassword;
  } catch (err) {
    console.error("Error loading data:", err);
    alert("Failed to load data. Check your JSONBin config.");
  }
}

// --- Helper: Save Data to JSONBin ---
async function saveData() {
  try {
    await fetch(BIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify({ students, subjects, adminPassword })
    });
  } catch (err) {
    console.error("Error saving data:", err);
    alert("Failed to save data. Check your JSONBin config.");
  }
}

// --- Login ---
async function login() {
  await loadData();
  const studentID = document.getElementById("studentName").value.trim();
  const pass = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  if (!studentID) { error.textContent = "Enter your Name/ID!"; return; }

  if (pass === adminPassword && studentID.toLowerCase() === "admin") {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
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

// --- Populate Subjects ---
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

// --- Start Exam ---
function startExam() {
  const select = document.getElementById("subject-select");
  currentSubject = select.value;
  document.getElementById("subject-screen").classList.add("hidden");
  document.getElementById("exam-screen").classList.remove("hidden");
  document.getElementById("exam-title").textContent = currentSubject + " Exam";
  loadExam();
}

// --- Load Exam ---
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

// --- Submit Exam ---
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

// --- Logout ---
function logout() {
  document.getElementById("result-screen").classList.add("hidden");
  document.getElementById("subject-screen").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
  currentStudent = null;
  currentSubject = null;
}

// --- Admin: Change Password ---
async function changePassword() {
  const newPass = document.getElementById("newPassword").value;
  if (newPass) { adminPassword = newPass; document.getElementById("admin-message").textContent = "Admin password updated!"; await saveData(); }
}

// --- Admin: Student Management ---
async function addStudent() {
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
  await saveData();
}

function displayStudents() {
  const list = document.getElementById("student-list");
  list.innerHTML = "";
  for (const id in students) { const li = document.createElement("li"); li.textContent = `${id} - ${students[id].name}`; list.appendChild(li); }
}

// --- Admin: Subject Management ---
async function addSubject() {
  const name = document.getElementById("newSubjectName").value.trim();
  const message = document.getElementById("subject-message");
  if (!name) { message.textContent = "Enter subject name!"; message.className = "error"; return; }
  if (subjects[name]) { message.textContent = "Subject exists!"; message.className = "error"; return; }
  subjects[name] = [];
  message.textContent = `Subject ${name} added!`; message.className = "success";
  document.getElementById("newSubjectName").value = "";
  displaySubjects();
  await saveData();
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

// --- Admin: Question Management ---
async function addQuestion() {
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
  await saveData();
}
