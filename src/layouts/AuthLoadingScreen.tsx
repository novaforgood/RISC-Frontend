import React, { Fragment, ReactNode } from "react";
import { useAuth } from "../utils/firebase/auth";

interface AuthLoadingScreenProps {
  children: ReactNode;
}

const AuthLoadingScreen = ({ children }: AuthLoadingScreenProps) => {
  const { loading } = useAuth();

  if (loading) return <Fragment />;

  return <Fragment>{children}</Fragment>;
};

export default AuthLoadingScreen;
