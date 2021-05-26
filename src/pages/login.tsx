import { MouseEvent, useState } from "react";
import { useAuth } from "../../utils/firebase/auth";
import { Text } from "../components/atomic";

const BlobCircle = () => {
  const sizes = "h-24 w-24 md:h-64 md:w-64 lg:h-80 lg:w-80";
  return (
    <div
      className={`${sizes} rounded-full bg-skyblue overflow-hidden flex justify-center items-end pointer-events-none`}
    >
      <img src="/HappyBlobs.svg" className="w-11/12 select-none" />
    </div>
  );
};

const LoginPage = () => {
  const { auth, signInWithEmail, signInWithGoogle, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayError, setError] = useState("");

  const login = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await signInWithEmail(email, password).catch((error) => {
      setError(error.message);
    });
  };

  return (
    <div className="flex w-screen h-screen">
      <div className="w-1/3 bg-primary h-full grid">
        <div className="place-self-center">
          <BlobCircle />
        </div>
      </div>
      <div className="flex flex-col justify-start w-2/3 h-full">
        <Text h1>Login</Text>
        <h2>
          Don't have an account? <a href="/signup">Sign up now</a>
        </h2>
        <button onClick={() => signInWithGoogle()} className="text-blue">
          Login with Google
        </button>
        <h2>- Or -</h2>
        <form>
          <input
            style={{ width: "100%" }}
            name="Email"
            placeholder="email address"
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            style={{ width: "100%" }}
            name="Password"
            placeholder="password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {displayError ? <p>{displayError}</p> : <></>}
          <button onClick={(e) => login(e)}>Login</button>

          <br />
          {auth ? (
            <p>
              u in. <button onClick={() => signOut()}>Sign Out</button>
            </p>
          ) : (
            <p>not signed in</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
