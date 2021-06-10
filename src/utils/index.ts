import firebase from "firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  GetMyUserQuery,
  ProfileType,
  useGetMyUserQuery,
} from "../generated/graphql";
import { useAuth } from "./firebase/auth";

export function parseParam(slug: string | string[] | undefined) {
  if (!slug || typeof slug !== "string") {
    return "";
  } else {
    return slug;
  }
}

export enum AuthorizationLevel {
  Mentee = "MENTEE",
  Mentor = "MENTOR",
  Admin = "ADMIN",
  Unauthenticated = "UNAUTHENTICATED",
  NotInProgram = "NOTINPROGRAM,",
}

const getAuthorizationLevel = (
  user: firebase.User | null,
  myUserData: GetMyUserQuery | undefined,
  programSlug: string
): AuthorizationLevel => {
  if (!user || !myUserData) return AuthorizationLevel.Unauthenticated;

  for (let profile of myUserData.getMyUser.profiles) {
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

export const useAuthorizationLevel = () => {
  const { user } = useAuth();
  const { data: myUserData } = useGetMyUserQuery({ skip: !user });
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
