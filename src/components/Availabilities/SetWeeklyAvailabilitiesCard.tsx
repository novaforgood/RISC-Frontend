import {
  addDays,
  addMinutes,
  eachDayOfInterval,
  endOfWeek,
  getDay,
  isEqual,
  isSameDay,
  startOfDay,
  startOfWeek,
} from "date-fns";
import React, { useEffect, useState } from "react";
import {
  DateInterval,
  refetchGetAvailWeeklysQuery,
  useGetAvailWeeklysQuery,
  useSetAvailWeeklysMutation,
} from "../../generated/graphql";
import useTimezoneConverters from "../../hooks/useTimezoneConverters";
import { Button, Text } from "../atomic";
import { weekdayNames } from "../Calendar/data";
import { SetDateInterval } from "./SetDateInterval";

type SetWeeklyAvailabilitiesCardProps = {
  profileId: string;
};

export const SetWeeklyAvailabilitiesCard = ({
  profileId,
}: SetWeeklyAvailabilitiesCardProps) => {
  const { data, loading, error } = useGetAvailWeeklysQuery({
    variables: {
      profileId,
    },
  });
  const { toUTC, fromUTC } = useTimezoneConverters();

  const [weeklyAvailabilities, setWeeklyAvailabilities] = useState<
    DateInterval[]
  >([]);
  const [modified, setModified] = useState(false);

  const [setWeeklyAvailabilitiesMutation] = useSetAvailWeeklysMutation({
    refetchQueries: [refetchGetAvailWeeklysQuery({ profileId })],
  });
  const [allDayAvailableError, setAllDayAvailableError] = useState(-1); // Index of error

  useEffect(() => {
    if (!loading && !error && data && fromUTC) {
      setWeeklyAvailabilities(
        data.getAvailWeeklys.map((x) => ({
          startTime: fromUTC(new Date(x.startTime)),
          endTime: fromUTC(new Date(x.endTime)),
        }))
      );
    }
  }, [loading]);

  const addWeeklyAvailability = (date: Date) => {
    const availabilitiesForDate = weeklyAvailabilities.filter((interval) =>
      isSameDay(interval.startTime, date)
    );
    // If there are no availabilities for the day, add one starting at 8:00 AM
    let newAvailability: DateInterval | null = {
      startTime: addMinutes(date, 60 * 8),
      endTime: addMinutes(date, 60 * 8 + 30),
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
      setAllDayAvailableError(getDay(date));
      return;
    }
    if (!toUTC) {
      console.log("Error: toUTC is not defined.");
      return;
    }

    const newWeeklyAvailabilities = weeklyAvailabilities
      .concat({
        startTime: toUTC(newAvailability.startTime),
        endTime: toUTC(newAvailability.endTime),
      })
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    setWeeklyAvailabilities(newWeeklyAvailabilities);
    setModified(true);
  };

  const editWeeklyAvailability =
    (dateIntervalIndex: number) => (newDateInterval: DateInterval) => {
      if (!toUTC) {
        console.log("Error: toUTC is not defined.");
        return;
      }
      const newWeeklyAvailabilities = [
        ...weeklyAvailabilities.slice(0, dateIntervalIndex),
        ...weeklyAvailabilities.slice(dateIntervalIndex + 1),
        {
          startTime: toUTC(newDateInterval.startTime),
          endTime: toUTC(newDateInterval.endTime),
        },
      ].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      setWeeklyAvailabilities(newWeeklyAvailabilities);
      setModified(true);
      setAllDayAvailableError(-1);
    };

  const deleteWeeklyAvailability = (dateIntervalIndex: number) => () => {
    const newWeeklyAvailabilities = [
      ...weeklyAvailabilities.slice(0, dateIntervalIndex),
      ...weeklyAvailabilities.slice(dateIntervalIndex + 1),
    ];
    setWeeklyAvailabilities(newWeeklyAvailabilities);
    setModified(true);
    setAllDayAvailableError(-1);
  };

  const saveWeeklyAvailabilities = () => {
    setWeeklyAvailabilitiesMutation({
      variables: {
        profileId: profileId,
        availabilities: weeklyAvailabilities,
      },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="w-5/6 mx-auto flex justify-between">
        <Text h3 b>
          Set Weekly Availabilities
        </Text>
        <Button
          disabled={!modified}
          size="small"
          onClick={() => {
            saveWeeklyAvailabilities();
            setModified(false);
          }}
        >
          Save
        </Button>
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
              <div className="h-4" />
              <div className="flex flex-col w-5/6 mx-auto space-y-4">
                <Text b>{weekdayNames[getDay(date)].toUpperCase() + "S"}</Text>
                {weeklyAvailabilities.map((interval, intervalIndex) => {
                  if (getDay(interval.startTime) !== getDay(date)) {
                    return <React.Fragment key={intervalIndex} />;
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
                {allDayAvailableError === getDay(date) && (
                  <Text className="text-error">
                    The entire day is already available.
                  </Text>
                )}
              </div>
              <div className="h-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
