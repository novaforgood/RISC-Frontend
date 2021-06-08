import { FetchResult } from "@apollo/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CreateUserInput,
  CreateUserMutation,
  GetMyUserQuery,
  useCreateUserMutation,
  useGetMyUserLazyQuery,
} from "../../generated/graphql";
import firebase from "./firebase";

type UserData = GetMyUserQuery;

interface AuthContext {
  user: firebase.User | null;
  userData: UserData | undefined;
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
  createUserInDb: (
    createUserInput: CreateUserInput
  ) => Promise<FetchResult<CreateUserMutation>>;
}

const authContext = createContext<AuthContext | undefined>(undefined);

function useProvideAuth() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const loading = loadingUser || loadingUserData;
  const [createUser] = useCreateUserMutation();

  const [getMyUser, { data: userData }] = useGetMyUserLazyQuery({
    onCompleted: () => {
      setLoadingUserData(false);
    },
  });

  const signUpWithEmail = async (email: string, password: string) => {
    setLoadingUser(true);
    setLoadingUserData(true);
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .finally(() => setLoadingUser(false));
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoadingUser(true);
    setLoadingUserData(true);
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .finally(() => setLoadingUser(false));
  };

  const signInWithGoogle = async () => {
    setLoadingUser(true);
    setLoadingUserData(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .finally(() => setLoadingUser(false));
  };

  const signOut = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => setLoadingUser(false));
  };

  const createUserInDb = async (createUserInput: CreateUserInput) => {
    return createUser({ variables: { data: createUserInput } }).then((res) => {
      getMyUser();
      return res;
    });
  };

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged((newUser: firebase.User | null) => {
        if (newUser) {
          getMyUser();
        }
        setUser(newUser);
        setLoadingUser(false);
      });
    return () => unsubscribe();
  }, []);

  return {
    user, // Firebase User
    loading, // True if user and userData are both loaded
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    createUserInDb,
    userData, // User object from database
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
