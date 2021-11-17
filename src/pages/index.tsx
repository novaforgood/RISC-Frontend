import dateFormat from "dateformat";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { Button, Card, ExternalLink, Modal, Text } from "../components/atomic";
import Form from "../components/Form";
import {
  ApplicationStatus,
  ApplicationType,
  GetMyUserApplicationsQuery,
  ProfileType,
  useGetMyUserApplicationsQuery,
  useGetMyUserQuery,
} from "../generated/graphql";
import { PageGetProgramBySlugComp } from "../generated/page";
import { AuthorizationLevel, useAuthorizationLevel } from "../hooks";
import NoProgramTabLayout from "../layouts/TabLayout/NoProgramTabLayout";
import Page from "../types/Page";
import { MAP_PROFILETYPE_TO_ROUTE } from "../utils/constants";
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
      <div className="px-2">
        <div className="h-screen w-full p-8">
          <div className="w-full md:flex items-center justify-between">
            <img src="/static/DarkTextLogo.svg" />
            <div className="h-4"></div>
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
          <div className="flex justify-between md:px-36 pt-10 md:pt-36 gap-8">
            <div className="md:w-160 md:flex-shrink-0">
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
                  Mentor Center works to make mentorship accessible and
                  manageable for any organization.
                </Text>
              </div>
              <div className="h-10"></div>
              <Button
                size="auto"
                className="h-14 px-4 md:w-80"
                onClick={() => {
                  router.push("/signup");
                }}
              >
                Get started for free
              </Button>
            </div>
            <img src="/static/Laptop.svg" className="hidden md:block"></img>
          </div>
        </div>

        <div className="md:w-300 mx-auto h-0.25 bg-inactive my-20"></div>
        <div className="flex flex-col items-center justify-center">
          <Text h2 b className="md:w-120 text-center">
            Seamlessly connect mentors and mentees.
          </Text>
          <div className="h-4"></div>
          <Text b2 className="md:w-200 text-center">
            Our platform facilitates mentor-mentee matching, empowers mentees to
            start conversations, and streamlines the scheduling process.
          </Text>
          <img src="/static/GuyOnVideoCall.svg" />
        </div>
        <div className="md:w-300 mx-auto h-0.25 bg-inactive my-20"></div>

        <div className="flex flex-col items-center md:items-start md:w-200 mx-auto">
          <Text h2 b className="md:w-96">
            Personalize your platform
          </Text>
          <div className="h-4"></div>
          <Text b2 className="md:w-1/2">
            Organization leaders and administrators can manage mentorship
            programs directly on our platform.
          </Text>
          <div className="h-10"></div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2 p-4 bg-beige rounded-lg flex flex-col">
              <Text h3 b>
                Tailored to Your Needs
              </Text>
              <div className="h-2"></div>
              <Text b2>
                Customize your program on our site to best fit your program’s
                needs.
              </Text>
            </div>
            <div className="md:w-1/2 p-4 bg-beige rounded-lg flex flex-col">
              <Text h3 b>
                A Centralized Platform
              </Text>
              <div className="h-2"></div>
              <Text b2>
                Keep track of your members on one centralized site and onboard
                new mentors and mentees in an intuitive flow.
              </Text>
            </div>
          </div>
          <div className="h-10"></div>
          <Button
            size="auto"
            className="h-14 md:w-80 px-4"
            onClick={() => {
              router.push("/create");
            }}
          >
            Create your program today
          </Button>
        </div>
        <div className="h-10" />
        <div className="flex justify-between w-full p-10 bg-beige space-y-2">
          <Text h3>Quick Links</Text>
          <div className="grid gap-4 grid-cols-3">
            <Text b>Legal Documents</Text>
            <Text b>About the creators</Text>
            <Text b>Socials</Text>
            <ExternalLink href="https://drive.google.com/file/d/1Zp0PZkBWpUmxedtTCz1QrpgxJBC7zNWU/view?usp=sharing">
              Terms of Use
            </ExternalLink>
            <ExternalLink href="https://risc.uchicago.edu/">
              UChicago RISC
            </ExternalLink>
            <ExternalLink href="mailto:mentorcenter.us@gmail.com">
              Email Us!
            </ExternalLink>
            <ExternalLink href="https://drive.google.com/file/d/1W54nQMgAmKs_9Qbcc02QwI7YepzhZxfB/view?usp=sharing">
              Privacy Policy
            </ExternalLink>
            <ExternalLink href="https://www.novaforgood.org/">
              Nova, Tech for Good
            </ExternalLink>
            <ExternalLink href="https://www.instagram.com/_mentorcenter/">
              Instagram
            </ExternalLink>
          </div>
        </div>
      </Fragment>
    );
  } else if (authorizationLevel === AuthorizationLevel.Unverified) {
    router.push("/verify");
    return <Fragment />;
  } else {
    return <NoMentorshipHome />;
  }
};

