import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { Button, Card, Text } from "../components/atomic";
import { useAuth } from "../utils/firebase/auth";
import { redirectAfterAuthentication } from "../utils";

const Verify = () => {
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  //If user is already logged in and verified
  if (user?.emailVerified || !user) {
    redirectAfterAuthentication(router);
    return <Fragment />;
  }

  return (
    <div className="bg-tertiary h-screen w-screen flex items-center justify-center">
      <div className="w-3/4">
        <Card className="p-10 flex flex-col space-y-6">
          <Text h1 b>
            Verify Account E-mail
          </Text>
          <Text>
            Hi {user?.displayName}, your account needs to be activated! Check
            your e-mail for a verification link.{" "}
          </Text>
          <Text>
            Once you've verified your email,{" "}
            <button
              onClick={() => {
                location.reload();
              }}
              className="text-darkblue hover:underline font-bold"
            >
              refresh
            </button>{" "}
            this page to access your homepage.
          </Text>
          <div className="space-x-6">
            <Button
              size="small"
              variant="inverted"
              onClick={() => {
                signOut();
              }}
            >
              Sign out
            </Button>
            <Button
              size="small"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                user?.sendEmailVerification().then(() => setLoading(false));
              }}
            >
              Resend Email
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Verify;
