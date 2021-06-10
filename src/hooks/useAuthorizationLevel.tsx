import firebase from "firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMyUserData } from ".";
import { ProfileType } from "../generated/graphql";
import { parseParam } from "../utils";
import { useAuth } from "../utils/firebase/auth";
import { UserData } from "./useMyUserData";

export enum AuthorizationLevel {
  Mentee = "MENTEE",
  Mentor = "MENTOR",
  Admin = "ADMIN",
  Unauthenticated = "UNAUTHENTICATED",
  NotInProgram = "NOTINPROGRAM,",
}

const getAuthorizationLevel = (
  user: firebase.User | null,
  myUserData: UserData,
  programSlug: string
): AuthorizationLevel => {
  if (!user || !myUserData) return AuthorizationLevel.Unauthenticated;

  for (let profile of myUserData.profiles) {
    if (profile.program.slug === programSlug) {
      switch (profile.profileType) {
        case ProfileType.Admin:
          return AuthorizationLevel.Admin;
        case ProfileType.Mentee:
          return AuthorizationLevel.Mentee;
        case ProfileType.Mentor:
          return AuthorizationLevel.Mentor;
      }
    }
  }
  return AuthorizationLevel.NotInProgram;
};

const useAuthorizationLevel = () => {
  const { user } = useAuth();
  const { myUserData } = useMyUserData();
  const router = useRouter();
  const [authLevel, setAuthLevel] = useState(
    AuthorizationLevel.Unauthenticated
  );

  useEffect(() => {
    if (user && myUserData && router) {
      const slug = parseParam(router.query.slug);
      console.log(user, myUserData, slug);
      setAuthLevel(getAuthorizationLevel(user, myUserData, slug));
    }
    return () => {};
  }, [myUserData, router, user]);

  return authLevel;
};

export default useAuthorizationLevel;
