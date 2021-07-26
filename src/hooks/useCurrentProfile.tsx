import { useRouter } from "next/router";
import { useGetMyUserQuery } from "../generated/graphql";
import { parseParam } from "../utils";
import { MAP_PROFILETYPE_TO_ROUTE } from "../utils/constants";
import useCurrentProgram from "./useCurrentProgram";

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
