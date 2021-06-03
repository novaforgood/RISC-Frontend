import React, { useEffect, useState } from "react";
import { Text } from "../../components/atomic";

// Types
type TimeInterval = {
  start: number;
  end: number;
};

type Availabilities = {
  weekly: {
    sunday: TimeInterval[];
    monday: TimeInterval[];
    tuesday: TimeInterval[];
    wednesday: TimeInterval[];
    thursday: TimeInterval[];
    friday: TimeInterval[];
    saturday: TimeInterval[];
  };
  overrides: {
    date: Date;
    intervals: TimeInterval[];
  }[];
};

/**
 *
 * @param month
 * @param year
 * @returns List of days in [month] of [year].
 */
function getDaysInThisMonth(month: number, year: number) {
  var date = new Date(year, month, 1);
  var days = [];

  // Add days until previous Sunday
  var tempDate = new Date(date);
  tempDate.setDate(date.getDate() - 1);
  while (tempDate.getDay() != 6) {
    days.unshift(new Date(tempDate));
    tempDate.setDate(tempDate.getDate() - 1);
  }

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  // Add days until Saturday
  while (date.getDay() != 0) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

const today = new Date();
const initMonth = today.getMonth();
const initYear = today.getFullYear();

interface CalendarProps {
  onSelect: (date: Date) => void;
  availabilities: Availabilities;
  selectedDay: Date;
}
const Calendar: React.FC<CalendarProps> = ({
  onSelect = () => {},
  selectedDay,
}) => {
  const [month, setMonth] = useState(initMonth);
  const [year, setYear] = useState(initYear);
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    setDays(getDaysInThisMonth(month, year));
    return () => {};
  }, [month, year]);

  if (!days) return <></>;

  return (
    <div>
      <div className="flex justify-between">
        <div>
          {monthNames[month]} {year}
        </div>
        <div className="flex">
          <button
            onClick={() => {
              if (month === 0) {
                setMonth(11);
                setYear((prevYear) => prevYear - 1);
              } else {
                setMonth((prevMonth) => prevMonth - 1);
              }
            }}
          >
            prev
          </button>
          <button
            onClick={() => {
              if (month === 11) {
                setMonth(0);
                setYear((prevYear) => prevYear + 1);
              } else {
                setMonth((prevMonth) => prevMonth + 1);
              }
            }}
          >
            next
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7">
        <React.Fragment>
          {weekdayNamesAbbreviated.map((dayOfWeek, i) => (
            <div className="text-center select-none" key={i}>
              {dayOfWeek.toUpperCase()}
            </div>
          ))}
        </React.Fragment>
        {days.map((day, i) => {
          // Determine if theres availabilities on this day.

          return (
            <div
              key={i}
              className="text-center hover:bg-tertiary cursor-pointer"
              onClick={() => {
                onSelect(day);
              }}
            >
              <Text b={selectedDay.getTime() === day.getTime()}>
                {day.getDate()}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

const weekdayNamesAbbreviated = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thur",
  "Fri",
  "Sat",
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const monthNamesAbbreviated = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Avoid typescript errors for now
weekdayNames;
monthNamesAbbreviated;
