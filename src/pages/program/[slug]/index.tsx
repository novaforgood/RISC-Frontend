import firebase from "firebase";
import type { GetServerSideProps } from "next";
import React, { Fragment } from "react";
import { Button, Text } from "../../../components/atomic";
import { ProfileType, useGetUsersLazyQuery } from "../../../generated/graphql";
import {
  PageGetProgramBySlugComp,
  ssrGetProgramBySlug,
} from "../../../generated/page";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import Page from "../../../types/Page";
import { parseParam } from "../../../utils";
import { useAuth, UserData } from "../../../utils/firebase/auth";

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

const ProgramPage: PageGetProgramBySlugComp & Page = (props) => {
  const [getUser, { data }] = useGetUsersLazyQuery();
  const { user, signOut, userData, loading } = useAuth();

  if (loading) return <Fragment />;

  const authorizationLevel = getAuthorizationLevel(
    user,
    userData,
    props.data?.getProgramBySlug.programId
  );

  const program = props.data?.getProgramBySlug;
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
      <div className="p-4">
        <div>
          <div>
            <Text h2>Program: [{program?.name}]</Text>
          </div>
          <div>
            <Text b>Authorization Level: [{authorizationLevel}]</Text>
          </div>
        </div>

        {userData && (
          <div>
            <div>USER DATA</div>
            <div>{JSON.stringify(userData)}</div>
          </div>
        )}
      </div>
      {user ? <p>Hi, {user.displayName}</p> : <p>Join us!</p>}
      {user ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <a href="/login">Log In</a>
      )}
    </>
  );
};

export default ProgramPage;

ProgramPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

// TODO: Extract this function because it'll probably be reused
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = parseParam(ctx.params?.slug);
  const apolloProps = await ssrGetProgramBySlug.getServerPage(
    { variables: { slug: slug } },
    ctx
  );

  return apolloProps;
};
