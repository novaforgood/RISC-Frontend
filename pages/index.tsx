import { useAuth } from "../utils/firebase/auth"

const IndexPage = () => {
  const { auth, signInWithGoogle, signOut } = useAuth();
  return (
  <>
    <button onClick={() => console.log("hello world")}>hello world</button>
    {auth ? 
        <button onClick={() => signOut()}>Sign Out</button>
      : <button onClick={() => signInWithGoogle()}>Sign In</button>
    }
  </>
)};

export default IndexPage;
