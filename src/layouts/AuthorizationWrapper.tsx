import { useRouter } from "next/router";
import React, { Fragment } from "react";
import ErrorScreen, { ErrorScreenType } from "../components/ErrorScreen";
import { AuthorizationLevel, useAuthorizationLevel } from "../hooks";
import AuthenticationModal from "../components/Authentication/AuthenticationModal";
import { useAuth } from "../utils/firebase/auth";

interface AuthorizationWrapperProps {
  canView?: AuthorizationLevel[];
}

const AuthorizationWrapper: React.FC<AuthorizationWrapperProps> = ({
  children,
  canView,
}) => {
  const { loading } = useAuth();
  const router = useRouter();
  const authorizationLevel = useAuthorizationLevel();

  if (loading) {
    console.log("loading");
    return <>Loading Screen</>;
  }

  if (authorizationLevel === AuthorizationLevel.WaitingForUserData)
    return <Fragment />;

  if (
    authorizationLevel === AuthorizationLevel.Unverified &&
    canView &&
    !canView.includes(AuthorizationLevel.Unverified)
  ) {
    router.push("/verify");
    return <Fragment />;
  }
  if (canView && !canView.includes(authorizationLevel)) {
    return <ErrorScreen type={ErrorScreenType.PageNotFound} />;
  }

  return (
    <Fragment>
      <AuthenticationModal
        isOpen={
          authorizationLevel === AuthorizationLevel.Unauthenticated ||
          authorizationLevel === AuthorizationLevel.Unverified
        }
        onClose={() => {}}
      />
      {children}
    </Fragment>
  );
};

export default AuthorizationWrapper;
