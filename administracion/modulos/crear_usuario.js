import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDocs,
  collection,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  getFunctions,
  httpsCallable
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

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
const db = getFirestore();
const functions = getFunctions();

// Forzar persistencia de sesión para que funcione en iframe
await setPersistence(auth, browserLocalPersistence);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("No estás autenticado");
    window.top.location.href = "/index.html";
  }
});

window.crearUsuario = async function () {
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rol = document.getElementById("rol").value;

  const crearUsuarioFn = httpsCallable(functions, "crearUsuarioDesdePanel");

  try {
    const result = await crearUsuarioFn({ email, password, rol, nombre });
    alert(result.data.mensaje);
    cargarUsuarios();
  } catch (error) {
    alert("Error: " + error.message);
  }
};

async function cargarUsuarios() {
  const tabla = document.getElementById("tablaUsuarios");
  tabla.innerHTML = "";
  const snapshot = await getDocs(collection(db, "usuarios"));
  snapshot.forEach((docu) => {
    const data = docu.data();
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${data.email}</td>
      <td>${data.rol}</td>
      <td>${data.activo ? "Activo" : "Deshabilitado"}</td>
      <td><button class="btn-deshabilitar" onclick="toggleUsuario('${docu.id}', ${data.activo})">${data.activo ? "Deshabilitar" : "Habilitar"}</button></td>
    `;
    tabla.appendChild(fila);
  });
}

window.toggleUsuario = async function (uid, estadoActual) {
  await updateDoc(doc(db, "usuarios", uid), {
    activo: !estadoActual
  });
  cargarUsuarios();
};

cargarUsuarios();
