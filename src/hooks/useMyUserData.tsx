import { GetMyUserQuery, useGetMyUserQuery } from "../generated/graphql";
import { useAuth } from "../utils/firebase/auth";

export type UserData = GetMyUserQuery["getMyUser"];

const useMyUserData = () => {
  const { user } = useAuth();
  const { data: myUserData, refetch } = useGetMyUserQuery({ skip: !user });

  return { myUserData: myUserData?.getMyUser, refetchMyUserData: refetch };
};

export default useMyUserData;
