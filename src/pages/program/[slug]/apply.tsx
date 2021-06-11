import React, { Fragment } from "react";
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

const ProgramApplyPage: Page = (_) => {
  const { loading, user } = useAuth();
  const { currentProgram } = useCurrentProgram();
  const [createApplication] = useCreateApplicationMutation();
  const authorizationLevel = useAuthorizationLevel();

  if (loading) return <Fragment />;

  const { Admin, Mentor, Mentee } = AuthorizationLevel;
  if ([Admin, Mentor, Mentee].includes(authorizationLevel))
    return <div>You're already in this program.</div>;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div>
        <Text h1>Apply to {currentProgram?.name} as a mentor!</Text>
      </div>
      <div className="h-4"></div>
      <Button
        size="small"
        onClick={() => {
          if (!currentProgram || !user) return;
          const createApplicationInput: CreateApplicationInput = {
            programId: currentProgram.programId!,
            applicationJson: JSON.stringify({ test: user?.uid }),
            applicationType: ApplicationType.Mentor,
          };
          createApplication({ variables: { data: createApplicationInput } });
        }}
      >
        Apply
      </Button>
    </div>
  );
};

export default ProgramApplyPage;
