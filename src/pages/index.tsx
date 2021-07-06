import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { Button, Card, Text } from "../components/atomic";
import {
  ApplicationStatus,
  useGetMyUserApplicationsQuery,
  useGetMyUserQuery,
} from "../generated/graphql";
import { PageGetProgramBySlugComp } from "../generated/page";
import { AuthorizationLevel, useAuthorizationLevel } from "../hooks";
import NoProgramTabLayout from "../layouts/TabLayout/NoProgramTabLayout";
import Page from "../types/Page";
import { useAuth } from "../utils/firebase/auth";
import LocalStorage from "../utils/localstorage";
import dateFormat from "dateformat";
import { CircledCheckSolid } from "../components/icons";
import Link from "next/link";

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
  description: string;
};

const ProgramCard = ({ iconUrl, name, description }: ProgramCardProps) => {
  return (
    <Card className="hover:bg-tertiary hover:cursor-pointer bg-white m-auto p-4 grid grid-cols-8 gap-4 items-center">
      <img src={iconUrl} alt={`Program ${name} icon`} className="col-span-1" />
      <Text b className="col-span-2">
        {name}
      </Text>
      <div className="col-span-4 overflow-ellipsis">
        <Text>{description}</Text>
      </div>
    </Card>
  );
};

const NoMentorshipHome: Page = () => {
  const { data } = useGetMyUserApplicationsQuery();
  const user = useGetMyUserQuery();
  const router = useRouter();

  const cachedProgramSlug = LocalStorage.get("cachedProgramSlug");
  if (cachedProgramSlug !== null && typeof cachedProgramSlug === "string") {
    router.push(`/program/${cachedProgramSlug}`);
    return <Fragment />;
  }

  return (
    <NoProgramTabLayout basePath={router.asPath}>
      <div className="p-10 space-y-8 bg-white">
        <Text h2 b>
          Welcome to the Mentor Center!
        </Text>
        <div className="h-0.25 bg-primary w-full" />
        <div className="h-2" />
        {data && data.getMyUser.applications.length > 0 ? (
          <div className="space-y-4">
            <Text h3 b>
              Your Applications
            </Text>
            <Card className="p-4">
              {data.getMyUser.applications.map((app, i) => {
                const status = () => {
                  switch (app.applicationStatus) {
                    case ApplicationStatus.Accepted:
                      return <CircledCheckSolid />;
                    case ApplicationStatus.Rejected:
                      return "Rejected";
                    case ApplicationStatus.PendingReview:
                      return "Submitted";
                  }
                };

                return (
                  <div className="flex grid grid-cols-3" key={i}>
                    {/* TODO: Need to fetch profile */}
                    <div className="flex-1 col-span-1">{app.program.name}</div>
                    <div className="flex-1 text-center col-span-1">
                      {dateFormat(app.createdAt, "mmm d, yyyy | h:MMtt")}
                    </div>
                    <div className="flex-1 flex justify-center col-span-1">
                      {status()}
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        ) : (
          <Text h3 b>
            No Applications
          </Text>
        )}
        {user.data && user.data.getMyUser.profiles.length > 0 ? (
          <div className="flex flex-col space-y-4">
            <Text h3 b>
              Your Programs
            </Text>
            {user.data.getMyUser.profiles.map((profile, i) => {
              const { program } = profile;

              return (
                <Link key={i} href={`/program/${program.slug}`}>
                  <a>
                    <ProgramCard
                      iconUrl={program.iconUrl}
                      name={program.name}
                      description={program.description}
                    />
                  </a>
                </Link>
              );
            })}
          </div>
        ) : (
          <>
            <div className="h-2" />
            <Text h3 b>
              No Programs
            </Text>
          </>
        )}
        <div className="h-2"></div>
        <div className="w-full flex">
          <Button
            size="small"
            className="w-72 mx-auto"
            onClick={() => {
              router.push("/create");
            }}
          >
            <Text>Create a Mentorship</Text>
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
