import React, { useState } from "react";
import { Button } from "../components/atomic/Button";
import { useGetUsersLazyQuery, useGetUsersQuery } from "../generated/graphql";
import { useAuth } from "../../utils/firebase/auth";

const IndexPage = () => {
  const [getUser, { loading, data }] = useGetUsersLazyQuery();
  const { auth, signInWithGoogle, signOut } = useAuth();
  const [text, setText] = useState("");

  return (
    <>
      <Button
        size="medium"
        variant="solid"
        onClick={() => {
          getUser();
          console.log("hi");
          console.log(data);
        }}
      >
        Get users
      </Button>
      <p>{JSON.stringify(data)}</p>
      {auth ? <p>Hi, {auth.displayName}</p> : <p>Join us!</p>}
      {auth ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <a href="/login">Log In</a>
      )}
    </>
  );
};

export default IndexPage;
