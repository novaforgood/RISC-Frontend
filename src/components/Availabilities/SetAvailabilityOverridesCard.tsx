import { addDays, format, getDay, startOfDay } from "date-fns";
import { nanoid } from "nanoid";
import React, { Fragment, useState } from "react";
import {
  GetAvailOverrideDatesQuery,
  GetAvailOverrideTimeslotsQuery,
  refetchGetAvailOverrideDatesQuery,
  useGetAvailOverrideDatesQuery,
  useSetAvailOverrideDatesMutation,
} from "../../generated/graphql";
import useTimezoneConverters from "../../hooks/useTimezoneConverters";
import { Button, Modal, Text } from "../atomic";
import Calendar from "../Calendar";
import { SetDateInterval } from "./SetDateInterval";

type AvailOverrideDayPartial =
  GetAvailOverrideDatesQuery["getAvailOverrideDates"][number];

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
  const { fromUTC, toUTC } = useTimezoneConverters();

  const createAvailOverrideDay = async () => {};

  const editAvailOverrideDay = async () => {};

  if (!fromUTC || !toUTC) return <Fragment />;

  const timeslots =
    overrideDay?.availOverrideTimeslots.map((t) => {
      return {
        startTime: fromUTC(new Date(t.startTime)),
        endTime: fromUTC(new Date(t.endTime)),
      };
    }) || [];

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
          overrideDates: [],
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
                  availOverrideDateId: nanoid(), // TemporaryID, will be overwritten by backend
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
            {timeslots.map((timeslot, timeslotIndex) => {
              const date = startOfDay(overrideDay?.startTime);
              if (getDay(timeslot.startTime) !== getDay(date)) {
                return <React.Fragment key={timeslotIndex}></React.Fragment>;
              }
              return (
                <SetDateInterval
                  key={timeslotIndex}
                  date={startOfDay(timeslot.startTime)}
                  intervalsForDate={timeslots}
                  selectedInterval={timeslot}
                  onEditInterval={(newInterval) => {
                    // if (!toUTC) {
                    //   console.log("Error: toUTC is not defined.");
                    //   return;
                    // }
                    // const newWeeklyAvailabilities = [
                    //   ...weeklyAvailabilities.slice(0, dateIntervalIndex),
                    //   ...weeklyAvailabilities.slice(dateIntervalIndex + 1),
                    //   {
                    //     startTime: toUTC(newDateInterval.startTime),
                    //     endTime: toUTC(newDateInterval.endTime),
                    //   },
                    // ].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
                    // setWeeklyAvailabilitiesMutation({
                    //   variables: {
                    //     profileId: profileId,
                    //     availabilities: newWeeklyAvailabilities,
                    //   },
                    // });
                    // setAllDayAvailableError(-1);
                  }}
                  onDeleteInterval={() => {}}
                />
              );
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
    data: availOverrideDatesData,
    loading: availOverrideDatesLoading,
    error: availOverrideDatesError,
  } = useGetAvailOverrideDatesQuery({
    variables: { profileId },
  });

  const [setAvailOverrideDatesMutation] = useSetAvailOverrideDatesMutation({
    refetchQueries: [refetchGetAvailOverrideDatesQuery({ profileId })],
  });

  const [editAvailOverrideDayModalOpen, setEditAvailOverrideDayModalOpen] =
    useState(false);

  let availOverrideDates: AvailOverrideDayPartial[] = [];
  if (
    !availOverrideDatesLoading &&
    !availOverrideDatesError &&
    availOverrideDatesData
  ) {
    availOverrideDates = availOverrideDatesData.getAvailOverrideDates;
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
        {availOverrideDates.map((overrideDay, idx) => {
          return (
            <React.Fragment key={idx}>
              <div className="w-full h-px bg-inactive" />
              <SetAvailOverrideDatesection
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
