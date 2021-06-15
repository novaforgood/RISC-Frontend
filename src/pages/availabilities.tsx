import React from "react";
import { Card, Text } from "../components/atomic";
import { SetAvailabilityOverridesCard } from "../components/Availabilities/SetAvailabilityOverridesCard";
import { SetWeeklyAvailabilitiesCard } from "../components/Availabilities/SetWeeklyAvailabilitiesCard";

const PROFILE_ID = "4c1a35bb-dd8d-4de0-aa93-efff37ceba55";

const SetAvailabilitiesPage = () => {
  return (
    <div className="bg-tertiary h-full">
      <div className="flex flex-col items-center w-11/12 mx-auto h-full">
        <div className="flex w-11/12 xl:w-5/6 items-center">
          <Text h1 b>
            My Availabilities
          </Text>
          <div className="flex-1" />
          <Text>
            Time Zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </Text>
        </div>
        <div className="h-4" />
        <div className="w-11/12 xl:w-5/6 flex-1">
          <div className="flex space-x-10">
            <Card className="flex-1 py-4">
              <SetWeeklyAvailabilitiesCard profileId={PROFILE_ID} />
            </Card>
            <Card className="flex-1 py-4">
              <SetAvailabilityOverridesCard profileId={PROFILE_ID} />
            </Card>
          </div>
        </div>
      </div>
      <div className="h-12" />
    </div>
  );
};

export default SetAvailabilitiesPage;
