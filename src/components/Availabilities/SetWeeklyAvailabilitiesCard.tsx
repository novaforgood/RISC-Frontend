import {
  addDays,
  addMinutes,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfWeek,
} from "date-fns";
import React from "react";
import {
  DateInterval,
  refetchGetWeeklyAvailabilitiesQuery,
  useGetWeeklyAvailabilitiesQuery,
  useSetWeeklyAvailabilitiesMutation,
} from "../../generated/graphql";
import { Button, Text } from "../atomic";
import Select from "../atomic/Select";
import { weekdayNames } from "../Calendar/data";

type SetDateIntervalProps = {
  date: Date;
  intervalsForDate: DateInterval[];
  selectedInterval: DateInterval;
  onEditInterval: (newDateInterval: DateInterval) => void;
  onDeleteInterval: (weekday: number) => void;
};

const SetDateInterval = ({
  date,
  intervalsForDate,
  selectedInterval,
  onEditInterval,
  onDeleteInterval,
}: SetDateIntervalProps) => {
  const toTimeString = (date: Date, minuteOffset = 0) => {
    return format(addMinutes(date, minuteOffset), "h:mm aaa");
  };

  const eachHalfHourOfDate = (date: Date) =>
    eachHourOfInterval({
      start: startOfDay(date),
      end: addDays(startOfDay(date), 1),
    })
      .concat(
        eachHourOfInterval({
          start: startOfDay(date),
          end: endOfDay(date),
        }).map((x) => addMinutes(x, 30))
      )
      .sort((a, b) => a.getTime() - b.getTime());

  const getAvailableStartTimes = () => {
    // Available start times are all times at least half hour before another interval
    let allOptions = eachHalfHourOfDate(date).map((x) => ({
      label: toTimeString(x),
      value: x,
    }));
    allOptions.pop(); // Remove midnight (next day) as a start time
    // Get start times that don't overlap with any other interval
    intervalsForDate.forEach((weeklyInterval) => {
      if (!isEqual(selectedInterval.startTime, weeklyInterval.startTime)) {
        allOptions = allOptions.filter((option) => {
          return (
            !isWithinInterval(option.value, {
              start: weeklyInterval.startTime,
              end: weeklyInterval.endTime,
            }) || isEqual(option.value, weeklyInterval.endTime)
          );
        });
      }
    });
    return allOptions;
  };

  const getAvailableEndTimes = () => {
    // End time options are from start time until EOD or start of next interval
    let allOptions = eachHalfHourOfDate(date).map((x) => ({
      label: toTimeString(x, -1),
      value: x,
    }));
    allOptions = allOptions.filter(
      ({ value }) => value > selectedInterval.startTime
    );
    for (let i = 0; i < intervalsForDate.length; i++) {
      if (intervalsForDate[i].startTime > selectedInterval.startTime) {
        allOptions = allOptions.filter(
          ({ value }) => value <= intervalsForDate[i].startTime
        );
      }
    }
    return allOptions;
  };

  return (
    <div className="flex space-x-2 items-center">
      <Text>From</Text>
      <div className="w-28">
        <Select
          options={getAvailableStartTimes()}
          value={selectedInterval.startTime}
          onSelect={(selectedValue) => {
            let tmpEndTime = selectedInterval.endTime;
            // If the new interval intersects with another interval,
            // change the end time to not intersect
            if (
              selectedValue >= selectedInterval.endTime ||
              !intervalsForDate.every(
                (weeklyInterval) =>
                  isEqual(selectedInterval.endTime, weeklyInterval.endTime) ||
                  weeklyInterval.endTime <= selectedValue ||
                  weeklyInterval.startTime >= selectedInterval.endTime
              )
            ) {
              tmpEndTime = addMinutes(selectedValue, 30);
            }
            onEditInterval({
              startTime: selectedValue,
              endTime: tmpEndTime,
            });
          }}
        />
      </div>
      <Text>To</Text>
      <div className="w-28">
        <Select
          options={getAvailableEndTimes()}
          value={selectedInterval.endTime}
          onSelect={(selectedValue) => {
            onEditInterval({
              startTime: selectedInterval.startTime,
              endTime: selectedValue,
            });
          }}
        />
      </div>
      <div className="flex-1" />
      <button
        onClick={() => onDeleteInterval(getDay(selectedInterval.startTime))}
      >
        delete
      </button>
    </div>
  );
};

type SetWeeklyAvailabilitiesCardProps = {
  profileId: string;
};

