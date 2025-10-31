// js/appointments.js
import { db, auth } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Book Appointment
export async function bookAppointment({ studentId, teacherId, date, time }) {
  try {
    await addDoc(collection(db, "appointments"), {
      studentId,
      teacherId,
      date,
      time,
      status: "pending"
    });
    alert("Appointment booked!");
  } catch (error) {
    console.error("Firestore Error:", error);
    alert("Error booking appointment: " + error.message);
  }
}

// Get Appointments
export async function getAppointments(role) {
  try {
    let q;
    if (role === "student") {
      q = query(collection(db, "appointments"), where("studentId", "==", auth.currentUser.uid));
    } else if (role === "teacher") {
      q = query(collection(db, "appointments"), where("teacherId", "==", auth.currentUser.uid));
    } else {
      q = collection(db, "appointments"); // admin
    }

    const snapshot = await getDocs(q);
    const appointments = [];
    snapshot.forEach(d => appointments.push({ id: d.id, ...d.data() }));
    return appointments;
  } catch (error) {
    console.error("Firestore Error:", error);
    return [];
  }
}

// MARK appointment as done 
export async function markAppointmentDone(appointmentId) {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await updateDoc(appointmentRef, { status: "done" });
    alert("Appointment marked as done!");
  } catch (error) {
    console.error(error);
    alert("Error updating appointment: " + error.message);
  }
}
