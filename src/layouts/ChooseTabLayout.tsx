import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { useGetMyUserQuery } from "../generated/graphql";
import {
  AuthorizationLevel,
  getAuthorizationLevel,
  parseParam,
} from "../utils";
import { useAuth } from "../utils/firebase/auth";
import { AdminTabLayout, MenteeTabLayout, MentorTabLayout } from "./TabLayout";
import { BaseTabLayoutProps } from "./TabLayout/TabLayout";

const UnauthorizedTabLayout: React.FC = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

const NotInProgramTabLayout: React.FC = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

function getTabLayout(
  authLevel: AuthorizationLevel
): React.FC<BaseTabLayoutProps> {
  switch (authLevel) {
    case "mentor":
      return MentorTabLayout;
    case "mentee":
      return MenteeTabLayout;
    case "admin":
      return AdminTabLayout;
    case "unauthorized":
      return UnauthorizedTabLayout;
    case "not-in-program":
      return NotInProgramTabLayout;
  }
}

interface ChooseTabLayoutProps {
  children: React.ReactNode;
}
const ChooseTabLayout = ({ children }: ChooseTabLayoutProps) => {
  const { user } = useAuth();

  const router = useRouter();
  const { data: myUserData } = useGetMyUserQuery();
  const slug = parseParam(router.query?.slug);

  const authorizationLevel = getAuthorizationLevel(user, myUserData, slug);

  console.log(authorizationLevel);
  const TabLayout = getTabLayout(authorizationLevel);

  console.log(slug);

  return <TabLayout basePath={`/program/${slug}`}>{children}</TabLayout>;
};
export default ChooseTabLayout;
