import { useState } from "react";
import { useAuth } from "../../utils/firebase/auth";

const SignUpPage = () => {
  const { auth, signUpUser, signInWithGoogle, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayError, setError] = useState("");

  const signup = async (e: Event) => {
    e.preventDefault();
    await signUpUser(email, password)
      .catch((error) => {
        setError(error.message);
      })
      .then(() => {
        console.log("ur in");
        console.log(auth?.email);
      });
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <div style={{ width: "35%", backgroundColor: "grey" }}></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "65%",
          height: "100%",
        }}
      >
        <h1>Sign Up</h1>
        <h2>
          Already have an account? <a href="/login">Login</a>
        </h2>
        <button
          onClick={() =>
            signInWithGoogle()
              .catch((e) => setError(""))
              .then((user) => {})
          }
        >
          Sign Up with Google
        </button>
        <h2>Or</h2>
        <form>
          <input
            name="Email"
            placeholder="Email Address"
            type="email"
            onChange={(e: Event) => {
              setEmail(e.target.value);
            }}
          />
          <input
            name="Password"
            placeholder="password"
            type="password"
            onChange={(e: Event) => {
              setPassword(e.target.value);
            }}
          />
          <p>{displayError}</p>
          <button onClick={(e) => signup(e)}>Sign Up</button>
        </form>

        {auth ? (
          <button onClick={() => signOut()}>Sign Out</button>
        ) : (
          <button>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
