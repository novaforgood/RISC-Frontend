import { GetProfileTagsByProfileQuery } from "../../generated/graphql";

export type ProfileTag =
  GetProfileTagsByProfileQuery["getProfileTagsByProfile"][number];
