import React, { createContext, useContext, useState, useEffect } from "react";
import firebase from "./firebase";

interface AuthContext {
  auth: firebase.User | null;
  loading: boolean;
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
  const [auth, setAuth] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .finally(() => setLoading(false));
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .finally(() => setLoading(false));
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .finally(() => setLoading(false));
  };

  const signOut = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => setLoading(false));
  };

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged((authState: firebase.User | null) => {
        setAuth(authState);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  // returns state values and callbacks for signIn and signOut.
  return {
    auth,
    loading,
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
