import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { useGetMyUserQuery } from "../generated/graphql";

const useTimezoneConverters = () => {
  const { loading, data } = useGetMyUserQuery();
  if (loading || !data) {
    return { toUTC: undefined, fromUTC: undefined };
  }

  const myTimezone = data.getMyUser.timezone;

  const toUTC = (time: Date): Date => {
    return zonedTimeToUtc(time, myTimezone);
  };

  const fromUTC = (utcTime: Date): Date => {
    return utcToZonedTime(utcTime, myTimezone);
  };

  return { toUTC, fromUTC };
};

export default useTimezoneConverters;
