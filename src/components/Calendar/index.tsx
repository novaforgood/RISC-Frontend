import classNames from "classnames";
import React, { useMemo, useState } from "react";
import { Button, Modal, Text } from "../../components/atomic";
import { monthNames, weekdayNamesAbbreviated } from "./data";
import { Arrow } from "./icons";
import { getDatesInThisMonth, padDatesInMonth } from "./utils";

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const initMonth = tomorrow.getMonth();
const initYear = tomorrow.getFullYear();

interface CalendarProps {
  onSelect: (date: Date | null) => void;
  selectedDate: Date | null;
  selectAnyDate?: boolean;
  modified?: boolean;
  getSelectableDates?: (month: number, year: number) => Date[];
}
const Calendar = ({
  onSelect = () => {},
  selectedDate,
  selectAnyDate = false,
  modified = false,
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
  const [nextDay, setNextDay] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (!days) return <></>;

  const selectableDatesSet = useMemo(() => {
    let val = new Set();
    for (const date of getSelectableDates(...monthyear)) {
      val.add(date.getDate());
    }
    return val;
  }, [monthyear, getSelectableDates]);

  return (
    <div className="w-96 border border-6 rounded-md border-black">
      <div className="bg-black p-2 flex items-center justify-center space-x-2">
        <Arrow
          direction="left"
          color="white"
          className="h-6 w-6 p-1 cursor-pointer hover:bg-secondary"
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
        <Text b className="text-white">
          {monthNames[monthyear[0]]} {monthyear[1]}
        </Text>
        <Arrow
          direction="right"
          color="white"
          className="h-6 w-6 p-1 cursor-pointer hover:bg-secondary"
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
      </div>
      <div className="grid grid-cols-7 gap-y-3 w-full p-2">
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
            selectedDate && selectedDate.getTime() === day.getTime();
          const selectable =
            day > today &&
            inMonth &&
            (selectAnyDate || selectableDatesSet.has(day.getDate()));

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
                if (nextDay !== null && modified) {
                  setModalOpen(true);
                } else {
                  onSelect(day);
                }
                setNextDay(day);
              }}
            >
              <Text b2>{day.getDate()}</Text>
            </button>
          );
        })}
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Text h2 b>
          You have unsaved changes!
        </Text>
        <div className="h-6" />
        <Text>Are you sure you want to switch dates?</Text>
        <div className="h-6" />
        <div className="flex justify-between">
          <Button
            size="small"
            variant="inverted"
            onClick={() => setModalOpen(false)}
          >
            Back
          </Button>
          <Button
            size="small"
            onClick={() => {
              onSelect(nextDay);
              setModalOpen(false);
            }}
          >
            Continue
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
