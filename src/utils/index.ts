import firebase from "firebase";
import { GetMyUserQuery, ProfileType } from "../generated/graphql";

export function parseParam(slug: string | string[] | undefined) {
  if (!slug || typeof slug !== "string") {
    return "";
  } else {
    return slug;
  }
}

export type AuthorizationLevel =
  | "unauthorized"
  | "not-in-program"
  | "mentee"
  | "mentor"
  | "admin";

export const getAuthorizationLevel = (
  user: firebase.User | null,
  myUserData: GetMyUserQuery | undefined,
  programSlug: string
): AuthorizationLevel => {
  if (!user || !myUserData) return "unauthorized";

  for (let profile of myUserData.getMyUser.profiles) {
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
