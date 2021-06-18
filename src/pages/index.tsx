import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Card, Text } from "../components/atomic";
import { useGetMyUserQuery } from "../generated/graphql";
import { PageGetProgramBySlugComp } from "../generated/page";
import { AuthorizationLevel, useAuthorizationLevel } from "../hooks";
import NoProgramTabLayout from "../layouts/TabLayout/NoProgramTabLayout";
import Page from "../types/Page";

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

  if (authorizationLevel === AuthorizationLevel.Unauthenticated)
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

  return <NoMentorshipHome />;
};

const NoMentorshipHome: Page = () => {
  const { data } = useGetMyUserQuery();
  const router = useRouter();
  const [isApplicatonClicked, setIsApplicatonClicked] = useState(false);
  const [isCreateClicked, setIsCreateClicked] = useState(false);

  if (data?.getMyUser.profiles.length == 0) {
    return (
      <NoProgramTabLayout basePath={router.asPath}>
        <div className="h-screen flex flex-col justify-center items-center">
          <div>
            <Text h3>
              You are currently not a part of any mentorship programs
            </Text>
          </div>
          <Button
            className="w-96 mt-9"
            onClick={() => {
              setIsApplicatonClicked(true);
            }}
          >
            <Link href="/my/applications">
              <a>
                <Text h3>
                  {isApplicatonClicked
                    ? "Rerouting..."
                    : "Check Application Statuses"}
                </Text>
              </a>
            </Link>
          </Button>
          <Button
            variant="inverted"
            className="w-96 mt-9"
            onClick={() => {
              setIsCreateClicked(true);
            }}
          >
            <Link href="/create">
              <a>
                <Text h3>
                  {isCreateClicked ? "Rerouting..." : "Create a Mentorship"}
                </Text>
              </a>
            </Link>
          </Button>
        </div>
      </NoProgramTabLayout>
    );
  } else {
    router.push("program/" + data?.getMyUser.profiles[0].program.slug);
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Card className="p-9">
          <Text h3>Rerouting...</Text>
        </Card>
      </div>
    );
  }
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
