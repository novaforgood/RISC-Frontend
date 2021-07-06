import React from "react";
import { Text } from "../../../components/atomic";
import { MyChatsFilterer } from "../../../components/ReviewChats/MyChatsFilterer";
import { AuthorizationLevel, useCurrentProfile } from "../../../hooks";
import AuthorizationWrapper from "../../../layouts/AuthorizationWrapper";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import PageContainer from "../../../layouts/PageContainer";
import Page from "../../../types/Page";

const MyChatsPage: Page = () => {
  const { currentProfile } = useCurrentProfile();

  if (!currentProfile) {
    // if (!currentProfile || currentProfile.profileId != ProfileType.Mentee) {
    return <></>;
  }

  return (
    <div className="flex flex-col items-center w-full mx-auto h-full">
      <div className="flex w-full items-center">
        <Text h2 b>
          My Chats
        </Text>
      </div>
      <div className="h-4" />
      <div className="w-full flex-1">
        <MyChatsFilterer profileId={currentProfile.profileId} />
      </div>
    </div>
  );
};

MyChatsPage.getLayout = (page, pageProps) => (
  <AuthorizationWrapper canView={[AuthorizationLevel.Mentee]}>
    <ChooseTabLayout {...pageProps}>
      <PageContainer>{page}</PageContainer>
    </ChooseTabLayout>
  </AuthorizationWrapper>
);

export default MyChatsPage;
