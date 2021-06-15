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
export function getDaysInThisMonth(month: number, year: number) {
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
