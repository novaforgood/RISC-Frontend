import firebase from "firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  GetMyUserQuery,
  ProfileType,
  useGetMyUserQuery,
} from "../generated/graphql";
import { parseParam } from "../utils";
import { useAuth } from "../utils/firebase/auth";

export enum AuthorizationLevel {
  Mentee = "MENTEE",
  Mentor = "MENTOR",
  Admin = "ADMIN",
  Unauthenticated = "UNAUTHENTICATED",
  NotInProgram = "NOTINPROGRAM",
}

const getAuthorizationLevel = (
  user: firebase.User | null,
  myUserData: GetMyUserQuery["getMyUser"],
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
  const { data } = useGetMyUserQuery();
  const router = useRouter();
  const [authLevel, setAuthLevel] = useState(
    AuthorizationLevel.Unauthenticated
  );

  const myUserData = data?.getMyUser;

  useEffect(() => {
    if (user && myUserData && router) {
      const slug = parseParam(router.query.slug);
      setAuthLevel(getAuthorizationLevel(user, myUserData, slug));
    }
    return () => {};
  }, [myUserData, router, user]);

  return authLevel;
};

export default useAuthorizationLevel;