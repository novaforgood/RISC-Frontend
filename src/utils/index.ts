import firebase from "firebase";
import { GetMyUserQuery, ProfileType } from "../generated/graphql";

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

export const getAuthorizationLevel = (
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
