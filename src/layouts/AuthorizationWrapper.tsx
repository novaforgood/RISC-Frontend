import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { Text } from "../components/atomic";
import { AuthorizationLevel, useAuthorizationLevel } from "../hooks";

interface AuthorizationWrapperProps {
  canView?: AuthorizationLevel[];
}

const AuthorizationWrapper: React.FC<AuthorizationWrapperProps> = ({
  children,
  canView,
}) => {
  const router = useRouter();
  const authorizationLevel = useAuthorizationLevel();

  if (authorizationLevel === AuthorizationLevel.WaitingForUserData)
    return <Fragment />;

  if (authorizationLevel === AuthorizationLevel.Unverified) {
    router.push("/verify");
    return <Fragment />;
  }
  if (canView && !canView.includes(authorizationLevel)) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <img src="/static/DarkTextLogo.svg" />
        <div className="h-8"></div>
        <div>
          <Text>Page not found. </Text>
          <Link href="/">
            <Text u className="cursor-pointer">
              Go back to home.
            </Text>
          </Link>
        </div>
      </div>
    );
  }

  return <Fragment>{children}</Fragment>;
};

export default AuthorizationWrapper;
