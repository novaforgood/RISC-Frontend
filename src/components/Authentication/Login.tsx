import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../../utils/firebase/auth";
import { Text, Button } from "../atomic";
import TitledInput from "../TitledInput";

const Login = ({
  onSuccessfulGoogleLogin = () => {},
  onSuccessfulEmailLogin = () => {},
}: {
  onSuccessfulGoogleLogin?: () => void;
  onSuccessfulEmailLogin?: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuth();

  return (
    <div className="flex flex-col space-y-6">
      <button
        className="flex h-16 w-full bg-tertiary cursor-pointer rounded-md focus:outline-none"
        onClick={() =>
          signInWithGoogle()
            .then(async (res) => {
              if (res) {
                if (res.additionalUserInfo?.isNewUser) {
                  res.user?.delete();
                  setError(
                    "An account with this email has not been created yet."
                  );
                } else {
                  onSuccessfulGoogleLogin();
                }
              }
            })
            .catch((e) => {
              setLoading(false);
              setError(e.message);
            })
        }
      >
        <div className="flex w-max m-auto space-x-4 items-center">
          <img className="h-10 w-10" src="/static/GoogleLogo.svg" />
          <Text b className="text-primary">
            Login with Google
          </Text>
        </div>
      </button>
      <div className="w-full h-3 flex justify-center items-center">
        <div className="h-0.25 flex-1 bg-inactive"></div>
        <Text b className="text-secondary px-4">
          Or
        </Text>
        <div className="h-0.25 flex-1 bg-inactive"></div>
      </div>
      <form className="space-y-6">
        <div className="flex flex-col space-y-4">
          <TitledInput
            title="Email"
            name="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <Link href="/reset-password">
              <a target="_blank">
                <Text className="absolute text-darkblue right-6 hover:underline cursor-pointer">
                  Forgot Password?
                </Text>
              </a>
            </Link>
            <TitledInput
              title="Password"
              type="password"
              name="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Text className="text-error">{error}</Text>
        </div>
        <Button
          type="submit"
          disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            setLoading(true);
            signInWithEmail(email, password)
              .then((res) => {
                if (res) {
                  //If user doesn't have email verified show error
                  if (!res.user?.emailVerified) {
                    setError("Please verify this email before logging in.");
                    //Otherwise call success function
                  } else {
                    onSuccessfulEmailLogin();
                  }
                }
              })
              .finally(() => setLoading(false))
              .catch((e) => {
                setLoading(false);
                setError(e.message);
              });
          }}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
