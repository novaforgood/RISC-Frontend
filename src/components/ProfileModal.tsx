import React, { useEffect, useState } from "react";
import { GetProfilesQuery, Maybe } from "../generated/graphql";
import { useCurrentProgram } from "../hooks";
import { Question } from "../types/Form";
import { Button, Modal, Text } from "./atomic";
import BookAChat from "./BookAChat";
import Form, { ResponseJson } from "./Form";

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

  useEffect(() => {
    if (isOpen === true) setStage(ProfileModalStage.VIEW_PROFILE);
    return () => {};
  }, [isOpen]);

  const renderModalContents = () => {
    switch (stage) {
      case ProfileModalStage.VIEW_PROFILE:
        return (
          <div>
            <div className="flex">
              <div className="flex flex-col items-center">
                <div className="h-40 w-40 rounded-full bg-inactive">
                  <img src={profile.user.profilePictureUrl}></img>
                </div>
                <div className="h-4"></div>
                <Text b1 b>
                  {profile.user.firstName} {profile.user.lastName}
                </Text>
              </div>
              <div className="w-8"></div>
              <div>
                <div>
                  <div className="rounded bg-tertiary p-4">
                    <table className="table-auto">
                      <tr>
                        <td>
                          <Text b>Email:</Text>
                        </td>
                        <td className="pl-4">
                          <Text>{profile.user.email}</Text>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div className="h-4"></div>

                <div className="flex justify-center">
                  <Button
                    size="small"
                    // disabled={authorizationLevel !== AuthorizationLevel.Mentee}
                    onClick={() => {
                      setStage(ProfileModalStage.BOOK_CHAT);
                    }}
                  >
                    Book a Chat
                  </Button>
                  {/* <div className="w-2"></div> */}
                  {/* <Button
                    size="small"
                    variant="inverted"
                    // disabled={authorizationLevel !== AuthorizationLevel.Mentee}
                  >
                    Request Mentor
                  </Button> */}
                  <button />
                </div>
              </div>
            </div>
            <div className="h-6" />
            <div className="h-0.25 w-full bg-tertiary" />
            <div className="h-6" />
            <div>
              <Text b>Personal Bio</Text>
            </div>
            <div>
              <Text>{profile.bio}</Text>
            </div>
            <div className="h-6" />
            <div>
              <Text b>Questions</Text>
            </div>
            <Form
              questions={getQuestionsFromJson(
                currentProgram?.mentorProfileSchemaJson
              )}
              responses={getResponsesFromJson(profile.profileJson)}
              readonly
              showDescriptions={false}
            />
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
      <div className="flex p-4">{renderModalContents()}</div>
    </Modal>
  );
};

export default ProfileModal;
