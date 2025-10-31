import { auth, db } from "./firebase-config.js";
import { logoutUser } from "./auth.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// logout
document.getElementById("logoutBtn").addEventListener("click", logoutUser);

// Add teacher
document.getElementById("addTeacherBtn").addEventListener("click", async () => {
  const name = document.getElementById("tName").value;
  const dept = document.getElementById("tDept").value;
  const subject = document.getElementById("tSubject").value;
  const email = document.getElementById("tEmail").value;
  const password = document.getElementById("tPassword").value;

  if (!name || !dept || !subject || !email || !password) {
    alert("Please fill all fields!");
    return;
  }

  try {
    // create auth account
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // add Firestore doc
    await setDoc(doc(db, "users", uid), {
      name,
      department: dept,
      subject,
      email,
      role: "teacher",
      status: "approved",
    });

    alert("Teacher added successfully!");
    loadTeachers();
  } catch (err) {
    alert(err.message);
  }
});

// load teachers
async function loadTeachers() {
  const container = document.getElementById("teachersList");
  container.innerHTML = "Loading...";

  const querySnapshot = await getDocs(collection(db, "users"));
  const teachers = [];
  querySnapshot.forEach((d) => {
    if (d.data().role === "teacher") teachers.push({ id: d.id, ...d.data() });
  });

  container.innerHTML = "";
  teachers.forEach((t) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p><b>Name:</b> ${t.name}</p>
      <p><b>Department:</b> ${t.department}</p>
      <p><b>Subject:</b> ${t.subject}</p>
      <p><b>Email:</b> ${t.email}</p>
      <button class="deleteBtn" data-id="${t.id}">Delete</button>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (confirm("Delete this teacher?")) {
        await deleteDoc(doc(db, "users", id));
        loadTeachers();
      }
    });
  });
}

// load students
async function loadStudents() {
  const container = document.getElementById("studentsList");
  container.innerHTML = "Loading...";

  const querySnapshot = await getDocs(collection(db, "users"));
  const students = [];
  querySnapshot.forEach((d) => {
    if (d.data().role === "student" && d.data().status === "pending")
      students.push({ id: d.id, ...d.data() });
  });

  container.innerHTML = "";
  students.forEach((s) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p><b>Name:</b> ${s.name}</p>
      <p><b>Email:</b> ${s.email}</p>
      <button class="approveBtn" data-id="${s.id}">Approve</button>
      <button class="rejectBtn" data-id="${s.id}">Reject</button>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll(".approveBtn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await updateDoc(doc(db, "users", id), { status: "approved" });
      loadStudents();
    });
  });

  document.querySelectorAll(".rejectBtn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await deleteDoc(doc(db, "users", id));
      loadStudents();
    });
  });
}

auth.onAuthStateChanged((user) => {
  if (user) {
    loadTeachers();
    loadStudents();
  } else {
    window.location.href = "../index.html";
  }
});
