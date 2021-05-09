import { createContext, Context, useContext, useState, useEffect } from "react";
import firebase from "./firebase";

interface Auth {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  token: string | null;
}

interface AuthContext {
  auth: Auth | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const formatAuth = (user: firebase.User): Auth => ({
  uid: user.uid,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  token: null,
});

// Create context with a default state.
const authContext: Context<AuthContext> = createContext<AuthContext>({
  auth: null,
  loading: true,
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

  /**
   * used to be called after signInWithGoogle
   * Callback function used for response from firebase OAuth.
   * Store user object returned in firestore.
   * @param firebase User Credential
   */
  const signedIn = async (resp: firebase.auth.UserCredential) => {
    // Format user into my required state.
    const storeUser = formatAuth(resp.user);
    // firestore database function
    // createUser(storeUser.uid, storeUser);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider()); //.then(signedIn));
  };

  const signOut = () => {
    return firebase.auth().signOut().then(clear);
  };

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(async (authState: firebase.User | null) => {
        if (authState) {
          const formattedAuth = formatAuth(authState);
          formattedAuth.token = await authState.getIdToken();
          setAuth(formattedAuth);
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  // returns state values and callbacks for signIn and signOut.
  return {
    auth,
    loading,
    signInWithGoogle,
    signedIn,
    signOut,
  };
}

export function AuthProvider({ children }: any) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);
