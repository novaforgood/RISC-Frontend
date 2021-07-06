import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { Text } from "../components/atomic";
import { AuthorizationLevel, useAuthorizationLevel } from "../hooks";
import { parseParam } from "../utils";
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
    case AuthorizationLevel.WaitingForUserData:
      return Fragment;
  }
}

interface ChooseTabLayoutProps {
  children: React.ReactNode;
  canView?: AuthorizationLevel[];
}
const ChooseTabLayout = ({ children, canView }: ChooseTabLayoutProps) => {
  const router = useRouter();
  const slug = parseParam(router.query?.slug);

  const authorizationLevel = useAuthorizationLevel();

  if (authorizationLevel === AuthorizationLevel.WaitingForUserData)
    return <Fragment />;

  if (canView && !canView.includes(authorizationLevel)) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <img src="/static/DarkTextLogo.svg" />
        <div className="h-8"></div>
        <div>
          <Text>Page not found. </Text>
          <Link href="/">
            <Text u className="cursor-pointer">
              Go back to home.
            </Text>
          </Link>
        </div>
      </div>
    );
  }

  const TabLayout = getTabLayout(authorizationLevel);
  return <TabLayout basePath={`/program/${slug}`}>{children}</TabLayout>;
};
export default ChooseTabLayout;
