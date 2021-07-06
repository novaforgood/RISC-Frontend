import firebase from "firebase";
import { useRouter } from "next/router";
import {
  GetMyUserQuery,
  ProfileType,
  useGetMyUserQuery,
} from "../generated/graphql";
import { parseParam } from "../utils";
import { useAuth } from "../utils/firebase/auth";

export enum AuthorizationLevel {
  Unauthenticated = "UNAUTHENTICATED", // Not logged in to Firebase
  WaitingForUserData = "WAITING_FOR_USER_DATA", // Logged in but fetching user data
  NotInProgram = "NOT_IN_PROGRAM", // User has no profile for current program
  Mentee = "MENTEE",
  Mentor = "MENTOR",
  Admin = "ADMIN",
}

const getAuthorizationLevel = (
  user: firebase.User | null,
  myUserData: GetMyUserQuery["getMyUser"] | undefined,
  programSlug: string
): AuthorizationLevel => {
  if (!user) return AuthorizationLevel.Unauthenticated;
  if (!myUserData) return AuthorizationLevel.WaitingForUserData;

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

  const myUserData = data?.getMyUser;

  let authLevel;
  if (router) {
    const slug = parseParam(router.query.slug);
    authLevel = getAuthorizationLevel(user, myUserData, slug);
  }

  return authLevel || AuthorizationLevel.Unauthenticated;
};

export default useAuthorizationLevel;
