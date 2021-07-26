import { ProfileType } from "../generated/graphql";

export const MAP_PROFILETYPE_TO_ROUTE = {
  [ProfileType.Admin]: "admin",
  [ProfileType.Mentor]: "mentor",
  [ProfileType.Mentee]: "mentee",
};
