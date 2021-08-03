import React, { createContext, useContext, useEffect, useState } from "react";
import { client } from "../../pages/_app";
import firebase from "./firebase";

interface AuthContext {
  user: firebase.User | null;
  loading: boolean;
  //TODO: customize the forget password flow instead of directly through firebase's ugly ui
  // confirmPasswordReset: (c: string, n: string) => Promise<void>;
  sendPasswordResetEmail: (e: string) => Promise<void>;
  signUpWithEmail: (
    e: string,
    p: string
  ) => Promise<firebase.auth.UserCredential>;
  signInWithEmail: (
    e: string,
    p: string
  ) => Promise<firebase.auth.UserCredential>;
  signInWithGoogle: () => Promise<firebase.auth.UserCredential>;
  signOut: () => Promise<void>;
}

const authContext = createContext<AuthContext | undefined>(undefined);

function useProvideAuth() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearCache = () => {
    client.stop();
    client.resetStore();
    localStorage.clear();
  };

  // const confirmPasswordReset = (code: string, newPassword: string) => {
  //   return firebase.auth().confirmPasswordReset(code, newPassword);
  // };

  const sendPasswordResetEmail = (email: string) => {
    return firebase.auth().sendPasswordResetEmail(email);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        clearCache();
        return res;
      });
  };

  const signInWithEmail = async (email: string, password: string) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        clearCache();
        return res;
      });
  };

  const signInWithGoogle = async () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((res) => {
        clearCache();
        return res;
      });
  };

  const signOut = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        clearCache();
        setUser(null);
      });
  };

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged((newUser: firebase.User | null) => {
        setUser(newUser);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    // confirmPasswordReset,
    sendPasswordResetEmail,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error("useAuth() must be within AuthProvider");
  }
  return context;
};
