import { format } from "date-fns";
import React, { useState } from "react";
import {
  ChatRequestStatus,
  GetChatRequestsQuery,
  refetchGetChatRequestsQuery,
  useAcceptChatRequestMutation,
  useGetChatRequestsQuery,
  useRejectChatRequestMutation,
} from "../../generated/graphql";
import { Button, Modal, Text } from "../atomic";
import InlineProfileAvatar from "../InlineProfileAvatar";
import ListFilterer from "../ListFilterer";

type ChatRequestPartial = GetChatRequestsQuery["getChatRequests"][number];

type DetailsModalButtonProps = {
  chatRequest: ChatRequestPartial;
};

const DetailsModalButton = ({ chatRequest }: DetailsModalButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Details</button>
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
            {format(
              new Date(chatRequest.chatStartTime),
              "MMM d, yyyy | h:mma"
            ) +
              " - " +
              format(new Date(chatRequest.chatEndTime), "MMM d, yyyy | h:mma")}
          </Text>
          <div className="h-2" />
          <Text>From {chatRequest.menteeProfile.user.firstName}:</Text>
          <div className="w-full bg-tertiary rounded-md p-2">
            <Text>{chatRequest.chatRequestMessage || ""}</Text>
          </div>
        </div>
      </Modal>
    </>
  );
};

type ChatRequestListItemProps = {
  chatRequest: ChatRequestPartial;
};

const ChatRequestListItem = ({ chatRequest }: ChatRequestListItemProps) => {
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
    variables: {
      chatRequestId: chatRequest.chatRequestId,
    },
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
            onClick={() => {
              acceptChatRequestMutation();
            }}
          >
            accept
          </button>
          <button
            onClick={() => {
              rejectChatRequestMutation();
            }}
          >
            reject
          </button>
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <div className="flex space-x-4">
      <div className="w-40">{getAcceptRejectButtons()}</div>
      <InlineProfileAvatar user={chatRequest.menteeProfile.user} />
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
  );
};

type ChatRequestsListProps = {
  title: string;
  chatRequests: ChatRequestPartial[];
};

const ChatRequestsList = ({ title, chatRequests }: ChatRequestsListProps) => {
  return (
    <div className="flex flex-col px-8 py-6">
      <Text h2>{title}</Text>
      <div className="h-4" />
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
    Past: (x) => x.filter((y) => y.chatStartTime < new Date().getTime),
  };

  return (
    <ListFilterer
      listToFilter={data ? data.getChatRequests : []}
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
