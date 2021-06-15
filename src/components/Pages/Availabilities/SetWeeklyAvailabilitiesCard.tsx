import {
  addDays,
  addMinutes,
  eachHourOfInterval,
  endOfDay,
  getDay,
  isWithinInterval,
  startOfDay,
  startOfWeek,
} from "date-fns";
import React, { useState } from "react";
import { DateInterval } from "../../../generated/graphql";
import { Button, Text } from "../../atomic";
import Select from "../../atomic/Select";
import { weekdayNames } from "../../Calendar/data";

type SetDateIntervalProps = {
  date: Date;
  intervalsForDate: DateInterval[];
  interval: DateInterval;
  dateIntervalIndex: number;
  editDateInterval: (
    dateIntervalIndex: number,
    newDateInterval: DateInterval
  ) => void;
  deleteDateInterval: (weekday: number, dateIntervalIndex: number) => void;
};

const SetDateInterval = ({
  date,
  intervalsForDate,
  interval,
  dateIntervalIndex,
  editDateInterval,
  deleteDateInterval,
}: SetDateIntervalProps) => {
  const toTimeString = (date: Date, minuteOffset = 0) =>
    addMinutes(date, minuteOffset).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

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
    let allOptions = eachHalfHourOfDate(date).map((x) => ({
      label: toTimeString(x),
      value: x,
    }));
    allOptions.pop(); // Remove midnight (next day) as a start time
    // Get start times that don't overlap with any other interval
    intervalsForDate.forEach((weeklyInterval) => {
      if (
        interval.startTime.getTime() - weeklyInterval.startTime.getTime() !==
        0
      ) {
        allOptions = allOptions.filter((option) => {
          return (
            !isWithinInterval(option.value, {
              start: weeklyInterval.startTime,
              end: weeklyInterval.endTime,
            }) ||
            option.value.getTime() - weeklyInterval.endTime.getTime() === 0
          );
        });
      }
    });
    return allOptions;
  };

  const getAvailableEndTimes = () => {
    let allOptions = eachHalfHourOfDate(date).map((x) => ({
      label: toTimeString(x, -1),
      value: x,
    }));
    allOptions = allOptions.filter(({ value }) => value > interval.startTime);
    for (let i = 0; i < intervalsForDate.length; i++) {
      if (intervalsForDate[i].startTime > interval.startTime) {
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
          value={interval.startTime}
          onSelect={(selectedValue) => {
            let tmpEndTime = interval.endTime;
            if (
              selectedValue >= interval.endTime ||
              !intervalsForDate.every(
                (weeklyInterval) =>
                  interval.endTime.getTime() -
                    weeklyInterval.endTime.getTime() ===
                    0 ||
                  weeklyInterval.endTime <= selectedValue ||
                  weeklyInterval.startTime >= interval.endTime
              )
            ) {
              tmpEndTime = addMinutes(selectedValue, 30);
            }
            editDateInterval(dateIntervalIndex, {
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
          value={interval.endTime}
          onSelect={(selectedValue) => {
            editDateInterval(dateIntervalIndex, {
              startTime: interval.startTime,
              endTime: selectedValue,
            });
          }}
        />
      </div>
      <div className="flex-1" />
      <button
        onClick={() =>
          deleteDateInterval(getDay(interval.startTime), dateIntervalIndex)
        }
      >
        delete
      </button>
    </div>
  );
};

type SetWeeklyAvailabilitiesCardProps = {
  profileId: string;
};

export const SetWeeklyAvailabilitiesCard = ({}: SetWeeklyAvailabilitiesCardProps) => {
  const [weeklyAvailabilities, setWeeklyAvailabilities] = useState<
    DateInterval[][]
  >([[], [], [], [], [], [], []]);

  const addWeeklyAvailability = (weekday: number) => {
    const date = addDays(startOfWeek(new Date()), weekday);
    // If there are no availabilities for the day, add one starting at 12:00 AM
    let newAvailability: DateInterval | null = {
      startTime: date,
      endTime: addMinutes(date, 30),
    };
    const len = weeklyAvailabilities[weekday].length;
    if (len > 0) {
      if (weeklyAvailabilities[weekday][len - 1].endTime < addDays(date, 1)) {
        // If the last availability of the day ends before midnight, add another availability at the end
        newAvailability = {
          startTime: weeklyAvailabilities[weekday][len - 1].endTime,
          endTime: addMinutes(
            weeklyAvailabilities[weekday][len - 1].endTime,
            30
          ),
        };
      } else if (
        weeklyAvailabilities[weekday][0].startTime.getTime() -
          date.getTime() !==
        0
      ) {
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
            weeklyAvailabilities[weekday][i].endTime.getTime() -
              weeklyAvailabilities[weekday][i + 1].startTime.getTime() !=
            0
          ) {
            newAvailability = {
              startTime: weeklyAvailabilities[weekday][i].endTime,
              endTime: addMinutes(weeklyAvailabilities[weekday][i].endTime, 30),
            };
          }
        }
      }
    }
    if (!newAvailability) {
      // Entire day is already available
      return;
    }
    const newWeeklyAvailabilities = [
      ...weeklyAvailabilities.slice(0, weekday),
      [...weeklyAvailabilities[weekday], newAvailability].sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      ),
      ...weeklyAvailabilities.slice(weekday + 1),
    ];
    setWeeklyAvailabilities(newWeeklyAvailabilities);
  };

  const editWeeklyAvailability = (
    dateIntervalIndex: number,
    newDateInterval: DateInterval
  ) => {
    const weekday = getDay(newDateInterval.startTime);
    const newWeeklyAvailabilities = [
      ...weeklyAvailabilities.slice(0, weekday),
      [
        ...weeklyAvailabilities[weekday].slice(0, dateIntervalIndex),
        newDateInterval,
        ...weeklyAvailabilities[weekday].slice(dateIntervalIndex + 1),
      ].sort((a, b) => a.startTime.getTime() - b.startTime.getTime()),
      ...weeklyAvailabilities.slice(weekday + 1),
    ];
    setWeeklyAvailabilities(newWeeklyAvailabilities);
  };

  const deleteWeeklyAvailability = (
    weekday: number,
    dateIntervalIndex: number
  ) => {
    const newWeeklyAvailabilities = [
      ...weeklyAvailabilities.slice(0, weekday),
      [
        ...weeklyAvailabilities[weekday].slice(0, dateIntervalIndex),
        ...weeklyAvailabilities[weekday].slice(dateIntervalIndex + 1),
      ],
      ...weeklyAvailabilities.slice(weekday + 1),
    ];
    setWeeklyAvailabilities(newWeeklyAvailabilities);
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
        {weeklyAvailabilities.map((weekdayIntervals, weekdayIndex) => (
          <div key={weekdayIndex}>
            <div className="w-full h-px bg-inactive"></div>
            <div className="flex flex-col w-5/6 mx-auto space-y-4 my-4">
              <Text b>{weekdayNames[weekdayIndex].toUpperCase() + "S"}</Text>
              {weekdayIntervals.map((interval, intervalIndex) => (
                <SetDateInterval
                  key={intervalIndex}
                  date={addDays(startOfWeek(new Date()), weekdayIndex)}
                  intervalsForDate={weekdayIntervals}
                  dateIntervalIndex={intervalIndex}
                  interval={interval}
                  editDateInterval={(dateIntervalId, newDateInterval) => {
                    editWeeklyAvailability(dateIntervalId, newDateInterval);
                  }}
                  deleteDateInterval={(weekday, dateIntervalIndex) => {
                    deleteWeeklyAvailability(weekday, dateIntervalIndex);
                  }}
                />
              ))}
              <Button
                size="small"
                variant="inverted"
                onClick={() => addWeeklyAvailability(weekdayIndex)}
              >
                add time
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
