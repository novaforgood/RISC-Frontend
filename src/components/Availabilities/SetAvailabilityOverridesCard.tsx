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

type EditAvailOverrideDayModalContentsProps = {
  overrideDate: AvailOverrideDate;
  onUpdateTimeslots: (newAvailOverrideDate: NewAvailOverrideDate) => void;
};

const EditAvailOverrideDayModalContents = ({
  overrideDate,
  onUpdateTimeslots,
}: EditAvailOverrideDayModalContentsProps) => {
  const { toUTC } = useTimezoneConverters();

  const [timeslots, setTimeslots] = useState(
    overrideDate?.availOverrideTimeslots || []
  );

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
    setTimeslots(newTimeslots);
    onUpdateTimeslots({
      ...overrideDate,
      edited: true,
      availOverrideTimeslots: newTimeslots,
    });
  };

  const editTimeslot = (timeslotIndex: number, newTimeslot: DateInterval) => {
    setTimeslots((prev) => {
      const newTimeslots = [
        ...prev.slice(0, timeslotIndex),
        ...prev.slice(timeslotIndex + 1),
        {
          startTime: toUTC!(newTimeslot.startTime),
          endTime: toUTC!(newTimeslot.endTime),
        },
      ].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      onUpdateTimeslots({
        ...overrideDate,
        edited: true,
        availOverrideTimeslots: newTimeslots,
      });
      return newTimeslots;
    });
  };

  const deleteTimeslot = (timeslotIndex: number) => {
    setTimeslots((prev) => {
      const newTimeslots = [
        ...prev.slice(0, timeslotIndex),
        ...prev.slice(timeslotIndex + 1),
      ];
      onUpdateTimeslots({
        ...overrideDate,
        edited: true,
        availOverrideTimeslots: newTimeslots,
      });
      return newTimeslots;
    });
  };

  return (
    <div className="p-8">
      <div>
        <div>
          <Text>
            Selected date:{" "}
            <Text b>
              {format(overrideDate?.startTime, "EEEE, MMMM d, yyyy")}
            </Text>
            <br />
            <br />
            <Text b i>
              What times are you free on this day?
            </Text>
          </Text>
          <br />

          <div className="h-2"></div>
          {timeslots.map((timeslot, timeslotIndex) => {
            const date = startOfDay(overrideDate.startTime);
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

              <div className="h-2"></div>
            </Fragment>
          )}

          <div className="h-2"></div>
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
  );
};

type AvailOverrideDateSectionProps = {
  overrideDate: AvailOverrideDate;
};
const AvailOverrideDateSection = ({
  overrideDate,
}: // availWeeklys,
AvailOverrideDateSectionProps) => {
  // const [modalOpen, setModalOpen] = useState(false);

  const [deleteAvailOverrideDateMutation] = useDeleteAvailOverrideDateMutation({
    refetchQueries: [
      refetchGetAvailOverrideDatesQuery({ profileId: overrideDate.profileId }),
    ],
  });

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
              // setModalOpen(true);
            }}
          >
            <Text u>edit</Text>
          </button>
          <div className="w-2"></div>
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
      {overrideDate.availOverrideTimeslots.map((timeslot, idx) => {
        return (
          <div className="px-12 py-1" key={idx}>
            {format(new Date(timeslot.startTime), "h:mm aaa")} -{" "}
            {format(new Date(timeslot.endTime), "h:mm aaa")}
          </div>
        );
      })}
      {/* <Modal
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
      </Modal> */}
      <div className="h-4"></div>
    </Fragment>
  );
};

type SetAvailabilityOverridesCardProps = {
  profileId: string;
};

