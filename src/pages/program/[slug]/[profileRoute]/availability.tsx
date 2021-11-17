import React from "react";
import { Card, Text } from "../../../../components/atomic";
import { SetAvailabilityOverridesCard } from "../../../../components/Availabilities/SetAvailabilityOverridesCard";
import { SetWeeklyAvailabilitiesCard } from "../../../../components/Availabilities/SetWeeklyAvailabilitiesCard";
import { useGetMyUserQuery } from "../../../../generated/graphql";
import { AuthorizationLevel, useCurrentProfile } from "../../../../hooks";
import AuthorizationWrapper from "../../../../layouts/AuthorizationWrapper";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import PageContainer from "../../../../layouts/PageContainer";
import Page from "../../../../types/Page";

// type SelectTimezoneProps = {
//   profileId: string;
//   currentTimezone: string;
// };
// const SelectTimezone = ({
//   profileId,
//   currentTimezone,
// }: SelectTimezoneProps) => {
//   const [updateUserTimezone] = useUpdateUserTimezoneMutation({
//     refetchQueries: [
//       refetchGetMyUserQuery(),
//       refetchGetAvailOverrideDatesQuery({
//         profileId: profileId,
//       }),
//       refetchGetAvailWeeklysQuery({
//         profileId: profileId,
//       }),
//     ],
//   });
//   return (
//     <Select
//       className="w-80"
//       value={currentTimezone}
//       options={getTimezoneSelectOptions()}
//       onSelect={(newTimezone) => {
//         updateUserTimezone({ variables: { timezone: newTimezone } });
//       }}
//     />
//   );
// };

const SetAvailabilitiesPage: Page = () => {
  const { currentProfile } = useCurrentProfile();

  const { data } = useGetMyUserQuery();

  if (!currentProfile || !data) {
    return <></>;
  }

  // const myTimezone = data.getMyUser.timezone;
  const myTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div>
      <div className="md:flex w-full items-center">
        <Text h2 b>
          My Availabilities
        </Text>
        <div className="flex-1" />
        <div className="flex items-center">
          <Text>Time Zone: </Text>
          <div className="w-2"></div>
          <div>{myTimezone}</div>
          {/* <SelectTimezone
            profileId={currentProfile.profileId}
            currentTimezone={myTimezone}
          /> */}
        </div>
      </div>
      <div className="h-4" />
      <div className="w-full flex-1">
        <div className="flex flex-col items-center md:flex-row md:items-start gap-10">
          <Card className="flex-1 py-4">
            <SetWeeklyAvailabilitiesCard profileId={currentProfile.profileId} />
          </Card>
          <Card className="flex-1 py-4">
            <SetAvailabilityOverridesCard
              profileId={currentProfile.profileId}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

SetAvailabilitiesPage.getLayout = (page, pageProps) => (
  <AuthorizationWrapper canView={[AuthorizationLevel.Mentor]}>
    <ChooseTabLayout {...pageProps}>
      <PageContainer>{page}</PageContainer>
    </ChooseTabLayout>
  </AuthorizationWrapper>
);

export default SetAvailabilitiesPage;
