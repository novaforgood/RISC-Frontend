import React, { useState } from "react";
import { Button } from "../components/atomic/Button";
import { useGetUsersLazyQuery, useGetUsersQuery } from "../generated/graphql";

const IndexPage = () => {
  const [getUser, { loading, data }] = useGetUsersLazyQuery();
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
    </>
  );
};

export default IndexPage;
