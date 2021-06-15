import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button, Text } from "../../../components/atomic";
import {
  PageGetProgramBySlugComp,
  ssrGetProgramBySlug,
} from "../../../generated/page";
import { AuthorizationLevel, useAuthorizationLevel } from "../../../hooks";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import Page from "../../../types/Page";
import { parseParam } from "../../../utils";
import { useAuth } from "../../../utils/firebase/auth";

const ProgramPage: PageGetProgramBySlugComp & Page = (props: any) => {
  const { user, signOut } = useAuth();
  const authorizationLevel = useAuthorizationLevel();
  const router = useRouter();

  const program = props.data?.getProgramBySlug;

  return (
    <div className="h-screen w-full">
      <div>
        {authorizationLevel === AuthorizationLevel.NotInProgram && (
          <>
            <Button variant="inverted" size="small">
              <Link href={`${router.asPath}/apply?as=mentor`}>
                Apply to Mentor
              </Link>
            </Button>
            <Button size="small">
              <Link href={`${router.asPath}/apply?as=mentee`}>Join</Link>
            </Button>
          </>
        )}
      </div>
      <div>
        <div>
          <a href="/create">Create Program</a>
        </div>
        <div className="p-4">
          <div>
            <div>
              <Text h2>Program: [{program?.name}]</Text>
            </div>
            <div>
              <Text b>Authorization Level: [{authorizationLevel}]</Text>
            </div>
          </div>
        </div>
        {user ? <p>Hi, {user.displayName}</p> : <p>Join us!</p>}
        {user ? (
          <button onClick={() => signOut()}>Sign Out</button>
        ) : (
          <a href="/login">Log In</a>
        )}
      </div>
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
