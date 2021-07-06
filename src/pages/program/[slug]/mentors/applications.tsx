import React, { Fragment } from "react";
import { Text } from "../../../../components/atomic";
import { ApplicationFilterer } from "../../../../components/ReviewApplications/ApplicationFilterer";
import { ApplicationType } from "../../../../generated/graphql";
import { AuthorizationLevel, useCurrentProgram } from "../../../../hooks";
import AuthorizationWrapper from "../../../../layouts/AuthorizationWrapper";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import PageContainer from "../../../../layouts/PageContainer";
import Page from "../../../../types/Page";

const MentorApplicationsPage: Page = () => {
  const { currentProgram } = useCurrentProgram();

  if (!currentProgram) {
    return <></>;
  }

  return (
    <Fragment>
      <Text h2 b>
        Mentor Applications
      </Text>
      <div className="h-4"></div>
      <ApplicationFilterer
        programId={currentProgram.programId}
        applicationType={ApplicationType.Mentor}
      />
    </Fragment>
  );
};

MentorApplicationsPage.getLayout = (page, pageProps) => (
  <AuthorizationWrapper canView={[AuthorizationLevel.Admin]}>
    <ChooseTabLayout {...pageProps} canView={[AuthorizationLevel.Admin]}>
      <PageContainer>{page}</PageContainer>
    </ChooseTabLayout>
  </AuthorizationWrapper>
);

export default MentorApplicationsPage;
