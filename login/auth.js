// auth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDw4amrnoIcj1nvBeOlchzv5kBaD_sVSoE",
  authDomain: "clicon-oficial.firebaseapp.com",
  projectId: "clicon-oficial",
  storageBucket: "clicon-oficial.firebasestorage.app",
  messagingSenderId: "604078149403",
  appId: "1:604078149403:web:5da069e8254c3695028dbe"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      window.location.href = "/crmclicon/propietario/";
    } catch (error) {
      alert("Usuario o contraseña incorrectos");
    }
  });
});