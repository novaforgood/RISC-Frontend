import { addDays } from "date-fns";

/**
 *
 * @param a
 * @param b
 * @returns Difference in days between [a] and [b]
 */
export function dateDiffInDays(a: Date, b: Date) {
  // Discard the time and time-zone information.
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

/**
 *
 * @param month
 * @param year
 * @returns List of days in [month] of [year].
 */
export function getDatesInThisMonth(month: number, year: number) {
  var date = new Date(year, month, 1, 0, 0, 0, 0);
  var days = [];

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date = addDays(date, 1);
  }
  return days;
}

export function padDatesInMonth(dates: Date[]) {
  const newDates = [...dates];

  // Add days until previous Sunday
  let tempDate = new Date(newDates[0]);
  tempDate.setDate(tempDate.getDate() - 1);
  while (tempDate.getDay() != 6) {
    newDates.unshift(new Date(tempDate));
    tempDate.setDate(tempDate.getDate() - 1);
  }

  // Add days until Saturday
  tempDate = new Date(newDates[newDates.length - 1]);
  tempDate.setDate(tempDate.getDate() + 1);
  while (tempDate.getDay() != 0) {
    newDates.push(new Date(tempDate));
    tempDate.setDate(tempDate.getDate() + 1);
  }

  return newDates;
}
