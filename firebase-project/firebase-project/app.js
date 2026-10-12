
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
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

// Google provider
const googleProvider = new GoogleAuthProvider();

// HTML elements
const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const googleBtn = document.getElementById("googleBtn");
const message = document.getElementById("message");

// Show messages
function showMessage(text) {
    message.textContent = text;
}

// Redirect users who are already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.replace("dashboard.html");
    }
});

// LOGIN WITH EMAIL AND PASSWORD
authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginBtn.disabled = true;
    signupBtn.disabled = true;
    googleBtn.disabled = true;

    showMessage("Logging in...");

    try {
        await signInWithEmailAndPassword(auth, email, password);

        showMessage("Login successful!");
        window.location.replace("dashboard.html");

    } catch (error) {
        console.error("Login error:", error);
        showMessage("Login failed: " + error.message);

    } finally {
        loginBtn.disabled = false;
        signupBtn.disabled = false;
        googleBtn.disabled = false;
    }
});

// CREATE ACCOUNT WITH EMAIL AND PASSWORD
signupBtn.addEventListener("click", async () => {
    if (!authForm.reportValidity()) {
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginBtn.disabled = true;
    signupBtn.disabled = true;
    googleBtn.disabled = true;

    showMessage("Creating account...");

    try {
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = result.user;

        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            name: "",
            photoURL: "",
            createdAt: new Date()
        });

        showMessage("Account created successfully!");
        window.location.replace("dashboard.html");

    } catch (error) {
        console.error("Signup error:", error);
        showMessage("Signup failed: " + error.message);

    } finally {
        loginBtn.disabled = false;
        signupBtn.disabled = false;
        googleBtn.disabled = false;
    }
});

// SIGN IN WITH GOOGLE
googleBtn.addEventListener("click", async () => {
    loginBtn.disabled = true;
    signupBtn.disabled = true;
    googleBtn.disabled = true;

    showMessage("Connecting to Google...");

    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Save Google account details in Firestore
        await setDoc(
            doc(db, "users", user.uid),
            {
                name: user.displayName || "",
                email: user.email || "",
                photoURL: user.photoURL || "",
                createdAt: new Date()
            },
            { merge: true }
        );

        showMessage("Google login successful!");
        window.location.replace("dashboard.html");

    } catch (error) {
        console.error("Google login error:", error);

        showMessage(
            "Google login failed: " +
            error.code + " - " + error.message
        );

    } finally {
        loginBtn.disabled = false;
        signupBtn.disabled = false;
        googleBtn.disabled = false;
    }
});
