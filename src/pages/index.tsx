import { useState } from "react";
import { useGetUsersLazyQuery, useGetUsersQuery } from "../generated/graphql";

const getSubdomain = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.location.href.split(".")[0].split("//")[1];
};

const IndexPage = () => {
  const [getUser, { loading, data }] = useGetUsersLazyQuery();
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
    </>
  );
};

export default IndexPage;
