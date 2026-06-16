import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { FIREBASE_CONFIG } from "./firebaseConfig";

const app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
