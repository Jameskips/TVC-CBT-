// ------------ JSONBin.io Config ------
const BIN_ID = "68b2ba9e43b1c97be9305ef8"; 
const API_KEY = "$2a$10$fWok9ba27BiXeCpOUIUYaOKx8SDCAhODlzlPkZ.6pyu3xjClAGuhy";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let students = {};
let subjects = {};
let results = {};
let adminPassword = "";
let currentStudent = null;
let currentSubject = null;
let examTimer = null;
let examDuration = 10*60; // example: 10 minutes

// ---------- Load Data ----------
async function loadData(){
  try{
    const res = await fetch(BIN_URL+"/latest",{ headers:{"X-Master-Key":API_KEY} });
    const data = await res.json();
    students = data.record.students;
    subjects = data.record.subjects;
    results = data.record.results || {};
    adminPassword = data.record.adminPassword;
  }catch(err){ console.error(err); alert("Failed to load data."); }
}

// ---------- Save Data ----------
async function saveData(){
  try{
    await fetch(BIN_URL,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "X-Master-Key":API_KEY
      },
      body: JSON.stringify({ students, subjects, results, adminPassword })
    });
  }catch(err){ console.error(err); alert("Failed to save data."); }
}

// ---------- Login ----------
async function login(){
  await loadData();
  const id=document.getElementById("studentName").value.trim();
  const pass=document.getElementById("password").value;
  const error=document.getElementById("login-error");
  
  if(pass===adminPassword && id.toLowerCase()==="admin"){
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    displayStudents();
    displaySubjects();
    viewAllScores();
    return;
  }

  if(students[id] && students[id].password===pass){
    currentStudent=id;
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("subject-screen").classList.remove("hidden");
    populateSubjectSelect();
    error.textContent="";
  }else{
    error.textContent="Invalid ID or Password!";
  }
}

// ---------- Populate Subjects ----------
function populateSubjectSelect(){
  const select=document.getElementById("subject-select");
  select.innerHTML="";
  for(const s in subjects){ const option=document.createElement("option"); option.value=s; option.textContent=s; select.appendChild(option); }
}

// ---------- Start Exam ----------
function startExam(){
  currentSubject=document.getElementById("subject-select").value;
  document.getElementById("subject-screen").classList.add("hidden");
  document.getElementById("exam-screen").classList.remove("hidden");
  document.getElementById("exam-title").textContent=currentSubject+" Exam";
  loadExam();
  startTimer();
}

