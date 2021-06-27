import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { useGetMyUserQuery } from "../generated/graphql";

const useTimezoneConverters = () => {
  const { data } = useGetMyUserQuery();
  if (!data) {
    return { toUTC: undefined, fromUTC: undefined };
  }

  // const myTimezone = data.getMyUser.timezone;
  const myTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // const myTimezone = "Pacific/Honolulu";

  const toUTC = (time: Date): Date => {
    return zonedTimeToUtc(time, myTimezone);
  };

  const fromUTC = (utcTime: Date): Date => {
    return utcToZonedTime(utcTime, myTimezone);
  };

  return { toUTC, fromUTC };
};

export default useTimezoneConverters;
