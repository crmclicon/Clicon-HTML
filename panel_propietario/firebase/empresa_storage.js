import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getStorage, ref, uploadString } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDw4amrnoIcj1nvBeOlchzv5kBaD_sVSoE",
  authDomain: "clicon-oficial.firebaseapp.com",
  projectId: "clicon-oficial",
  storageBucket: "clicon-oficial.appspot.com",
  messagingSenderId: "604078149403",
  appId: "1:604078149403:web:5da069e8254c3695028dbe"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Espera a que cargue el DOM
window.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn_crear_empresa");

  if (boton) {
    boton.addEventListener("click", async () => {
      const nombre = document.getElementById("nombre_empresa").value.trim();
      const email = document.getElementById("email_responsable").value.trim();
      const pass = document.getElementById("pass_empresa").value;

      if (!nombre || !email || !pass) {
        alert("Faltan datos");
        return;
      }

      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, pass);
        const uid = userCred.user.uid;

        // Crear carpetas en Storage con archivo .init
        const carpetas = ["historial_carteras", "historial_ventas", "documentacion_clientes"];
        for (const carpeta of carpetas) {
          const refPath = ref(storage, `${nombre}/${carpeta}/.init`);
          await uploadString(refPath, "placeholder");
        }

        alert("Empresa creada y carpetas generadas con éxito");
      } catch (error) {
        alert("Error: " + error.message);
      }
    });
  }
});
