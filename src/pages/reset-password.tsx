import React, { useState } from "react";
import { Text, Input, Button } from "../components/atomic";
import { useAuth } from "../utils/firebase/auth";
import { validateEmail } from "../utils";
import Link from "next/link";
import Page from "../types/Page";
import { useRouter } from "next/router";

enum ResetPasswordStages {
  InputEmail = 0,
  SuccessfulReset = 1,
}

//TODO: Customize reset password pages with
//TODO: Incorporate loading UI when resending link
const ResetPasswordPage: Page = () => {
  const { sendPasswordResetEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState(ResetPasswordStages.InputEmail);
  const [error, setError] = useState<String | null>(null);
  const router = useRouter();

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
        {stage === ResetPasswordStages.InputEmail ? (
          <form>
            <Text>
              Type in your email and we'll send a link to reset your password
              with.
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
            <div className="flex space-x-4">
              <Button
                type="reset"
                size="small"
                variant="inverted"
                onClick={() => {
                  router.back();
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  if (validateEmail(email)) {
                    sendPasswordResetEmail(email)
                      .then(() => {
                        setStage(ResetPasswordStages.SuccessfulReset);
                        setError(null);
                      })
                      .catch((err) => {
                        setError(err.message);
                      });
                  } else {
                    setError("Please provide a valid email.");
                  }
                }}
              >
                Send Email
              </Button>
            </div>
          </form>
        ) : (
          <>
            <Text>
              You should've received an email to reset your password. Once
              you've filled out that form, you can log in again! Didn't receive
              an email?{" "}
              <button
                onClick={() => {
                  setStage(ResetPasswordStages.InputEmail);
                }}
              >
                <Text className="text-darkblue hover:underline" b>
                  Resend the link.
                </Text>
              </button>
            </Text>
            <div className="h-4" />
            <Link href="/login">
              <Button size="small">Log in</Button>
            </Link>
          </>
        )}
        <div className="h-4" />
        <Text className="min-h-4 text-error">{error}</Text>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
