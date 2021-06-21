import { format } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import timezoneRawData from "./data/timezones.json";

export function parseParam(slug: string | string[] | undefined) {
  if (!slug || typeof slug !== "string") {
    return "";
  } else {
    return slug;
  }
}

export function getTimezoneSelectOptions() {
  const myTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  return timezoneRawData.map((timezoneRaw) => {
    return {
      label: `${timezoneRaw.alternativeName} (${format(
        utcToZonedTime(zonedTimeToUtc(now, myTimezone), timezoneRaw.name),
        "h:mm aaa"
      )})`,
      value: timezoneRaw.name,
    };
  });
}

const emailForm = new RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
export function validateEmail(email: string) {
  return email && emailForm.test(email);
}
