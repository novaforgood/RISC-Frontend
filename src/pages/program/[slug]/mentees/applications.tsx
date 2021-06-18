import React, { Fragment } from "react";
import { Text } from "../../../../components/atomic";
import { ApplicationFilterer } from "../../../../components/ReviewApplications/ApplicationFilterer";
import { ApplicationType } from "../../../../generated/graphql";
import { useCurrentProgram } from "../../../../hooks";
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
        Mentee Applications
      </Text>
      <div className="h-4"></div>
      <ApplicationFilterer
        programId={currentProgram.programId}
        applicationType={ApplicationType.Mentee}
      />
    </Fragment>
  );
};

MentorApplicationsPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>
    <PageContainer>{page}</PageContainer>
  </ChooseTabLayout>
);

export default MentorApplicationsPage;
