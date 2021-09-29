import { capitalize } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Card, Text } from "../../../components/atomic";
import AuthenticationModal from "../../../components/Authentication/AuthenticationModal";
import ErrorScreen, { ErrorScreenType } from "../../../components/ErrorScreen";
import Form from "../../../components/Form";
import {
  ApplicationType,
  CreateApplicationInput,
  useCreateApplicationMutation,
} from "../../../generated/graphql";
import {
  AuthorizationLevel,
  useAuthorizationLevel,
  useCurrentProgram,
} from "../../../hooks";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import { Question } from "../../../types/Form";
import Page from "../../../types/Page";
import { useAuth } from "../../../utils/firebase/auth";
import LocalStorage from "../../../utils/localstorage";

// Question: Do we want users to see mentor app (behind the modal) before they log in?

function getApplicationSchemaFromJson(json: string): Question[] {
  try {
    return JSON.parse(json) as Question[];
  } catch (_) {
    return [];
  }
}

const ProgramApplyPage: Page = (_) => {
  const { user } = useAuth();
  const authorizationLevel = useAuthorizationLevel();
  const { currentProgram } = useCurrentProgram();
  const [createApplication] = useCreateApplicationMutation();
  const router = useRouter();

  const [responses, setResponses] = useState({}); // Should fetch previously saved answers
  const [formChanged, setFormChanged] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { Admin, Mentor, Mentee } = AuthorizationLevel;

  const applicant: string | string[] = router.query.as;
  // const path: string = router.asPath;

  const getApplicationType = (): ApplicationType => {
    switch (applicant) {
      case "mentor":
        return ApplicationType.Mentor;
      default:
        return ApplicationType.Mentee;
    }
  };

  const applicationType: ApplicationType = getApplicationType();

  if ([Admin, Mentor, Mentee].includes(authorizationLevel))
    // TODO: Integrate with ErrorScreen component
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <img src="/static/DarkTextLogo.svg" />
        <div className="h-8"></div>
        <div>
          <Text>You're already in this program. </Text>
          <Link href={`/program/${currentProgram?.slug}`}>
            <Text u className="cursor-pointer">
              Go to program homepage.
            </Text>
          </Link>
        </div>
      </div>
    );

  if (!currentProgram) {
    return <></>;
  }
  if (currentProgram?.name == null) {
    return <ErrorScreen type={ErrorScreenType.PageNotFound} />;
  }

  return (
    <div className="min-w-screen h-screen bg-tertiary">
      <div className="max-w-4xl mx-auto p-10">
        <div className="mt-9">
          <Text h1 b>
            {currentProgram?.name}
          </Text>
        </div>
        {!formSubmitted ? (
          <div className="w-full">
            <div className="mt-4">
              <Text h3>
                {capitalize(applicationType as string)} Application
              </Text>
            </div>
            <Text error>{error}</Text>
            <div className="mt-6 mx-10">
              <Form
                questions={getApplicationSchemaFromJson(
                  applicationType == ApplicationType.Mentee
                    ? currentProgram.menteeApplicationSchemaJson
                    : currentProgram.mentorApplicationSchemaJson
                )}
                responses={responses}
                onChange={(newResponses) => {
                  setFormChanged(true);
                  setResponses(newResponses);
                }}
                showDescriptions={true}
                // onAutosave={(response) => {
                //   setResponses(response);
                // }}
              ></Form>
              <div className="flex justify-between mt-10">
                <Button variant="inverted" onClick={() => router.back()}>
                  Back
                </Button>
                <Button
                  disabled={!formChanged}
                  onClick={() => {
                    setError("");
                    if (!currentProgram || !user) return; // Should show an error message
                    const createApplicationInput: CreateApplicationInput = {
                      programId: currentProgram.programId!,
                      applicationJson: JSON.stringify(responses),
                      applicationType: applicationType,
                    };
                    createApplication({
                      variables: { data: createApplicationInput },
                    })
                      .then(() => setFormSubmitted(true))
                      .catch((err) => {
                        setError(err.message);
                      });
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <Text h1 b>
              Thank You
            </Text>
            <div className="mt-6">
              <Card className="p-9 border-inactive rounded-xl">
                <Text b>
                  Your application has been submitted. You will receive an email
                  once there are updates to your application.
                </Text>
                <br />
                <br />
                <Text>
                  Please contact the mentorship admin if you need to make
                  changes to your application.
                </Text>
                <br />
                <br />
                <Text b>
                  Go to your homepage to view your application status.
                </Text>
              </Card>
              <div className="mt-14">
                <Button
                  onClick={() => {
                    LocalStorage.delete("cachedProfileSlug");
                    router.push("/");
                  }}
                >
                  Go to Home
                </Button>
              </div>
            </div>
          </div>
        )}
        <AuthenticationModal
          isOpen={
            user == null || authorizationLevel === AuthorizationLevel.Unverified
          }
          onClose={() => {}}
          programName={currentProgram.name}
        />
      </div>
    </div>
  );
};

ProgramApplyPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default ProgramApplyPage;
