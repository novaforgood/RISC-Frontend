import { RawDraftContentState } from "draft-js";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Card, Text } from "../../../components/atomic";
import AuthModal from "../../../components/Authentication/AuthModal";
import ErrorScreen, { ErrorScreenType } from "../../../components/ErrorScreen";
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
import AuthorizationWrapper from "../../../layouts/AuthorizationWrapper";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import PageContainer from "../../../layouts/PageContainer";
import Page from "../../../types/Page";
import { parseParam } from "../../../utils";
import LocalStorage from "../../../utils/localstorage";

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
  <div>
    <EditorProvider currentHomepage={getRawContentState(homepage)}>
      <div className="flex items-center">
        <div className="flex w-full items-center justify-between">
          <Text h2 b>
            Edit Homepage
          </Text>
          <PublishButton className="" programId={programId} />
        </div>
      </div>
      <div className="h-24"></div>

      <Card className="box-border w-full px-16 p-8 z-0">
        <img
          className="w-28 h-28 relative rounded-md -top-24"
          src={iconUrl}
          alt={`${name} Logo`}
        />
        <div className="relative -top-20">
          <Text h1 b>
            {name}
          </Text>
          <div className="w-full bg-white sticky -top-10 p-4 z-10 rounded-md">
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const authorizationLevel = useAuthorizationLevel();
  const router = useRouter();

  const JSONHomepage: RawDraftContentState = getRawContentState(homepage);
  return (
    //TODO: Figure out whether the buttons at the top should be sticky
    <div className="box-border bg-tertiary min-h-full pt-16 lg:pt-32 overflow-hidden">
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        programName={name}
      />
      {inProgram ? (
        <></>
      ) : (
        <div className="flex transform -translate-y-14 lg:-translate-y-20 float-right z-10">
          <Button
            variant="inverted"
            size="small"
            onClick={() => {
              if (authorizationLevel === AuthorizationLevel.Unauthenticated) {
                setAuthModalOpen(true);
              } else {
                router.push(router.asPath + "/apply?as=mentor");
              }
            }}
          >
            Apply as Mentor
          </Button>

          <div className="w-4" />

          <Button
            size="small"
            onClick={() => {
              if (authorizationLevel === AuthorizationLevel.Unauthenticated) {
                setAuthModalOpen(true);
              } else {
                router.push(router.asPath + "/apply?as=mentee");
              }
            }}
          >
            Apply as Mentee
          </Button>
        </div>
      )}
      <Card className="box-border w-full px-16 py-10 ">
        <div className="relative -top-24 pointer-events-none">
          <div>
            <img className="w-28 h-28 rounded-md" src={iconUrl} />
            <div className="h-2" />
            <Text h1 b>
              {name}
            </Text>
            <div className="h-2" />
          </div>
          <div className="pointer-events-auto">
            <ReadOnlyTextEditor {...JSONHomepage} />
          </div>
        </div>
      </Card>
    </div>
  );
};

//TODO: Change type of this to not any
const ProgramPage: PageGetProgramBySlugComp & Page = (props: any) => {
  const authorizationLevel = useAuthorizationLevel();

  const program = props.data?.getProgramBySlug;

  switch (authorizationLevel) {
    case AuthorizationLevel.Admin:
    case AuthorizationLevel.Mentor:
    case AuthorizationLevel.Mentee:
      LocalStorage.set("cachedProgramSlug", program.slug);
      break;
    default:
      break;
  }

  if (!program) {
    return <ErrorScreen type={ErrorScreenType.PageNotFound} />;
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
  return <PageContainer>{getProgramPage()}</PageContainer>;
};

export default ProgramPage;

ProgramPage.getLayout = (page, pageProps) => (
  <AuthorizationWrapper>
    <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
  </AuthorizationWrapper>
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
