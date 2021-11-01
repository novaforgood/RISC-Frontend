import { useRouter } from "next/router";
import React, { Fragment } from "react";
import {
  AuthorizationLevel,
  useAuthorizationLevel,
  useCurrentProfile,
} from "../hooks";
import { parseParam } from "../utils";
import { MAP_PROFILETYPE_TO_ROUTE } from "../utils/constants";
import { AdminTabLayout, MenteeTabLayout, MentorTabLayout } from "./TabLayout";
import NoMatchingProfileLayout from "./TabLayout/NoMatchingProfileTabLayout";
import { BaseTabLayoutProps } from "./TabLayout/TabLayout";
import OnboardingComponent from "../components/Onboarding/Onboarding";

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
    case AuthorizationLevel.Unauthenticated:
    case AuthorizationLevel.Unverified:
      return NotInProgramTabLayout;
    default:
      return NoMatchingProfileLayout;
  }
}

function getAuthRoute(level: AuthorizationLevel) {
  switch (level) {
    case AuthorizationLevel.Admin:
    case AuthorizationLevel.Mentor:
    case AuthorizationLevel.Mentee:
      return MAP_PROFILETYPE_TO_ROUTE[level];
    default:
      return "";
  }
}

interface ChooseTabLayoutProps {
  children: React.ReactNode;
}
const ChooseTabLayout = ({ children }: ChooseTabLayoutProps) => {
  const router = useRouter();
  const slug = parseParam(router.query.slug);
  const currentProfile = useCurrentProfile();

  const authorizationLevel = useAuthorizationLevel();

  const TabLayout = getTabLayout(authorizationLevel);
  return (
    <TabLayout
      onboarded={
        currentProfile.currentProfile?.onboarded !== undefined
          ? currentProfile.currentProfile.onboarded
          : true
      }
      basePath={`/program/${slug}/${getAuthRoute(authorizationLevel)}`}
    >
      {/* If the user is in a program right now as a mentor, mentee, or admin,
          Check for onboarding */}
      {currentProfile.currentProfile?.onboarded !== undefined &&
      !currentProfile.currentProfile.onboarded &&
      getAuthRoute(authorizationLevel) ? (
        <OnboardingComponent currentPageChildren={children} />
      ) : (
        children
      )}
    </TabLayout>
  );
};
export default ChooseTabLayout;
