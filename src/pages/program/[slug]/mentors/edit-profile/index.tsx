import React, { useEffect, useState } from "react";
import { Button, Text } from "../../../../../components/atomic";
import FormSchemaEditor from "../../../../../components/FormSchemaEditor";
import { useUpdateProgramMutation } from "../../../../../generated/graphql";
import { useCurrentProgram } from "../../../../../hooks";
import ChooseTabLayout from "../../../../../layouts/ChooseTabLayout";
import { Question } from "../../../../../types/Form";
import Page from "../../../../../types/Page";

function getQuestionsFromJson(json: string): Question[] {
  try {
    return JSON.parse(json) as Question[];
  } catch (e) {
    return [];
  }
}

const EditMentorProfilePage: Page = (_) => {
  const { currentProgram, refetchCurrentProgram } = useCurrentProgram();
  const [updateProgram] = useUpdateProgramMutation();
  const [profileSchema, setProfileSchema] = useState<Question[]>([]);
  const [modified, setModified] = useState(false);
  const [isSavingProfileSchema, setIsSavingProfileSchema] = useState(false);
  isSavingProfileSchema; // TODO: If is saving, set loading state of button to true.

  useEffect(() => {
    if (!currentProgram) return;
    setProfileSchema(
      getQuestionsFromJson(currentProgram?.mentorProfileSchemaJson)
    );
    return () => {};
  }, [currentProgram]);

  const saveMentorProfileSchema = () => {
    setIsSavingProfileSchema(true);
    updateProgram({
      variables: {
        programId: currentProgram?.programId!,
        data: { mentorProfileSchemaJson: JSON.stringify(profileSchema) },
      },
    }).then(() => {
      refetchCurrentProgram();
      setIsSavingProfileSchema(false);
      setModified(false);
    });
  };

  return (
    <div>
      <div className="h-screen bg-tertiary flex flex-col items-center py-16 border-box overflow-y-scroll">
        <div className="flex flex-col items-center">
          <div className="flex justify-between items-center w-full">
            <Text h2 b>
              Edit Mentor Profile
            </Text>
            <div className="w-12"></div>
            <div className="flex">
              <Button
                size="small"
                disabled={!modified}
                onClick={() => {
                  saveMentorProfileSchema();
                }}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="h-8"></div>

          <FormSchemaEditor
            questions={profileSchema}
            onChange={(newQuestions) => {
              setModified(true);
              setProfileSchema(newQuestions);
            }}
          ></FormSchemaEditor>
        </div>
      </div>
    </div>
  );
};

EditMentorProfilePage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default EditMentorProfilePage;
