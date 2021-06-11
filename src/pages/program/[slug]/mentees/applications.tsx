import React, { Fragment } from "react";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import Page from "../../../../types/Page";
import { useAuth } from "../../../../utils/firebase/auth";

const MenteeApplicationsPage: Page = (_) => {
  const { loading } = useAuth();

  if (loading) return <Fragment />;

  return <div>Mentee Application Page</div>;
};

MenteeApplicationsPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default MenteeApplicationsPage;
