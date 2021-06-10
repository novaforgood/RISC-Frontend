import { useRouter } from "next/router";
import React, { Fragment } from "react";
import {
  AuthorizationLevel,
  parseParam,
  useAuthorizationLevel,
} from "../utils";
import { AdminTabLayout, MenteeTabLayout, MentorTabLayout } from "./TabLayout";
import { BaseTabLayoutProps } from "./TabLayout/TabLayout";

const UnauthenticatedTabLayout: React.FC = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

const NotInProgramTabLayout: React.FC = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

function getTabLayout(
  authLevel: AuthorizationLevel
): React.FC<BaseTabLayoutProps> {
  switch (authLevel) {
    case AuthorizationLevel.Mentor:
      return MentorTabLayout;
    case AuthorizationLevel.Mentee:
      return MenteeTabLayout;
    case AuthorizationLevel.Admin:
      return AdminTabLayout;
    case AuthorizationLevel.Unauthenticated:
      return UnauthenticatedTabLayout;
    case AuthorizationLevel.NotInProgram:
      return NotInProgramTabLayout;
  }
}

interface ChooseTabLayoutProps {
  children: React.ReactNode;
}
const ChooseTabLayout = ({ children }: ChooseTabLayoutProps) => {
  const router = useRouter();
  const slug = parseParam(router.query?.slug);

  const authorizationLevel = useAuthorizationLevel();

  const TabLayout = getTabLayout(authorizationLevel);

  return <TabLayout basePath={`/program/${slug}`}>{children}</TabLayout>;
};
export default ChooseTabLayout;
