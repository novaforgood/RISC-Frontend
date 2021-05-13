import { createContext, Context, useContext, useState, useEffect } from "react";
import firebase from "./firebase";

interface Auth {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

interface AuthContext {
  auth: firebase.User | null;
  loading: boolean;
  signUpUser: (e: string, p: string) => Promise<void>;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signedIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create context with a default state.
const authContext: Context<AuthContext> = createContext<AuthContext>({
  auth: null,
  loading: true,
  signUpUser: async () => {},
  signInWithEmail: async () => {},
  signInWithGoogle: async () => {},
  signedIn: async () => {},
  signOut: async () => {},
});

function useProvideAuth() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const clear = () => {
    setAuth(null);
    setLoading(true);
  };

  const signUpUser = async (email: string, password: string) => {
    setLoading(true);
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(() => setLoading(false));
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(() => setLoading(false));
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(() => setLoading(false));
  };

  const signOut = () => {
    return firebase.auth().signOut().then(clear);
  };

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(async (authState: firebase.User | null) => {
        setAuth(authState);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  // returns state values and callbacks for signIn and signOut.
  return {
    auth,
    loading,
    signUpUser,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  };
}

export function AuthProvider({ children }: any) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);

// mostly leaving this to get firstName lastName, likely not necessary tho
export const formatAuth = (user: firebase.User): Auth => ({
  uid: user.uid,
  email: user.email,
  firstName: user.displayName ? user.displayName.split(" ")[0] : "",
  lastName: user.displayName ? user.displayName.split(" ")[1] : "",
});
