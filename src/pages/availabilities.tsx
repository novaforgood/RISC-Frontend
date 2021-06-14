import React from "react";
import { Card, Text } from "../components/atomic";

type SetAvailabilityOverridesCardProps = {
  profileId: string;
};

const SetAvailabilityOverridesCard = ({
  profileId,
}: SetAvailabilityOverridesCardProps) => {
  return (
    <Text h3 b>
      Add Exceptions
    </Text>
  );
};

type SetWeeklyAvailabilitiesCardProps = {
  profileId: string;
};

const SetWeeklyAvailabilitiesCard = ({
  profileId,
}: SetWeeklyAvailabilitiesCardProps) => {
  return (
    <div className="flex flex-col">
      <Text h3 b>
        Set Weekly Availabilities
      </Text>
      <Text>Duration</Text>
    </div>
  );
};

const SetAvailabilitiesPage = () => {
  return (
    <div className="bg-tertiary h-screen">
      <div className="flex flex-col items-center w-5/6 mx-auto h-full">
        <div className="flex w-5/6 items-center">
          <Text h1 b>
            My Availabilities
          </Text>
          <div className="flex-1" />
          <label className="space-x-4">
            <Text>Accepting Applications</Text>
            <input type="checkbox" />
          </label>
        </div>
        <div className="h-4" />
        <div className="w-4/5 flex-1">
          <div className="flex space-x-10">
            <Card className="flex-1 py-4">
              <SetWeeklyAvailabilitiesCard profileId="a" />
            </Card>
            <Card className="flex-1 py-4">
              <SetAvailabilityOverridesCard profileId="a" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetAvailabilitiesPage;
