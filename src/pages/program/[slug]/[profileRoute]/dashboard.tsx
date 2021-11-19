import React, { Fragment } from "react";
import { Card, Text } from "../../../../components/atomic";
import {
  ProfileType,
  useGetProfilesQuery,
} from "../../../../generated/graphql";
import { AuthorizationLevel, useCurrentProgram } from "../../../../hooks";
import AuthorizationWrapper from "../../../../layouts/AuthorizationWrapper";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import PageContainer from "../../../../layouts/PageContainer";
import Page from "../../../../types/Page";

const DashboardPage: Page = () => {
  const { currentProgram } = useCurrentProgram();
  const { programId } = currentProgram || {
    programId: ""
  };

  const mentors = useGetProfilesQuery({
    variables: {
      programId: programId,
      profileType: ProfileType.Mentor,
    },
  });

  const mentees = useGetProfilesQuery({
    variables: {
      programId: programId,
      profileType: ProfileType.Mentee,
    },
  });

  if (!currentProgram || mentors.error || mentees.error) return <Fragment />;

  return (
    <Fragment>
      <Text h2 b>
        Dashboard
      </Text>
      <div className="h-4"></div>
      <Card className="flex flex-col p-12 space-y-6 overflow-y-auto">
        <div className="grid grid-cols-4 gap-4 justify-center items-center">
          <Text b secondary className="col-span-1">
            Mentors (#):
          </Text>
          <Text b>
            {mentors.data?.getProfiles.length}
          </Text>
          <Text b secondary className="col-span-1">
            Mentees (#):
          </Text>
          <Text b>
            {mentees.data?.getProfiles.length}
          </Text>
        </div>
      </Card>
    </Fragment>
  );
};

DashboardPage.getLayout = (page, pageProps) => (
  <AuthorizationWrapper canView={[AuthorizationLevel.Admin]}>
    <ChooseTabLayout {...pageProps}>
      <PageContainer>{page}</PageContainer>
    </ChooseTabLayout>
  </AuthorizationWrapper>
);

export default DashboardPage;
