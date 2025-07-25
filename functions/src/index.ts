import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

initializeApp();

export const crearCarpetasEmpresa = onDocumentCreated("empresas/{empresaId}", async (event) => {
  // const snap = event.data as QueryDocumentSnapshot;
  const empresaId = event.params.empresaId;

  const storage = getStorage().bucket();

  const carpetas = [
    `empresas/${empresaId}/historial_carteras/.init`,
    `empresas/${empresaId}/historial_ventas/.init`,
    `empresas/${empresaId}/documentacion_clientes/.init`,
  ];

  await Promise.all(
    carpetas.map(path => storage.file(path).save("inicial"))
  );

  console.log(`Carpetas creadas para empresa ${empresaId}`);
});
