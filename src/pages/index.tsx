import React from "react";
import { Button, Text } from "../components/atomic";
import Form, { Question } from "../components/Form";
import TitledInput from "../components/TitledInput";
import { useGetMyUserQuery } from "../generated/graphql";
import { PageGetProgramBySlugComp } from "../generated/page";
import { useAuth } from "../utils/firebase/auth";

const IndexPage: PageGetProgramBySlugComp = (_) => {
  const { user, signOut } = useAuth();
  const { data } = useGetMyUserQuery();

  // Dummy data
  const dummyForm: Question[] = [
    {
      id: "0ABC",
      title: "Test Question",
      type: "short-answer",
      description: "",
    },
    {
      id: "1ABC",
      title: "Test Question",
      type: "short-answer",
      description: "",
    },
  ];

  return (
    <>
      <a href="/create">Create Program</a>
      <div className="h-4"></div>
      <div>{JSON.stringify(data?.getMyUser)}</div>
      <div className="h-4"></div>

      {user ? <p>Hi, {user.displayName}</p> : <p>Join us!</p>}
      {user ? (
        <button
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </button>
      ) : (
        <a href="/login">Log In</a>
      )}
      <br />
      <Text h2>Just the component</Text>
      <Form
        questions={dummyForm}
        initResponses={{}}
        onSubmit={(resp: Object) => {
          console.log("Imagine that I pushed answers");
          console.log(resp);
        }}
        id="bryanTestID0"
      ></Form>
      <Text h2>With margins applied</Text>
      <Form
        questions={dummyForm}
        initResponses={{}}
        onSubmit={(resp: Object) => {
          console.log("Imagine that I pushed answers");
          console.log(resp);
        }}
        id="bryanTestID1"
        className="m-20"
      ></Form>
      <Text h2>Can make custom submit button and link to form</Text>
      <br />
      <Button form="bryanTestID1">Submit</Button>
      <TitledInput title="Foo"></TitledInput>
    </>
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
