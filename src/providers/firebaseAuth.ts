import type { AuthProvider } from "@refinedev/core";
import {
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./firebaseClient";

export const authProvider: AuthProvider = {
  login: async ({ email, password, remember }: any) => {
    try {
      if (!email || !password) {
        return {
          success: false,
          error: new Error("Email and password are required."),
        };
      }

      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence,
      );

      await signInWithEmailAndPassword(auth, email, password);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }
  },

  check: async () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();

        if (user) {
          resolve({ authenticated: true });
        } else {
          resolve({
            authenticated: false,
            redirectTo: "/login",
            logout: true,
          });
        }
      });
    });
  },

  onError: async (error: any) => {
    return {
      error,
      logout: false,
      redirectTo: "/login",
    };
  },

  register: async ({ email, password }: any) => {
    try {
      if (!email || !password) {
        return {
          success: false,
          error: new Error("Email and password are required."),
        };
      }

      await createUserWithEmailAndPassword(auth, email, password);

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }
  },

  forgotPassword: async ({ email }: any) => {
    try {
      if (!email) {
        return {
          success: false,
          error: new Error("Email is required."),
        };
      }

      await sendPasswordResetEmail(auth, email);

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }
  },

  getIdentity: async () => {
    const user = auth.currentUser;

    if (!user) {
      return null;
    }

    return {
      id: user.uid,
      name: user.displayName ?? user.email,
      email: user.email,
      avatar: user.photoURL,
    };
  },
};
