import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Checkbox, Text, Modal } from "../components/atomic";
import TitledInput from "../components/TitledInput";
import { CreateUserInput, useCreateUserMutation } from "../generated/graphql";
import { useAuth } from "../utils/firebase/auth";

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

const getTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const SignUpPage = () => {
  const { signUpWithEmail, signInWithGoogle, signOut } = useAuth();
  const [createUser] = useCreateUserMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [displayError, setDisplayError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [tocChecked, setTocChecked] = useState(false);
  const router = useRouter();

  return (
    <div className="flex w-screen min-h-screen">
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col space-y-2 justify-center">
          <Text>
            A verification email has been sent to your inbox. Please verify
            before logging in.
          </Text>
          <Button size="small" onClick={() => setModalOpen(false)}>
            Go to Email
          </Button>
        </div>
      </Modal>
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
              <Link href="/login">Login</Link>
            </Text>
          </Text>
          <div className="h-6" />
          <button
            onClick={() =>
              signInWithGoogle()
                .then((res) => {
                  if (res.additionalUserInfo?.isNewUser) {
                    const arr = res.user?.displayName?.split(" ") || [];
                    const highResPhotoURL = res.user?.photoURL?.replace(
                      "s96-c",
                      "s400-c"
                    );
                    const createUserInput: CreateUserInput = {
                      email: res.user?.email!,
                      firstName: arr[0] || "",
                      lastName: arr[1] || "",
                      profilePictureUrl: highResPhotoURL || "",
                      timezone: getTimezone(),
                    };
                    createUser({ variables: { data: createUserInput } });
                    res.user?.sendEmailVerification();
                    setModalOpen(true);
                  } else {
                    setDisplayError(
                      "An account with this email already exists. Please log in."
                    );
                  }
                  signOut();
                })
                .catch((e) => {
                  setDisplayError(e.message);
                })
            }
            className="h-16 w-full bg-tertiary flex items-center justify-center cursor-pointer"
          >
            <div className="flex-1">
              <img className="h-10 w-10 ml-6" src="/static/GoogleLogo.svg" />
            </div>
            <Text b className="text-secondary">
              Sign up with Google
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
            <div className="flex w-full">
              <TitledInput
                title="First Name"
                name="First Name"
                // type="email"
                value={firstName}
                className="flex-1"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <div className="w-2" />
              <TitledInput
                title="Last Name"
                name="Last Name"
                value={lastName}
                className="flex-1"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
            <div className="h-3" />

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

            <TitledInput
              title="Password"
              name="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="h-6" />

            {/* <div className="flex items-center">
              <Checkbox
                checked={tocChecked}
                onCheck={() => {
                  setTocChecked(!tocChecked);
                }}
              />
              <Text>
                I read and agree to the{" "}
                <Text u b>
                  Terms and Conditions
                </Text>
              </Text>
            </div>
            <div className="h-6" /> */}

            <Button
              onClick={() => {
                signUpWithEmail(email, password)
                  .catch((e) => {
                    setDisplayError(e.message);
                  })
                  .then((res) => {
                    // TODO: Valid profilePictureURL and photoURL
                    if (res) {
                      const createUserInput: CreateUserInput = {
                        email: res.user?.email!,
                        firstName: firstName,
                        lastName: lastName,
                        profilePictureUrl: "",
                        timezone: getTimezone(),
                      };
                      Promise.all([
                        createUser({ variables: { data: createUserInput } }),
                        res.user?.updateProfile({
                          displayName: firstName + " " + lastName,
                          photoURL: "",
                        }),
                      ])
                        .then(() => {
                          res.user?.sendEmailVerification();
                          signOut();
                          setModalOpen(true);
                        })
                        .catch((e) => {
                          setDisplayError(e.message);
                          signOut();
                        });
                    }
                  });
              }}
            >
              Sign Up
            </Button>
            <div className="h-6" />

            <Text className="text-error">
              {displayError ? displayError : ""}
            </Text>
          </form>
          {/* {auth ? (
            <button onClick={() => signOut()}>Sign Out</button>
          ) : (
            <button>Sign In</button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
