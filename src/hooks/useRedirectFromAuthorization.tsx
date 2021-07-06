import { useRouter } from "next/router";
import { AuthorizationLevel, useAuthorizationLevel } from ".";

export enum AccessLevel {
  VERIFIED,
  AUTHENTICATED,
  UNAUTHENTICATED,
}

const AccessLevelToAuthorizationLevels = {
  [AccessLevel.VERIFIED]: [
    AuthorizationLevel.Admin,
    AuthorizationLevel.Mentee,
    AuthorizationLevel.Mentor,
    AuthorizationLevel.NotInProgram,
  ],
  [AccessLevel.AUTHENTICATED]: [
    AuthorizationLevel.Admin,
    AuthorizationLevel.Mentee,
    AuthorizationLevel.Mentor,
    AuthorizationLevel.NotInProgram,
    AuthorizationLevel.Unverified,
    AuthorizationLevel.WaitingForUserData,
  ],
  [AccessLevel.UNAUTHENTICATED]: [
    AuthorizationLevel.Admin,
    AuthorizationLevel.Mentee,
    AuthorizationLevel.Mentor,
    AuthorizationLevel.NotInProgram,
    AuthorizationLevel.Unverified,
    AuthorizationLevel.WaitingForUserData,
    AuthorizationLevel.Unauthenticated,
  ],
};

const useRedirectFromAuthorization = (accessLevel: AccessLevel) => {
  const authorizationLevel = useAuthorizationLevel();
  const router = useRouter();

  const authorizedRoles = AccessLevelToAuthorizationLevels[accessLevel];
  if (authorizedRoles.length == 0) return;

  switch (authorizationLevel) {
    case AuthorizationLevel.Unverified:
      if (!authorizedRoles.includes(AuthorizationLevel.Unverified)) {
        router.push("/verify");
        return <div>User not verified. Redirecting...</div>;
      }
      break;
    case AuthorizationLevel.Unauthenticated:
      if (!authorizedRoles.includes(AuthorizationLevel.Unauthenticated)) {
        router.push("/signup");
        return <div>User not logged in. Redirecting...</div>;
      }
  }
};

export default useRedirectFromAuthorization;
