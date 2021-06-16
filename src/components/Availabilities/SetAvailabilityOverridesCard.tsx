import { addDays, format, startOfDay } from "date-fns";
import React from "react";
import {
  DateInterval,
  GetAvailabilityOverridesQuery,
  refetchGetAvailabilityOverridesQuery,
  useCreateAvailabilityOverrideMutation,
  useDeleteAvailabilityOverrideMutation,
  useGetAvailabilityOverridesQuery,
  useSetAvailabilityOverridesMutation,
} from "../../generated/graphql";
import { Button, Text } from "../atomic";

type AvailabilityOverridePartial = GetAvailabilityOverridesQuery["getAvailabilityOverrides"][number];
type AvailabilityOverrideIntervalPartial = GetAvailabilityOverridesQuery["getAvailabilityOverrides"][number]["availabilityOverrideIntervals"][number];

type SetAvailabilityOverridesRowProps = {
  date: Date;
  overrides: AvailabilityOverrideIntervalPartial[];
  onEdit: (newDateIntervals: DateInterval[]) => void;
  onDelete: () => void;
};

const SetAvailabilityOverridesRow = ({
  date,
  overrides,
  onDelete,
}: SetAvailabilityOverridesRowProps) => {
  return (
    <>
      <div className="h-4" />
      <div className="flex flex-col w-5/6 mx-auto">
        <div className="flex">
          <Text b>{format(date, "MMMM d, yyyy")}</Text>
          <div className="flex-1" />
          <button>edit</button>
          <div className="w-4" />
          <button onClick={() => onDelete()}>delete</button>
        </div>
        <div className="h-1" />
        <div className="flex flex-col space-y-1">
          {overrides.map((interval) => (
            <Text>
              {format(interval.startTime, "h:mm a") +
                " - " +
                format(interval.endTime, "h:mm a")}
            </Text>
          ))}
        </div>
      </div>
      <div className="h-4" />
    </>
  );
};

type SetAvailabilityOverridesCardProps = {
  profileId: string;
};

export const SetAvailabilityOverridesCard = ({
  profileId,
}: SetAvailabilityOverridesCardProps) => {
  const { data, loading, error } = useGetAvailabilityOverridesQuery({
    variables: {
      profileId,
    },
  });
  const [
    createAvailabilityOverrideMutation,
  ] = useCreateAvailabilityOverrideMutation({
    refetchQueries: [
      refetchGetAvailabilityOverridesQuery({
        profileId,
      }),
    ],
  });
  const [
    setAvailabilityOverridesMutation,
  ] = useSetAvailabilityOverridesMutation({
    refetchQueries: [
      refetchGetAvailabilityOverridesQuery({
        profileId,
      }),
    ],
  });
  const [
    deleteAvailabilityOverrideMutation,
  ] = useDeleteAvailabilityOverrideMutation({
    refetchQueries: [
      refetchGetAvailabilityOverridesQuery({
        profileId,
      }),
    ],
  });

  let availabilityOverrides: AvailabilityOverridePartial[] = [];
  if (!loading && !error && data) {
    availabilityOverrides = data.getAvailabilityOverrides;
  }

  const createAvailabilityOverride = () => {
    let nextDate = new Date();
    if (availabilityOverrides.length > 0) {
      nextDate = addDays(
        startOfDay(
          availabilityOverrides[availabilityOverrides.length - 1].date
        ),
        1
      );
    }
    createAvailabilityOverrideMutation({
      variables: { profileId, date: nextDate.getTime() },
    });
  };

  const editAvailabilityOverride = (availabilityOverrideId: string) => (
    newDateIntervals: DateInterval[]
  ) => {
    setAvailabilityOverridesMutation({
      variables: {
        availabilityOverrideId,
        availabilities: newDateIntervals,
      },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="w-5/6 mx-auto">
        <Text h3 b>
          Add exceptions
        </Text>
      </div>
      <div className="h-4" />
      <div className="flex flex-col">
        {availabilityOverrides.map((overridesForDate) => {
          return (
            <React.Fragment key={overridesForDate.date}>
              <div className="w-full h-px bg-inactive" />
              <SetAvailabilityOverridesRow
                date={new Date(overridesForDate.date)}
                overrides={overridesForDate.availabilityOverrideIntervals || []}
                onEdit={editAvailabilityOverride(
                  overridesForDate.availabilityOverrideId
                )}
                onDelete={() => {
                  deleteAvailabilityOverrideMutation({
                    variables: {
                      availabilityOverrideId:
                        overridesForDate.availabilityOverrideId,
                    },
                  });
                }}
              />
            </React.Fragment>
          );
        })}
        <div className="w-full h-px bg-inactive" />
      </div>
      <Button
        variant={"inverted"}
        size={"small"}
        onClick={createAvailabilityOverride}
      >
        add exception
      </Button>
    </div>
  );
};
