import React from "react";
import { Button } from "../components/atomic";
import { useGetUsersLazyQuery } from "../generated/graphql";
import { useAuth } from "../utils/firebase/auth";

const IndexPage = () => {
  const [getUser, { data }] = useGetUsersLazyQuery();
  const { user, signOut, userData } = useAuth();

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
      <a href="/create">Create Program</a>
      {userData && <p>USER DATA: {JSON.stringify(userData)}</p>}
      {user ? <p>Hi, {user.displayName}</p> : <p>Join us!</p>}
      {user ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <a href="/login">Log In</a>
      )}
    </>
  );
};

export default IndexPage;
