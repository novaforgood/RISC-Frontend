import React, { useEffect, useState } from "react";
import { GetProfilesQuery, Maybe, ProfileType } from "../generated/graphql";
import {
  AuthorizationLevel,
  useAuthorizationLevel,
  useCurrentProgram,
} from "../hooks";
import { Question } from "../types/Form";
import { Button, Card, Modal, Tag, Text } from "./atomic";
import BookAChat from "./BookAChat";
import Form, { ResponseJson } from "./Form";
import ProfilePictureImg from "./ProfilePictureImg";

function getQuestionsFromJson(json: string | undefined): Question[] {
  if (!json) return [];
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

type Profile = GetProfilesQuery["getProfiles"][number];

enum ProfileModalStage {
  VIEW_PROFILE = "VIEW_PROFILE",
  BOOK_CHAT = "BOOK_CHAT",
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
}
const ProfileModal = ({
  isOpen,
  onClose = () => {},
  profile,
}: ProfileModalProps) => {
  const [stage, setStage] = useState(ProfileModalStage.VIEW_PROFILE);
  const { currentProgram } = useCurrentProgram();
  const authorizationLevel = useAuthorizationLevel();

  useEffect(() => {
    if (isOpen === true) setStage(ProfileModalStage.VIEW_PROFILE);
    return () => {};
  }, [isOpen]);

  const renderModalContents = () => {
    switch (stage) {
      case ProfileModalStage.VIEW_PROFILE:
        return (
          <div className="w-full">
            <div className="flex">
              <div className="flex flex-col items-center">
                <ProfilePictureImg
                  src={profile.user.profilePictureUrl}
                  className="h-40 w-40 rounded-full bg-inactive"
                />
                <div className="h-4"></div>
                <Text b1 b>
                  {profile.user.firstName} {profile.user.lastName}
                </Text>
              </div>
              <div className="w-8"></div>
              <div>
                <div>
                  <div className="rounded bg-tertiary p-4">
                    <table className="table-auto w-96">
                      <tr>
                        <td>
                          <Text b>Email:</Text>
                        </td>
                        <td className="pl-4">
                          <Text>{profile.user.email}</Text>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Text b>Preferred Location:</Text>
                        </td>
                        <td className="pl-4">{profile.user.defaultLocation}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div className="h-4"></div>

                {/* <div className="flex "> */}
                <Button
                  size="small"
                  disabled={authorizationLevel !== AuthorizationLevel.Mentee}
                  onClick={() => setStage(ProfileModalStage.BOOK_CHAT)}
                >
                  Book a Chat
                </Button>
                {/* <div className="w-2"></div>
                  <Button
                    size="small"
                    variant="inverted"
                    // disabled={authorizationLevel !== AuthorizationLevel.Mentee}
                  >
                    Request mentor
                  </Button> 
                  </div> */}
              </div>
            </div>
            <div className="h-6" />
            <div className="h-0.25 w-full bg-tertiary" />
            <div className="h-6" />

            <div className="flex flex-col justify-items-center items-center space-y-4">
              <Card className="p-6 w-full">
                <div>
                  <Text b>A little bit about me</Text>
                </div>
                <div className={profile.bio ? "h-1" : "h-2"}></div>
                <div>
                  {profile.bio ? (
                    <Text>{profile.bio}</Text>
                  ) : (
                    <Text secondary i>
                      None
                    </Text>
                  )}
                </div>
              </Card>

              <Card className="p-6 w-full">
                <Text b>Tags</Text>
                <div className="h-2"></div>
                {profile.profileTags.length === 0 ? (
                  <Text secondary i>
                    None
                  </Text>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.profileTags.map((tag) => {
                      return <Tag>{tag.name}</Tag>;
                    })}
                  </div>
                )}
              </Card>

              <div className="w-full">
                <Form
                  questions={getQuestionsFromJson(
                    profile.profileType === ProfileType.Mentee
                      ? currentProgram?.menteeProfileSchemaJson
                      : currentProgram?.mentorProfileSchemaJson
                  )}
                  responses={getResponsesFromJson(profile.profileJson)}
                  readonly
                  showDescriptions={false}
                />
              </div>
              <Button size="small" onClick={onClose}>
                Close Profile
              </Button>
            </div>
          </div>
        );
      case ProfileModalStage.BOOK_CHAT:
        return (
          <div>
            <Button
              onClick={() => {
                setStage(ProfileModalStage.VIEW_PROFILE);
              }}
              size="small"
            >
              Back
            </Button>
            <BookAChat mentor={profile} />
          </div>
        );
    }
  };

  return (
    <Modal
      backgroundColor={
        stage === ProfileModalStage.BOOK_CHAT ? "tertiary" : "white"
      }
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <div className="flex p-4 md:max-w-3xl lg:max-w-4xl">
        {renderModalContents()}
      </div>
    </Modal>
  );
};

export default ProfileModal;
