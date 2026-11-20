import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
const serviceAccountJson = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf-8");
const serviceAccount = JSON.parse(serviceAccountJson);
const app = initializeApp({ credential: cert(serviceAccount) });
export default getAuth(app);
