import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { Button, Text } from "../components/atomic";
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

const NoMentorshipHome: Page = () => {
  const router = useRouter();

  const cachedProgramSlug = LocalStorage.get("cachedProgramSlug");
  if (cachedProgramSlug !== null && typeof cachedProgramSlug === "string") {
    router.push(`/program/${cachedProgramSlug}`);
    return <Fragment />;
  }

  return (
    <NoProgramTabLayout basePath={router.asPath}>
      <div className="h-screen flex flex-col justify-center items-center">
        <div>
          <Text h2>Welcome to Mentor Center</Text>
        </div>
        <div className="h-4"></div>

        <Button
          size="small"
          className="w-72"
          onClick={() => {
            router.push("/my/applications");
          }}
        >
          <Text>Check Application Statuses</Text>
        </Button>
        <div className="h-2"></div>
        <Button
          size="small"
          variant="inverted"
          className="w-72"
          onClick={() => {
            router.push("/create");
          }}
        >
          <Text>Create a Mentorship</Text>
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
