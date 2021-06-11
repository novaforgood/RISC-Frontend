import React, { Fragment } from "react";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import Page from "../../../../types/Page";
import { useAuth } from "../../../../utils/firebase/auth";

const ProgramPage: Page = (_) => {
  const { loading } = useAuth();

  if (loading) return <Fragment />;

  return <div>VIEW MENTORS</div>;
};

ProgramPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default ProgramPage;
