import classNames from "classnames";
import React, { useMemo, useState } from "react";
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
  overrides: Timeslot[];
};

const today = new Date();
const initMonth = today.getMonth();
const initYear = today.getFullYear();

interface CalendarProps {
  onSelect: (date: Date | null) => void;
  availabilities: Availabilities;
  selectedDay: Date | null;
  selectAnyDay?: boolean;
}
const Calendar = ({
  onSelect = () => {},
  selectedDay,
  availabilities,
  selectAnyDay = false,
}: CalendarProps) => {
  const [monthyear, setMonthyear] = useState<[number, number]>([
    initMonth,
    initYear,
  ]);
  const [days, setDays] = useState<Date[]>(
    getDaysInThisMonth(initMonth, initYear)
  );

  if (!days) return <></>;

  // isOverrided: Map from [idx in date array] => [if date has an override]
  let isOverrided = useMemo(() => {
    const ret: { [key: number]: boolean } = {};
    if (!days || days.length == 0) return ret;
    for (let timeslot of availabilities.overrides) {
      const idx = dateDiffInDays(days[0], timeslot.start);
      ret[idx] = true;
    }
    console.log(ret);
    return ret;
  }, [days, availabilities]);

  return (
    <div className="w-96">
      <div className="flex justify-between w-full">
        <Text b className="text-secondary pl-1.5">
          {monthNames[monthyear[0]]} {monthyear[1]}
        </Text>
        <div className="flex">
          <Arrow
            direction="left"
            className="h-6 w-6 p-1 cursor-pointer"
            onClick={() => {
              setMonthyear(([prevMonth, prevYear]) => {
                let newMonthYear: [number, number];
                if (prevMonth === 0) {
                  newMonthYear = [11, prevYear - 1];
                } else {
                  newMonthYear = [prevMonth - 1, prevYear];
                }
                setDays(getDaysInThisMonth(...newMonthYear));
                return newMonthYear;
              });
            }}
          />
          <div className="w-2" />
          <Arrow
            direction="right"
            className="h-6 w-6 p-1 cursor-pointer"
            onClick={() => {
              setMonthyear(([prevMonth, prevYear]) => {
                let newMonthYear: [number, number];
                if (prevMonth === 11) {
                  newMonthYear = [0, prevYear + 1];
                } else {
                  newMonthYear = [prevMonth + 1, prevYear];
                }
                setDays(getDaysInThisMonth(...newMonthYear));
                return newMonthYear;
              });
            }}
          />
          <div className="w-1" />
        </div>
      </div>
      <div className="h-4"></div>
      <div className="grid grid-cols-7 gap-y-3 w-full">
        <React.Fragment>
          {weekdayNamesAbbreviated.map((dayOfWeek, i) => (
            <div className="text-center select-none font-bold" key={i}>
              {dayOfWeek.toUpperCase()}
            </div>
          ))}
        </React.Fragment>
        {days.map((day, i) => {
          // Determine if theres availabilities on this day.
          const inMonth = monthyear[0] === day.getMonth();
          const selected =
            selectedDay && selectedDay.getTime() === day.getTime();
          const hasTimeslots =
            availabilities.weekly[i % 7].length > 0 || isOverrided[i];
          const selectable = inMonth && (selectAnyDay || hasTimeslots);

          const backgroundStyles = classNames({
            "h-11 w-11 mx-auto flex justify-center items-center cursor-pointer select-none rounded-full \
            transition-background duration-100":
              true,
            "pointer-events-none": !selectable,
            "bg-inactive": hasTimeslots,
            "hover:bg-secondary": !selected,
            "text-white bg-black": selected,
            "opacity-0 pointer-events-none": !inMonth,
          });

          return (
            <button
              disabled={!selectable}
              key={i}
              className={backgroundStyles}
              onClick={() => {
                onSelect(day);
              }}
            >
              <Text b2>{day.getDate()}</Text>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
