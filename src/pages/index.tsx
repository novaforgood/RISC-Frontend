import React from "react";
import { Button } from "../components/atomic";
import { useGetUsersLazyQuery } from "../generated/graphql";
import { useAuth } from "../utils/firebase/auth";

const IndexPage = () => {
  const [getUser, { data }] = useGetUsersLazyQuery();
  const { auth, signOut } = useAuth();

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
