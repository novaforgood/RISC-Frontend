import React, { useState } from "react";
import {
  CreateUserInput,
  useCreateUserMutation,
} from "../../generated/graphql";
import { useAuth } from "../../utils/firebase/auth";
import { Text, Button, Checkbox } from "../atomic";
import TitledInput from "../TitledInput";

const getTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const Signup = ({
  onSuccessfulGoogleSignup,
  onSuccessfulEmailSignup,
}: {
  onSuccessfulGoogleSignup: () => void;
  onSuccessfulEmailSignup: () => void;
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [error, setError] = useState("");
  const [createUser] = useCreateUserMutation();
  const { signUpWithEmail, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="flex flex-col space-y-6">
      <button
        className="flex h-16 w-full bg-tertiary cursor-pointer rounded-md focus:outline-none"
        onClick={() =>
          signInWithGoogle()
            .then((res) => {
              if (res.additionalUserInfo?.isNewUser) {
                //no need for verification
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
                createUser({ variables: { data: createUserInput } }).then(
                  onSuccessfulGoogleSignup
                );
              } else {
                setError(
                  "An account with this email already exists. Please log in."
                );
              }
            })
            .catch((e) => {
              setError(e.message);
            })
        }
      >
        <div className="flex w-max m-auto space-x-4 items-center">
          <img className="h-10 w-10" src="/static/GoogleLogo.svg" />
          <Text b className="text-primary">
            Sign Up with Google
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
          <div className="grid grid-cols-2 gap-2">
            <TitledInput
              title="First Name"
              name="First Name"
              value={firstName}
              className="col-span-1"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TitledInput
              title="Last Name"
              name="Last Name"
              value={lastName}
              className="col-span-1"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <TitledInput
            title="Email"
            name="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TitledInput
            title="Password"
            type="password"
            name="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex">
          <Checkbox
            checked={termsChecked}
            onCheck={(checked) => {
              setTermsChecked(checked);
            }}
          />
          <Text className="text-secondary">
            I read and agree to the{" "}
            <Text b u className="hover:text-primary cursor-pointer">
              Terms & Conditions
            </Text>
          </Text>
        </div>
        <div>
          <Text className="text-error">{error}</Text>
        </div>
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            signUpWithEmail(email, password)
              .catch((e) => {
                setError(e.message);
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
                  res.user?.sendEmailVerification();
                  Promise.all([
                    createUser({ variables: { data: createUserInput } }),
                    res.user?.updateProfile({
                      displayName: firstName + " " + lastName,
                      photoURL: "",
                    }),
                  ])
                    .then(onSuccessfulEmailSignup)
                    .then(() => {})
                    .catch((e) => {
                      setError(e.message);
                      signOut();
                    });
                }
              });
          }}
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default Signup;
