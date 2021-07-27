import { Text } from "../components/atomic";
import { useGetMyUserQuery } from "../generated/graphql";
import { AuthorizationLevel, useAuthorizationLevel } from "../hooks";
import { useAuth } from "../utils/firebase/auth";

const SignedInAsIndicator: React.FC = () => {
  const { data } = useGetMyUserQuery();
  const authorizationLevel = useAuthorizationLevel();
  const { signOut } = useAuth();

  //If a user is fully logged in and verified, then their account information shows
  return (
    <div className="box-border">
      {data?.getMyUser &&
      authorizationLevel !== AuthorizationLevel.Unverified ? (
        <div className="text-right">
          <Text>
            Signed in as{" "}
            <Text
              b
            >{`${data.getMyUser.firstName} ${data.getMyUser.lastName}`}</Text>
          </Text>
          <div className="h-2" />
          <button onClick={signOut}>
            <Text u>Sign Out</Text>
          </button>
          <div className="h-2" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SignedInAsIndicator;
