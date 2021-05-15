import { useState } from "react";
import { useAuth } from "../../utils/firebase/auth";

const LoginPage = () => {
  const { auth, signInWithEmail, signInWithGoogle, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayError, setError] = useState("");

  const login = async (e: Event) => {
    await signInWithEmail(email, password).catch((error) => {
      setError(error.message);
    });
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "65%",
          height: "100%",
        }}
      >
        <h1>Login</h1>
        <h2>
          Don't have an account? <a href="/signup">Sign up now</a>
        </h2>
        <button onClick={() => signInWithGoogle()}>Login with Google</button>
        <h2>- Or -</h2>
        <form>
          <input
            style={{ width: "100%" }}
            name="Email"
            placeholder="email address"
            type="email"
            onChange={(e: Event) => {
              setEmail(e.target.value);
            }}
          />
          <input
            style={{ width: "100%" }}
            name="Password"
            placeholder="password"
            type="password"
            onChange={(e: Event) => {
              setPassword(e.target.value);
            }}
          />
          {displayError ? <p>{displayError}</p> : <></>}
          <button onClick={() => login(e)}>Login</button>

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
      <div style={{ width: "35%", backgroundColor: "grey" }}></div>
    </div>
  );
};

export default LoginPage;
