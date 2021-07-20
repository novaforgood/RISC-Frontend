import { useRouter } from "next/router";
import React, { useState } from "react";
import { Text, Modal } from "../atomic";
import Login from "./Login";
import Signup from "./Signup";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  programName: string;
};

const AuthModal = ({ isOpen, onClose, programName }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  console.log(router);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-36rem">
        <button
          onClick={onClose}
          className="cursor-pointer focus:outline-none self-end"
        >
          <img src="/static/Close.svg" className="h-4 w-4" />
        </button>
        {isLogin ? (
          <div>
            <div className="flex flex-col space-y-1">
              <Text h3 b>
                Login to join {programName}
              </Text>
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
              <Text h3 b>
                Create an account to join {programName}
              </Text>
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
                  path: "/verify",
                  query: { to: router.pathname },
                });
              }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;
