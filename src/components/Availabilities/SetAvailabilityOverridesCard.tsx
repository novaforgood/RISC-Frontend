import {
  addDays,
  addMinutes,
  format,
  getDay,
  isEqual,
  setDate,
  setMonth,
  setYear,
  startOfDay,
} from "date-fns";
import React, { Fragment, useState } from "react";
import {
  DateInterval,
  refetchGetAvailOverrideDatesQuery,
  useCreateAvailOverrideDateMutation,
  useDeleteAvailOverrideDateMutation,
  useGetAvailOverrideDatesQuery,
  useGetAvailWeeklysQuery,
  useUpdateAvailOverrideDateMutation,
} from "../../generated/graphql";
import useTimezoneConverters from "../../hooks/useTimezoneConverters";
import { Button, Modal, Text } from "../atomic";
import Calendar from "../Calendar";
import { DeleteIcon } from "../FormSchemaEditor/icons";
import { SetDateInterval } from "./SetDateInterval";

type AvailOverrideDate = {
  profileId: string;
  startTime: Date;
  endTime: Date;
  availOverrideDateId: string;
  availOverrideTimeslots: {
    startTime: Date;
    endTime: Date;
  }[];
};

type EditAvailOverrideDayModalContentsProps = {
  initOverrideDate?: any | null;
  profileId: string;
  availWeeklys: DateInterval[];
  onClose: () => void;
  onSave: () => void;
};
const EditAvailOverrideDayModalContents = ({
  initOverrideDate = null,
  profileId,
  availWeeklys,
  onClose,
  onSave,
}: EditAvailOverrideDayModalContentsProps) => {
  const { toUTC } = useTimezoneConverters();
  const [overrideDate, setOverrideDay] = useState<AvailOverrideDate | null>(
    initOverrideDate
  );
  const [timeslots, setTimeslots] = useState(
    overrideDate?.availOverrideTimeslots || []
  );
  const [modified, setModified] = useState(false);

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

    const newTimeslots = timeslots.map((timeslot) => ({
      startTime: toUTC(timeslot.startTime),
      endTime: toUTC(timeslot.endTime),
    }));
    if (overrideDate.availOverrideDateId === "__I_AM_A_NEW_OVERRIDE_DATE__") {
      // Create
      return createAvailOverrideDateMutation({
        variables: {
          data: {
            startTime: toUTC(overrideDate.startTime).getTime(),
            endTime: toUTC(overrideDate.endTime).getTime(),
            availOverrideTimeslots: newTimeslots,
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
            startTime: toUTC(overrideDate.startTime).getTime(),
            endTime: toUTC(overrideDate.endTime).getTime(),
            availOverrideTimeslots: newTimeslots,
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
    setModified(true);
    setTimeslots(newTimeslots);
  };

  const editTimeslot = (timeslotIndex: number, newTimeslot: DateInterval) => {
    setModified(true);
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
    setModified(true);
    setTimeslots((prev) => {
      return [
        ...prev.slice(0, timeslotIndex),
        ...prev.slice(timeslotIndex + 1),
      ];
    });
  };

  return (
    <div className="md:p-8 overflow-x-scroll">
      <div>
        <Text h3 b>
          Set the date to override
        </Text>
      </div>
      <div className="h-8" />
      <Calendar
        selectAnyDate
        onSelect={(newSelectedDate) => {
          if (newSelectedDate) {
            const weekday = newSelectedDate.getDay();

            setOverrideDay((prev) => {
              const newDay = {
                startTime: newSelectedDate,
                endTime: addDays(newSelectedDate, 1),
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
            setModified(false);
            setTimeslots(
              availWeeklys
                .filter((avail) => avail.startTime.getDay() === weekday)
                .map((slot) => {
                  const year = newSelectedDate.getFullYear();
                  const month = newSelectedDate.getMonth();
                  const date = newSelectedDate.getDate();
                  return {
                    startTime: setDate(
                      setMonth(setYear(slot.startTime, year), month),
                      date
                    ),
                    endTime: setDate(
                      setMonth(setYear(slot.endTime, year), month),
                      date
                    ),
                  };
                })
            );
          }
        }}
        modified={modified}
        selectedDate={overrideDate ? new Date(overrideDate.startTime) : null}
      />
      <div className="h-8" />
      {overrideDate ? (
        <div>
          <div>
            <Text>
              Selected date:{" "}
              <Text b>
                {format(overrideDate.startTime, "EEEE, MMMM d, yyyy")}
              </Text>
              <br />
              <br />
              <Text b i>
                What times are you free on this day?
              </Text>
            </Text>
            <br />

            <div className="h-2" />
            {timeslots.map((timeslot, timeslotIndex) => {
              const date = startOfDay(overrideDate?.startTime);
              if (getDay(timeslot.startTime) !== getDay(date)) {
                return <React.Fragment key={timeslotIndex}></React.Fragment>;
              }
              return (
                <div className="py-2">
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
                </div>
              );
            })}

            {timeslots.length === 0 && (
              <Fragment>
                <div className="p-2 bg-tertiary rounded-sm">
                  <Text i className="text-secondary">
                    Leave empty to mark yourself unavailable.
                  </Text>
                </div>

                <div className="h-2" />
              </Fragment>
            )}

            <div className="h-2" />
            <div>
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
        </div>
      ) : (
        <div className="w-96">
          <Text>
            Select a date to override. <br />
            Weekly availability on that day will be overridden.
          </Text>
        </div>
      )}
      <div className="h-8" />

      <div className="flex">
        <Button
          size="small"
          variant="inverted"
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
        <div className="w-2" />
        <Button
          disabled={overrideDate === null}
          size="small"
          onClick={() => {
            createOrUpdateOverrideDay()
              .then(() => {
                onClose();
                onSave();
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
  onSave: () => void;
  overrideDate: AvailOverrideDate;
  availWeeklys: DateInterval[];
};
const AvailOverrideDateSection = ({
  onSave,
  overrideDate,
  availWeeklys,
}: AvailOverrideDateSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteAvailOverrideDateMutation] = useDeleteAvailOverrideDateMutation({
    refetchQueries: [
      refetchGetAvailOverrideDatesQuery({ profileId: overrideDate.profileId }),
    ],
  });

  return (
    <Fragment>
      <div className="h-4" />
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
      {overrideDate.availOverrideTimeslots.map((timeslot) => {
        return (
          <div className="px-12 py-1">
            {format(new Date(timeslot.startTime), "h:mm aaa")} -{" "}
            {format(new Date(timeslot.endTime), "h:mm aaa")}
          </div>
        );
      })}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <EditAvailOverrideDayModalContents
          initOverrideDate={overrideDate}
          profileId={overrideDate.profileId}
          availWeeklys={availWeeklys}
          onSave={onSave}
          onClose={() => {
            setModalOpen(false);
          }}
        />
      </Modal>
      <div className="h-4" />
    </Fragment>
  );
};

type SetAvailabilityOverridesCardProps = {
  onSave: () => void;
  profileId: string;
};
export const SetAvailabilityOverridesCard = ({
  onSave,
  profileId,
}: SetAvailabilityOverridesCardProps) => {
  const {
    data: availOverrideDatesData,
    loading: availOverrideDatesLoading,
    error: availOverrideDatesError,
  } = useGetAvailOverrideDatesQuery({
    variables: { profileId },
  });

  const {
    data: availWeeklysData,
    loading: availWeeklysLoading,
    error: availWeeklysError,
  } = useGetAvailWeeklysQuery({
    variables: {
      profileId,
    },
  });

  const [editAvailOverrideDayModalOpen, setEditAvailOverrideDayModalOpen] =
    useState(false);
  const { fromUTC } = useTimezoneConverters();
  if (!fromUTC) return <Fragment />;

  let availOverrideDates: AvailOverrideDate[] = [];
  let availWeeklys: DateInterval[] = [];
  if (
    !availOverrideDatesLoading &&
    !availOverrideDatesError &&
    availOverrideDatesData
  ) {
    availOverrideDates = availOverrideDatesData.getAvailOverrideDates
      .map((date) => {
        return {
          ...date,
          startTime: fromUTC(new Date(date.startTime)),
          endTime: fromUTC(new Date(date.endTime)),
          availOverrideTimeslots: date.availOverrideTimeslots.map(
            (timeslot) => ({
              startTime: fromUTC(new Date(timeslot.startTime)),
              endTime: fromUTC(new Date(timeslot.endTime)),
            })
          ),
        };
      })
      .sort((a, b) => {
        return a.startTime.getTime() - b.startTime.getTime();
      });
  }

  if (!availWeeklysLoading && !availWeeklysError && availWeeklysData) {
    availWeeklys = availWeeklysData.getAvailWeeklys.map((avail) => {
      return {
        startTime: fromUTC(new Date(avail.startTime)),
        endTime: fromUTC(new Date(avail.endTime)),
      };
    });
  }

  return (
    <div className="flex flex-col">
      <div className="w-5/6 mx-auto">
        <Text h3 b>
          Add date overrides
        </Text>
      </div>
      <div className="h-2" />
      <div className="w-5/6 mx-auto">
        <Text className="text-secondary">
          Adjust your availability manually for certain dates.
        </Text>
      </div>
      <div className="h-4" />
      <div className="flex flex-col">
        {availOverrideDates.map((overrideDate, idx) => {
          return (
            <React.Fragment key={idx}>
              <div className="w-full h-px bg-inactive" />
              <AvailOverrideDateSection
                onSave={onSave}
                overrideDate={overrideDate}
                availWeeklys={availWeeklys}
              />
            </React.Fragment>
          );
        })}
        <div className="w-full h-px bg-inactive" />
      </div>
      <div className="h-4" />
      <div className="flex px-12">
        <Button
          variant="inverted"
          size="small"
          onClick={() => {
            setEditAvailOverrideDayModalOpen(true);
          }}
        >
          Add date override
        </Button>
      </div>
      <Modal
        isOpen={editAvailOverrideDayModalOpen}
        onClose={() => {
          setEditAvailOverrideDayModalOpen(false);
        }}
      >
        <EditAvailOverrideDayModalContents
          profileId={profileId}
          availWeeklys={availWeeklys}
          onSave={onSave}
          onClose={() => {
            setEditAvailOverrideDayModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};
