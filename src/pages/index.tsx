import dateFormat from "dateformat";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { Button, Card, Modal, Text } from "../components/atomic";
import Form from "../components/Form";
import {
  ApplicationStatus,
  ApplicationType,
  GetMyUserApplicationsQuery,
  useGetMyUserApplicationsQuery,
  useGetMyUserQuery,
} from "../generated/graphql";
import { PageGetProgramBySlugComp } from "../generated/page";
import { AuthorizationLevel, useAuthorizationLevel } from "../hooks";
import NoProgramTabLayout from "../layouts/TabLayout/NoProgramTabLayout";
import Page from "../types/Page";
import { useAuth } from "../utils/firebase/auth";
import LocalStorage from "../utils/localstorage";

const BlobCircle = () => {
  const sizes = "h-24 w-24";
  return (
    <div
      className={`${sizes} rounded-full bg-skyblue overflow-hidden flex justify-center items-end pointer-events-none`}
    >
      <img src="/static/HappyBlobs.svg" className="w-11/12 select-none" />
    </div>
  );
};

const IndexPage: PageGetProgramBySlugComp = (_) => {
  const router = useRouter();
  const authorizationLevel = useAuthorizationLevel();
  const { user } = useAuth();

  if (authorizationLevel === AuthorizationLevel.Unauthenticated) {
    if (user)
      // Logged in but myUserData has not been retrieved yet
      return <Fragment />;
    return (
      <div className="h-screen w-full p-8">
        <div className="w-full flex items-center justify-between">
          <img src="/static/DarkTextLogo.svg" />
          <div className="flex">
            <Button
              variant="inverted"
              size="small"
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </Button>
            <div className="w-4"></div>
            <Button
              size="small"
              onClick={() => {
                router.push("/signup");
              }}
            >
              Sign up
            </Button>
          </div>
        </div>
        <div className="w-160 pt-36 pl-36">
          <BlobCircle />
          <div className="h-4"></div>

          <div>
            <Text h1 b>
              Your mentorship program starts here
            </Text>
          </div>
          <div className="h-4"></div>

          <div>
            <Text>
              Mentor Center works to make peer mentorship accessible and
              manageable for any organization.
            </Text>
          </div>
          <div className="h-10"></div>
          <Button
            size="auto"
            className="h-14 w-80"
            onClick={() => {
              router.push("/signup");
            }}
          >
            Get started for free
          </Button>
        </div>
      </div>
    );
  } else if (authorizationLevel === AuthorizationLevel.Unverified) {
    router.push("/verify");
    return <Fragment />;
  } else {
    return <NoMentorshipHome />;
  }
};

type ProgramCardProps = {
  iconUrl: string;
  name: string;
  route: string;
};

const ProgramCard = ({ iconUrl, name, route }: ProgramCardProps) => {
  return (
    <Card className=" duration-75 bg-white p-4 flex gap-4 items-center justify-between">
      <div className="flex gap-4 items-center">
        <img
          src={iconUrl}
          alt={`Program ${name} icon`}
          className="h-10 w-10 col-span-1"
        />
        <Text>{name}</Text>
      </div>

      <Link href={`/program/${route}`}>
        <a>
          <Text u className="text-secondary">
            Homepage
          </Text>
        </a>
      </Link>
    </Card>
  );
};

