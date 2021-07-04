import React, { useEffect, useState } from "react";
import { Button, Text } from "../../../../../components/atomic";
import CatchUnsavedChangesModal from "../../../../../components/CatchUnsavedChangesModal";
import FormSchemaEditor from "../../../../../components/FormSchemaEditor";
import { useUpdateProgramMutation } from "../../../../../generated/graphql";
import { AuthorizationLevel, useCurrentProgram } from "../../../../../hooks";
import ChooseTabLayout from "../../../../../layouts/ChooseTabLayout";
import PageContainer from "../../../../../layouts/PageContainer";
import { Question } from "../../../../../types/Form";
import Page from "../../../../../types/Page";

function getQuestionsFromJson(json: string): Question[] {
  try {
    return JSON.parse(json) as Question[];
  } catch (e) {
    return [];
  }
}

const EditMenteeProfilePage: Page = (_) => {
  const { currentProgram, refetchCurrentProgram } = useCurrentProgram();
  const [updateProgram] = useUpdateProgramMutation();
  const [profileSchema, setProfileSchema] = useState<Question[]>([]);
  const [modified, setModified] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  isSavingProfile; // TODO: If is saving, set loading state of button to true.

  useEffect(() => {
    if (!currentProgram) return;
    setProfileSchema(
      getQuestionsFromJson(currentProgram?.menteeProfileSchemaJson)
    );
    return () => {};
  }, [currentProgram]);

  const saveProfile = () => {
    if (!currentProgram) return;

    setIsSavingProfile(true);

    Promise.all([
      updateProgram({
        variables: {
          programId: currentProgram.programId,
          data: { menteeProfileSchemaJson: JSON.stringify(profileSchema) },
        },
      }),
    ]).then(() => {
      refetchCurrentProgram();

      setIsSavingProfile(false);
      setModified(false);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <CatchUnsavedChangesModal unsavedChangesExist={modified === true} />

      <div className="flex justify-between items-center w-full">
        <Text h2 b>
          Edit Mentee Profile
        </Text>
        <div className="w-12"></div>
        <div className="flex">
          <Button
            size="small"
            disabled={!modified}
            onClick={() => {
              saveProfile();
            }}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="h-8" />

      <div className="w-80 sm:w-120 md:w-160 lg:w-200 flex flex-col">
        <Text b2>
          This page is for editing how <b>mentees</b> fill out their profile.
        </Text>
        <div className="h-8" />

        <Text h3 b className="text-secondary">
          Edit questions
        </Text>
        <div className="h-2"></div>

        <Text>
          What should mentors know about mentees who reach out for a chat?
        </Text>
        <div className="h-4"></div>

        <FormSchemaEditor
          questions={profileSchema}
          onChange={(newQuestions) => {
            setModified(true);
            setProfileSchema(newQuestions);
          }}
        ></FormSchemaEditor>
      </div>
    </div>
  );
};

EditMenteeProfilePage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps} canView={[AuthorizationLevel.Admin]}>
    <PageContainer>{page}</PageContainer>
  </ChooseTabLayout>
);

export default EditMenteeProfilePage;
