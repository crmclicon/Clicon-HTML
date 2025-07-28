import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

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

export const crearUsuarioDesdePanel = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "No estás autenticado");
    }

    const { email, password, rol, nombre } = data;

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password
      });

      await admin.firestore().collection("usuarios").doc(userRecord.uid).set({
        email,
        rol,
        nombre,
        activo: true
      });

      return { mensaje: "Usuario creado correctamente" };
    } catch (error: any) {
      throw new functions.https.HttpsError("internal", error.message);
    }
  }
);
