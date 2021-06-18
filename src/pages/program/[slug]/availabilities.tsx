import React from "react";
import { Card, Text } from "../../../components/atomic";
import { SetWeeklyAvailabilitiesCard } from "../../../components/Availabilities/SetWeeklyAvailabilitiesCard";
import { useCurrentProfile } from "../../../hooks";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import PageContainer from "../../../layouts/PageContainer";
import Page from "../../../types/Page";

const SetAvailabilitiesPage: Page = () => {
  const { currentProfile } = useCurrentProfile();

  if (!currentProfile) {
    return <></>;
  }

  return (
    <div>
      <div className="flex w-full items-center">
        <Text h2 b>
          My Availabilities
        </Text>
        <div className="flex-1" />
        <Text>
          Time Zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </Text>
      </div>
      <div className="h-4" />
      <div className="w-full flex-1">
        <div className="flex space-x-10">
          <Card className="flex-1 py-4">
            <SetWeeklyAvailabilitiesCard profileId={currentProfile.profileId} />
          </Card>
          {/* <Card className="flex-1 py-4">
              <SetAvailabilityOverridesCard
                profileId={currentProfile.profileId}
              />
            </Card> */}
        </div>
      </div>
    </div>
  );
};

SetAvailabilitiesPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>
    <PageContainer>{page}</PageContainer>
  </ChooseTabLayout>
);

export default SetAvailabilitiesPage;
