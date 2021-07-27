import { useRouter } from "next/router";
import React, { useState } from "react";
import { Text, Modal } from "../atomic";
import Login from "./Login";
import Signup from "./Signup";

type AuthenticationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  programName?: string;
};

const AuthenticationModal = ({
  isOpen,
  onClose,
  programName = "",
}: AuthenticationModalProps) => {
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  const reset = () => {
    setIsLogin(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={reset}>
      <div className="flex flex-col w-144">
        <button
          onClick={reset}
          className="cursor-pointer focus:outline-none self-end"
        >
          <img src="/static/Close.svg" className="h-4 w-4" />
        </button>
        {isLogin ? (
          <div>
            <div className="flex flex-col space-y-1">
              {programName ? (
                <Text h3 b>
                  Login to join <Text i>{programName}</Text>
                </Text>
              ) : (
                <Text h3 b>
                  Login to access the Mentor Center
                </Text>
              )}
              <Text>
                Don't have a <Text>Mentor Center </Text>account?{" "}
                <button onClick={() => setIsLogin(false)}>
                  <Text u>Sign up now</Text>
                </button>
              </Text>
            </div>
            <div className="h-6" />
            <Login />
          </div>
        ) : (
          <div>
            <div className="flex flex-col">
              {programName ? (
                <Text h3 b>
                  Create an account to join <Text i>{programName}</Text>
                </Text>
              ) : (
                <Text h3 b>
                  Create an account to access the Mentor Center
                </Text>
              )}
              <Text>
                Already have a <Text>Mentor Center </Text>account?{" "}
                <button onClick={() => setIsLogin(true)}>
                  <Text u>Login</Text>
                </button>
              </Text>
            </div>
            <div className="h-6" />
            <Signup
              onSuccessfulGoogleSignup={() => {
                location.reload();
              }}
              onSuccessfulEmailSignup={() => {
                router.push({
                  pathname: "/verify",
                  query: { to: router.asPath },
                });
              }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AuthenticationModal;