export const SetWeeklyAvailabilitiesCard = ({
  profileId,
}: SetWeeklyAvailabilitiesCardProps) => {
  const { data, loading, error } = useGetWeeklyAvailabilitiesQuery({
    variables: {
      profileId,
    },
  });

  const [setWeeklyAvailabilitiesMutation] = useSetWeeklyAvailabilitiesMutation({
    refetchQueries: [
      refetchGetWeeklyAvailabilitiesQuery({
        profileId,
      }),
    ],
  });

  let weeklyAvailabilities: DateInterval[] = [];

  if (!loading && !error && data) {
    weeklyAvailabilities = data.getWeeklyAvailabilities.map((x) => ({
      startTime: new Date(x.startTime),
      endTime: new Date(x.endTime),
    }));
  }

  const addWeeklyAvailability = (date: Date) => {
    const availabilitiesForDate = weeklyAvailabilities.filter((interval) =>
      isSameDay(interval.startTime, date)
    );
    // If there are no availabilities for the day, add one starting at 12:00 AM
    let newAvailability: DateInterval | null = {
      startTime: date,
      endTime: addMinutes(date, 30),
    };
    const len = availabilitiesForDate.length;
    if (len > 0) {
      if (availabilitiesForDate[len - 1].endTime < addDays(date, 1)) {
        // If the last availability of the day ends before midnight, add another availability at the end
        const newStartTime = availabilitiesForDate[len - 1].endTime;
        newAvailability = {
          startTime: newStartTime,
          endTime: addMinutes(newStartTime, 30),
        };
      } else if (!isEqual(availabilitiesForDate[0].startTime, date)) {
        // If the first availability of the day starts after midnight, add another availability at the start
        newAvailability = {
          startTime: date,
          endTime: addMinutes(date, 30),
        };
      } else {
        // Otherwise, find the first open slot to add availabilities
        // If none found, the entire day is already available and do nothing
        newAvailability = null;
        for (let i = 0; i < len - 1; ++i) {
          if (
            !isEqual(
              availabilitiesForDate[i].endTime,
              availabilitiesForDate[i + 1].startTime
            )
          ) {
            newAvailability = {
              startTime: availabilitiesForDate[i].endTime,
              endTime: addMinutes(availabilitiesForDate[i].endTime, 30),
            };
          }
        }
      }
    }
    if (!newAvailability) {
      // Entire day is already available
      return;
    }
    const newWeeklyAvailabilities = weeklyAvailabilities
      .concat(newAvailability)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    setWeeklyAvailabilitiesMutation({
      variables: {
        profileId: profileId,
        availabilities: newWeeklyAvailabilities,
      },
    });
  };

  const editWeeklyAvailability = (dateIntervalIndex: number) => (
    newDateInterval: DateInterval
  ) => {
    const newWeeklyAvailabilities = [
      ...weeklyAvailabilities.slice(0, dateIntervalIndex),
      ...weeklyAvailabilities.slice(dateIntervalIndex + 1),
      newDateInterval,
    ].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    setWeeklyAvailabilitiesMutation({
      variables: {
        profileId: profileId,
        availabilities: newWeeklyAvailabilities,
      },
    });
  };

  const deleteWeeklyAvailability = (dateIntervalIndex: number) => () => {
    const newWeeklyAvailabilities = [
      ...weeklyAvailabilities.slice(0, dateIntervalIndex),
      ...weeklyAvailabilities.slice(dateIntervalIndex + 1),
    ];
    setWeeklyAvailabilitiesMutation({
      variables: {
        profileId: profileId,
        availabilities: newWeeklyAvailabilities,
      },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="w-5/6 mx-auto">
        <Text h3 b>
          Set Weekly Availabilities
        </Text>
      </div>
      <div className="h-4" />
      <div className="flex flex-col">
        {eachDayOfInterval({
          start: startOfWeek(new Date()),
          end: endOfWeek(new Date()),
        }).map((date) => {
          const intervalsForDate = weeklyAvailabilities.filter((interval) =>
            isSameDay(interval.startTime, date)
          );
          return (
            <div key={date.toDateString()}>
              <div className="w-full h-px bg-inactive"></div>
              <div className="flex flex-col w-5/6 mx-auto space-y-4 my-4">
                <Text b>{weekdayNames[getDay(date)].toUpperCase() + "S"}</Text>
                {weeklyAvailabilities.map((interval, intervalIndex) => {
                  if (getDay(interval.startTime) !== getDay(date)) {
                    return (
                      <React.Fragment key={intervalIndex}></React.Fragment>
                    );
                  }
                  return (
                    <SetDateInterval
                      key={intervalIndex}
                      date={startOfDay(interval.startTime)}
                      intervalsForDate={intervalsForDate}
                      selectedInterval={interval}
                      onEditInterval={editWeeklyAvailability(intervalIndex)}
                      onDeleteInterval={deleteWeeklyAvailability(intervalIndex)}
                    />
                  );
                })}
                <Button
                  size="small"
                  variant="inverted"
                  onClick={() => addWeeklyAvailability(date)}
                >
                  add time
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
