// auth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDw4amrnoIcj1nvBeOlchzv5kBaD_sVSoE",
  authDomain: "clicon-oficial.firebaseapp.com",
  projectId: "clicon-oficial",
  storageBucket: "clicon-oficial.firebasestorage.app",
  messagingSenderId: "604078149403",
  appId: "1:604078149403:web:5da069e8254c3695028dbe"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth();
const db = getFirestore();

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      console.log("✅ Login OK:", userCredential.user);
      const uid = userCredential.user.uid;
      console.log("🆔 UID:", uid);

      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);

      console.log("📄 Documento cargado:", docSnap.exists(), docSnap.data());  // 👉 agregado

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.activo === false) {
          alert("Este usuario está deshabilitado");
          return;
        }

        const rol = data.rol;

        if (rol === "propietario") {
          window.location.href = "/clicon-html/propietario/propietario.html";
        } else if (rol === "administrador") {
          window.location.href = "/Clicon-HTML/administracion/administracion.html";
        } else if (rol === "gerente") {
          window.location.href = "/clicon-html/gerente/";
        } else if (rol === "supervisor") {
          window.location.href = "/clicon-html/supervisor/";
        } else if (rol === "vendedor") {
          window.location.href = "/clicon-html/vendedor/";
        } else {
          alert("Rol no reconocido");
        }
      } else {
        alert("No se encontró información del rol del usuario");
      }

    } catch (error) {
      console.error("🔥 ERROR de login:", error.code, error.message);
      alert("Error: " + error.message);
    }
  });
});
