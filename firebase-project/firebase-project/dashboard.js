
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdzbqyo-WSPIWBYU6jAywi4-C7IBEjotM",
  authDomain: "labexam-feb20.firebaseapp.com",
  projectId: "labexam-feb20",
  storageBucket: "labexam-feb20.firebasestorage.app",
  messagingSenderId: "487073000515",
  appId: "1:487073000515:web:9ef1504c21cf3a9b0bb8f6",
  measurementId: "G-DJX5TQN1EH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check whether the user is logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("index.html");
    }
});

// Save student details
document.getElementById("detailsForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const age = Number(document.getElementById("age").value);
    const department = document.getElementById("department").value.trim();
    const message = document.getElementById("message");

    try {
        const user = auth.currentUser;

        if (!user) {
            message.textContent = "Please log in first.";
            return;
        }

        await addDoc(collection(db, "students"), {
            name: name,
            email: email,
            age: age,
            department: department,
            userId: user.uid,
            createdAt: serverTimestamp()
        });

        message.textContent = "Student details saved successfully!";

        document.getElementById("detailsForm").reset();

    } catch (error) {
        message.textContent = "Error: " + error.message;
    }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.replace("index.html");
});
