import React, { useEffect, useState } from "react";
import { Button, Text } from "../../../../../components/atomic";
import FormSchemaEditor from "../../../../../components/FormSchemaEditor";
import { useUpdateProgramMutation } from "../../../../../generated/graphql";
import { useCurrentProgram } from "../../../../../hooks";
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
  const [isSavingProfileSchema, setIsSavingProfileSchema] = useState(false);
  isSavingProfileSchema; // TODO: If is saving, set loading state of button to true.

  useEffect(() => {
    if (!currentProgram) return;
    setProfileSchema(
      getQuestionsFromJson(currentProgram?.menteeProfileSchemaJson)
    );
    return () => {};
  }, [currentProgram]);

  const saveMenteeProfileSchema = () => {
    console.log(JSON.stringify(profileSchema));
    setIsSavingProfileSchema(true);
    updateProgram({
      variables: {
        programId: currentProgram?.programId!,
        data: { menteeProfileSchemaJson: JSON.stringify(profileSchema) },
      },
    }).then(() => {
      refetchCurrentProgram();
      setIsSavingProfileSchema(false);
      setModified(false);
    });
  };

  return (
    <div className="flex flex-col items-center">
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
              saveMenteeProfileSchema();
            }}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="h-8" />
      <Text b2>
        This page is for editing the information that mentees will see when they
        fill out their profiles for your organization.
      </Text>
      <div className="h-8" />

      <FormSchemaEditor
        questions={profileSchema}
        onChange={(newQuestions) => {
          setModified(true);
          setProfileSchema(newQuestions);
        }}
      ></FormSchemaEditor>
    </div>
  );
};

EditMenteeProfilePage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>
    <PageContainer>{page}</PageContainer>
  </ChooseTabLayout>
);

export default EditMenteeProfilePage;