type NewAvailOverrideDate = AvailOverrideDate & {
  edited: boolean;
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

  // const {
  //   data: availWeeklysData,
  //   loading: availWeeklysLoading,
  //   error: availWeeklysError,
  // } = useGetAvailWeeklysQuery({
  //   variables: {
  //     profileId,
  //   },
  // });

  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [currentTimeslots, setCurrentTimeslots] = useState<Timeslots>([]);
  const [dayToTimeslots, setDayToTimeSlots] = useState<{
    [key: string]: NewAvailOverrideDate;
  }>({});

  const { fromUTC } = useTimezoneConverters();
  const { toUTC } = useTimezoneConverters();

  if (!fromUTC || !toUTC) return <Fragment />;
  const [updateAvailOverrideDateMutation] = useUpdateAvailOverrideDateMutation({
    refetchQueries: [refetchGetAvailOverrideDatesQuery({ profileId })],
  });
  const [createAvailOverrideDateMutation] = useCreateAvailOverrideDateMutation({
    refetchQueries: [refetchGetAvailOverrideDatesQuery({ profileId })],
  });

  const saveNewOverrides = async () => {
    //Save the override if it's new or needs to be updated
    for (const availOverrideDate of Object.values(dayToTimeslots)) {
      if (availOverrideDate.availOverrideDateId === DEFAULT_AVAIL_ID) {
        await createAvailOverrideDateMutation({
          variables: {
            data: {
              startTime: toUTC(availOverrideDate.startTime).getTime(),
              endTime: toUTC(availOverrideDate.endTime).getTime(),
              availOverrideTimeslots: availOverrideDate.availOverrideTimeslots,
              profileId: profileId,
            },
          },
        });
      } else if (availOverrideDate.edited) {
        await updateAvailOverrideDateMutation({
          variables: {
            availOverrideDateId: availOverrideDate.availOverrideDateId,
            data: {
              startTime: toUTC(availOverrideDate.startTime).getTime(),
              endTime: toUTC(availOverrideDate.endTime).getTime(),
              availOverrideTimeslots: availOverrideDate.availOverrideTimeslots,
            },
          },
        });
      }
    }
  };

  let availOverrideDates: { [key: string]: NewAvailOverrideDate } = {};
  if (
    !availOverrideDatesLoading &&
    !availOverrideDatesError &&
    availOverrideDatesData
  ) {
    // availOverrideDates = availOverrideDatesData.getAvailOverrideDates.map(
    //   (date) => {
    //     return {
    //       ...date,
    //       startTime: fromUTC(new Date(date.startTime)),
    //       endTime: fromUTC(new Date(date.endTime)),
    //       availOverrideTimeslots: date.availOverrideTimeslots.map(
    //         (timeslot) => ({
    //           startTime: fromUTC(new Date(timeslot.startTime)),
    //           endTime: fromUTC(new Date(timeslot.endTime)),
    //         })
    //       ),
    //     };
    //   }
    // );

    for (const overrideDate of availOverrideDatesData.getAvailOverrideDates) {
      availOverrideDates[overrideDate.startTime.toLocaleString()] = {
        ...overrideDate,
        startTime: fromUTC(new Date(overrideDate.startTime)),
        endTime: fromUTC(new Date(overrideDate.endTime)),
        availOverrideTimeslots: overrideDate.availOverrideTimeslots.map(
          (timeslot) => ({
            startTime: fromUTC(new Date(timeslot.startTime)),
            endTime: fromUTC(new Date(timeslot.endTime)),
          })
        ),
        edited: false,
      };
    }
  }

  // if (!availWeeklysLoading && !availWeeklysError && availWeeklysData) {
  //   availWeeklys = availWeeklysData.getAvailWeeklys.map((avail) => {
  //     return {
  //       startTime: fromUTC(new Date(avail.startTime)),
  //       endTime: fromUTC(new Date(avail.endTime)),
  //     };
  //   });
  // }

  // console.log(
  //   Intl.DateTimeFormat.supportedLocalesOf(["ban", "id-u-co-pinyin", "de-ID"])
  // );

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
      <div className="flex flex-col w-5/6 mx-auto items-center">
        <Calendar
          selectAnyDate
          onSelect={(newSelectedDate) => {
            if (newSelectedDate) {
              let newOverrides = dayToTimeslots;
              const existingOverride =
                dayToTimeslots[newSelectedDate.toLocaleString()];
              if (existingOverride) {
                newOverrides[newSelectedDate.toLocaleString()] = {
                  ...existingOverride,
                  availOverrideTimeslots: currentTimeslots,
                };
              } else {
                const newDay = {
                  startTime: newSelectedDate,
                  endTime: addDays(newSelectedDate, 1),
                };
                newOverrides[newSelectedDate.toLocaleString()] = {
                  availOverrideDateId: DEFAULT_AVAIL_ID,
                  ...newDay,
                  profileId,
                  availOverrideTimeslots: currentTimeslots,
                  edited: false,
                };
              }
              setDayToTimeSlots(newOverrides);
              setCurrentDate(newSelectedDate);
            }
          }}
          selectedDate={currentDate || null}
        />
        <div className="h-4" />
        {currentDate && dayToTimeslots[currentDate.toLocaleString()] && (
          <EditAvailOverrideDayModalContents
            overrideDate={dayToTimeslots[currentDate.toLocaleString()]}
            onUpdateTimeslots={(newAvailOverrideDate) => {
              setCurrentTimeslots(newAvailOverrideDate.availOverrideTimeslots);
              let newDayToTimeslots = dayToTimeslots;
              newDayToTimeslots[
                newAvailOverrideDate.startTime.toLocaleString()
              ] = newAvailOverrideDate;
            }}
          />
        )}
      </div>
      <div className="w-96 flex justify-between mx-auto">
        <Button size="small" variant="inverted" onClick={() => {}}>
          Cancel
        </Button>
        <div className="w-2"></div>
        <Button size="small" onClick={saveNewOverrides}>
          Save
        </Button>
      </div>
      <div className="h-4" />
      <div className="w-full h-px bg-inactive" />
      <div className="h-4" />
      <div className="flex flex-col">
        {Object.values(availOverrideDates).map((overrideDate, idx) => {
          console.log(overrideDate);
          return (
            <React.Fragment key={idx}>
              <AvailOverrideDateSection overrideDate={overrideDate} />
              <div className="w-full h-px bg-inactive" />
            </React.Fragment>
          );
        }) || (
          <Text i b className="text-secondary m-auto">
            No overrides added. Select a date to get started.
          </Text>
        )}
      </div>
    </div>
  );
};
