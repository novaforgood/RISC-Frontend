import React from "react";
import { Text } from "../atomic";

type SetAvailabilityOverridesCardProps = {
  profileId: string;
};

export const SetAvailabilityOverridesCard = ({
  profileId,
}: SetAvailabilityOverridesCardProps) => {
  return (
    <>
      <Text h3 b>
        Add Exceptions
      </Text>
      <Text>{profileId}</Text>
    </>
  );
};
