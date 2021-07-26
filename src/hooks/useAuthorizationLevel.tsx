import firebase from "firebase";
import { useRouter } from "next/router";
import {
  GetMyUserQuery,
  ProfileType,
  useGetMyUserQuery,
} from "../generated/graphql";
import { parseParam } from "../utils";
import { MAP_PROFILETYPE_TO_ROUTE } from "../utils/constants";
import { useAuth } from "../utils/firebase/auth";

export enum AuthorizationLevel {
  Unauthenticated = "UNAUTHENTICATED", // Not logged in to Firebase
  WaitingForUserData = "WAITING_FOR_USER_DATA", // Logged in but fetching user data from database
  NotInProgram = "NOT_IN_PROGRAM", // User has no profile for current program
  NoMatchingProfile = "NO_MATCHING_PROFILE", // User has a profile, but it's type doesnt match the current route.
  Mentee = "MENTEE",
  Mentor = "MENTOR",
  Admin = "ADMIN",
  Unverified = "UNVERIFIED",
}

const getAuthorizationLevel = (
  user: firebase.User | null,
  myUserData: GetMyUserQuery["getMyUser"] | undefined,
  programSlug: string,
  profileType: string
): AuthorizationLevel => {
  if (!user) return AuthorizationLevel.Unauthenticated;
  if (!user.emailVerified) return AuthorizationLevel.Unverified;
  if (!myUserData) return AuthorizationLevel.WaitingForUserData;

  let inProgram = false;
  for (let profile of myUserData.profiles) {
    if (profile.program.slug === programSlug) {
      inProgram = true;
      if (MAP_PROFILETYPE_TO_ROUTE[profile.profileType] === profileType) {
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
  }

  return inProgram
    ? AuthorizationLevel.NoMatchingProfile
    : AuthorizationLevel.NotInProgram;
};

const useAuthorizationLevel = () => {
  const { user } = useAuth();
  const { data } = useGetMyUserQuery();
  const router = useRouter();

  const myUserData = data?.getMyUser;

  let authLevel;
  if (router) {
    const slug = parseParam(router.query.slug);
    const profileType = parseParam(router.query.profileType);
    authLevel = getAuthorizationLevel(user, myUserData, slug, profileType);
  }

  return authLevel || AuthorizationLevel.Unauthenticated;
};

export default useAuthorizationLevel;
