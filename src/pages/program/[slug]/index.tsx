import React from "react";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { Text, Card } from "../../../components/atomic";
import {
  EditorProvider,
  ToolBar,
  TextEditor,
  PublishButton,
} from "../../../components/RichTextEditing";
import {
  PageGetProgramBySlugComp,
  ssrGetProgramBySlug,
} from "../../../generated/page";

import { AuthorizationLevel, useAuthorizationLevel } from "../../../hooks";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import Page from "../../../types/Page";
import { parseParam } from "../../../utils";
import { useAuth } from "../../../utils/firebase/auth";
import { useRouter } from "next/router";
import { Program } from "../../../generated/graphql";
import { ContentBlock } from "draft-js";

//TODO: Figure out how we want the scrolling behavior to work
//TODO: Answer "Should the homepage be by default a really long card / What contents should it have"
//TODO: Determine when the button should be disabled
//TODO: saving contents of the homepage
const AdminHome = ({ programId, name, iconUrl, homepage }: Program) => {
  return (
    <div className="box-border bg-tertiary min-h-screen py-24 px-28 flex">
      <Card className="box-border w-full px-16 py-10">
        <div className="relative -top-24">
          <img className="w-28 h-28" src={iconUrl} />
          <div className="h-2" />
          <Text h1 b>
            {name}
          </Text>
          <EditorProvider currentHomepage={homepage}>
            <div className="box-border w-full bg-white sticky top-0 py-4 z-10 rounded-md flex justify-end">
              <div className="flex-grow self-center">
                <ToolBar />
              </div>
              <PublishButton programId={programId} />
            </div>
            <div className="h-2" />
            <TextEditor />
          </EditorProvider>
        </div>
      </Card>
    </div>
  );
};

const ReadOnlyHome = ({ name, iconUrl, homepage }: Program) => {
  const JSONHomepage = JSON.parse(homepage);
  return (
    <div className="box-border bg-tertiary min-h-screen py-24 px-28 flex">
      <Card className="box-border w-full px-16 py-10">
        <div className="relative -top-24">
          <img className="w-28 h-28" src={iconUrl} />
          <div className="h-2" />
          <Text h1 b>
            {name}
          </Text>
          {JSONHomepage.map((block: ContentBlock) => {
            console.log(block);
            return <div></div>;
          })}
        </div>
      </Card>
    </div>
  );
};

const ProgramPage: PageGetProgramBySlugComp & Page = (props) => {
  const { user, signOut } = useAuth();
  const authorizationLevel = useAuthorizationLevel();
  const router = useRouter();

  const program = props.data?.getProgramBySlug;

  const getProgramPage = () => {
    switch (authorizationLevel) {
      case AuthorizationLevel.Admin:
        return <AdminHome {...program} />;
      case AuthorizationLevel.Mentee:
      case AuthorizationLevel.Mentor:
        return <div>In-program Home</div>;
      default:
        return <ReadOnlyHome {...program} />;
    }
  };
  console.log(program.homepage);
  return getProgramPage();
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
