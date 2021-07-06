import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Text } from "../../../components/atomic";
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

function getTagsFromJson(json: Maybe<string> | undefined): Array<string> {
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch (e) {
    return [];
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

  const { profileId, tagsJson } = currentProfile;
  const { firstName, lastName, profilePictureUrl } = myUserData.getMyUser;
  const tagsList = getTagsFromJson(tagsJson);
  const tags = tagsList?.slice(0, 3).map((tag: string, index: number) => (
    <div className="rounded-md bg-tertiary m-1 p-1" key={index}>
      {tag}
    </div>
  ));
  const moreTag = (
    <div className="rounded-md border-primary border m-1 p-1">
      + {tagsList.length - 3} more
    </div>
  );

  switch (authorizationLevel) {
    case AuthorizationLevel.Mentor:
    case AuthorizationLevel.Mentee:
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
              {tags?.length > 3 ? moreTag : <div></div>}
            </div>
            <div className="h-4"></div>

            <textarea
              value={bio}
              onChange={(e) => {
                setModified(true);
                setBio(e.target.value);
              }}
              className="resize-none p-2 shadow-sm focus:ring-secondary focus:border-primary mt-1 block sm:text-sm border border-secondary rounded-md"
              placeholder="Bio"
            ></textarea>
            <div className="h-4"></div>

            <Button disabled onClick={() => {}}>
              View Profile
            </Button>
          </Card>
          <div className="h-8"></div>

          {authorizationLevel === AuthorizationLevel.Mentor && (
            <Fragment>
              <Card className="flex flex-col p-6 items-start border-0">
                <Text b>
                  {isMentor
                    ? "What kinds of mentorship do you offer?"
                    : "What kinds of mentorship are you looking for?"}
                </Text>
                <div className="h-2"></div>
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

    default:
      return <div>404</div>;
  }
};

EditProfilePage.getLayout = (page, pageProps) => (
  <ChooseTabLayout
    {...pageProps}
    canView={[AuthorizationLevel.Mentor, AuthorizationLevel.Mentee]}
  >
    <PageContainer>{page}</PageContainer>
  </ChooseTabLayout>
);

export default EditProfilePage;
