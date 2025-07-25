import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { FirestoreEvent } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { DocumentSnapshot } from "firebase-admin/firestore";

initializeApp();

export const onEmpresaCreated = onDocumentCreated("empresas/{empresaId}", async (event: FirestoreEvent<DocumentSnapshot>) => {
  const snap = event.data;
  const empresaId = event.params.empresaId;

  if (!snap || !empresaId) {
    console.error("Falta documento o ID de empresa");
    return;
  }

  const storage = getStorage().bucket();

  const carpetas = [
    `empresas/${empresaId}/historial_carteras/`,
    `empresas/${empresaId}/historial_ventas/`,
    `empresas/${empresaId}/documentacion_clientes/`
  ];

  for (const carpeta of carpetas) {
    const file = storage.file(`${carpeta}.init`);
    await file.save("inicialización");
  }

  console.log(`Carpetas creadas para empresa: ${empresaId}`);
});
