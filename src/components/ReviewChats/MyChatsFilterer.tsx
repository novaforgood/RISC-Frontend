import { format } from "date-fns";
import React, { Fragment, useState } from "react";
import {
  ChatRequestStatus,
  GetChatRequestsQuery,
  Profile,
  useGetChatRequestsQuery,
} from "../../generated/graphql";
import useTimezoneConverters from "../../hooks/useTimezoneConverters";
import { Button, Modal, Text } from "../atomic";
import InlineProfileAvatar from "../InlineProfileAvatar";
import ListFilterer from "../ListFilterer";
import ProfileModal from "../ProfileModal";
import ChatRequestMutators from "./ChatRequestMutators";

type ChatRequestPartial = Omit<
  GetChatRequestsQuery["getChatRequests"][number],
  "chatStartTime" | "chatEndTime"
> & {
  chatStartTime: Date;
  chatEndTime: Date;
};

const chatRequestStatusToTextMap = {
  [ChatRequestStatus.PendingReview]: "Pending",
  [ChatRequestStatus.Accepted]: "Accepted",
  [ChatRequestStatus.Rejected]: "Rejected",
  [ChatRequestStatus.Canceled]: "Canceled",
  [ChatRequestStatus.Rescheduled]: "Rescheduled",
};

type DetailsModalButtonProps = {
  chatRequest: ChatRequestPartial;
};

const DetailsModalButton = ({ chatRequest }: DetailsModalButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <div className="flex flex-1">
      <div className="flex-1" />
      <button onClick={() => setIsOpen(true)}>
        <Text u>Details</Text>
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => {
            setProfileModalOpen(false);
          }}
          profile={chatRequest.mentorProfile as Profile}
        />
        <div className="w-200 p-2 flex flex-col space-y-2 box-border">
          <div className="flex w-full space-x-4">
            <Text h3>
              Chat with{" "}
              <Text h3 b>
                {chatRequest.mentorProfile.user.firstName +
                  " " +
                  chatRequest.mentorProfile.user.lastName}
              </Text>
            </Text>
            <Text i>
              {chatRequestStatusToTextMap[chatRequest.chatRequestStatus]} chat
              request
            </Text>
            <div className="flex-1" />
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
          <div>
            <Text b>Your message:</Text>
            <div className="h-2" />
            <div className="bg-tertiary rounded-md p-2">
              <Text>{chatRequest.chatRequestMessage || "No message"}</Text>
            </div>
          </div>
          {chatRequest.chatRequestStatus === ChatRequestStatus.Rejected && (
            <>
              <Text b>Reason for rejection:</Text>
              <div className="w-full bg-tertiary rounded-md p-4">
                <Text>
                  {chatRequest.chatRejectMessage || "No reason given."}
                </Text>
              </div>
            </>
          )}
          <div className="h-2" />
          <div className="flex justify-between w-full">
            <ChatRequestMutators
              chatRequestId={chatRequest.chatRequestId}
              chatCanceled={
                chatRequest.chatRequestStatus === ChatRequestStatus.Canceled
              }
            />
            {/* <Button size={"small"} onClick={() => setIsOpen(false)}>
              Ok
            </Button> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

type MyChatsListItemProps = {
  chatRequest: ChatRequestPartial;
};

const MyChatsListItem = ({ chatRequest }: MyChatsListItemProps) => {
  return (
    <div className="flex space-x-4 hover:bg-tertiary p-3">
      <div className="w-40">
        <Text b>
          {chatRequestStatusToTextMap[chatRequest.chatRequestStatus]}
        </Text>
      </div>
      <div className="flex-1">
        <InlineProfileAvatar user={chatRequest.mentorProfile.user} />
      </div>
      <div className="md:flex-1" />
      <Text className="hidden xl:inline">
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
      <Text h3>{title}</Text>
      <div className="h-4"></div>
      {chatRequests.length > 0 ? (
        chatRequests.map((cr) => (
          <MyChatsListItem key={cr.chatRequestId} chatRequest={cr} />
        ))
      ) : (
        <Text>None</Text>
      )}
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

  const today = new Date();

  const filterOptions: {
    [key: string]: (
      applicationList: ChatRequestPartial[]
    ) => ChatRequestPartial[];
  } = {
    Upcoming: (x) =>
      x.filter(
        (y) =>
          y.chatRequestStatus === ChatRequestStatus.Accepted &&
          y.chatStartTime.getTime() > today.getTime()
      ),
    Pending: (x) =>
      x.filter((y) => y.chatRequestStatus === ChatRequestStatus.PendingReview),
    Past: (x) => x.filter((y) => y.chatStartTime.getTime() < today.getTime()),
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
      defaultFilterOption={"Upcoming"}
      listComponent={(filterOption, filteredList) => (
        <MyChatsList
          title={`${filterOption} Chats`}
          chatRequests={filteredList}
        />
      )}
    />
  );
};
