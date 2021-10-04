import React, { useEffect, useState } from "react";
import { Button, Text } from "../../../../../../components/atomic";
import CatchUnsavedChangesModal from "../../../../../../components/CatchUnsavedChangesModal";
import FormSchemaEditor from "../../../../../../components/FormSchemaEditor";
import { useUpdateProgramMutation } from "../../../../../../generated/graphql";
import { AuthorizationLevel, useCurrentProgram } from "../../../../../../hooks";
import AuthorizationWrapper from "../../../../../../layouts/AuthorizationWrapper";
import ChooseTabLayout from "../../../../../../layouts/ChooseTabLayout";
import PageContainer from "../../../../../../layouts/PageContainer";
import { useSnackbar } from "../../../../../../notifications/SnackbarContext";
import { Question } from "../../../../../../types/Form";
import Page from "../../../../../../types/Page";

function getQuestionsFromJson(json: string): Question[] {
  try {
    return JSON.parse(json) as Question[];
  } catch (e) {
    return [];
  }
}

const EditMenteeApplicationPage: Page = (_) => {
  const { currentProgram, refetchCurrentProgram } = useCurrentProgram();
  const [updateProgram] = useUpdateProgramMutation();
  const [applicationSchema, setApplicationSchema] = useState<Question[]>([]);
  const [modified, setModified] = useState(false);
  const { setSnackbarMessage } = useSnackbar();
  const [isSavingApplicationSchema, setIsSavingApplicationSchema] =
    useState(false);
  isSavingApplicationSchema; // TODO: If is saving, set loading state of button to true.

  useEffect(() => {
    if (!currentProgram) return;
    setApplicationSchema(
      getQuestionsFromJson(currentProgram?.menteeApplicationSchemaJson)
    );
    return () => {};
  }, [currentProgram]);

  const saveMenteeApplicationSchema = () => {
    setIsSavingApplicationSchema(true);
    updateProgram({
      variables: {
        programId: currentProgram?.programId!,
        data: {
          menteeApplicationSchemaJson: JSON.stringify(applicationSchema),
        },
      },
    }).then(() => {
      refetchCurrentProgram();
      setIsSavingApplicationSchema(false);
      setModified(false);
      setSnackbarMessage({ text: "Saved mentor application format!" });
    });
  };

  return (
    <div className="flex flex-col items-center">
      <CatchUnsavedChangesModal unsavedChangesExist={modified === true} />

      <div className="sticky -top-10 bg-tertiary flex justify-between items-center w-full pt-4 pb-4">
        <Text h2 b>
          Edit Mentee Application
        </Text>
        <Button
          size="small"
          disabled={!modified || applicationSchema.length == 0}
          onClick={() => {
            saveMenteeApplicationSchema();
          }}
        >
          Save
        </Button>
      </div>

      <div className="h-8"></div>

      <div className="w-80 sm:w-120 md:w-160 lg:w-200 flex flex-col">
        <Text b2>
          Mentees will have to answer these questions in order to apply to join
          the program.
        </Text>
        <div className="h-4" />
        <FormSchemaEditor
          questions={applicationSchema}
          onChange={(newQuestions) => {
            setModified(true);
            setApplicationSchema(newQuestions);
          }}
        ></FormSchemaEditor>
      </div>
    </div>
  );
};

EditMenteeApplicationPage.getLayout = (page, pageProps) => (
  <AuthorizationWrapper canView={[AuthorizationLevel.Admin]}>
    <ChooseTabLayout {...pageProps}>
      <PageContainer>{page}</PageContainer>
    </ChooseTabLayout>
  </AuthorizationWrapper>
);

export default EditMenteeApplicationPage;
