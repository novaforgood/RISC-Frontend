import React, { useState } from "react";
import { Button, Text } from "../../../components/atomic";
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
import Page from "../../../types/Page";
import { useAuth } from "../../../utils/firebase/auth";
import Form, { dummyForm } from "../../../components/Form";

const ProgramApplyPage: Page = (_) => {
  const { user } = useAuth();
  const { currentProgram } = useCurrentProgram();
  const [createApplication] = useCreateApplicationMutation();
  const authorizationLevel = useAuthorizationLevel();
  const [responses, setResponses] = useState({}); // Should fetch previously saved answers
  const [formChanged, setFormChanged] = useState(false);

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
    <div className="h-screen w-screen">
      <div>
        <Text h2 b>
          Apply to {currentProgram?.name} as a mentor!
        </Text>
      </div>
      <div className="w-screen">
        <Form
          questions={dummyForm} // Should actually fetch form schema
          responses={responses}
          onChange={() => {
            setFormChanged(true);
          }}
          onAutosave={(response) => {
            setResponses(response);
          }}
        ></Form>
        <Button
          size="small"
          disabled={!formChanged}
          onClick={() => {
            if (!currentProgram || !user) return;
            const createApplicationInput: CreateApplicationInput = {
              programId: currentProgram.programId!,
              applicationJson: JSON.stringify(responses),
              applicationType: ApplicationType.Mentor,
            };
            createApplication({ variables: { data: createApplicationInput } });
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default ProgramApplyPage;
