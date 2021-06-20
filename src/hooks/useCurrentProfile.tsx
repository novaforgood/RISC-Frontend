import { useGetMyUserQuery } from "../generated/graphql";
import useCurrentProgram from "./useCurrentProgram";

const useCurrentProfile = () => {
  const { data, refetch } = useGetMyUserQuery();
  const { currentProgram } = useCurrentProgram();

  if (data) {
    for (let profile of data.getMyUser.profiles) {
      if (profile.program.programId === currentProgram?.programId) {
        return { currentProfile: profile, refetchCurrentProfile: refetch };
      }
    }
  }
  return { currentProfile: undefined, refetchCurrentProfile: undefined };
};

export default useCurrentProfile;
