import React from "react";
import { Text } from "../../../components/atomic";
import { ChatRequestFilterer } from "../../../components/ReviewChats/ChatRequestFilterer";
import { AuthorizationLevel, useCurrentProfile } from "../../../hooks";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import PageContainer from "../../../layouts/PageContainer";
import Page from "../../../types/Page";

const MentorApplicationsPage: Page = () => {
  const { currentProfile } = useCurrentProfile();

  if (!currentProfile) {
    return <></>;
  }

  return (
    <div className="flex flex-col items-center w-full mx-auto h-full">
      <div className="flex w-full items-center">
        <Text h2 b>
          Chat Requests
        </Text>
      </div>
      <div className="h-4" />
      <div className="w-full flex-1">
        <ChatRequestFilterer profileId={currentProfile.profileId} />
      </div>
    </div>
  );
};

MentorApplicationsPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps} canView={[AuthorizationLevel.Mentor]}>
    <PageContainer>{page}</PageContainer>
  </ChooseTabLayout>
);

export default MentorApplicationsPage;
