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
  ProfileType,
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
      <Fragment>
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
          <div className="flex justify-between px-36 pt-36 gap-8">
            <div className="w-160 flex-shrink-0">
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
            <img src="/static/Laptop.svg"></img>
          </div>
        </div>

        <div className="w-300 mx-auto h-0.25 bg-inactive my-20"></div>
        <div className="flex flex-col items-center justify-center">
          <Text h2 b className="w-120 text-center">
            Seamlessly connect mentors and mentees.
          </Text>
          <div className="h-4"></div>
          <Text b2 className="w-200 text-center">
            Our platform facilitates mentor-mentee matching, empowers mentees to
            start conversations, and streamlines the scheduling process.
          </Text>
          <img src="/static/GuyOnVideoCall.svg" />
        </div>
        <div className="w-300 mx-auto h-0.25 bg-inactive my-20"></div>

        <div className="flex flex-col items-start w-200 mx-auto">
          <Text h2 b className="w-96">
            Personalize your platform
          </Text>
          <div className="h-4"></div>
          <Text b2 className="w-1/2">
            Organization leaders and administrators can manage mentorship
            programs directly on our platform.
          </Text>
          <div className="h-10"></div>
          <div className="flex gap-4">
            <div className="w-1/2 p-4 bg-beige rounded-lg flex flex-col">
              <Text h3 b>
                Tailored to Your Needs
              </Text>
              <div className="h-2"></div>
              <Text b2>
                Customize your program on our site to best fit your program’s
                needs.
              </Text>
            </div>
            <div className="w-1/2 p-4 bg-beige rounded-lg flex flex-col">
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
            className="h-14 w-80"
            onClick={() => {
              router.push("/create");
            }}
          >
            Create your program today
          </Button>
        </div>

        <div className="w-300 mx-auto h-0.25 bg-inactive my-20"></div>
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
        <Link href={`/program/${route}`}>Go to Mentorship</Link>
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

type TitledCardProps = {
  title: string;
  children: JSX.Element[] | undefined;
};
const TitledCard = ({ title, children }: TitledCardProps) => {
  return (
    <Card className="w-2/3 mx-auto p-6 space-y-4">
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

  const cachedProgramSlug = LocalStorage.get("cachedProgramSlug");
  if (cachedProgramSlug !== null && typeof cachedProgramSlug === "string") {
    router.push(`/program/${cachedProgramSlug}`);
    return <Fragment />;
  }

  return (
    <NoProgramTabLayout basePath={router.asPath}>
      <div className="h-screen bg-tertiary">
        <div className="bg-white flex flex-col pt-12 pb-2 px-20 space-y-4">
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
              Welcome to the <Text b>Mentor Center</Text>!
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
                  My Mentorships
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
              className={`w-32 h-1 bg-primary transform transition-transform ${
                showApplications && "translate-x-40"
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
            <TitledCard title="My Mentorships">
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
