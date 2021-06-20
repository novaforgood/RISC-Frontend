import React from "react";
import { Card, Text } from "../../../components/atomic";
import Select from "../../../components/atomic/Select";
import { SetWeeklyAvailabilitiesCard } from "../../../components/Availabilities/SetWeeklyAvailabilitiesCard";
import {
  refetchGetMyUserQuery,
  useGetMyUserQuery,
  useUpdateUserMutation,
} from "../../../generated/graphql";
import { useCurrentProfile } from "../../../hooks";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import PageContainer from "../../../layouts/PageContainer";
import Page from "../../../types/Page";
import { getTimezoneSelectOptions } from "../../../utils";

const SetAvailabilitiesPage: Page = () => {
  const [updateUser] = useUpdateUserMutation({
    refetchQueries: [refetchGetMyUserQuery()],
  });
  const { currentProfile } = useCurrentProfile();
  const { data } = useGetMyUserQuery();

  if (!currentProfile || !data) {
    return <></>;
  }

  const myTimezone = data.getMyUser.timezone;

  return (
    <div>
      <div className="flex w-full items-center">
        <Text h2 b>
          My Availabilities
        </Text>
        <div className="flex-1" />
        <div className="flex items-center">
          <Text>Time Zone: </Text>
          <div className="w-2"></div>
          <Select
            className="w-80"
            value={myTimezone}
            options={getTimezoneSelectOptions()}
            onSelect={(newTimezone) => {
              updateUser({ variables: { data: { timezone: newTimezone } } });
            }}
          />
        </div>
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
