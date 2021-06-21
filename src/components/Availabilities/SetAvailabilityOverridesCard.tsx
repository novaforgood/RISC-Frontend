import {
  addDays,
  addMinutes,
  format,
  getDay,
  isEqual,
  startOfDay,
} from "date-fns";
import React, { Fragment, useState } from "react";
import {
  DateInterval,
  GetAvailOverrideDatesQuery,
  refetchGetAvailOverrideDatesQuery,
  useCreateAvailOverrideDateMutation,
  useDeleteAvailOverrideDateMutation,
  useGetAvailOverrideDatesQuery,
  useUpdateAvailOverrideDateMutation,
} from "../../generated/graphql";
import useTimezoneConverters from "../../hooks/useTimezoneConverters";
import { Button, Modal, Text } from "../atomic";
import Calendar from "../Calendar";
import { DeleteIcon } from "../FormSchemaEditor/icons";
import { SetDateInterval } from "./SetDateInterval";

type AvailOverrideDayPartial =
  GetAvailOverrideDatesQuery["getAvailOverrideDates"][number];

type EditAvailOverrideDayModalContentsProps = {
  initOverrideDate?: AvailOverrideDayPartial | null;
  profileId: string;
  onClose: () => void;
};
const EditAvailOverrideDayModalContents = ({
  initOverrideDate = null,
  profileId,
  onClose = () => {},
}: EditAvailOverrideDayModalContentsProps) => {
  const { fromUTC, toUTC } = useTimezoneConverters();
  const [overrideDate, setOverrideDay] =
    useState<AvailOverrideDayPartial | null>(initOverrideDate);
  const [timeslots, setTimeslots] = useState(
    overrideDate?.availOverrideTimeslots.map((t) => {
      return {
        startTime: fromUTC!(new Date(t.startTime)),
        endTime: fromUTC!(new Date(t.endTime)),
      };
    }) || []
  );

  const [updateAvailOverrideDateMutation] = useUpdateAvailOverrideDateMutation({
    refetchQueries: [refetchGetAvailOverrideDatesQuery({ profileId })],
  });
  const [createAvailOverrideDateMutation] = useCreateAvailOverrideDateMutation({
    refetchQueries: [refetchGetAvailOverrideDatesQuery({ profileId })],
  });

  const createOrUpdateOverrideDay = async () => {
    if (!overrideDate) {
      throw new Error("Error: overrideDate is null.");
    }
    if (!toUTC) {
      throw new Error("Error: toUTC is undefined.");
    }
    if (overrideDate.availOverrideDateId === "__I_AM_A_NEW_OVERRIDE_DATE__") {
      console.log("Create");
      // Create
      return createAvailOverrideDateMutation({
        variables: {
          data: {
            startTime: overrideDate.startTime,
            endTime: overrideDate.endTime,
            availOverrideTimeslots: timeslots,
            profileId: profileId,
          },
        },
      });
    } else {
      // Update
      return updateAvailOverrideDateMutation({
        variables: {
          availOverrideDateId: overrideDate.availOverrideDateId,
          data: {
            startTime: overrideDate.startTime,
            endTime: overrideDate.endTime,
            availOverrideTimeslots: timeslots,
          },
        },
      });
    }
  };

  const addTimeslot = () => {
    if (!overrideDate) {
      console.error("Must select timeslot first");
      return;
    }
    // If there are no availabilities for the day, add one starting at 12:00 AM
    const dateStart = startOfDay(new Date(overrideDate.startTime));
    let newAvailability: DateInterval | null = {
      startTime: dateStart,
      endTime: addMinutes(dateStart, 30),
    };
    const len = timeslots.length;
    if (len > 0) {
      if (timeslots[len - 1].endTime < addDays(dateStart, 1)) {
        // If the last availability of the day ends before midnight, add another availability at the end
        const newStartTime = timeslots[len - 1].endTime;
        newAvailability = {
          startTime: newStartTime,
          endTime: addMinutes(newStartTime, 30),
        };
      } else if (!isEqual(timeslots[0].startTime, dateStart)) {
        // If the first availability of the day starts after midnight, add another availability at the start
        newAvailability = {
          startTime: dateStart,
          endTime: addMinutes(dateStart, 30),
        };
      } else {
        // Otherwise, find the first open slot to add availabilities
        // If none found, the entire day is already available and do nothing
        newAvailability = null;
        for (let i = 0; i < len - 1; ++i) {
          if (!isEqual(timeslots[i].endTime, timeslots[i + 1].startTime)) {
            newAvailability = {
              startTime: timeslots[i].endTime,
              endTime: addMinutes(timeslots[i].endTime, 30),
            };
          }
        }
      }
    }
    if (!newAvailability) {
      // Entire day is already available
      console.error("Entire date is available already");
      return;
    }
    if (!toUTC) {
      console.log("Error: toUTC is undefined");
      return;
    }

    const newTimeslots = timeslots
      .concat({
        startTime: toUTC(newAvailability.startTime),
        endTime: toUTC(newAvailability.endTime),
      })
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    console.log(newTimeslots);
    setTimeslots(newTimeslots);
  };

  const editTimeslot = (timeslotIndex: number, newTimeslot: DateInterval) => {
    setTimeslots((prev) => {
      return [
        ...prev.slice(0, timeslotIndex),
        ...prev.slice(timeslotIndex + 1),
        {
          startTime: toUTC!(newTimeslot.startTime),
          endTime: toUTC!(newTimeslot.endTime),
        },
      ].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    });
  };

  const deleteTimeslot = (timeslotIndex: number) => {
    setTimeslots((prev) => {
      return [
        ...prev.slice(0, timeslotIndex),
        ...prev.slice(timeslotIndex + 1),
      ];
    });
  };

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
                // Create new date
                prev = {
                  availOverrideDateId: "__I_AM_A_NEW_OVERRIDE_DATE__", // TemporaryID, will be overwritten by backend
                  ...newDay,
                  profileId: profileId,
                  availOverrideTimeslots: [],
                };
              }
              return prev;
            });
        }}
        selectedDay={overrideDate ? new Date(overrideDate.startTime) : null}
      />
      <div className="h-8"></div>
      {overrideDate ? (
        <div>
          <div>
            <Text>
              Selected date: {format(overrideDate.startTime, "MMMM d, yyyy")}
            </Text>
            {timeslots.map((timeslot, timeslotIndex) => {
              const date = startOfDay(overrideDate?.startTime);
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
                    editTimeslot(timeslotIndex, newInterval);
                  }}
                  onDeleteInterval={() => {
                    deleteTimeslot(timeslotIndex);
                  }}
                />
              );
            })}
            <Button
              size="small"
              variant="inverted"
              onClick={() => {
                addTimeslot();
              }}
            >
              add time
            </Button>
          </div>
        </div>
      ) : (
        <div>Select a date</div>
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
        <Button
          size="small"
          onClick={() => {
            createOrUpdateOverrideDay()
              .then(() => {
                onClose();
              })
              .catch((err) => {
                console.error(err);
                alert(err);
              });
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

type AvailOverrideDateSectionProps = {
  overrideDate: AvailOverrideDayPartial;
};
const AvailOverrideDateSection = ({
  overrideDate,
}: AvailOverrideDateSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteAvailOverrideDateMutation] = useDeleteAvailOverrideDateMutation({
    refetchQueries: [
      refetchGetAvailOverrideDatesQuery({ profileId: overrideDate.profileId }),
    ],
  });

  return (
    <Fragment>
      <div className="flex">
        <button
          onClick={() => {
            setModalOpen(true);
          }}
        >
          {overrideDate.profileId}
        </button>
        <button
          className="rounded p-2 hover:bg-tertiary cursor-pointer"
          onClick={() => {
            deleteAvailOverrideDateMutation({
              variables: {
                availOverrideDateId: overrideDate.availOverrideDateId,
              },
            });
          }}
        >
          <DeleteIcon />
        </button>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <EditAvailOverrideDayModalContents
          initOverrideDate={overrideDate}
          profileId={overrideDate.profileId}
          onClose={() => {
            setModalOpen(false);
          }}
        />
      </Modal>
    </Fragment>
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
      <div className="flex flex-col">
        {availOverrideDates.map((overrideDate, idx) => {
          return (
            <React.Fragment key={idx}>
              <div className="w-full h-px bg-inactive" />
              <AvailOverrideDateSection overrideDate={overrideDate} />
            </React.Fragment>
          );
        })}
        <div className="w-full h-px bg-inactive" />
      </div>
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
