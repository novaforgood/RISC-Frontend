import { format } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { NextRouter } from "next/router";
import timezoneRawData from "./data/timezones.json";

export function parseParam(param: string | string[] | undefined) {
  if (!param || typeof param !== "string") {
    return "";
  } else {
    return param;
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

export const redirectAfterAuthentication = (router: NextRouter) => {
  if (router.query.to && typeof router.query.to === "string") {
    router.push(router.query.to);
  } else {
    router.push("/");
  }
};

export function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
