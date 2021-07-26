import { ProfileType } from "../generated/graphql";

// Typical route: /program/[programSlug]/[profileRoute]
export enum ProfileRoute {
  Admin = "admin",
  Mentor = "mentor",
  Mentee = "mentee",
}

export const MAP_PROFILETYPE_TO_ROUTE = {
  [ProfileType.Admin]: ProfileRoute.Admin,
  [ProfileType.Mentor]: ProfileRoute.Mentor,
  [ProfileType.Mentee]: ProfileRoute.Mentee,
};
