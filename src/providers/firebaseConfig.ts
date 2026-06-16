const _env = typeof import.meta !== "undefined" && (import.meta as any).env ? (import.meta as any).env : process.env;

export const FIREBASE_CONFIG = {
  apiKey:
    _env.VITE_FIREBASE_API_KEY || _env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain:
    _env.VITE_FIREBASE_AUTH_DOMAIN || _env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  projectId:
    _env.VITE_FIREBASE_PROJECT_ID || _env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket:
    _env.VITE_FIREBASE_STORAGE_BUCKET || _env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId:
    _env.VITE_FIREBASE_MESSAGING_SENDER_ID || _env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: _env.VITE_FIREBASE_APP_ID || _env.REACT_APP_FIREBASE_APP_ID || "",
};

// For Vite use `VITE_FIREBASE_*` in your .env; this file also accepts
// legacy `REACT_APP_FIREBASE_*` variables as a fallback.
