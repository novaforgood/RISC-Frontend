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

const DEFAULT_AVAIL_ID = "__I_AM_A_NEW_OVERRIDE_DATE__";

type Timeslots = {
  startTime: Date;
  endTime: Date;
}[];

type AvailOverrideDate = {
  profileId: string;
  startTime: Date;
  endTime: Date;
  availOverrideDateId: string;
  availOverrideTimeslots: Timeslots;
};

const EditAvailabilityOverridesModal = ({
  profileId,
  initOverrideDate = null,
  availOverrideDates,
  isOpen = false,
  onClose,
}: {
  profileId: string;
  initOverrideDate?: NewAvailOverrideDate | null;
  availOverrideDates: { [key: string]: NewAvailOverrideDate };
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { toUTC } = useTimezoneConverters();

  const [currentDate, setCurrentDate] = useState<NewAvailOverrideDate | null>(
    initOverrideDate || null
  );
  const [modified, setModified] = useState(false);
  const [dayToTimeslots, setDayToTimeSlots] = useState<{
    [key: string]: NewAvailOverrideDate;
  }>({});

  const [updateAvailOverrideDateMutation] =
    useUpdateAvailOverrideDateMutation();
  const [createAvailOverrideDateMutation] =
    useCreateAvailOverrideDateMutation();
  const [deleteAvailOverrideDateMutation] =
    useDeleteAvailOverrideDateMutation();

  const updateCurrentDay = ({
    edited = true,
    unavailable = false,
    newTimeslots = [],
  }: {
    edited?: boolean;
    unavailable?: boolean;
    newTimeslots?: Timeslots;
  }) => {
    if (!currentDate) {
      console.error("Must select timeslot first");
      return;
    }
    const newOverride = {
      ...currentDate,
      edited,
      unavailable,
      availOverrideTimeslots: newTimeslots,
    };
    setModified(true);
    setCurrentDate(newOverride);
    setDayToTimeSlots({
      ...dayToTimeslots,
      [currentDate.startTime.toLocaleString()]: newOverride,
    });
  };

  const saveNewOverrides = async () => {
    if (!toUTC) {
      throw new Error("Error: toUTC is undefined.");
    }
    let allEdits: Promise<any>[] = [];
    //Save the override if it's new or needs to be updated
    for (const availOverrideDate of Object.values(dayToTimeslots)) {
      if (availOverrideDate.availOverrideDateId === DEFAULT_AVAIL_ID) {
        if (
          availOverrideDate.availOverrideTimeslots.length ||
          availOverrideDate.unavailable
        ) {
          allEdits.push(
            createAvailOverrideDateMutation({
              variables: {
                data: {
                  startTime: toUTC(availOverrideDate.startTime).getTime(),
                  endTime: toUTC(availOverrideDate.endTime).getTime(),
                  availOverrideTimeslots:
                    availOverrideDate.availOverrideTimeslots,
                  profileId: profileId,
                },
              },
            })
          );
        }
      } else if (availOverrideDate.edited) {
        if (
          availOverrideDate.availOverrideTimeslots.length ||
          availOverrideDate.unavailable
        ) {
          allEdits.push(
            updateAvailOverrideDateMutation({
              variables: {
                availOverrideDateId: availOverrideDate.availOverrideDateId,
                data: {
                  startTime: toUTC(availOverrideDate.startTime).getTime(),
                  endTime: toUTC(availOverrideDate.endTime).getTime(),
                  availOverrideTimeslots:
                    availOverrideDate.availOverrideTimeslots,
                },
              },
            })
          );
        } else if (!availOverrideDate.unavailable) {
          allEdits.push(
            deleteAvailOverrideDateMutation({
              variables: {
                availOverrideDateId: availOverrideDate.availOverrideDateId,
              },
            }).catch((err) => console.log(err.message))
          );
        }
      }
      Promise.all(allEdits).then(onClose);
    }
  };

  const addTimeslot = () => {
    if (!currentDate) {
      console.error("Must select timeslot first");
      return;
    }
    const timeslots = currentDate.availOverrideTimeslots;
    // If there are no availabilities for the day, add one starting at 12:00 AM
    const dateStart = startOfDay(new Date(currentDate.startTime));
    let newAvailability: DateInterval | null = {
      startTime: addMinutes(dateStart, 8 * 60),
      endTime: addMinutes(dateStart, 8 * 60 + 30),
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

    updateCurrentDay({
      newTimeslots,
    });
  };

  const editTimeslot = (timeslotIndex: number, newTimeslot: DateInterval) => {
    if (!currentDate) {
      console.error("Must select timeslot first");
      return;
    }
    const timeslots = currentDate.availOverrideTimeslots;
    const newTimeslots = [
      ...timeslots.slice(0, timeslotIndex),
      ...timeslots.slice(timeslotIndex + 1),
      {
        startTime: toUTC!(newTimeslot.startTime),
        endTime: toUTC!(newTimeslot.endTime),
      },
    ].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    updateCurrentDay({ newTimeslots });
  };

  const deleteTimeslot = (timeslotIndex: number) => {
    if (!currentDate) {
      console.error("Must select timeslot first");
      return;
    }
    const timeslots = currentDate.availOverrideTimeslots;
    const newTimeslots = [
      ...timeslots.slice(0, timeslotIndex),
      ...timeslots.slice(timeslotIndex + 1),
    ];

    updateCurrentDay({
      newTimeslots,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-144 mx-auto items-center space-y-4">
        <Text h3 b className="self-start">
          Edit Overrides
        </Text>
        <Calendar
          selectAnyDate
          onSelect={(newSelectedDate) => {
            if (newSelectedDate) {
              let newAvailOverrideDate: NewAvailOverrideDate;

              //If there are already timeslots on this day set those as current timeslots
              const existingOverride =
                dayToTimeslots[newSelectedDate.toLocaleString()] ||
                availOverrideDates[newSelectedDate.toLocaleString()];
              if (existingOverride) {
                newAvailOverrideDate = existingOverride;

                //otherwise create new availOverrideDate object
              } else {
                const newDay = {
                  startTime: newSelectedDate,
                  endTime: addDays(newSelectedDate, 1),
                };
                newAvailOverrideDate = {
                  availOverrideDateId: DEFAULT_AVAIL_ID,
                  ...newDay,
                  profileId,
                  availOverrideTimeslots: [],
                  edited: false,
                  unavailable: false,
                };
              }
              setDayToTimeSlots({
                ...dayToTimeslots,
                [newSelectedDate.toLocaleString()]: newAvailOverrideDate,
              });
              setCurrentDate(newAvailOverrideDate);
            }
          }}
          selectedDate={currentDate?.startTime || null}
        />
        {currentDate && (
          <div className="w-5/6 p-8">
            <div>
              <div>
                <Text>
                  Selected date:{" "}
                  <Text b>
                    {format(currentDate.startTime, "EEEE, MMMM d, yyyy")}
                  </Text>
                  <br />
                  <br />
                  <Text b i>
                    What times are you free on this day?
                  </Text>
                </Text>
                <br />

                <div className="h-2" />
                {currentDate &&
                  currentDate.availOverrideTimeslots.map(
                    (timeslot, timeslotIndex) => {
                      const date = startOfDay(currentDate.startTime);
                      if (getDay(timeslot.startTime) !== getDay(date)) {
                        return (
                          <React.Fragment key={timeslotIndex}></React.Fragment>
                        );
                      }
                      return (
                        <div className="py-2" key={timeslotIndex}>
                          <SetDateInterval
                            key={timeslotIndex}
                            date={startOfDay(timeslot.startTime)}
                            intervalsForDate={
                              currentDate.availOverrideTimeslots
                            }
                            selectedInterval={timeslot}
                            onEditInterval={(newInterval) => {
                              editTimeslot(timeslotIndex, newInterval);
                            }}
                            onDeleteInterval={() => {
                              deleteTimeslot(timeslotIndex);
                            }}
                          />
                        </div>
                      );
                    }
                  )}

                {currentDate &&
                  currentDate.availOverrideTimeslots.length === 0 &&
                  (currentDate.unavailable ? (
                    <Fragment>
                      <div className="p-2 bg-tertiary rounded-sm">
                        <Text i className="text-secondary">
                          You have set today as unavailable.
                        </Text>
                      </div>

                      <div className="h-2"></div>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <div className="p-2 bg-tertiary rounded-sm">
                        <Text i className="text-secondary">
                          Your availabilities will be the same as weekly
                          availability today.
                        </Text>
                      </div>

                      <div className="h-2"></div>
                    </Fragment>
                  ))}

                <div className="h-2" />
                <div className="flex justify-between">
                  <Button
                    size="small"
                    variant="inverted"
                    onClick={() => {
                      if (currentDate.unavailable) {
                        updateCurrentDay({
                          unavailable: false,
                        });
                      } else {
                        updateCurrentDay({
                          unavailable: true,
                          newTimeslots: [],
                        });
                      }
                    }}
                  >
                    {currentDate && currentDate.unavailable
                      ? "Reset to Weekly"
                      : "Set Unavailable"}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      addTimeslot();
                    }}
                  >
                    Add time
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex w-full justify-between">
          <Button size="small" variant="inverted" onClick={onClose}>
            Close
          </Button>
          <div className="w-2"></div>
          <Button
            disabled={!modified}
            size="small"
            onClick={() => {
              setModified(false);
              saveNewOverrides();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

type AvailOverrideDateSectionProps = {
  overrideDate: AvailOverrideDate;
  availOverrideDates: { [key: string]: NewAvailOverrideDate };
  onSuccessfulDelete: () => void;
};
const AvailOverrideDateSection = ({
  overrideDate,
  availOverrideDates,
  onSuccessfulDelete,
}: // availWeeklys,
AvailOverrideDateSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteAvailOverrideDateMutation] =
    useDeleteAvailOverrideDateMutation();

  return (
    <Fragment>
      <div className="h-4"></div>
      <div className="flex items-center justify-between w-full px-12">
        <div>
          <Text b>{format(overrideDate.startTime, "MMMM d, yyyy")}</Text>
        </div>
        <div className="flex">
          <button
            onClick={() => {
              setModalOpen(true);
            }}
          >
            <Text u>edit</Text>
          </button>
          <div className="w-2" />
          <button
            className="h-6 w-6 rounded p-1 hover:bg-tertiary cursor-pointer"
            onClick={() => {
              deleteAvailOverrideDateMutation({
                variables: {
                  availOverrideDateId: overrideDate.availOverrideDateId,
                },
              })
                .catch((e) => {
                  console.log(e.message);
                })
                .then(() => {
                  onSuccessfulDelete();
                });
            }}
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
      {overrideDate.availOverrideTimeslots.length === 0 && (
        <div className="px-12 py-1">
          <Text className="text-secondary">Unavailable</Text>
        </div>
      )}
      {overrideDate.availOverrideTimeslots.map((timeslot, idx) => {
        return (
          <div className="px-12 py-1" key={idx}>
            {format(new Date(timeslot.startTime), "h:mm aaa")} -{" "}
            {format(new Date(timeslot.endTime), "h:mm aaa")}
          </div>
        );
      })}
      <EditAvailabilityOverridesModal
        profileId={overrideDate.profileId}
        availOverrideDates={availOverrideDates}
        isOpen={modalOpen}
        onClose={async () => {
          await onSuccessfulDelete();
          setModalOpen(false);
        }}
      />
      <div className="h-4"></div>
    </Fragment>
  );
};

type SetAvailabilityOverridesCardProps = {
  profileId: string;
};

type NewAvailOverrideDate = AvailOverrideDate & {
  edited: boolean;
  unavailable: boolean;
};

export const SetAvailabilityOverridesCard = ({
  profileId,
}: SetAvailabilityOverridesCardProps) => {
  const {
    data: availOverrideDatesData,
    loading: availOverrideDatesLoading,
    error: availOverrideDatesError,
    refetch: refetchAvailOverrideDates,
  } = useGetAvailOverrideDatesQuery({
    variables: { profileId },
  });
  const [modalOpen, setModalOpen] = useState(false);

  const { fromUTC } = useTimezoneConverters();

  if (!fromUTC) return <Fragment />;

  let availOverrideDates: { [key: string]: NewAvailOverrideDate } = {};

  if (
    !availOverrideDatesLoading &&
    !availOverrideDatesError &&
    availOverrideDatesData
  ) {
    const sorted = [...availOverrideDatesData.getAvailOverrideDates].sort(
      (a, b) => a.startTime - b.startTime
    );
    for (const overrideDate of sorted) {
      const startTime = fromUTC(new Date(overrideDate.startTime));
      let temp = {
        ...overrideDate,
        startTime: startTime,
        endTime: fromUTC(new Date(overrideDate.endTime)),
        availOverrideTimeslots: overrideDate.availOverrideTimeslots.map(
          (timeslot) => ({
            startTime: fromUTC(new Date(timeslot.startTime)),
            endTime: fromUTC(new Date(timeslot.endTime)),
          })
        ),
        edited: false,
        unavailable: overrideDate.availOverrideTimeslots.length === 0,
      };
      availOverrideDates[startTime.toLocaleString()] = temp;
    }
  }

  return (
    <div className="flex flex-col">
      <div className="w-5/6 mx-auto">
        <Text h3 b>
          Add date overrides
        </Text>
        <div className="h-2" />
        <Text className="text-secondary">
          Add dates when your availability changes from your weekly hours.
        </Text>
      </div>
      <div className="h-4" />
      <div className="w-full h-px bg-inactive" />
      <div className="h-4" />
      <div className="flex flex-col">
        {Object.values(availOverrideDates).map((overrideDate, idx) => {
          return (
            <React.Fragment key={idx}>
              <AvailOverrideDateSection
                overrideDate={overrideDate}
                availOverrideDates={availOverrideDates}
                onSuccessfulDelete={() => {
                  refetchAvailOverrideDates();
                }}
              />
              <div className="w-full h-px bg-inactive" />
            </React.Fragment>
          );
        }) || (
          <Text i b className="text-secondary mx-auto">
            No overrides added.
          </Text>
        )}
      </div>
      <div className="h-4" />
      <Button className="mx-auto" onClick={() => setModalOpen(true)}>
        Add Availability
      </Button>
      <EditAvailabilityOverridesModal
        profileId={profileId}
        availOverrideDates={availOverrideDates}
        isOpen={modalOpen}
        onClose={async () => {
          await refetchAvailOverrideDates();
          setModalOpen(false);
        }}
      />
    </div>
  );
};
