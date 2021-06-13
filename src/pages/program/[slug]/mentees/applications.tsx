import React from "react";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import Page from "../../../../types/Page";

const MenteeApplicationsPage: Page = (_) => {
  return <div>Mentee Application Page</div>;
};

MenteeApplicationsPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default MenteeApplicationsPage;
