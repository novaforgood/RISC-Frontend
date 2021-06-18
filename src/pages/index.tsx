import Link from "next/link";
import router, { useRouter } from "next/router";
import React from "react";
import { Button, Text } from "../components/atomic";
import { PageGetProgramBySlugComp } from "../generated/page";
import { AuthorizationLevel, useAuthorizationLevel } from "../hooks";
import NoProgramTabLayout from "../layouts/TabLayout/NoProgramTabLayout";
import Page from "../types/Page";
import { useAuth } from "../utils/firebase/auth";

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
  // TODO: Signout
  const { user } = useAuth();

  console.log(authorizationLevel, user);
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
  return (
    <NoProgramTabLayout basePath={router.asPath}>
      <div className="h-screen flex flex-col justify-center items-center">
        <div>
          <Text h3>
            You are currently not a part of any mentorship programs
          </Text>
        </div>
        <Button className="w-96 mt-9">
          <Link href="/my/applications">
            <a>
              <Text h3>Check Application Statuses</Text>
            </a>
          </Link>
        </Button>
        <Button variant="inverted" className="w-96 mt-9">
          <Link href="/create">
            <a>
              <Text h3>Create a Mentorship</Text>
            </a>
          </Link>
        </Button>
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
