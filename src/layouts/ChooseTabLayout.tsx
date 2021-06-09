import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { parseParam } from "../utils";
import { AuthorizationLevel, useAuth } from "../utils/firebase/auth";
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
  const { getAuthorizationLevel, loading } = useAuth();
  const router = useRouter();

  if (loading) return <Fragment />;

  const slug = parseParam(router.query?.slug);
  const authorizationLevel = getAuthorizationLevel(slug);

  const TabLayout = getTabLayout(authorizationLevel);

  if (loading) return <Fragment />;
  return (
    <Fragment>
      <TabLayout basePath={`/program/${slug}`}>{children}</TabLayout>
    </Fragment>
  );
};
export default ChooseTabLayout;
