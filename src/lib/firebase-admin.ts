import admin from 'firebase-admin';

// This function centralizes the initialization of the Firebase Admin SDK.
function initializeFirebaseAdmin() {
    // Avoid re-initializing the app if it's already been done.
    if (admin.apps.length > 0) {
        return;
    }

    // A detailed error message to guide the user if the credential environment variable is not set.
    const credentialError = 'A variável de ambiente FIREBASE_ADMIN_SDK_CONFIG não está definida ou está mal formatada. ' +
        'Por favor, crie um arquivo .env na raiz do projeto e adicione a configuração completa do seu Service Account do Firebase como uma única string JSON. ' +
        'Exemplo no seu arquivo .env: \n' +
        'FIREBASE_ADMIN_SDK_CONFIG=\'{"type": "service_account", "project_id": "seu-id-de-projeto", "private_key_id": "...", "private_key": "...", "client_email": "...", ...}\'\n' +
        'Você pode obter este JSON no Console do Firebase > Configurações do Projeto > Contas de Serviço > Gerar nova chave privada. Após adicionar/alterar, reinicie o servidor de desenvolvimento.';

    if (!process.env.FIREBASE_ADMIN_SDK_CONFIG) {
        throw new Error(credentialError);
    }

    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG);

        // Environment variables often escape newline characters. We need to un-escape them for the private key to be valid.
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error: any) {
        console.error('Falha ao inicializar o Firebase Admin:', error.message);
        // If initialization fails (e.g., due to malformed JSON), throw the same helpful error.
        throw new Error(credentialError);
    }
}

// Initialize the app when this module is imported.
initializeFirebaseAdmin();

// Export the initialized services for use in server-side code.
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
