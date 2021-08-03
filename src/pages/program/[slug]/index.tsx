import { RawDraftContentState } from "draft-js";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Card, Text } from "../../../components/atomic";
import AuthenticationModal from "../../../components/Authentication/AuthenticationModal";
import ErrorScreen, { ErrorScreenType } from "../../../components/ErrorScreen";
import {
  defaultContentState,
  ReadOnlyTextEditor,
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

const ReadOnlyHome = ({
  name,
  iconUrl,
  homepage,
  inProgram = false,
}: DisplayProgramHomepageProps & { inProgram?: boolean }) => {
  const [authenticationModalOpen, setAuthenticationModalOpen] = useState(false);
  const [queryAfterAuthentication, setQueryAfterAuthentication] = useState<
    "mentor" | "mentee"
  >("mentor");
  const authorizationLevel = useAuthorizationLevel();
  const router = useRouter();

  const JSONHomepage: RawDraftContentState = getRawContentState(homepage);
  return (
    //TODO: Figure out whether the buttons at the top should be sticky
    <div className="box-border bg-tertiary min-h-full pt-16 lg:pt-32">
      <AuthenticationModal
        isOpen={authenticationModalOpen}
        onClose={() => {
          setAuthenticationModalOpen(false);
        }}
        programName={name}
        afterRoute={router.asPath + "/apply?as=" + queryAfterAuthentication}
      />
      {inProgram ? (
        <></>
      ) : (
        <div className="flex transform -translate-y-14 lg:-translate-y-20 float-right z-10">
          <Button
            variant="inverted"
            size="small"
            onClick={() => {
              if (
                authorizationLevel === AuthorizationLevel.Unauthenticated ||
                authorizationLevel === AuthorizationLevel.Unverified
              ) {
                setQueryAfterAuthentication("mentor");
                setAuthenticationModalOpen(true);
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
              if (
                authorizationLevel === AuthorizationLevel.Unauthenticated ||
                authorizationLevel === AuthorizationLevel.Unverified
              ) {
                setQueryAfterAuthentication("mentee");
                setAuthenticationModalOpen(true);
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
  const program = props.data?.getProgramBySlug;

  if (!program) {
    return <ErrorScreen type={ErrorScreenType.PageNotFound} />;
  }

  return (
    <PageContainer>
      <ReadOnlyHome {...program} />
    </PageContainer>
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
      return {
        props: {},
      };
    });

  return apolloProps;
};
