import React, { useState } from "react";
//import { useAuth } from "../utils/firebase/auth";
import { Text, Button, Modal, Checkbox } from "./atomic";
import TitledInput from "./TitledInput";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isLogin: boolean;
  programName: string;
};

const AuthModal = ({
  isOpen,
  onClose,
  isLogin,
  programName,
}: AuthModalProps) => {
  const [termsChecked, setTermsChecked] = useState(false);
  //const { signUpWithEmail, signInWithGoogle, signOut } = useAuth();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <img src="/static/Close.svg" />
      <div className="flex flex-col space-y-6">
        {isLogin ? (
          <div className="flex flex-col space-y-2">
            <Text h3 b>
              Login to join {programName}
            </Text>
            <Text>
              Don't have a <Text>Mentor Center </Text>account?{" "}
              <Text u>Sign up</Text>
            </Text>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Text h3 b>
              Create an account to join {programName}
            </Text>
            <Text>
              Already have a <Text>Mentor Center </Text>account?{" "}
              <Text u>Login</Text>
            </Text>
          </div>
        )}

        <button className="flex h-16 w-full bg-tertiary cursor-pointer rounded-md focus:outline-none">
          <div className="flex w-max m-auto space-x-4 items-center">
            <img className="h-10 w-10" src="/static/GoogleLogo.svg" />
            <Text b className="text-primary">
              {isLogin ? "Login" : "Sign up"} with Google
            </Text>
          </div>
        </button>
        <div className="flex h-0.25 bg-inactive items-center">
          <div className="w-max mx-auto bg-white p-2">
            <Text b className="text-secondary">
              Or
            </Text>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          {isLogin ? (
            <></>
          ) : (
            <div className="flex space-x-2">
              <TitledInput
                title="First Name"
                name="First Name"
                value={""}
                onChange={(e) => {}}
              />
              <TitledInput
                title="Last Name"
                name="Last Name"
                value={""}
                onChange={(e) => {}}
              />
            </div>
          )}
          <TitledInput
            title="Email"
            name="Email"
            value={""}
            onChange={(e) => {}}
          />
          <TitledInput
            title="Password"
            name="Password"
            value={""}
            onChange={(e) => {}}
          />
        </div>
        {isLogin ? (
          <></>
        ) : (
          <div>
            <Checkbox
              checked={termsChecked}
              onCheck={(checked) => {
                setTermsChecked(checked);
              }}
            />
          </div>
        )}
        <Button>{isLogin ? "Login" : "Sign up"}</Button>
      </div>
    </Modal>
  );
};

export default AuthModal;
