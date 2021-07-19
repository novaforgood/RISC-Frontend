import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Text } from "../components/atomic";
import Page from "../types/Page";
import { redirectAfterAuthentication } from "../utils";
import Signup from "../components/Authentication/Signup";

const BlobCircle = () => {
  const sizes = "h-24 w-24 md:h-64 md:w-64 lg:h-80 lg:w-80";
  return (
    <div
      className={`${sizes} rounded-full bg-skyblue overflow-hidden flex justify-center items-end pointer-events-none`}
    >
      <img src="/static/HappyBlobs.svg" className="w-11/12 select-none" />
    </div>
  );
};

const SignUpPage: Page = () => {
  const router = useRouter();

  return (
    <div className="flex w-screen min-h-screen">
      <div className="hidden md:grid md:w-1/3 bg-primary min-h-screen relative">
        <img
          src="/static/TextLogo.svg"
          className="absolute p-6 select-none pointer-events-none"
        />
        <div className="place-self-center">
          <BlobCircle />
        </div>
      </div>
      <div className="w-full md:w-2/3 flex justify-center items-center min-h-screen">
        <div className="flex flex-col w-full px-4 py-12 md:w-120">
          <Text h1 b>
            Sign Up
          </Text>
          <Text b2>
            Already have an account?{" "}
            <Text u className="cursor-pointer">
              <Link
                href={
                  "/login" + (router.query.to ? "?to=" + router.query.to : "")
                }
              >
                Login
              </Link>
            </Text>
          </Text>
          <div className="h-6" />
          <Signup
            onSuccessfulGoogleSignup={() => {
              redirectAfterAuthentication(router);
            }}
            onSuccessfulEmailSignup={() => {
              router.push({
                pathname: "/verify",
                query: { to: router.query.to },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