// ====================== LOGGED IN HOMEPAGE ======================

const MAP_PROFILETYPE_TO_NAME = {
  [ProfileType.Admin]: "Admin",
  [ProfileType.Mentor]: "Mentor",
  [ProfileType.Mentee]: "Mentee",
};

type ProgramRowProps = {
  iconUrl: string;
  name: string;
  route: string;
  profileType: ProfileType;
};

const ProgramRow = ({ iconUrl, name, route, profileType }: ProgramRowProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <img
          src={iconUrl}
          alt={`Program ${name} icon`}
          className="h-10 w-10 col-span-1"
        />
        <div className="flex flex-col">
          <Text>{name}</Text>
          <Text className="text-secondary text-caption">
            {MAP_PROFILETYPE_TO_NAME[profileType]}
          </Text>
        </div>
      </div>
      <Text
        u
        b
        className="text-secondary hover:cursor-pointer hover:text-primary"
      >
        <Link
          href={`/program/${route}/${MAP_PROFILETYPE_TO_ROUTE[profileType]}`}
        >
          Go to Homepage
        </Link>
      </Text>
    </div>
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

      <div className="hidden md:block flex-1 text-center col-span-1">
        {dateFormat(application.createdAt, "mmm d, yyyy | h:MMtt")}
      </div>

      <div className="flex items-center gap-8">
        <div className="">{status()}</div>
        <button
          onClick={() => {
            setAppModalOpen(true);
          }}
        >
          <Text u b className="text-secondary hover:text-primary">
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
        <div className="w-full md:w-120">
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

type TitledCardProps = {
  title: string;
  children: JSX.Element[] | undefined;
};
const TitledCard = ({ title, children }: TitledCardProps) => {
  return (
    <Card className="w-full md:w-2/3 mx-auto p-6 space-y-4 overflow-x-auto">
      <span>
        <Text h3 b>
          {title}
        </Text>
      </span>
      <div className="grid grid-auto-rows gap-4">
        {children?.length ? (
          children
        ) : (
          <Text className="text-secondary" i>
            None
          </Text>
        )}
      </div>
    </Card>
  );
};

const NoMentorshipHome: Page = () => {
  const { data } = useGetMyUserApplicationsQuery();
  const { data: myUserData } = useGetMyUserQuery();
  const router = useRouter();
  const [showApplications, setShowApplications] = useState(false);

  const cachedProfileSlug = LocalStorage.get("cachedProfileSlug");
  if (cachedProfileSlug !== null && typeof cachedProfileSlug === "string") {
    router.push(`/program/${cachedProfileSlug}`);
    return <Fragment />;
  }

  return (
    <NoProgramTabLayout basePath={router.asPath}>
      <div className="md:h-screen bg-tertiary">
        <div className="bg-white flex flex-col px-10 md:pt-12 md:pb-2 md:px-20 space-y-4">
          <div className="w-full flex justify-end">
            <Button
              size="small"
              className="w-72"
              onClick={() => {
                router.push("/create");
              }}
            >
              <Text>Create a Mentorship Program</Text>
            </Button>
          </div>
          <img src="/static/HappyBlobs2.svg" className="w-40 h-40" />
          <div>
            <Text h1>
              Welcome to <Text b>Mentor Center</Text>!
            </Text>
          </div>
          <div>
            <div className="flex space-x-8">
              <button onClick={() => setShowApplications(false)}>
                <Text
                  b
                  className={`cursor-pointer ${
                    showApplications && "text-secondary"
                  }`}
                >
                  My Programs
                </Text>
              </button>
              <button onClick={() => setShowApplications(true)}>
                <Text
                  b
                  className={`cursor-pointer ${
                    !showApplications && "text-secondary"
                  }`}
                >
                  My Applications
                </Text>
              </button>
            </div>
            <div className="h-1" />
            <div
              className={`w-26 h-1 bg-primary transform transition-transform ${
                showApplications && "translate-x-34 w-32"
              }`}
            />
          </div>
        </div>
        <div className="p-6">
          {showApplications ? (
            <TitledCard title="My Applications">
              {data?.getMyUser.applications.map((app, i) => {
                return <ApplicationRow application={app} key={i} />;
              })}
            </TitledCard>
          ) : (
            <TitledCard title="My Programs">
              {myUserData?.getMyUser.profiles.map((profile, i) => {
                const { program } = profile;

                return (
                  <div key={i}>
                    <ProgramRow
                      profileType={profile.profileType}
                      iconUrl={program.iconUrl}
                      name={program.name}
                      route={program.slug}
                    />
                  </div>
                );
              })}
            </TitledCard>
          )}
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