interface ApplicationRowProps {
  application: GetMyUserApplicationsQuery["getMyUser"]["applications"][number];
}
const ApplicationRow = ({ application }: ApplicationRowProps) => {
  const [appModalOpen, setAppModalOpen] = useState(false);
  const status = () => {
    switch (application.applicationStatus) {
      case ApplicationStatus.Accepted:
        return "Accepted";
      case ApplicationStatus.Rejected:
        return "Rejected";
      case ApplicationStatus.PendingReview:
        return "Submitted";
    }
  };

  const { program } = application;

  return (
    <div className="flex items-center">
      {/* TODO: Need to fetch profile */}
      <div className="flex items-center gap-4">
        <img
          src={program.iconUrl}
          alt={`Program ${program.name} icon`}
          className="h-10 w-10 col-span-1"
        />
        <div className="flex-1 col-span-1">{program.name}</div>
      </div>

      <div className="flex-1 text-center col-span-1">
        {dateFormat(application.createdAt, "mmm d, yyyy | h:MMtt")}
      </div>

      <div className="flex items-center gap-8">
        <div className="">{status()}</div>
        <button
          onClick={() => {
            setAppModalOpen(true);
          }}
        >
          <Text u className="text-secondary">
            View Application
          </Text>
        </button>
      </div>

      <Modal
        isOpen={appModalOpen}
        onClose={() => {
          setAppModalOpen(false);
        }}
      >
        <div className="w-120">
          <Text h3>Application to {program.name}</Text>
          <div className="h-4"></div>
          <Form
            questions={
              JSON.parse(
                application.applicationType === ApplicationType.Mentee
                  ? program.menteeApplicationSchemaJson
                  : program.mentorApplicationSchemaJson
              ) || []
            }
            responses={JSON.parse(application.applicationJson) || {}}
            readonly
            showDescriptions={false}
          />
          <div className="h-8"></div>
          <div className="flex justify-end">
            <Button
              size="small"
              onClick={() => {
                setAppModalOpen(false);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const NoMentorshipHome: Page = () => {
  const { data } = useGetMyUserApplicationsQuery();
  const { data: myUserData } = useGetMyUserQuery();
  const router = useRouter();

  const cachedProgramSlug = LocalStorage.get("cachedProgramSlug");
  if (cachedProgramSlug !== null && typeof cachedProgramSlug === "string") {
    router.push(`/program/${cachedProgramSlug}`);
    return <Fragment />;
  }

  return (
    <NoProgramTabLayout basePath={router.asPath}>
      <div className="p-12 bg-white">
        <Text h2 b>
          Welcome to the Mentor Center!
        </Text>
        <div className="h-2"></div>
        <div className="h-0.25 bg-secondary w-full" />
        <div className="h-12"></div>

        {data && (
          <div>
            <Text h3 b>
              Your Applications
            </Text>
            <div className="h-4"></div>

            <Card className="p-4 flex flex-col gap-4">
              {data.getMyUser.applications.length === 0 && (
                <Text b1 b>
                  No Applications
                </Text>
              )}
              {data.getMyUser.applications.map((app, i) => {
                return <ApplicationRow application={app} key={i} />;
              })}
            </Card>
          </div>
        )}
        <div className="h-8"></div>

        {myUserData && (
          <div>
            <Text h3 b>
              Your Mentorship Programs
            </Text>
            <div className="h-4"></div>
            <div className="flex gap-4 flex-wrap">
              {myUserData.getMyUser.profiles.length === 0 && (
                <Text b1 b>
                  No Applications
                </Text>
              )}
              {myUserData.getMyUser.profiles.map((profile, i) => {
                const { program } = profile;

                return (
                  <div className="w-80" key={i}>
                    <ProgramCard
                      iconUrl={program.iconUrl}
                      name={program.name}
                      route={program.slug}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="h-8"></div>
        <div className="w-full flex">
          <Button
            size="small"
            className="w-72 mx-auto"
            onClick={() => {
              router.push("/create");
            }}
          >
            <Text>Create a Mentorship Program</Text>
          </Button>
        </div>
      </div>
    </NoProgramTabLayout>
  );
};

export default IndexPage;

// We're no longer using subdomains for v2, but keep this around for
// future use.

// function extractSubdomain(hostname: string | undefined) {
//   if (!hostname) return "";
//   let arr = hostname.split(".");
//   arr.pop();
//   return arr.join(".");
// }

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { req, res } = ctx;
//   res.setHeader(
//     "Cache-Control",
//     "public, s-maxage=1, stale-while-revalidate=59"
//   );

//   const slug = extractSubdomain(req.headers.host);

//   return await ssrGetProgramBySlug
//     .getServerPage({ variables: { slug: slug } }, ctx)
//     .catch((e) => {
//       console.log(e);
//       return { props: {} };
//     });
// };
