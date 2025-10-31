// js/messages.js
import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Send Message
export async function sendMessage(senderId, receiverId, message) {
  try {
    await addDoc(collection(db, "messages"), { senderId, receiverId, message, timestamp: Date.now() });
  } catch (error) { alert(error.message); }
}

// Get Messages
export async function getMessages(user1, user2) {
  try {
    const q = query(collection(db, "messages"));
    const snapshot = await getDocs(q);
    const msgs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if ((data.senderId === user1 && data.receiverId === user2) || (data.senderId === user2 && data.receiverId === user1)) {
        msgs.push(data);
      }
    });
    return msgs;
  } catch (error) { alert(error.message); return []; }
}
