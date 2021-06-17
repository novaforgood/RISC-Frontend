import { format } from "date-fns";
import React, { useState } from "react";
import {
  ChatRequestStatus,
  GetChatRequestsQuery,
  useGetChatRequestsQuery,
} from "../../generated/graphql";
import { Button, Modal, Text } from "../atomic";
import InlineProfileAvatar from "../InlineProfileAvatar";
import ListFilterer from "../ListFilterer";

type ChatRequestPartial = GetChatRequestsQuery["getChatRequests"][number];

const chatRequestStatusToTextMap = {
  [ChatRequestStatus.PendingReview]: "Pending",
  [ChatRequestStatus.Accepted]: "Accepted",
  [ChatRequestStatus.Rejected]: "Rejected",
};

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
                {chatRequest.mentorProfile.user.firstName +
                  " " +
                  chatRequest.mentorProfile.user.lastName}
              </Text>
            </Text>
            <div className="flex-1" />
            <Text>
              {chatRequestStatusToTextMap[chatRequest.chatRequestStatus]} chat
              request
            </Text>
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
          {chatRequest.chatRequestStatus === ChatRequestStatus.Rejected && (
            <>
              <Text>Reason for rejection:</Text>
              <div className="w-full bg-tertiary rounded-md p-2">
                <Text>{chatRequest.chatRejectMessage || ""}</Text>
              </div>
            </>
          )}
          <div className="h-2" />
          <div className="flex w-full">
            <div className="flex-1" />
            <Button size={"small"} onClick={() => setIsOpen(false)}>
              Ok
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

type MyChatsListItemProps = {
  chatRequest: ChatRequestPartial;
};

const MyChatsListItem = ({ chatRequest }: MyChatsListItemProps) => {
  return (
    <div className="flex space-x-4">
      <div className="w-40">
        <Text>{chatRequestStatusToTextMap[chatRequest.chatRequestStatus]}</Text>
      </div>
      <InlineProfileAvatar user={chatRequest.mentorProfile.user} />
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

type MyChatsListProps = {
  title: string;
  chatRequests: ChatRequestPartial[];
};

const MyChatsList = ({ title, chatRequests }: MyChatsListProps) => {
  return (
    <div className="flex flex-col px-8 py-6">
      <Text h2>{title}</Text>
      <div className="h-4" />
      {chatRequests.map((cr) => (
        <MyChatsListItem key={cr.chatRequestId} chatRequest={cr} />
      ))}
    </div>
  );
};

type MyChatsFiltererProps = {
  profileId: string;
};

export const MyChatsFilterer = ({ profileId }: MyChatsFiltererProps) => {
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
    All: (x) => x,
  };

  return (
    <ListFilterer
      listToFilter={data ? data.getChatRequests : []}
      filterOptions={filterOptions}
      defaultFilterOption={"All"}
      listComponent={(filterOption, filteredList) => (
        <MyChatsList
          title={`${filterOption} Chats`}
          chatRequests={filteredList}
        />
      )}
    />
  );
};
