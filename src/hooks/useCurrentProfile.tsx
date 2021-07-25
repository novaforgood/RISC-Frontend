import { useRouter } from "next/router";
import { ProfileType, useGetMyUserQuery } from "../generated/graphql";
import { parseParam } from "../utils";
import useCurrentProgram from "./useCurrentProgram";

const MAP_PROFILETYPE_TO_ROUTE = {
  [ProfileType.Admin]: "admin",
  [ProfileType.Mentor]: "mentor",
  [ProfileType.Mentee]: "mentee",
};

const useCurrentProfile = () => {
  const router = useRouter();
  const { data, refetch } = useGetMyUserQuery();
  const { currentProgram } = useCurrentProgram();
  const profileType = parseParam(router.query.profileType);

  if (data) {
    for (let profile of data.getMyUser.profiles) {
      if (
        profile.program.programId === currentProgram?.programId &&
        MAP_PROFILETYPE_TO_ROUTE[profile.profileType] === profileType
      ) {
        return { currentProfile: profile, refetchCurrentProfile: refetch };
      }
    }
  }
  return { currentProfile: undefined, refetchCurrentProfile: undefined };
};

export default useCurrentProfile;
