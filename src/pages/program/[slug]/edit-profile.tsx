import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Text, TextArea } from "../../../components/atomic";
import CatchUnsavedChangesModal from "../../../components/CatchUnsavedChangesModal";
import Form, { ResponseJson } from "../../../components/Form";
import ProfilePictureImg from "../../../components/ProfilePictureImg";
import TagSelector from "../../../components/tags/TagSelector";
import {
  Maybe,
  UpdateProfileInput,
  useGetMyUserQuery,
  useGetProfileTagsByProgramQuery,
  useUpdateProfileMutation,
  useUpdateProfileTagsOfProfileMutation,
} from "../../../generated/graphql";
import {
  AuthorizationLevel,
  useAuthorizationLevel,
  useCurrentProgram,
} from "../../../hooks";
import useCurrentProfile from "../../../hooks/useCurrentProfile";
import AuthorizationWrapper from "../../../layouts/AuthorizationWrapper";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import PageContainer from "../../../layouts/PageContainer";
import { Question } from "../../../types/Form";
import Page from "../../../types/Page";

function getQuestionsFromJson(json: string): Question[] {
  try {
    return JSON.parse(json) as Question[];
  } catch (e) {
    return [];
  }
}

function getResponsesFromJson(json: Maybe<string> | undefined): ResponseJson {
  if (!json) return {};
  try {
    return JSON.parse(json) as ResponseJson;
  } catch (e) {
    return {};
  }
}

const EditProfilePage: Page = (_) => {
  const { currentProgram } = useCurrentProgram();
  const { currentProfile, refetchCurrentProfile } = useCurrentProfile();
  const authorizationLevel = useAuthorizationLevel();
  const { data: myUserData } = useGetMyUserQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [profileJson, setProfileJson] = useState<ResponseJson>({});
  const [modified, setModified] = useState(false);

  const [bio, setBio] = useState("");

  const [updateProfileTagsOfProfile] = useUpdateProfileTagsOfProfileMutation();
  const { data: programTagsData } = useGetProfileTagsByProgramQuery({
    variables: { programId: currentProgram?.programId! },
  });

  useEffect(() => {
    if (!currentProfile) return;

    setBio(currentProfile.bio || "");
    setProfileJson(getResponsesFromJson(currentProfile.profileJson));
    setSelectedTagIds(currentProfile.profileTags.map((t) => t.profileTagId));

    return () => {};
  }, [currentProfile]);

  if (!currentProgram || !currentProfile || !myUserData || !programTagsData)
    return <div>404</div>;

  const { profileId } = currentProfile;
  const { firstName, lastName, profilePictureUrl } = myUserData.getMyUser;
  const tagsList = programTagsData.getProfileTagsByProgram.filter((t) =>
    selectedTagIds.includes(t.profileTagId)
  );
  const tags = tagsList.slice(0, 3).map((tag, index: number) => (
    <div className="rounded-md bg-tertiary m-1 p-1" key={index}>
      {tag.name}
    </div>
  ));
  const moreTag = (
    <div className="rounded-md border-primary border m-1 p-1">
      + {tagsList.length - 3} more
    </div>
  );

  if (
    ![AuthorizationLevel.Mentor, AuthorizationLevel.Mentee].includes(
      authorizationLevel
    )
  )
    return <div>404</div>;

  const isMentor = authorizationLevel === AuthorizationLevel.Mentor;
  return (
    <div className="flex flex-col items-center">
      <CatchUnsavedChangesModal unsavedChangesExist={modified === true} />

      <div className="flex justify-between items-center w-full">
        <Text h2 b>
          Edit My {isMentor ? "Mentor" : "Mentee"} Profile
        </Text>
        <div className="w-12"></div>
        <div className="flex">
          <Button
            size="small"
            disabled={!modified}
            onClick={() => {
              const updateProfileInput: UpdateProfileInput = {
                profileJson: JSON.stringify(profileJson),
                bio: bio,
              };

              Promise.all([
                updateProfile({
                  variables: {
                    profileId: profileId,
                    data: updateProfileInput,
                  },
                }),
                updateProfileTagsOfProfile({
                  variables: {
                    profileId: currentProfile.profileId,
                    profileTagIds: selectedTagIds,
                  },
                }),
              ]).then(() => {
                if (refetchCurrentProfile) refetchCurrentProfile();
                setModified(false);
              });
            }}
          >
            Save
          </Button>
        </div>
      </div>
      <div className="h-8"></div>
      <Card className="flex flex-col w-80 p-6 items-center border-0">
        <ProfilePictureImg
          className="h-40 w-40 rounded-full object-cover bg-tertiary border border-inactive"
          src={profilePictureUrl}
        />

        <div className="h-4"></div>

        <Text b className="text-body-1 text-center">
          {firstName} {lastName}
        </Text>
        <div className="h-4"></div>

        <div className="flex flex-wrap justify-center">
          {tags}
          {tagsList.length > 3 && moreTag}
        </div>
        <div className="h-4"></div>

        <TextArea
          value={bio}
          onChange={(e: any) => {
            const target = e.target as HTMLTextAreaElement;
            setModified(true);
            setBio(target.value);
          }}
          placeholder="Bio"
        ></TextArea>
        <div className="h-4"></div>

        <Button disabled onClick={() => {}}>
          View Profile
        </Button>
      </Card>
      <div className="h-8"></div>

      {authorizationLevel === AuthorizationLevel.Mentor && (
        <Fragment>
          <Card className="flex flex-col p-6 items-start border-0">
            <Text b>Select the tags that best describe you.</Text>
            <div className="h-4"></div>
            <TagSelector
              selectableTags={programTagsData.getProfileTagsByProgram}
              selectedTagIds={selectedTagIds}
              onChange={(newSelectedTagIds) => {
                setModified(true);
                setSelectedTagIds(newSelectedTagIds);
              }}
            />
          </Card>
          <div className="h-8"></div>
        </Fragment>
      )}

      <Form
        questions={getQuestionsFromJson(
          isMentor
            ? currentProgram.mentorProfileSchemaJson
            : currentProgram.menteeProfileSchemaJson
        )}
        responses={profileJson}
        onChange={(newResponses) => {
          setModified(true);
          setProfileJson(newResponses);
        }}
        className="w-full"
      ></Form>
    </div>
  );
};

EditProfilePage.getLayout = (page, pageProps) => (
  <AuthorizationWrapper
    canView={[AuthorizationLevel.Mentor, AuthorizationLevel.Mentee]}
  >
    <ChooseTabLayout {...pageProps}>
      <PageContainer>{page}</PageContainer>
    </ChooseTabLayout>
  </AuthorizationWrapper>
);

export default EditProfilePage;
