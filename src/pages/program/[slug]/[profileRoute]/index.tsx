import { RawDraftContentState } from "draft-js";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { HTMLAttributes } from "react";
import { Button, Card, Text } from "../../../../components/atomic";
import ErrorScreen, {
  ErrorScreenType,
} from "../../../../components/ErrorScreen";
import {
  defaultContentState,
  EditorProvider,
  PublishButton,
  ReadOnlyTextEditor,
  TextEditor,
  ToolBar,
} from "../../../../components/RichTextEditing";
import {
  PageGetProgramBySlugComp,
  ssrGetProgramBySlug,
} from "../../../../generated/page";
import { AuthorizationLevel, useAuthorizationLevel } from "../../../../hooks";
import AuthorizationWrapper from "../../../../layouts/AuthorizationWrapper";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import PageContainer from "../../../../layouts/PageContainer";
import { useSnackbar } from "../../../../notifications/SnackbarContext";
import Page from "../../../../types/Page";
import { parseParam } from "../../../../utils";
import { MAP_PROFILETYPE_TO_ROUTE } from "../../../../utils/constants";
import LocalStorage from "../../../../utils/localstorage";

function getRawContentState(json: string): RawDraftContentState {
  try {
    return JSON.parse(json) as RawDraftContentState;
  } catch (_) {
    return defaultContentState;
  }
}

const LinkToProgram = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const { setSnackbarMessage } = useSnackbar();
  return (
    <div {...props} className={"flex items-center space-x-4 " + className}>
      <Text b className="hidden xl:inline">
        Share your program!
      </Text>
      <div className="flex flex-1 xl:flex-none xl:w-96 rounded-md border-tertiary bg-white">
        <input
          id="mentorship-link"
          type="text"
          className="bg-white flex-1 rounded-md p-2"
          disabled
          readOnly
          value={`${window.location.protocol}//${
            window.location.host
          }/program/${useRouter().query.slug}`}
        />
        <button
          className="bg-black text-white h-full rounded-r-md p-2"
          onClick={() => {
            const link = document.getElementById(
              "mentorship-link"
            ) as HTMLInputElement;

            //TODO: ExecCommand has been deprecated although copy command is still supported on most browsers
            link.focus();
            link.disabled = false;
            link.select();
            link.disabled = true;
            document.execCommand("copy");
            setSnackbarMessage({ text: "Copied link!", durationInMs: 1000 });
          }}
        >
          copy
        </button>
      </div>
    </div>
  );
};

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
}: DisplayProgramHomepageProps) => {
  const JSONHomepage = getRawContentState(homepage);
  return (
    <div>
      <EditorProvider currentHomepage={JSONHomepage}>
        <div className="flex flex-col justify-center">
          <div className="flex w-full items-center justify-between">
            <Text h2 b>
              Edit Homepage
            </Text>
            <PublishButton className="" programId={programId} />
          </div>
          <div className="h-4" />
          <Text>
            People will see this landing page when they click your program link.
            Use this space to welcome people to your program, provide basic
            program information, outline FAQs, or whatever else you can imagine!
          </Text>
        </div>
        <div className="h-4" />
        <LinkToProgram />
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
};

const ReadOnlyHome = ({
  name,
  iconUrl,
  homepage,
  inProgram = false,
}: DisplayProgramHomepageProps & { inProgram?: boolean }) => {
  const router = useRouter();

  const slug = parseParam(router.query.slug);

  const JSONHomepage: RawDraftContentState = getRawContentState(homepage);
  return (
    //TODO: Figure out whether the buttons at the top should be sticky
    <div className="box-border bg-tertiary min-h-full pt-16 lg:pt-32">
      {inProgram ? (
        <LinkToProgram className="transform -translate-y-20" />
      ) : (
        <div className="flex transform -translate-y-14 lg:-translate-y-20 float-right z-10">
          <Link href={`/program/${slug}/apply?as=mentor`}>
            <Button variant="inverted" size="small">
              Apply as Mentor
            </Button>
          </Link>

          <div className="w-4" />

          <Link href={`/program/${slug}/apply?as=mentee`}>
            <Button variant="solid" size="small">
              Apply as Mentee
            </Button>
          </Link>
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

  if (!program) {
    return <ErrorScreen type={ErrorScreenType.PageNotFound} />;
  }

  switch (authorizationLevel) {
    case AuthorizationLevel.Admin:
    case AuthorizationLevel.Mentor:
    case AuthorizationLevel.Mentee:
      LocalStorage.set(
        "cachedProfileSlug",
        `${program.slug}/${MAP_PROFILETYPE_TO_ROUTE[authorizationLevel]}`
      );
      break;
    default:
      break;
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
