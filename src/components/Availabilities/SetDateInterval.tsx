import {
  addDays,
  addMinutes,
  eachHourOfInterval,
  endOfDay,
  format,
  getDay,
  isEqual,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import React from "react";
import { DateInterval } from "../../generated/graphql";
import { Text } from "../atomic";
import Select from "../atomic/Select";
import { DeleteIcon } from "../FormSchemaEditor/icons";

type SetDateIntervalProps = {
  date: Date;
  intervalsForDate: DateInterval[];
  selectedInterval: DateInterval;
  onEditInterval: (newDateInterval: DateInterval) => void;
  onDeleteInterval: (weekday: number) => void;
};

export const SetDateInterval = ({
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
      label: toTimeString(x),
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
    <div className="flex items-center space-x-2 w-full">
      <Text>From</Text>
      <div>
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
      <button
        className="h-6 w-6 rounded p-1 hover:bg-tertiary cursor-pointer justify-self-end"
        onClick={() => onDeleteInterval(getDay(selectedInterval.startTime))}
      >
        <DeleteIcon className="h-4 m-auto" />
      </button>
    </div>
  );
};
