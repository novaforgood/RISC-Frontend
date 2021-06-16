import React, { useState } from "react";
import { Button, Checkbox } from "../../components/atomic";
import { useGetUsersLazyQuery } from "../../generated/graphql";
import { useAuth } from "../../utils/firebase/auth";

const TestCheckboxPage = () => {
  const [getUser, { data }] = useGetUsersLazyQuery();
  const { user, signOut } = useAuth();

  const [checked, setChecked] = useState(false);

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
      {user ? <p>Hi, {user.displayName}</p> : <p>Join us!</p>}
      {user ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <a href="/login">Log In</a>
      )}
      <br />
      <Checkbox
        label="check me!"
        checked={checked}
        onCheck={(c) => {
          setChecked(c);
        }}
      ></Checkbox>
    </>
  );
};

export default TestCheckboxPage;
