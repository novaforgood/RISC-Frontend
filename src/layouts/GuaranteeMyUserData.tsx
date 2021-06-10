import React, { Fragment, ReactNode, useEffect } from "react";
import { useCreateUserMutation, useGetMyUserQuery } from "../generated/graphql";
import { useAuth } from "../utils/firebase/auth";

interface GuaranteeMyUserDataProps {
  children: ReactNode;
}

const GuaranteeMyUserData = ({ children }: GuaranteeMyUserDataProps) => {
  const { user } = useAuth();
  const { data: myUserData } = useGetMyUserQuery({ skip: !user });
  const [createUser] = useCreateUserMutation();

  useEffect(() => {
    if (user && !myUserData) {
      /**
       * If user is authenticated but there's no User table entry,
       * mirror Firebase data to the database
       */
      console.log("GuaranteeMyUserData fired");
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

  return <Fragment>{children}</Fragment>;
};
export default GuaranteeMyUserData;
