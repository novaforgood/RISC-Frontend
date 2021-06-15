import { useGetMyUserQuery } from "../generated/graphql";
import { useCurrentProgram } from "../hooks";

const useCurrentProfile = () => {
  const { data } = useGetMyUserQuery();
  const { currentProgram } = useCurrentProgram();

  if (data) {
    for (let profile of data.getMyUser.profiles) {
      if (profile.program.programId === currentProgram?.programId) {
        return { currentProfile: profile };
      }
    }
  }
  return { currentProfile: undefined };
};

export default useCurrentProfile;
