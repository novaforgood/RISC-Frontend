import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { AuthorizationLevel, useAuthorizationLevel } from "../hooks";
import { parseParam } from "../utils";
import { AdminTabLayout, MenteeTabLayout, MentorTabLayout } from "./TabLayout";
import NoMatchingProfileLayout from "./TabLayout/NoMatchingProfileTabLayout";
import { BaseTabLayoutProps } from "./TabLayout/TabLayout";

const NotInProgramTabLayout: React.FC<BaseTabLayoutProps> = ({
  children,
  basePath,
}) => {
  basePath;
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
    case AuthorizationLevel.NoMatchingProfile:
      return NoMatchingProfileLayout;
    default:
      return NotInProgramTabLayout;
  }
}

const MAP_AUTHORIZATIONLEVEL_TO_ROUTE = {
  [AuthorizationLevel.Admin]: "admin",
  [AuthorizationLevel.Mentor]: "mentor",
  [AuthorizationLevel.Mentee]: "mentee",
  [AuthorizationLevel.Unauthenticated]: "",
  [AuthorizationLevel.WaitingForUserData]: "",
  [AuthorizationLevel.NotInProgram]: "",
  [AuthorizationLevel.Unverified]: "",
  [AuthorizationLevel.NoMatchingProfile]: "",
};

interface ChooseTabLayoutProps {
  children: React.ReactNode;
}
const ChooseTabLayout = ({ children }: ChooseTabLayoutProps) => {
  const router = useRouter();
  const slug = parseParam(router.query.slug);

  const authorizationLevel = useAuthorizationLevel();

  const TabLayout = getTabLayout(authorizationLevel);

  return (
    <TabLayout
      basePath={`/program/${slug}/${MAP_AUTHORIZATIONLEVEL_TO_ROUTE[authorizationLevel]}`}
    >
      {children}
    </TabLayout>
  );
};
export default ChooseTabLayout;
