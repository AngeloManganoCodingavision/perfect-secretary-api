import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  type: "service_account",
  project_id: "perfect-secretary-2ff60",
  private_key_id: process.env.FIREBASE_SECRET_KEY_ID,
  private_key: process.env.FIREBASE_SECRET_KEY,
  client_email: "firebase-adminsdk-ky67r@perfect-secretary-2ff60.iam.gserviceaccount.com",
  client_id: "115579771995354304788",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ky67r%40perfect-secretary-2ff60.iam.gserviceaccount.com"
};

initializeApp({
  credential: cert(serviceAccount as ServiceAccount)
});

const db = getFirestore();

export default db;