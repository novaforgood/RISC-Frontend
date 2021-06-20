import React from "react";
import {
  GetAvailOverrideDaysQuery,
  GetAvailOverrideTimeslotsQuery,
  useGetAvailOverrideDaysQuery,
  useGetAvailOverrideTimeslotsQuery,
} from "../../generated/graphql";

type AvailOverrideDayPartial =
  GetAvailOverrideDaysQuery["getAvailOverrideDays"][number];

type AvailOverrideTimeslotPartial =
  GetAvailOverrideTimeslotsQuery["getAvailOverrideTimeslots"][number];

type SetAvailabilityOverridesCardProps = {
  profileId: string;
};

export const SetAvailabilityOverridesCard = ({
  profileId,
}: SetAvailabilityOverridesCardProps) => {
  const {
    data: availOverrideTimeslotsData,
    loading: availOverrideTimeslotsLoading,
    error: availOverrideTimeslotsError,
  } = useGetAvailOverrideTimeslotsQuery({
    variables: { profileId },
  });
  const {
    data: availOverrideDaysData,
    loading: availOverrideDaysLoading,
    error: availOverrideDaysError,
  } = useGetAvailOverrideDaysQuery({
    variables: { profileId },
  });
  // const [setAvailOverrideTimeslotsMutation] =
  //   useSetAvailOverrideTimeslotsMutation({
  //     refetchQueries: [refetchGetAvailOverrideTimeslotsQuery({ profileId })],
  //   });
  // const [setAvailOverrideDaysMutation] = useSetAvailOverrideDaysMutation({
  //   refetchQueries: [refetchGetAvailOverrideDaysQuery({ profileId })],
  // });

  let availOverrideDays: AvailOverrideDayPartial[] = [];
  if (
    !availOverrideDaysLoading &&
    !availOverrideDaysError &&
    availOverrideDaysData
  ) {
    availOverrideDays = availOverrideDaysData.getAvailOverrideDays;
  }

  let availOverrideTimeslots: AvailOverrideTimeslotPartial[] = [];
  if (
    !availOverrideTimeslotsLoading &&
    !availOverrideTimeslotsError &&
    availOverrideTimeslotsData
  ) {
    availOverrideTimeslots =
      availOverrideTimeslotsData.getAvailOverrideTimeslots;
  }

  return (
    <div className="flex flex-col">
      {/* <Calendar availabilities={[]} /> */}
    </div>
  );
};
