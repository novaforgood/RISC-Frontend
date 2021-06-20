import { addDays, format } from "date-fns";
import React, { useState } from "react";
import {
  GetAvailOverrideDaysQuery,
  GetAvailOverrideTimeslotsQuery,
  refetchGetAvailOverrideDaysQuery,
  useGetAvailOverrideDaysQuery,
  useSetAvailOverrideDaysMutation,
} from "../../generated/graphql";
import { Button, Modal, Text } from "../atomic";
import Calendar from "../Calendar";

type AvailOverrideDayPartial =
  GetAvailOverrideDaysQuery["getAvailOverrideDays"][number];

type AvailOverrideTimeslotPartial =
  GetAvailOverrideTimeslotsQuery["getAvailOverrideTimeslots"][number];

type SetAvailOverrideDayRowProps = {
  overrideDay: AvailOverrideDayPartial;
  onChange: (newOverrideDay: AvailOverrideDayPartial) => void;
  onDelete: () => void;
};
const SetAvailOverrideDayRow = ({
  overrideDay,
  onChange = () => {},
  onDelete = () => {},
}: SetAvailOverrideDayRowProps) => {
  return (
    <>
      <div className="h-4" />
      <div className="flex flex-col w-5/6 mx-auto">
        <div className="flex">
          <Text b>{format(overrideDay.startTime, "MMMM d, yyyy")}</Text>
          <div className="flex-1" />
          <button>edit</button>
          <div className="w-4" />
          <button
            onClick={() => {
              onDelete();
            }}
          >
            delete
          </button>
        </div>
        <div className="h-1" />
        <div className="flex flex-col space-y-1">
          {overrideDay.availOverrideTimeslots.map((timeslot) => (
            <Text>
              {format(timeslot.startTime, "h:mm a") +
                " - " +
                format(timeslot.endTime, "h:mm a")}
            </Text>
          ))}
        </div>
      </div>
      <div className="h-4" />
    </>
  );
};

type EditAvailOverrideDayModalContentsProps = {
  initOverrideDay?: AvailOverrideDayPartial | null;
  profileId: string;
  onClose: () => void;
};
const EditAvailOverrideDayModalContents = ({
  initOverrideDay = null,
  profileId,
  onClose = () => {},
}: EditAvailOverrideDayModalContentsProps) => {
  const [overrideDay, setOverrideDay] =
    useState<AvailOverrideDayPartial | null>(initOverrideDay);

  const createAvailOverrideDay = async () => {};

  const editAvailOverrideDay = async () => {};

  return (
    <div className="p-8">
      <div>
        <Text h3 b>
          Set the date of exception
        </Text>
      </div>
      <div className="h-8"></div>
      <Calendar
        selectAnyDay
        availabilities={{
          weekly: [],
          overrideDays: [],
          overrideTimeslots: [],
        }}
        onSelect={(newSelectedDay) => {
          if (newSelectedDay)
            setOverrideDay((prev) => {
              const newDay = {
                startTime: newSelectedDay?.getTime(),
                endTime: addDays(newSelectedDay, 1).getTime(),
              };
              if (prev) {
                prev = { ...prev, ...newDay };
              } else {
                // Create new day
                prev = {
                  ...newDay,
                  profileId: profileId,
                  availOverrideTimeslots: [],
                };
              }
              return prev;
            });
        }}
        selectedDay={overrideDay ? new Date(overrideDay.startTime) : null}
      />
      <div className="h-8"></div>
      {overrideDay ? (
        <div>
          <div>
            <Text>
              Selected day: {format(overrideDay.startTime, "MMMM d, yyyy")}
            </Text>
            {overrideDay.availOverrideTimeslots.map((timeslot) => {
              return <div>lol</div>;
            })}
          </div>
        </div>
      ) : (
        <div>Select a day</div>
      )}
      <div className="h-8"></div>

      <div className="flex">
        <Button
          size="small"
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
        <div className="w-2"></div>
        <Button size="small" onClick={() => {}}>
          Save
        </Button>
      </div>
    </div>
  );
};

type SetAvailabilityOverridesCardProps = {
  profileId: string;
};
export const SetAvailabilityOverridesCard = ({
  profileId,
}: SetAvailabilityOverridesCardProps) => {
  const {
    data: availOverrideDaysData,
    loading: availOverrideDaysLoading,
    error: availOverrideDaysError,
  } = useGetAvailOverrideDaysQuery({
    variables: { profileId },
  });

  const [setAvailOverrideDaysMutation] = useSetAvailOverrideDaysMutation({
    refetchQueries: [refetchGetAvailOverrideDaysQuery({ profileId })],
  });

  const [editAvailOverrideDayModalOpen, setEditAvailOverrideDayModalOpen] =
    useState(false);

  let availOverrideDays: AvailOverrideDayPartial[] = [];
  if (
    !availOverrideDaysLoading &&
    !availOverrideDaysError &&
    availOverrideDaysData
  ) {
    availOverrideDays = availOverrideDaysData.getAvailOverrideDays;
  }

  return (
    <div className="flex flex-col">
      <div className="w-5/6 mx-auto">
        <Text h3 b>
          Add exceptions
        </Text>
      </div>
      <div className="h-4" />
      {/* <div className="flex flex-col">
        {availOverrideDays.map((overrideDay, idx) => {
          return (
            <React.Fragment key={idx}>
              <div className="w-full h-px bg-inactive" />
              <SetAvailOverrideDaySection
                overrideDay={overrideDay}
                onChange={() => {}}
                onDelete={() => {}}
              />
            </React.Fragment>
          );
        })}
        <div className="w-full h-px bg-inactive" />
      </div> */}
      <Button
        variant="inverted"
        size="small"
        onClick={() => {
          setEditAvailOverrideDayModalOpen(true);
        }}
      >
        add exception
      </Button>
      <Modal
        isOpen={editAvailOverrideDayModalOpen}
        onClose={() => {
          setEditAvailOverrideDayModalOpen(false);
        }}
      >
        <EditAvailOverrideDayModalContents
          profileId={profileId}
          onClose={() => {
            setEditAvailOverrideDayModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};
