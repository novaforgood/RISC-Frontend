import React, { useEffect, useState } from "react";
import { Button, Text } from "../../../../../components/atomic";
import CatchUnsavedChangesModal from "../../../../../components/CatchUnsavedChangesModal";
import FormSchemaEditor from "../../../../../components/FormSchemaEditor";
import TagSchemaEditor from "../../../../../components/tags/TagSchemaEditor";
import { ProfileTag } from "../../../../../components/tags/types";
import {
  refetchGetProfileTagsByProgramQuery,
  useGetProfileTagsByProgramQuery,
  useUpdateProfileTagsOfProgramMutation,
  useUpdateProgramMutation,
} from "../../../../../generated/graphql";
import { AuthorizationLevel, useCurrentProgram } from "../../../../../hooks";
import AuthorizationWrapper from "../../../../../layouts/AuthorizationWrapper";
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
  const [updateProfileTagsOfProgram] = useUpdateProfileTagsOfProgramMutation({
    refetchQueries: [
      refetchGetProfileTagsByProgramQuery({
        programId: currentProgram?.programId!,
      }),
    ],
  });
  const { data: profileTagsData } = useGetProfileTagsByProgramQuery({
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

      setIsSavingProfile(false);
      setModified(false);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <CatchUnsavedChangesModal unsavedChangesExist={modified === true} />

      <div className="flex justify-between items-center w-full">
        <Text h2 b>
          Edit Mentor Profile
        </Text>
        <div className="w-12"></div>
        <div className="flex">
          <Button
            size="small"
            disabled={!modified || profileSchema.length == 0}
            onClick={() => {
              saveProfile();
            }}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="h-8"></div>

      <div className="w-80 sm:w-120 md:w-160 lg:w-200 flex flex-col">
        <Text b2>
          This page is for editing how <b>mentors</b> fill out their profile.
        </Text>
        <div className="h-8" />

        <Text h3 b className="text-secondary">
          Edit tags
        </Text>
        <div className="h-2"></div>

        <Text>
          Add some tags that can be used to categorize your mentors. Mentors
          will be able to select the tags that best describe them for mentees to
          view and filter by.
        </Text>
        <div className="h-4"></div>

        <TagSchemaEditor
          tags={profileTags}
          onChange={(newProfileTags) => {
            setModified(true);
            setProfileTags(newProfileTags);
          }}
        />
        <div className="h-16"></div>

        <Text h3 b className="text-secondary">
          Edit questions
        </Text>
        <div className="h-2"></div>

        <Text>
          What should mentees know about a mentor before reaching out?
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

EditMentorProfilePage.getLayout = (page, pageProps) => (
  <AuthorizationWrapper canView={[AuthorizationLevel.Admin]}>
    <ChooseTabLayout {...pageProps} canView={[AuthorizationLevel.Admin]}>
      <PageContainer>{page}</PageContainer>
    </ChooseTabLayout>
  </AuthorizationWrapper>
);

export default EditMentorProfilePage;
