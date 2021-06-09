import React, { Fragment, useEffect } from "react";
import { useCreateUserMutation, useGetMyUserQuery } from "../generated/graphql";
import { useAuth } from "../utils/firebase/auth";

/**
 * If user is authenticated but there's no User table entry,
 * mirror Firebase data to the database
 */

interface GuaranteeUserDataProps {}

const GuaranteeUserData: React.FC<GuaranteeUserDataProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { data: myUserData } = useGetMyUserQuery();
  const [createUser] = useCreateUserMutation();

  useEffect(() => {
    if (user && !myUserData) {
      const arr = user.displayName?.split(" ") || [];
      createUser({
        variables: {
          data: {
            email: user.email || "",
            firstName: arr[0] || "",
            lastName: arr[1] || "",
            profilePictureUrl: "",
          },
        },
      });
    }
    return () => {};
  }, [user, myUserData]);

  if (loading) return <Fragment />;

  return <Fragment>{children}</Fragment>;
};
export default GuaranteeUserData;
