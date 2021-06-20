import timezoneRawData from "./data/timezones.json";

export function parseParam(slug: string | string[] | undefined) {
  if (!slug || typeof slug !== "string") {
    return "";
  } else {
    return slug;
  }
}

export function getTimezoneSelectOptions() {
  return timezoneRawData.map((timezoneRaw) => {
    return {
      label: `${timezoneRaw.alternativeName} (${
        timezoneRaw.rawFormat.split(" ")[0]
      })`,
      value: timezoneRaw.name,
    };
  });
}
