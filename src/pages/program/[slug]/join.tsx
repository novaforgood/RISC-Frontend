import React, { Fragment } from "react";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import Page from "../../../types/Page";
import { useAuth } from "../../../utils/firebase/auth";

const ProgramJoinPage: Page = (_) => {
  const { loading } = useAuth();

  if (loading) return <Fragment />;

  return <div>VIEW MENTORS</div>;
};

ProgramJoinPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default ProgramJoinPage;
