import React, { Fragment, useEffect } from "react";
import { useAuth } from "../utils/firebase/auth";

/**
 * If user is authenticated but there's no User table entry,
 * mirror Firebase data to the database
 */

interface GuaranteeUserDataProps {}

const GuaranteeUserData: React.FC<GuaranteeUserDataProps> = ({ children }) => {
  const { user, userData, createUserInDb } = useAuth();

  useEffect(() => {
    if (user && !userData) {
      const arr = user.displayName?.split(" ") || [];
      createUserInDb({
        email: user.email || "",
        firstName: arr[0] || "",
        lastName: arr[1] || "",
        profilePictureUrl: "",
      });
    }
    return () => {};
  }, [user, userData]);

  return <Fragment>{children}</Fragment>;
};
export default GuaranteeUserData;
