import React, { useState } from "react";
import { Text, Input, Button } from "../components/atomic";
// import TitledInput from "../components/TitledInput";
import { useAuth } from "../utils/firebase/auth";
import { validateEmail } from "../utils";
import Link from "next/link";
import Page from "../types/Page";

enum ResetPasswordStages {
  InputEmail = 0,
  ResetPassword = 1,
  SuccessfulReset = 2,
}

type ResetPasswordStageProps = {
  email: string;
  setEmail?: (email: string) => void;
  setStage: (stage: ResetPasswordStages) => void;
  setError: (error: string) => void;
};

//TODO: Customize Reset password pages using continueURL
// const ResetPassword = ({
//   email,
//   setStage,
//   setError,
// }: ResetPasswordStageProps) => {
//   const { sendPasswordResetEmail, confirmPasswordReset } = useAuth();
//   const [code, setCode] = useState("");
//   const [password0, setPassword0] = useState("");
//   const [password1, setPassword1] = useState("");
//   const [loading, setLoading] = useState(false);

//   return (
//     <>
//       <Text>
//         Check your email and type the code sent to you in the box below to
//         verify your email address. Didn't receive the email?{" "}
//         <button
//           onClick={(_) =>
//             sendPasswordResetEmail(email).then(() => {
//               //loading logic
//             })
//           }
//         >
//           <Text b className="hover:underline text-darkblue">
//             Resend the verification email
//           </Text>
//         </button>
//         .
//       </Text>
//       <div className="h-4" />
//       <TitledInput
//         title="Verification Code"
//         placeholder="Verification Code"
//         value={code}
//         onChange={(e) => {
//           setCode(e.target.value);
//         }}
//       />
//       <div className="h-4" />
//       <TitledInput
//         title="Password"
//         placeholder="********"
//         value={password0}
//         onChange={(e) => {
//           setPassword0(e.target.value);
//         }}
//       />
//       <TitledInput
//         title="Re-Enter Password"
//         placeholder="********"
//         value={password1}
//         onChange={(e) => {
//           setPassword1(e.target.value);
//         }}
//       />
//       <div className="h-6" />
//       <div className="flex justify-between">
//         <Button
//           disabled={loading}
//           size="small"
//           variant="inverted"
//           onClick={() => {
//             setError("");
//             setStage(ResetPasswordStages.InputEmail);
//           }}
//         >
//           Back
//         </Button>
//         <Button
//           disabled={loading}
//           size="small"
//           onClick={(_) => {
//             if (password0 === password1) {
//               setLoading(true);
//               confirmPasswordReset(code, password0).then(() => {
//                 /* Success Message & Log in */
//                 setError("");
//                 setStage(ResetPasswordStages.SuccessfulReset);
//                 setLoading(false);
//               });
//             } else {
//               setError("Make sure the password fields match.");
//             }
//           }}
//         >
//           Reset Password
//         </Button>
//       </div>
//     </>
//   );
// };

const InputEmail = ({
  email,
  setEmail,
  setStage,
  setError,
}: ResetPasswordStageProps) => {
  const { sendPasswordResetEmail } = useAuth();

  return (
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
};

const SuccessfulReset = () => (
  <>
    <Text>
      You should've received an email to reset your password. Once you've filled
      out that form, you can log in again!
    </Text>
    <div className="h-4" />
    <Link href="/login">
      <Button size="small">Log in</Button>
    </Link>
  </>
);

const ResetPasswordPage: Page = () => {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState(ResetPasswordStages.InputEmail);
  const [error, setError] = useState("");

  const getStage = () => {
    switch (stage) {
      case ResetPasswordStages.InputEmail:
        return (
          <InputEmail
            email={email}
            setEmail={setEmail}
            setStage={setStage}
            setError={setError}
          />
        );
      // case ResetPasswordStages.ResetPassword:
      //   return (
      //     <ResetPassword
      //       email={email}
      //       setStage={setStage}
      //       setError={setError}
      //     />
      //   );
      case ResetPasswordStages.SuccessfulReset:
        return <SuccessfulReset />;
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
