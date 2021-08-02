import { Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Text } from "../components/atomic";
import { redirectAfterAuthentication } from "../utils";
import { AuthorizationLevel, useAuthorizationLevel } from "../hooks";
import Login from "../components/Authentication/Login";

const BlobCircle = () => {
  const sizes = "h-24 w-24 md:h-64 md:w-64 lg:h-80 lg:w-80";
  return (
    <div
      className={`${sizes} rounded-full bg-darkblue overflow-hidden flex justify-center items-end pointer-events-none`}
    >
      <img src="/static/HappyBlobs.svg" className="w-11/12 select-none" />
    </div>
  );
};

const LoginPage = () => {
  const authorizationLevel = useAuthorizationLevel();
  const router = useRouter();

  if (
    authorizationLevel !== AuthorizationLevel.Unverified &&
    authorizationLevel !== AuthorizationLevel.Unauthenticated
  ) {
    redirectAfterAuthentication(router);
    return <Fragment />;
  }

  return (
    <div className="flex w-screen min-h-screen relative">
      <img
        src="/static/TextLogo.svg"
        className="absolute p-6 select-none pointer-events-none"
      />
      <div className="hidden md:grid md:w-1/3 bg-primary min-h-screen">
        <div className="place-self-center">
          <BlobCircle />
        </div>
      </div>
      <div className="w-full md:w-2/3 flex justify-center items-center min-h-screen">
        <div className="flex flex-col w-full px-4 py-12 md:w-120">
          <Text h1 b>
            Login
          </Text>
          <Text b2>
            Don't have an account?{" "}
            <Text u className="cursor-pointer">
              <Link
                href={
                  "/signup" + (router.query.to ? "?to=" + router.query.to : "")
                }
              >
                Sign up now
              </Link>
            </Text>
          </Text>
          <div className="h-6" />
          <Login
            onSuccessfulEmailLogin={() => redirectAfterAuthentication(router)}
            onSuccessfulGoogleLogin={() => redirectAfterAuthentication(router)}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
