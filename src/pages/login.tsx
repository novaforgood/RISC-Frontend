import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Input, Text } from "../components/atomic";
import TitledInput from "../components/TitledInput";
import { useAuth } from "../utils/firebase/auth";

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
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayError, setError] = useState("");
  const router = useRouter();

  const redirectAfterLoggingIn = () => {
    if (router.query.to && typeof router.query.to === "string") {
      router.push(router.query.to);
    } else {
      router.push("/");
    }
  };

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
              <Link href="/signup">Sign up now</Link>
            </Text>
          </Text>
          <div className="h-6" />
          <button
            onClick={() =>
              signInWithGoogle()
                .catch((e) => setError(e.message))
                .then(async (res) => {
                  if (res) {
                    if (res.additionalUserInfo?.isNewUser) {
                      res.user?.delete();
                      setError(
                        "An account with this email has not been created yet."
                      );
                    } else {
                      // redirectAfterLoggingIn();
                    }
                  }
                })
                .catch((e) => setError(e.message))
            }
            className="h-16 w-full bg-tertiary flex items-center justify-center cursor-pointer"
          >
            <div className="flex-1">
              <img className="h-10 w-10 ml-6" src="/static/GoogleLogo.svg" />
            </div>
            <Text b className="text-secondary">
              Login with Google
            </Text>
            <div className="flex-1"></div>
          </button>
          <div className="h-6" />
          <div className="w-full h-3 flex justify-center items-center">
            <div className="h-0.25 flex-1 bg-inactive"></div>
            <Text b className="text-secondary px-4">
              Or
            </Text>
            <div className="h-0.25 flex-1 bg-inactive"></div>
          </div>
          <div className="h-6" />
          <form>
            <TitledInput
              title="Email"
              name="Email"
              // type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <div className="h-3" />
            <div>
              <div className="flex justify-between">
                <Text b>Password</Text>

                <Text className="text-darkblue hover:underline">
                  <Link href="/reset-password">Forgot Password?</Link>
                </Text>
              </div>
              <div className="h-1" />
              <Input
                className="w-full"
                title="Password"
                name="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="h-6" />

            <Button
              onClick={() => {
                signInWithEmail(email, password)
                  .catch((error) => {
                    setError(error.message);
                  })
                  .then((res) => {
                    if (res) {
                      if (!res.user?.emailVerified) {
                        signOut();
                        setError(
                          "Please verify your email address before logging in."
                        );
                      } else {
                        redirectAfterLoggingIn();
                      }
                    }
                  });
              }}
            >
              Login
            </Button>
          </form>
          <div className="h-6" />
          <Text className="text-error">{displayError}</Text>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