// ---------- Timer ----------
function startTimer(){
  let time=examDuration;
  const timerElem=document.getElementById("timer");
  examTimer=setInterval(()=>{
    let mins=Math.floor(time/60); let secs=time%60;
    timerElem.textContent=`${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    if(time<=0){ clearInterval(examTimer); submitExam(); }
    time--;
  },1000);
}

// ---------- Load Exam ----------
function loadExam(){
  const form=document.getElementById("exam-form");
  form.innerHTML="";
  subjects[currentSubject].forEach((q,i)=>{
    const div=document.createElement("div");
    div.innerHTML=`<p><b>${i+1}. ${q.q}</b></p>`+
      q.options.map(opt=>`<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`).join("");
    form.appendChild(div);
  });
}

// ---------- Submit Exam ----------
async function submitExam(){
  clearInterval(examTimer);
  let score=0;
  subjects[currentSubject].forEach((q,i)=>{
    const selected=document.querySelector(`input[name="q${i}"]:checked`);
    if(selected && selected.value===q.answer){ score++; }
  });
  // Save score to results (Admin only sees)
  if(!results[currentSubject]) results[currentSubject]={};
  results[currentSubject][currentStudent]=score;
  await saveData();
  document.getElementById("exam-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");
}

// ---------- Logout ----------
function logout(){
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("subject-screen").classList.add("hidden");
  document.getElementById("exam-screen").classList.add("hidden");
  document.getElementById("admin-panel").classList.add("hidden");
  document.getElementById("result-screen").classList.add("hidden");
  currentStudent=null;
  currentSubject=null;
}

// ---------- Admin Functions ----------

// Change Admin Password
async function changePassword(){
  const newPass=document.getElementById("newPassword").value;
  if(newPass){ adminPassword=newPass; document.getElementById("admin-message").textContent="Admin password updated!"; await saveData(); }
}

// Add Student
async function addStudent(){
  const id=document.getElementById("newStudentID").value.trim();
  const name=document.getElementById("newStudentName").value.trim();
  const pass=document.getElementById("newStudentPass").value.trim();
  const msg=document.getElementById("student-message");
  if(!id||!name||!pass){ msg.textContent="All fields required!"; msg.className="error"; return; }
  if(students[id]){ msg.textContent="Student ID exists!"; msg.className="error"; return; }
  students[id]={ name, password: pass };
  msg.textContent=`Student ${name} added!`; msg.className="success";
  document.getElementById("newStudentID").value="";
  document.getElementById("newStudentName").value="";
  document.getElementById("newStudentPass").value="";
  displayStudents();
  await saveData();
}

// Display Students
function displayStudents(){
  const list=document.getElementById("student-list");
  list.innerHTML="";
  for(const id in students){ const li=document.createElement("li"); li.textContent=`${id} - ${students[id].name}`; list.appendChild(li); }
}

// Add Subject
async function addSubject(){
  const name=document.getElementById("newSubjectName").value.trim();
  const msg=document.getElementById("subject-message");
  if(!name){ msg.textContent="Enter subject name!"; msg.className="error"; return; }
  if(subjects[name]){ msg.textContent="Subject exists!"; msg.className="error"; return; }
  subjects[name]=[];
  msg.textContent=`Subject ${name} added!`; msg.className="success";
  document.getElementById("newSubjectName").value="";
  displaySubjects();
  await saveData();
}

// Display Subjects
function displaySubjects(){
  const list=document.getElementById("subject-list");
  const select=document.getElementById("question-subject-select");
  list.innerHTML=""; select.innerHTML="";
  for(const s in subjects){
    const li=document.createElement("li"); li.textContent=s; list.appendChild(li);
    const option=document.createElement("option"); option.value=s; option.textContent=s; select.appendChild(option);
  }
}

// Add Question
async function addQuestion(){
  const subj=document.getElementById("question-subject-select").value;
  const q=document.getElementById("question-text").value.trim();
  const o1=document.getElementById("question-option1").value.trim();
  const o2=document.getElementById("question-option2").value.trim();
  const o3=document.getElementById("question-option3").value.trim();
  const o4=document.getElementById("question-option4").value.trim();
  const ans=document.getElementById("question-answer").value.trim();
  const msg=document.getElementById("question-message");
  if(!q||!o1||!o2||!o3||!o4||!ans){ msg.textContent="All fields required!"; msg.className="error"; return; }
  subjects[subj].push({ q, options:[o1,o2,o3,o4], answer:ans });
  msg.textContent="Question added!"; msg.className="success";
  document.getElementById("question-text").value="";
  document.getElementById("question-option1").value="";
  document.getElementById("question-option2").value="";
  document.getElementById("question-option3").value="";
  document.getElementById("question-option4").value="";
  document.getElementById("question-answer").value="";
  await saveData();
}

// View All Scores (Admin)
function viewAllScores(){
  const table=document.getElementById("scores-table");
  table.innerHTML="<tr><th>Student</th><th>Subject</th><th>Score</th></tr>";
  for(const subj in results){
    for(const studentID in results[subj]){
      const tr=document.createElement("tr");
      tr.innerHTML=`<td>${students[studentID].name}</td><td>${subj}</td><td>${results[subj][studentID]}</td>`;
      table.appendChild(tr);
    }
  }
}

