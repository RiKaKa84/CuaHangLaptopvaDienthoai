import config from './config';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: config.API_KEY,
    authDomain: config.AUTH_DOMAIN,
    databaseURL: config.DATABASE_URL,
    projectId: config.PROJECT_ID,
    storageBucket: config.STORAGE_BUCKET,
    messagingSenderId: config.MESSAGINSENDERID,
    appId: config.API_ID,
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

export default app;
