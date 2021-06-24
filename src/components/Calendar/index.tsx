import classNames from "classnames";
import { addDays } from "date-fns";
import React, { useMemo, useState } from "react";
import { Text } from "../../components/atomic";
import { DateInterval } from "../../generated/graphql";
import { monthNames, weekdayNamesAbbreviated } from "./data";
import { Arrow } from "./icons";
import { getDatesInThisMonth, padDatesInMonth } from "./utils";

// Types
type Availabilities = {
  weekly: DateInterval[];
  overrideDates: DateInterval[];
  overrideTimeslots: DateInterval[];
};

const today = new Date();
const initMonth = today.getMonth();
const initYear = today.getFullYear();

interface CalendarProps {
  onSelect: (date: Date | null) => void;
  selectedDay: Date | null;
  selectAnyDay?: boolean;
  getSelectableDates?: (month: number, year: number) => Date[];
}
const Calendar = ({
  onSelect = () => {},
  selectedDay,

  selectAnyDay = false,
  getSelectableDates = () => {
    return [];
  },
}: CalendarProps) => {
  const [monthyear, setMonthyear] = useState<[number, number]>([
    initMonth,
    initYear,
  ]);
  const [days, setDays] = useState<Date[]>(
    padDatesInMonth(getDatesInThisMonth(initMonth, initYear))
  );

  if (!days) return <></>;

  const selectableDatesSet = useMemo(() => {
    let val = new Set();
    for (const date of getSelectableDates(...monthyear)) {
      val.add(date.getDate());
    }
    return val;
  }, [monthyear]);

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
                setDays(padDatesInMonth(getDatesInThisMonth(...newMonthYear)));
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
                setDays(padDatesInMonth(getDatesInThisMonth(...newMonthYear)));
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
          const selectable =
            day > addDays(new Date(), -1) &&
            inMonth &&
            (selectAnyDay || selectableDatesSet.has(day.getDate()));

          const backgroundStyles = classNames({
            "h-11 w-11 mx-auto flex justify-center items-center cursor-pointer select-none rounded-full \
            transition-background duration-100":
              true,
            "pointer-events-none": !selectable,
            "bg-inactive": selectable,
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
