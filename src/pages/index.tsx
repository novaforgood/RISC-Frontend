import { useState } from "react";
import { useGetUsersLazyQuery, useGetUsersQuery } from "../generated/graphql";
import { useAuth } from "../../utils/firebase/auth";

const IndexPage = () => {
  const [getUser, { loading, data }] = useGetUsersLazyQuery();
  const { auth, signInWithGoogle, signOut } = useAuth();
  const [text, setText] = useState("");

  return (
    <>
      <button
        onClick={() => {
          getUser();
          console.log("hi");
          console.log(data);
        }}
      >
        Get users
      </button>
      <p>{JSON.stringify(data)}</p>
      {auth ? <p>Hi, {auth.firstName}</p> : <p>Join us!</p>}
      {auth ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <a href="/login">Log In</a>
      )}
    </>
  );
};

export default IndexPage;
