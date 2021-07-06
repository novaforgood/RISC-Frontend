import { format } from "date-fns";
import React, { Fragment, useState } from "react";
import {
  ChatRequestStatus,
  GetChatRequestsQuery,
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
import ChatRequestMutators from "./ChatRequestMutators";

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
            <Button size={"small"}>View Profile</Button>
          </div>
          <Text>
            {format(chatRequest.chatStartTime, "MMM d, yyyy | h:mma") +
              " - " +
              format(chatRequest.chatEndTime, "MMM d, yyyy | h:mma")}
          </Text>
          <div className="h-2" />
          {chatRequest.chatRequestMessage && (
            <>
              <Text>From {chatRequest.menteeProfile.user.firstName}:</Text>
              <div className="w-full bg-tertiary rounded-md p-2">
                <Text>{chatRequest.chatRequestMessage}</Text>
              </div>
            </>
          )}
          {chatRequest.chatRequestStatus == ChatRequestStatus.Accepted && (
            <div className="flex w-full">
              <ChatRequestMutators
                chatRequestId={chatRequest.chatRequestId}
                chatCanceled={false}
              />
              <div className="flex-1" />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

type ChatRequestListItemProps = {
  chatRequest: ChatRequestPartial;
};

const ChatRequestListItem = ({ chatRequest }: ChatRequestListItemProps) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");

  const [acceptChatRequestMutation] = useAcceptChatRequestMutation({
    variables: {
      chatRequestId: chatRequest.chatRequestId,
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
        <div className="flex space-x-4">
          <button
            className="hover:bg-inactive p-1 rounded"
            title="Accept Chat Request"
            onClick={() => {
              acceptChatRequestMutation();
            }}
          >
            <CircledCheck />
          </button>
          <button
            className="hover:bg-inactive p-1 rounded"
            title="Reject Chat Request"
            onClick={() => {
              setIsRejectModalOpen(true);
            }}
          >
            <CircledCross />
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
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
        }}
      >
        <div className="p-4 flex flex-col items-center">
          <div>
            <Text>
              Let {chatRequest.menteeProfile.user.firstName} know why you are
              rejecting the request:
            </Text>
          </div>
          <div className="h-6"></div>

          <TextArea
            value={rejectMessage}
            onChange={(e) => {
              const target = e.target as HTMLTextAreaElement;
              setRejectMessage(target.value);
            }}
            className="w-96"
            placeholder="Reason for rejection"
          ></TextArea>
          <div className="h-8"></div>

          <div className="flex">
            <Button
              variant="inverted"
              size="small"
              onClick={() => {
                setIsRejectModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <div className="w-2"></div>
            <Button
              size="small"
              onClick={() => {
                rejectChatRequestMutation({
                  variables: {
                    chatRequestId: chatRequest.chatRequestId,
                    chatRejectMessage: rejectMessage,
                  },
                });
                setIsRejectModalOpen(false);
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
  return (
    <div className="flex flex-col px-8 py-6">
      <Text h3>{title}</Text>
      <div className="h-4"></div>
      {chatRequests.map((cr) => (
        <ChatRequestListItem key={cr.chatRequestId} chatRequest={cr} />
      ))}
    </div>
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
