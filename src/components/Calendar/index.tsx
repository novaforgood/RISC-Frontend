import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { Text } from "../../components/atomic";
import { monthNames, weekdayNamesAbbreviated } from "./data";
import { Arrow } from "./icons";
import { dateDiffInDays, getDaysInThisMonth } from "./utils";

// Types

type Timeslot = {
  start: Date;
  end: Date;
};

type Availabilities = {
  weekly: Timeslot[][];
  overrides: {
    date: Date;
    timeslots: Timeslot[];
  }[];
};

const today = new Date();
const initMonth = today.getMonth();
const initYear = today.getFullYear();

interface CalendarProps {
  onSelect: (date: Date | null) => void;
  availabilities: Availabilities;
  selectedDay: Date | null;
}
const Calendar = ({
  onSelect = () => {},
  selectedDay,
  availabilities,
}: CalendarProps) => {
  const [month, setMonth] = useState(initMonth);
  const [year, setYear] = useState(initYear);
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    setDays(getDaysInThisMonth(month, year));
    return () => {};
  }, [month, year]);

  if (!days) return <></>;

  // isOverrided: Map from [idx in date array] => [if date has an override]
  let isOverrided = useMemo(() => {
    const ret: { [key: number]: boolean } = {};
    if (!days || days.length == 0) return ret;
    for (let d of availabilities.overrides) {
      const idx = dateDiffInDays(days[0], d.date);
      if (!d.timeslots || d.timeslots.length === 0) {
        ret[idx] = false;
      } else {
        ret[idx] = true;
      }
    }
    return ret;
  }, [days, availabilities]);

  return (
    <div className="w-96">
      <div className="flex justify-between w-full">
        <Text b className="text-secondary pl-1.5">
          {monthNames[month]} {year}
        </Text>
        <div className="flex">
          <Arrow
            direction="left"
            className="h-6 w-6 p-1 cursor-pointer"
            onClick={() => {
              if (month === 0) {
                setMonth(11);
                setYear((prevYear) => prevYear - 1);
              } else {
                setMonth((prevMonth) => prevMonth - 1);
              }
            }}
          />
          <div className="w-2" />
          <Arrow
            direction="right"
            className="h-6 w-6 p-1 cursor-pointer"
            onClick={() => {
              if (month === 11) {
                setMonth(0);
                setYear((prevYear) => prevYear + 1);
              } else {
                setMonth((prevMonth) => prevMonth + 1);
              }
            }}
          />
          <div className="w-1" />
        </div>
      </div>
      <div className="h-8"></div>
      <div className="grid grid-cols-7 gap-x-1 gap-y-2.5 w-full">
        <React.Fragment>
          {weekdayNamesAbbreviated.map((dayOfWeek, i) => (
            <div className="text-center select-none font-bold" key={i}>
              {dayOfWeek.toUpperCase()}
            </div>
          ))}
        </React.Fragment>
        {days.map((day, i) => {
          // Determine if theres availabilities on this day.
          const inMonth = month === day.getMonth();
          const selected =
            selectedDay && selectedDay.getTime() === day.getTime();
          const hasTimeslots =
            availabilities.weekly[i % 7].length > 0 || isOverrided[i];

          const backgroundStyles = classNames({
            "flex justify-center items-center cursor-pointer select-none rounded-full h-12 w-12":
              true,
            "pointer-events-none": !hasTimeslots,
            "bg-inactive": hasTimeslots,
            "hover:bg-secondary": !selected,
            "text-white bg-black": selected,
            hidden: !inMonth,
          });

          return (
            <div className="w-full flex justify-center">
              <div
                key={i}
                className={backgroundStyles}
                onClick={() => {
                  onSelect(day);
                }}
              >
                <Text b2>{day.getDate()}</Text>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
