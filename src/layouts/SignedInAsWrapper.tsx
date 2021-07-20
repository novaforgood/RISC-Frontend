import { Text } from "../components/atomic";
import { useGetMyUserQuery } from "../generated/graphql";
import { useAuth } from "../utils/firebase/auth";

const SignedInAsWrapper: React.FC = ({ children }) => {
  const { data } = useGetMyUserQuery();
  const { signOut } = useAuth();

  return (
    <div className="box-border bg-tertiary min-h-full overflow-hidden">
      {data?.getMyUser ? (
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
      {children}
    </div>
  );
};

export default SignedInAsWrapper;
