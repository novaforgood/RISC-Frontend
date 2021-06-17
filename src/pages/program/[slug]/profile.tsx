import React, { useEffect, useState } from "react";
import { Button, Text } from "../../../components/atomic";
import Form, { ResponseJson } from "../../../components/Form";
import {
  Maybe,
  UpdateProfileInput,
  useUpdateProfileMutation,
} from "../../../generated/graphql";
import {
  AuthorizationLevel,
  useAuthorizationLevel,
  useCurrentProgram,
} from "../../../hooks";
import useCurrentProfile from "../../../hooks/useCurrentProfile";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
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
  const [updateProfile] = useUpdateProfileMutation();

  const [profileJson, setProfileJson] = useState<ResponseJson>({});
  const [modified, setModified] = useState(false);

  useEffect(() => {
    if (!currentProfile) return;

    setProfileJson(getResponsesFromJson(currentProfile?.profileJson));
    return () => {};
  }, [currentProfile]);

  if (!currentProgram || !currentProfile) return <div>404</div>;

  switch (authorizationLevel) {
    case AuthorizationLevel.Mentor:
    case AuthorizationLevel.Mentee:
      const isMentor = authorizationLevel === AuthorizationLevel.Mentor;
      return (
        <div className="h-screen bg-tertiary flex flex-col items-center py-20">
          <div className="w-200">
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
                    };
                    updateProfile({
                      variables: {
                        profileId: currentProfile.profileId,
                        data: updateProfileInput,
                      },
                    }).then(() => {
                      if (refetchCurrentProfile) refetchCurrentProfile();
                      setModified(false);
                    });
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
            <div className="h-4"></div>
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
            ></Form>
          </div>
        </div>
      );

    default:
      return <div>404</div>;
  }
};

EditProfilePage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default EditProfilePage;
