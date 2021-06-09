import { FetchResult } from "@apollo/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CreateUserInput,
  CreateUserMutation,
  GetMyUserQuery,
  ProfileType,
  useCreateUserMutation,
  useGetMyUserLazyQuery,
} from "../../generated/graphql";
import firebase from "./firebase";

export type UserData = GetMyUserQuery;
export type AuthorizationLevel =
  | "unauthorized"
  | "not-in-program"
  | "mentee"
  | "mentor"
  | "admin";

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
  getAuthorizationLevel: (programSlug: string) => AuthorizationLevel;
}

const authContext = createContext<AuthContext | undefined>(undefined);

function useProvideAuth() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const loading = loadingUser || loadingUserData;
  const [createUser] = useCreateUserMutation();

  const [_getMyUser, { data: userData }] = useGetMyUserLazyQuery({
    onCompleted: () => {
      setLoadingUserData(false);
    },
    onError: () => {
      setLoadingUserData(false);
    },
  });
  const getMyUser = () => {
    setLoadingUserData(true);
    _getMyUser();
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setLoadingUser(true);
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .finally(() => setLoadingUser(false));
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoadingUser(true);
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .finally(() => setLoadingUser(false));
  };

  const signInWithGoogle = async () => {
    setLoadingUser(true);
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

  const getAuthorizationLevel = (programSlug: string) => {
    if (!user || !userData) return "unauthorized";

    for (let profile of userData.getMyUser.profiles) {
      if (profile.program.slug === programSlug) {
        switch (profile.profileType) {
          case ProfileType.Admin:
            return "admin";
          case ProfileType.Mentee:
            return "mentee";
          case ProfileType.Mentor:
            return "mentor";
        }
      }
    }
    return "not-in-program";
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
    loading, // True if user and userData are both loading
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    createUserInDb,
    getAuthorizationLevel,
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
