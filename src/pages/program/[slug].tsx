import firebase from "firebase";
import type { GetServerSideProps } from "next";
import React, { Fragment } from "react";
import { Button } from "../../components/atomic";
import { ProfileType, useGetUsersLazyQuery } from "../../generated/graphql";
import {
  PageGetProgramBySlugComp,
  ssrGetProgramBySlug,
} from "../../generated/page";
import { useAuth, UserData } from "../../utils/firebase/auth";

type AuthorizationLevel =
  | "unauthorized"
  | "not-in-program"
  | "mentee"
  | "mentor"
  | "admin";

function getAuthorizationLevel(
  user: firebase.User | null,
  userData: UserData | undefined,
  programID: string | undefined
): AuthorizationLevel {
  if (!user || !userData || !programID) return "unauthorized";

  for (let profile of userData.getMyUser.profiles) {
    if (profile.program.programId === programID) {
      switch (profile.profileType) {
        case ProfileType.Admin:
          return "admin";
        case ProfileType.Mentee:
          return "mentee";
        case ProfileType.Mentor:
          return "mentor";
      }
    }
  }

  return "not-in-program";
}

const IndexPage: PageGetProgramBySlugComp = (props) => {
  const [getUser, { data }] = useGetUsersLazyQuery();
  const { user, signOut, userData, loading } = useAuth();

  if (loading) return <Fragment />;

  const authorizationLevel = getAuthorizationLevel(
    user,
    userData,
    props.data?.getProgramBySlug.programId
  );

  console.log(authorizationLevel);

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

function getProgramSlug(slug: string | string[] | undefined) {
  if (!slug || typeof slug !== "string") {
    return "";
  } else {
    return slug;
  }
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = getProgramSlug(ctx.params?.slug);
  return await ssrGetProgramBySlug.getServerPage(
    { variables: { slug: slug } },
    ctx
  );
};
