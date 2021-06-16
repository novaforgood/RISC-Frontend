import React from "react";
import { Text } from "../../../components/atomic";
import { ChatRequestFilterer } from "../../../components/ReviewChats/ChatRequestFilterer";
import { useCurrentProfile } from "../../../hooks";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import Page from "../../../types/Page";

const MentorApplicationsPage: Page = () => {
  const { currentProfile } = useCurrentProfile();

  if (!currentProfile) {
    return <></>;
  }

  return (
    <div className="bg-tertiary h-screen">
      <div className="flex flex-col items-center w-full mx-auto h-full">
        <div className="flex w-11/12 items-center">
          <Text h1 b>
            Chat Requests
          </Text>
        </div>
        <div className="h-4" />
        <div className="w-11/12 flex-1">
          <ChatRequestFilterer profileId={currentProfile.profileId} />
        </div>
      </div>
    </div>
  );
};

MentorApplicationsPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default MentorApplicationsPage;
