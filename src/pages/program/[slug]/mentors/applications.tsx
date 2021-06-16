import React from "react";
import { Text } from "../../../../components/atomic";
import { ApplicationFilterer } from "../../../../components/ReviewApplications/ApplicationFilterer";
import { ApplicationType } from "../../../../generated/graphql";
import { useCurrentProgram } from "../../../../hooks";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import Page from "../../../../types/Page";

const MentorApplicationsPage: Page = () => {
  const { currentProgram } = useCurrentProgram();

  if (!currentProgram) {
    return <></>;
  }

  return (
    <div className="bg-tertiary h-screen">
      <div className="flex flex-col items-center w-5/6 mx-auto h-full">
        <div className="flex w-5/6 items-center">
          <Text h1 b>
            Applications
          </Text>
          {/* <div className="flex-1" />
          <label className="space-x-4">
            <Text>Accepting Applications</Text>
            <input type="checkbox" />
          </label> */}
        </div>
        <div className="h-4" />
        <div className="w-4/5 flex-1">
          <ApplicationFilterer
            programId={currentProgram.programId}
            applicationType={ApplicationType.Mentor}
          />
        </div>
      </div>
    </div>
  );
};

MentorApplicationsPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default MentorApplicationsPage;
