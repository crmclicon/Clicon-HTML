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

// 🔧 Configuración de Firebase
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

// 🧩 Verificar sesión activa
async function iniciar() {
  await setPersistence(auth, browserLocalPersistence);

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setTimeout(() => {
        if (!auth.currentUser) {
          alert("Sesión no detectada");
          window.location.href = "https://crmclicon.github.io/Clicon-HTML/login/login.html";
        }
      }, 1000);
    }
  });
}

iniciar();

// ➕ Crear nuevo usuario
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

// 📥 Cargar todos los usuarios en la tabla
async function cargarUsuarios() {
  const tabla = document.getElementById("tablaUsuarios");
  tabla.innerHTML = "";

  const snapshot = await getDocs(collection(db, "usuarios"));
  snapshot.forEach((docu) => {
    const data = docu.data();
    const fila = document.createElement("tr");

    // 🔍 Atributos para búsqueda
    fila.setAttribute("data-email", data.email.toLowerCase());
    fila.setAttribute("data-rol", data.rol.toLowerCase());

    // 🎨 Construir la fila con botón cambiar contraseña
    fila.innerHTML = `
      <td>${data.email}</td>
      <td>${data.rol}</td>
      <td>${data.activo ? "Activo" : "Deshabilitado"}</td>
      <td>
        <button class="btn-deshabilitar" onclick="toggleUsuario('${docu.id}', ${data.activo})">
          ${data.activo ? "Deshabilitar" : "Habilitar"}
        </button><br>
        <button style="margin-top:8px;" onclick="mostrarInputPassword(this, '${data.email}')">🔑 Cambiar</button>
        <div style="margin-top:8px; display:none;">
          <input type="password" placeholder="Nueva contraseña" style="width:200px; padding:6px; border-radius:8px; border:1px solid #ccc;">
          <button onclick="cambiarPassword(this, '${data.email}')">Guardar</button>
        </div>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

// 🔁 Activar / desactivar usuario
window.toggleUsuario = async function (uid, estadoActual) {
  await updateDoc(doc(db, "usuarios", uid), {
    activo: !estadoActual
  });
  cargarUsuarios();
};

// 🔍 Filtrar usuarios por texto
window.filtrarUsuarios = function () {
  const filtro = document.getElementById("buscador").value.toLowerCase();
  const filas = document.querySelectorAll("#tablaUsuarios tr");

  filas.forEach(fila => {
    const email = fila.getAttribute("data-email");
    const rol = fila.getAttribute("data-rol");
    const visible = email.includes(filtro) || rol.includes(filtro);
    fila.style.display = visible ? "" : "none";
  });
};

// 👁 Mostrar input para cambiar contraseña
window.mostrarInputPassword = function (btn, email) {
  const contenedor = btn.nextElementSibling;
  contenedor.style.display = contenedor.style.display === "none" ? "block" : "none";
};

// 🔐 Cambiar contraseña desde backend (requiere función Firebase)
window.cambiarPassword = async function (btn, email) {
  const input = btn.previousElementSibling;
  const nueva = input.value.trim();

  if (!nueva || nueva.length < 6) {
    alert("La nueva contraseña debe tener al menos 6 caracteres");
    return;
  }

  const cambiarPasswordFn = httpsCallable(functions, "cambiarPasswordDesdePanel");

  try {
    const result = await cambiarPasswordFn({ email, nuevaPassword: nueva });
    alert(result.data.mensaje || "Contraseña actualizada");
  } catch (error) {
    alert("Error al cambiar la contraseña: " + error.message);
  }
};

// ⏬ Ejecutar al iniciar
cargarUsuarios();
