import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// REGISTER USER
export async function registerUser({ name, email, password, role, department, subject }) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    await setDoc(doc(db, "users", uid), {
      name,
      email,
      role,
      department: department || "",
      subject: subject || "",
      status: "pending", // ✅ approval required
    });

    alert("Registration successful! Wait for admin approval.");
    window.location.href = "../pages/index.html";
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// LOGIN USER (only if approved)
export async function loginUser(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) throw new Error("User not found in Firestore.");

    const userData = userDoc.data();

    if (userData.status !== "approved") {
      await signOut(auth);
      alert("Your account is pending admin approval.");
      return;
    }

    if (userData.role === "admin") {
      window.location.href = "../pages/admin-dashboard.html";
    } else if (userData.role === "teacher") {
      window.location.href = "../pages/teacher-dashboard.html";
    } else {
      window.location.href = "../pages/student-dashboard.html";
    }
  } catch (err) {
    alert(err.message);
  }
}

// LOGOUT
export async function logoutUser() {
  await signOut(auth);
  window.location.href = "../pages/index.html";
}
