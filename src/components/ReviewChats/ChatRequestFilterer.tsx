import { format } from "date-fns";
import React, { Fragment, useState } from "react";
import {
  ChatRequestStatus,
  GetChatRequestsQuery,
  Profile,
  refetchGetChatRequestsQuery,
  useAcceptChatRequestMutation,
  useGetChatRequestsQuery,
  useRejectChatRequestMutation,
} from "../../generated/graphql";
import useTimezoneConverters from "../../hooks/useTimezoneConverters";
import { Button, Modal, Text, TextArea } from "../atomic";
import { CircledCheck, CircledCross } from "../icons";
import InlineProfileAvatar from "../InlineProfileAvatar";
import ListFilterer from "../ListFilterer";
import OneOptionModal from "../OneOptionModal";
import ProfileModal from "../ProfileModal";
import TitledInput from "../TitledInput";
import ModifyChatRequestModal from "./ChatRequestMutators";

type ChatRequestPartial = Omit<
  GetChatRequestsQuery["getChatRequests"][number],
  "chatStartTime" | "chatEndTime"
> & {
  chatStartTime: Date;
  chatEndTime: Date;
};

type DetailsModalButtonProps = {
  chatRequest: ChatRequestPartial;
};

const DetailsModalButton = ({ chatRequest }: DetailsModalButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <Text u>Details</Text>
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="w-200 p-2 flex flex-col space-y-2 box-border">
          <div className="flex w-full">
            <Text h3>
              Chat with{" "}
              <Text h3 b>
                {chatRequest.menteeProfile.user.firstName +
                  " " +
                  chatRequest.menteeProfile.user.lastName}
              </Text>
            </Text>
            <div className="flex-1" />
            {/*TODO: View Profile should go here, not Close */}
            <Button size="small" onClick={() => setProfileModalOpen(true)}>
              View Profile
            </Button>
          </div>
          <Text>
            {format(chatRequest.chatStartTime, "MMM d, yyyy | h:mma") +
              " - " +
              format(chatRequest.chatEndTime, "MMM d, yyyy | h:mma")}
          </Text>
          <div className="h-2" />
          <div>Mentee Email: {chatRequest.menteeProfile.user.email}</div>
          <div className="h-2" />
          {chatRequest.chatRequestMessage && (
            <>
              <Text b>From {chatRequest.menteeProfile.user.firstName}:</Text>
              <div className="w-full bg-tertiary rounded-md p-2">
                <Text>{chatRequest.chatRequestMessage}</Text>
              </div>
            </>
          )}
          {chatRequest.chatRequestStatus == ChatRequestStatus.Accepted && (
            <div className="flex w-full">
              <ModifyChatRequestModal
                chatRequestId={chatRequest.chatRequestId}
                chatCanceled={false}
              />
              <div className="flex-1" />
            </div>
          )}
        </div>
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => {
            setProfileModalOpen(false);
          }}
          profile={chatRequest.menteeProfile as Profile}
        />
      </Modal>
    </>
  );
};

type ChatRequestListItemProps = {
  chatRequest: ChatRequestPartial;
  onChatRequestAccept: (mentee: string) => void;
};

