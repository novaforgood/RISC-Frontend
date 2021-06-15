import React from "react";
import type { GetServerSideProps } from "next";
import { Text, Card, Button } from "../../../components/atomic";
import {
  EditorProvider,
  ToolBar,
  ReadOnlyTextEditor,
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
// import { useAuth } from "../../../utils/firebase/auth";
// import { useRouter } from "next/router";
import { Program } from "../../../generated/graphql";
import { RawDraftContentState } from "draft-js";

//TODO: Answer "Should the homepage be by default a really long card / What contents should it have"
const AdminHome = ({ programId, name, iconUrl, homepage }: Program) => {
  return (
    <div className="box-border bg-tertiary min-h-screen py-32 px-36">
      <EditorProvider currentHomepage={homepage}>
        <PublishButton
          className="transform -translate-y-20 z-10 float-right"
          programId={programId}
        />
        <Card className="box-border w-full px-16 py-10">
          <div className="relative -top-24">
            <img className="w-28 h-28" src={iconUrl} />
            <div className="h-2" />
            <Text h1 b>
              {name}
            </Text>
            <div className="box-border w-full bg-white sticky top-0 py-4 z-10 rounded-md">
              <ToolBar />
            </div>
            <div className="h-2" />
            <TextEditor />
          </div>
        </Card>
      </EditorProvider>
    </div>
  );
};

//TODO: Add join and apply routing
const ReadOnlyHome = ({ name, iconUrl, homepage }: Program) => {
  const JSONHomepage: RawDraftContentState = JSON.parse(homepage);
  return (
    //TODO: Figure out whether the buttons at the top should be sticky
    <div className="box-border bg-tertiary min-h-screen py-32 px-36">
      <div className="flex transform -translate-y-20 float-right z-10">
        <Button variant="inverted" size="small">
          Apply to Mentor
        </Button>
        <div className="w-4" />
        <Button variant="solid" size="small">
          Join
        </Button>
      </div>
      <Card className="box-border w-full px-16 py-10">
        <div className="relative -top-24">
          <img className="w-28 h-28" src={iconUrl} />
          <div className="h-2" />
          <Text h1 b>
            {name}
          </Text>
          <div className="h-2" />
          <ReadOnlyTextEditor {...JSONHomepage} />
        </div>
      </Card>
    </div>
  );
};

//TODO: Figure out what routing we need
const ProgramPage: PageGetProgramBySlugComp & Page = (props: any) => {
  // const { user, signOut } = useAuth();
  const authorizationLevel = useAuthorizationLevel();
  // const router = useRouter();

  const program = props.data?.getProgramBySlug;
  console.log(program);

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
