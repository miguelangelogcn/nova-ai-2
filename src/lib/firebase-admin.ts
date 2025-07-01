require('dotenv').config({ path: 'envs/.env.local' });
import admin from 'firebase-admin';

// -----------------------------------------------------------------------------
// Firebase Admin
// -----------------------------------------------------------------------------
// As variáveis de ambiente agora são carregadas do arquivo `envs/.env.local`.

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  throw new Error(`
    **ERRO DE CONFIGURAÇÃO DO FIREBASE ADMIN**

    Uma ou mais variáveis de ambiente do Firebase Admin não foram encontradas.
    Verifique se você moveu o arquivo '.env.local' para a pasta 'envs' na raiz do seu projeto com o seguinte conteúdo:

    FIREBASE_PROJECT_ID="seu-project-id-aqui"
    FIREBASE_CLIENT_EMAIL="seu-client-email-aqui"
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...sua chave completa aqui...\\n-----END PRIVATE KEY-----\\n"

    **Importante:**
    1. O arquivo deve se chamar '.env.local' e estar dentro da pasta 'envs'.
    2. O valor da FIREBASE_PRIVATE_KEY deve estar entre aspas duplas (") e as quebras de linha devem ser escritas como '\\n'.
    3. Após criar ou alterar o arquivo, você **PRECISA REINICIAR O SERVIDOR DE DESENVOLVIMENTO** para que as alterações tenham efeito.
  `);
}

const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
    databaseURL: `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
