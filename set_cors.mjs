import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { readFileSync } from 'fs';

const cors = JSON.parse(readFileSync('cors.json', 'utf8'));
const serviceAccount = JSON.parse(readFileSync('firebase-key.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'clicon-oficial'
});

const bucket = getStorage().bucket();

bucket.setCorsConfiguration(cors)
  .then(() => {
    console.log('✅ CORS configurado correctamente.');
  })
  .catch((err) => {
    console.error('❌ Error al configurar CORS:', err);
  });
