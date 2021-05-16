import { MouseEvent, useState, Fragment, InputHTMLAttributes } from "react";
import { useAuth } from "../../utils/firebase/auth";
import { Text, Input, Button, Spacer } from "../components/atomic";
import Link from "next/link";

const BlobCircle = () => {
  const sizes = "h-24 w-24 md:h-64 md:w-64 lg:h-80 lg:w-80";
  return (
    <div
      className={`${sizes} rounded-full bg-darkblue overflow-hidden flex justify-center items-end pointer-events-none`}
    >
      <img src="/HappyBlobs.svg" className="w-11/12 select-none" />
    </div>
  );
};

type TitledInputProps = {
  title: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;
const TitledInput = ({ title, className, ...props }: TitledInputProps) => {
  return (
    <div className={className}>
      <Text b>{title}</Text>
      <Spacer y={1} />
      <Input className="w-full" {...props}></Input>
    </div>
  );
};

const SignUpPage = () => {
  const { auth, signUpWithEmail, signInWithGoogle, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayError, setError] = useState("");

  return (
    <div className="flex w-screen min-h-screen">
      <div className="hidden md:grid md:w-1/3 bg-primary min-h-screen">
        <div className="place-self-center">
          <BlobCircle />
        </div>
      </div>
      <div className="w-full md:w-2/3 flex justify-center items-center min-h-screen">
        <div className="flex flex-col w-full px-4 py-12 md:w-120">
          <div className="w-full flex justify-start">
            <Text h1 b>
              Sign Up
            </Text>
          </div>
          <div className="w-full flex justify-start">
            <Text b2>
              Already have an account?{" "}
              <Text u className="cursor-pointer">
                <Link href="/login">Login</Link>
              </Text>
            </Text>
          </div>
          <Spacer y={6} />
          <div
            onClick={() =>
              signInWithGoogle()
                .catch((e) => setError(e.message))
                .then((_) => {})
            }
            className="h-16 w-full bg-tertiary flex items-center justify-center cursor-pointer"
          >
            <div className="flex-1 flex justify-start">
              <img className="h-10 w-10 ml-6" src="/GoogleLogo.svg"></img>
            </div>
            <Text b className="text-secondary">
              Sign Up with Google
            </Text>
            <div className="flex-1"></div>
          </div>
          <Spacer y={6} />
          <div className="w-full h-3 flex justify-center items-center">
            <div className="h-0.25 flex-1 bg-inactive"></div>
            <Text b className="text-secondary px-4">
              Or
            </Text>
            <div className="h-0.25 flex-1 bg-inactive"></div>
          </div>
          <Spacer y={6} />
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
            <Spacer x={2} />
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
          <Spacer y={3} />
          <TitledInput
            title="Email"
            name="Email"
            // type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Spacer y={3} />
          <TitledInput
            title="Password"
            name="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Spacer y={6} />
          <Text>
            TODO: I read and agree to the{" "}
            <Text u b>
              Terms and Conditions
            </Text>
          </Text>
          <Spacer y={6} />
          <Button
            onClick={(e) => {
              e.preventDefault();
              signUpWithEmail(email, password)
                .catch((error) => {
                  setError(error.message);
                })
                .then(() => {
                  console.log(auth?.email);
                });
            }}
          >
            Sign Up
          </Button>
          <Spacer y={6} />
          <Text className="text-error">
            {displayError + "TODO: Proper error box"}
          </Text>

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
