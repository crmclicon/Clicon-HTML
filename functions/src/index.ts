import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

initializeApp();

export const crearCarpetasEmpresa = onDocumentCreated("empresas/{empresaId}", async (event) => {
  const snap = event.data;
  const empresaData = snap?.data();
  const nombreEmpresa = empresaData?.nombre;

  if (!nombreEmpresa || typeof nombreEmpresa !== "string") {
    console.error("No se encontró un 'nombre' válido en el documento");
    return;
  }

  const storage = getStorage().bucket();

  const carpetas = [
    `empresas/${nombreEmpresa}/historial_carteras/.init`,
    `empresas/${nombreEmpresa}/historial_ventas/.init`,
    `empresas/${nombreEmpresa}/documentacion_clientes/.init`,
  ];

  await Promise.all(
    carpetas.map(path => storage.file(path).save("inicial"))
  );

  console.log(`Carpetas creadas para empresa ${nombreEmpresa}`);
});
