import type { GetServerSideProps } from "next";
import React, { Fragment } from "react";
import { Text } from "../../../components/atomic";
import {
  PageGetProgramBySlugComp,
  ssrGetProgramBySlug,
} from "../../../generated/page";
import { useAuthorizationLevel, useMyUserData } from "../../../hooks";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import Page from "../../../types/Page";
import { parseParam } from "../../../utils";
import { useAuth } from "../../../utils/firebase/auth";

const ProgramPage: PageGetProgramBySlugComp & Page = (props) => {
  const { user, signOut, loading } = useAuth();
  const { myUserData } = useMyUserData();
  const authorizationLevel = useAuthorizationLevel();

  if (loading) return <Fragment />;

  const program = props.data?.getProgramBySlug;

  return (
    <div className="h-screen w-full">
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

        {myUserData && (
          <div>
            <div>USER DATA</div>
            <div>{JSON.stringify(myUserData)}</div>
          </div>
        )}
      </div>
      {user ? <p>Hi, {user.displayName}</p> : <p>Join us!</p>}
      {user ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <a href="/login">Log In</a>
      )}
    </div>
  );
};

export default ProgramPage;

ProgramPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

// TODO: Extract this function because it'll probably be reused
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = parseParam(ctx.params?.slug);
  const apolloProps = await ssrGetProgramBySlug
    .getServerPage({ variables: { slug: slug } }, ctx)
    .catch((_) => {
      return { props: {} };
    });

  return apolloProps;
};
