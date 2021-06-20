import { RawDraftContentState } from "draft-js";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button, Card, Text } from "../../../components/atomic";
import {
  defaultContentState,
  EditorProvider,
  PublishButton,
  ReadOnlyTextEditor,
  TextEditor,
  ToolBar,
} from "../../../components/RichTextEditing";
import {
  PageGetProgramBySlugComp,
  ssrGetProgramBySlug,
} from "../../../generated/page";
import { AuthorizationLevel, useAuthorizationLevel } from "../../../hooks";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import PageContainer from "../../../layouts/PageContainer";
import Page from "../../../types/Page";
import { parseParam } from "../../../utils";

function getRawContentState(json: string): RawDraftContentState {
  try {
    return JSON.parse(json) as RawDraftContentState;
  } catch (_) {
    return defaultContentState;
  }
}

type DisplayProgramHomepageProps = {
  programId: string;
  name: string;
  iconUrl: string;
  homepage: string;
};

const AdminHome = ({
  programId,
  name,
  iconUrl,
  homepage,
}: DisplayProgramHomepageProps) => (
  <div className="pt-24">
    <EditorProvider currentHomepage={getRawContentState(homepage)}>
      <PublishButton
        className="transform -translate-y-24 z-10 float-right"
        programId={programId}
      />
      <Card className="box-border w-full px-16 p-8 z-0">
        <img
          className="w-28 h-28 relative -top-24"
          src={iconUrl}
          alt={`${name} Logo`}
        />
        <div className="relative -top-20">
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

const ReadOnlyHome = ({
  name,
  iconUrl,
  homepage,
  inProgram = false,
}: DisplayProgramHomepageProps & { inProgram?: boolean }) => {
  const router = useRouter();

  console.log(homepage);
  const JSONHomepage: RawDraftContentState = getRawContentState(homepage);
  return (
    //TODO: Figure out whether the buttons at the top should be sticky
    <div className="box-border bg-tertiary min-h-screen py-32 px-10">
      {inProgram ? (
        <></>
      ) : (
        <div className="flex transform -translate-y-20 float-right z-10">
          <Button variant="inverted" size="small">
            <Link href={router.asPath + "/apply?as=mentor"}>
              Apply to Mentor
            </Link>
          </Button>
          <div className="w-4" />
          <Button variant="solid" size="small">
            <Link href={router.asPath + "/apply?as=mentee"}>Join</Link>
          </Button>
        </div>
      )}
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

//TODO: Change type of this to not any
const ProgramPage: PageGetProgramBySlugComp & Page = (props: any) => {
  const authorizationLevel = useAuthorizationLevel();
  const router = useRouter();

  const program = props.data?.getProgramBySlug;
  if (!program) {
    router.push("/");
    return <div>Program doesn't exist!</div>;
  }
  const getProgramPage = () => {
    switch (authorizationLevel) {
      case AuthorizationLevel.Admin:
        return <AdminHome {...program} />;
      case AuthorizationLevel.Mentee:
      case AuthorizationLevel.Mentor:
        return <ReadOnlyHome {...program} inProgram={true} />;
      default:
        return <ReadOnlyHome {...program} />;
    }
  };
  return getProgramPage();
};

export default ProgramPage;

ProgramPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>
    <PageContainer>{page}</PageContainer>
  </ChooseTabLayout>
);

// TODO: Extract this function because it'll probably be reused
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = parseParam(ctx.params?.slug);
  const apolloProps = await ssrGetProgramBySlug
    .getServerPage({ variables: { slug: slug } }, ctx)
    .catch((_) => {
      return {
        props: {},
      };
    });

  return apolloProps;
};
