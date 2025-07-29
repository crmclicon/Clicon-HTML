
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getStorage, ref, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs";

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
const storage = getStorage(app);
let currentUserEmail = "";

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserEmail = user.email;
  } else {
    alert("Debes estar logueado");
    window.location.href = "/index.html";
  }
});

document.getElementById("ventaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    NOMBRE_SUSCRIPTOR: document.getElementById("nombre").value,
    DOMICILIO_SUSCRIPTOR: document.getElementById("domicilio").value,
    LOCALIDAD: document.getElementById("localidad").value,
    CODIGO_POSTAL: document.getElementById("codigo_postal").value,
    TELEFONO_SUSCRIPTOR: document.getElementById("telefono").value,
    TELEFONO_ALTERNATIVO: document.getElementById("telefono_alt").value,
    Mail: document.getElementById("email").value,
    "Nro Documento": document.getElementById("dni").value,
    "Fecha de nacimiento": document.getElementById("fecha_nac").value,
    VENDEDOR: currentUserEmail,
  };

  try {
    const fileRef = ref(storage, "ventas/historial_ventas.xlsx");
    const url = await getDownloadURL(fileRef);
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    json.push(data);

    const newSheet = XLSX.utils.json_to_sheet(json, { skipHeader: false });
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Hoja1");
    const updatedExcel = XLSX.write(newWorkbook, { bookType: "xlsx", type: "array" });

    await uploadBytes(fileRef, new Blob([updatedExcel], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));

    alert("✅ Venta cargada exitosamente");
    document.getElementById("ventaForm").reset();
  } catch (error) {
    console.error("Error al cargar venta:", error);
    alert("❌ Error al guardar la venta.");
  }
});
