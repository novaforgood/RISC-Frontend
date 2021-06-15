import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Text } from "../../../components/atomic";
import Form, { dummyForm } from "../../../components/Form";
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
import RedirectIfNotLoggedIn from "../../../layouts/RedirectIfNotLoggedIn";
import Page from "../../../types/Page";
import { useAuth } from "../../../utils/firebase/auth";

// Question: Do we want users to see mentor app (behind the modal) before they log in?
// Urgent: Should check if user applied to be mentor before prior to allowing them to access the form.
const ProgramApplyPage: Page = (_) => {
  const { user } = useAuth();
  const authorizationLevel = useAuthorizationLevel();
  const { currentProgram } = useCurrentProgram();
  const [createApplication] = useCreateApplicationMutation();
  const router = useRouter();

  const [responses] = useState({}); // Should fetch previously saved answers
  const [formChanged, setFormChanged] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { Admin, Mentor, Mentee } = AuthorizationLevel;
  if ([Admin, Mentor, Mentee].includes(authorizationLevel))
    return <div>You're already in this program.</div>;

  // There must be a better/more direct way of checking whether the program exists or not.
  if (currentProgram?.name == null)
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <Text h1>The program you are looking for does not exist</Text>
      </div>
    );

  return (
    <div className="min-w-screen h-screen bg-tertiary">
      {/* Nav bar goes here */}
      <div
        className={"max-w-4xl mx-auto p-10" + (formSubmitted ? " hidden" : "")}
      >
        <div className="mt-9">
          <Text h1 b>
            {currentProgram?.name}
          </Text>
        </div>
        <div className="mt-4">
          <Text h3>Mentor Application</Text>
        </div>
        <div className="mt-6 mx-10">
          <Form
            questions={dummyForm} // Should actually fetch form schema
            responses={responses}
            onChange={() => {
              setFormChanged(true);
            }}
            // onAutosave={(response) => {
            //   setResponses(response);
            // }}
          ></Form>
          <div className="flex justify-between mt-10">
            <Button variant="inverted">Back</Button>
            <Button
              disabled={!formChanged}
              onClick={() => {
                if (!currentProgram || !user) return; // Should show an error message
                const createApplicationInput: CreateApplicationInput = {
                  programId: currentProgram.programId!,
                  applicationJson: JSON.stringify(responses),
                  applicationType: ApplicationType.Mentor,
                };
                createApplication({
                  variables: { data: createApplicationInput },
                });
                setFormSubmitted(true);
              }}
            >
              Submit
            </Button>
            {user == null ? (
              <RedirectIfNotLoggedIn
                pathAfterLoggingIn={`${router.asPath}`}
              ></RedirectIfNotLoggedIn>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramApplyPage;
