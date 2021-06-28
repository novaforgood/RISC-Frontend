import { useRouter } from "next/router";
import React, { useState } from "react";
import { Text, Button } from "../components/atomic";
import { useAuth } from "../utils/firebase/auth";

const Verify = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  if (user?.emailVerified || !user) {
    router.push("/");
    return <div>Rerouting to Home...</div>;
  }

  return (
    <div className="bg-tertiary h-screen w-screen flex items-center justify-center">
      <div className="w-3/4 flex flex-col space-y-6">
        <Text h1 b>
          Verify Password
        </Text>
        <Text>
          Hi {user?.displayName}! Your account needs to be activated! Check your
          email or resend the verification email to access the Mentor Center.
          Once you've verified your email,{" "}
          <button
            onClick={() => {
              location.reload();
            }}
            className="text-darkblue hover:underline font-bold"
          >
            hard refresh
          </button>{" "}
          this page.
        </Text>
        <div className="space-x-6">
          <Button
            onClick={() => router.push("/login")}
            variant="inverted"
            size="small"
          >
            Back
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
      </div>
    </div>
  );
};

export default Verify;
