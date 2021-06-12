import React from "react";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import Page from "../../../types/Page";

const ProgramJoinPage: Page = (_) => {
  return <div>VIEW MENTORS</div>;
};

ProgramJoinPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default ProgramJoinPage;