const ChatRequestListItem = ({
  chatRequest,
  onChatRequestAccept,
}: ChatRequestListItemProps) => {
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");

  const [isSetLocationModalOpen, setSetLocationModalOpen] = useState(false);
  const [location, setLocation] = useState(
    chatRequest.mentorProfile.user.preferredChatLocation
  );
  const [acceptChatRequestMutation] = useAcceptChatRequestMutation({
    variables: {
      chatRequestId: chatRequest.chatRequestId,
      chatLocation: location,
    },
    refetchQueries: [
      refetchGetChatRequestsQuery({
        profileId: chatRequest.mentorProfileId,
      }),
    ],
  });

  const [rejectChatRequestMutation] = useRejectChatRequestMutation({
    refetchQueries: [
      refetchGetChatRequestsQuery({
        profileId: chatRequest.mentorProfileId,
      }),
    ],
  });

  const getAcceptRejectButtons = () => {
    if (chatRequest.chatRequestStatus === ChatRequestStatus.PendingReview) {
      return (
        <div className="flex space-x-2">
          <button
            className="hover:bg-inactive p-1 rounded"
            title="Accept Chat Request"
            onClick={() => {
              setSetLocationModalOpen(true);
            }}
          >
            <CircledCheck className="h-8 w-8" />
          </button>
          <button
            className="hover:bg-inactive p-1 rounded"
            title="Reject Chat Request"
            onClick={() => {
              setRejectModalOpen(true);
            }}
          >
            <CircledCross className="h-8 w-8" />
          </button>
        </div>
      );
    } else if (chatRequest.chatRequestStatus === ChatRequestStatus.Accepted) {
      return <Text b>Accepted</Text>;
    } else if (chatRequest.chatRequestStatus === ChatRequestStatus.Rejected) {
      return <Text b>Rejected</Text>;
    } else {
      return <></>;
    }
  };
  return (
    <>
      <div className="flex items-center space-x-4 p-3 hover:bg-tertiary duration-150 rounded">
        <div className="w-24">{getAcceptRejectButtons()}</div>
        <div className="flex-1">
          <InlineProfileAvatar user={chatRequest.menteeProfile.user} />
        </div>
        <div className="md:flex-1" />
        <Text className="hidden lg:inline">
          {format(new Date(chatRequest.chatStartTime), "MMM d, yyyy | h:mma") +
            " - " +
            format(new Date(chatRequest.chatEndTime), "MMM d, yyyy | h:mma")}
        </Text>
        <div className="flex-1" />
        <DetailsModalButton chatRequest={chatRequest} />
        <div className="md:w-8 lg:w-12" />
      </div>
      <Modal
        isOpen={isSetLocationModalOpen}
        onClose={() => {
          setSetLocationModalOpen(false);
        }}
      >
        <div className="p-4 flex flex-col space-y-6">
          <Text h3 b>
            Accept Chat Request
          </Text>
          <Text>
            {chatRequest.menteeProfile.user.firstName} has specified that they
            prefer to meet here:
            <br className="h-2" />
            <Text i>{chatRequest.chatLocation}</Text>
          </Text>
          <TitledInput
            title="Confirm the location:"
            className="w-144"
            placeholder="Set your default location in Profile Picture > My General Profile"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="w-full flex justify-between">
            <Button
              size="small"
              variant="inverted"
              onClick={() => setSetLocationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="small"
              onClick={() => {
                acceptChatRequestMutation().then(() => {
                  onChatRequestAccept(
                    chatRequest.menteeProfile.user.firstName +
                      " " +
                      chatRequest.menteeProfile.user.lastName
                  );
                });
                setSetLocationModalOpen(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
        }}
      >
        <div className="p-4 flex flex-col">
          <Text h3 b>
            Reject Chat Request
          </Text>
          <div className="h-6" />
          <Text>
            Let {chatRequest.menteeProfile.user.firstName} know why you are
            rejecting the request:
          </Text>
          <div className="h-6" />
          <TextArea
            value={rejectMessage}
            onChange={(e: any) => {
              const target = e.target as HTMLTextAreaElement;
              setRejectMessage(target.value);
            }}
            className="w-96"
            placeholder="Reason for rejection"
          />
          <div className="h-8" />

          <div className="flex justify-between">
            <Button
              variant="inverted"
              size="small"
              onClick={() => {
                setRejectModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              onClick={() => {
                rejectChatRequestMutation({
                  variables: {
                    chatRequestId: chatRequest.chatRequestId,
                    chatRejectMessage: rejectMessage,
                  },
                });
                setRejectModalOpen(false);
              }}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

type ChatRequestsListProps = {
  title: string;
  chatRequests: ChatRequestPartial[];
};

const ChatRequestsList = ({ title, chatRequests }: ChatRequestsListProps) => {
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [mentee, setMentee] = useState("NULL NULL");

  return (
    <Fragment>
      <div className="flex flex-col px-8 py-6">
        <Text h3>{title}</Text>
        <div className="h-4" />
        {chatRequests.length > 0 ? (
          chatRequests.map((cr) => (
            <ChatRequestListItem
              key={cr.chatRequestId}
              chatRequest={cr}
              onChatRequestAccept={(mentee: string) => {
                setTimeout(() => {
                  setIsAcceptModalOpen(true);
                  setMentee(mentee);
                }, 250);
              }}
            />
          ))
        ) : (
          <Text>None</Text>
        )}
      </div>
      <OneOptionModal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        title="Chat Accepted! 🎉"
        buttonText="Close"
        onButtonClick={() => {
          setIsAcceptModalOpen(false);
        }}
      >
        <Text>
          You have scheduled a chat with <Text b>{mentee}</Text>! Check your
          email for a calendar invite and some next steps to make sure that your
          chat goes smoothly.
        </Text>
      </OneOptionModal>
    </Fragment>
  );
};

type ChatsFiltererProps = {
  profileId: string;
};

export const ChatRequestFilterer = ({ profileId }: ChatsFiltererProps) => {
  const { data } = useGetChatRequestsQuery({
    variables: {
      profileId,
    },
  });

  const filterOptions: {
    [key: string]: (
      applicationList: ChatRequestPartial[]
    ) => ChatRequestPartial[];
  } = {
    New: (x) =>
      x.filter((y) => y.chatRequestStatus === ChatRequestStatus.PendingReview),
    Upcoming: (x) =>
      x.filter((y) => y.chatRequestStatus === ChatRequestStatus.Accepted),
    Past: (x) =>
      x.filter((y) => y.chatStartTime.getTime() < new Date().getTime()),
  };

  const { fromUTC } = useTimezoneConverters();

  if (!fromUTC || !data) return <Fragment />;

  const chatRequests = data.getChatRequests.map((chatRequest) => {
    return {
      ...chatRequest,
      chatStartTime: fromUTC(new Date(chatRequest.chatStartTime)),
      chatEndTime: fromUTC(new Date(chatRequest.chatEndTime)),
    };
  });

  return (
    <ListFilterer
      listToFilter={chatRequests}
      filterOptions={filterOptions}
      defaultFilterOption={"New"}
      listComponent={(filterOption, filteredList) => (
        <ChatRequestsList
          title={`${filterOption} Chats`}
          chatRequests={filteredList}
        />
      )}
    />
  );
};
