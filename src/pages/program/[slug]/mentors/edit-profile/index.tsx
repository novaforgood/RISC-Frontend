import React, { useEffect, useState } from "react";
import { Button, Text } from "../../../../../components/atomic";
import FormSchemaEditor from "../../../../../components/FormSchemaEditor";
import TagSchemaEditor from "../../../../../components/tags/TagSchemaEditor";
import { ProfileTag } from "../../../../../components/tags/types";
import {
  useGetProfileTagsByProgramQuery,
  useUpdateProfileTagsOfProgramMutation,
  useUpdateProgramMutation,
} from "../../../../../generated/graphql";
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

const EditMentorProfilePage: Page = (_) => {
  const { currentProgram, refetchCurrentProgram } = useCurrentProgram();
  const [updateProgram] = useUpdateProgramMutation();
  const [updateProfileTagsOfProgram] = useUpdateProfileTagsOfProgramMutation();
  const { data: profileTagsData, refetch: refetchProfileTags } =
    useGetProfileTagsByProgramQuery({
      variables: { programId: currentProgram?.programId! },
    });
  const [profileSchema, setProfileSchema] = useState<Question[]>([]);
  const [profileTags, setProfileTags] = useState<ProfileTag[]>([]);
  const [modified, setModified] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  isSavingProfile; // TODO: If is saving, set loading state of button to true.

  useEffect(() => {
    if (!currentProgram) return;
    setProfileSchema(
      getQuestionsFromJson(currentProgram?.mentorProfileSchemaJson)
    );
    return () => {};
  }, [currentProgram]);

  useEffect(() => {
    if (!profileTagsData) return;
    setProfileTags(profileTagsData.getProfileTagsByProgram);
    return () => {};
  }, [profileTagsData]);

  const saveProfile = () => {
    if (!currentProgram) return;

    setIsSavingProfile(true);

    Promise.all([
      updateProgram({
        variables: {
          programId: currentProgram.programId,
          data: { mentorProfileSchemaJson: JSON.stringify(profileSchema) },
        },
      }),
      updateProfileTagsOfProgram({
        variables: {
          programId: currentProgram.programId,
          profileTags: profileTags.map((tag) => ({
            profileTagId: tag.profileTagId,
            name: tag.name,
          })),
        },
      }),
    ]).then(() => {
      refetchCurrentProgram();
      refetchProfileTags({ programId: currentProgram.programId });

      setIsSavingProfile(false);
      setModified(false);
    });
  };

  return (
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
              saveProfile();
            }}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="h-8"></div>
      <TagSchemaEditor
        tags={profileTags}
        onChange={(newProfileTags) => {
          setModified(true);
          setProfileTags(newProfileTags);
        }}
      />

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

EditMentorProfilePage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>
    <PageContainer>{page}</PageContainer>
  </ChooseTabLayout>
);

export default EditMentorProfilePage;
