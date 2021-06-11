import React, { Fragment } from "react";
import { Button, Text } from "../../../components/atomic";
import { useCurrentProgram } from "../../../hooks";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import Page from "../../../types/Page";
import { useAuth } from "../../../utils/firebase/auth";

const ProgramApplyPage: Page = (_) => {
  const { loading } = useAuth();
  const { currentProgram } = useCurrentProgram();

  if (loading) return <Fragment />;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div>
        <Text h1>Apply to {currentProgram?.name} as a mentor!</Text>
      </div>
      <div className="h-4"></div>
      <Button size="small">Apply</Button>
    </div>
  );
};

ProgramApplyPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default ProgramApplyPage;
