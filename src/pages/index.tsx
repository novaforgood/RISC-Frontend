import type { GetServerSideProps } from "next";
import React from "react";
import { Button } from "../components/atomic";
import { useGetUsersLazyQuery } from "../generated/graphql";
import {
  PageGetProgramBySlugComp,
  ssrGetProgramBySlug,
} from "../generated/page";
import { useAuth } from "../utils/firebase/auth";

const IndexPage: PageGetProgramBySlugComp = (props) => {
  const [getUser, { data }] = useGetUsersLazyQuery();
  const { user, signOut, userData } = useAuth();

  console.log(props);

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

function extractSubdomain(hostname: string | undefined) {
  if (!hostname) return "";
  let arr = hostname.split(".");
  arr.pop();
  return arr.join(".");
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx;
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1, stale-while-revalidate=59"
  );

  const slug = extractSubdomain(req.headers.host);

  return await ssrGetProgramBySlug.getServerPage(
    { variables: { slug: slug } },
    ctx
  );
};
