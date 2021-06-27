import React, { useState } from "react";
import { Text, Input, Button } from "../components/atomic";
// import TitledInput from "../components/TitledInput";
import { useAuth } from "../utils/firebase/auth";
import { validateEmail } from "../utils";
import Link from "next/link";
import Page from "../types/Page";

enum ResetPasswordStages {
  InputEmail = 0,
  SuccessfulReset = 1,
}

//TODO: Customize reset password pages with
const ResetPasswordPage: Page = () => {
  const { sendPasswordResetEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState(ResetPasswordStages.InputEmail);
  const [error, setError] = useState("");

  //should be outside switch statement so input works
  const InputEmail = () => (
    <>
      <Text>
        Type in your email and we'll send a password reset email to you with a
        code to reset your password.
      </Text>
      <div className="h-4" />
      <Input
        placeholder="example@example.com"
        value={email}
        onChange={(e) => {
          setEmail!(e.target.value);
        }}
      />
      <div className="h-4" />
      <Button
        size="small"
        onClick={(_) => {
          if (validateEmail(email)) {
            sendPasswordResetEmail(email).then(() => {
              setStage(ResetPasswordStages.SuccessfulReset);
              setError("");
            });
          } else {
            setError("Please provide a valid email.");
          }
        }}
      >
        Send Email
      </Button>
    </>
  );

  const getStage = () => {
    switch (stage) {
      case ResetPasswordStages.InputEmail:
        return <InputEmail />;
      case ResetPasswordStages.SuccessfulReset:
        return (
          <>
            <Text>
              You should've received an email to reset your password. Once
              you've filled out that form, you can log in again!
            </Text>
            <div className="h-4" />
            <Link href="/login">
              <Button size="small">Log in</Button>
            </Link>
          </>
        );
    }
  };

  return (
    <div className="flex w-screen min-h-screen relative">
      <img
        src="/static/DarkTextLogo.svg"
        className="absolute p-6 select-none pointer-events-none"
      />
      <div className="w-3/4 m-auto">
        <Text h1 b>
          Reset Password
        </Text>
        <div className="h-4" />
        {getStage()}
        <div className="h-4" />
        <Text className="min-h-4 text-error">{error}</Text>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
