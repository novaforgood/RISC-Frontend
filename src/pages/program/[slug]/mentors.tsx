import React, { Fragment } from "react";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import Page from "../../../types/Page";
import { useAuth } from "../../../utils/firebase/auth";

const ProgramPage: Page = (props) => {
  const { getAuthorizationLevel, loading } = useAuth();

  if (loading) return <Fragment />;

  const authorizationLevel = getAuthorizationLevel(props.slug);

  console.log(authorizationLevel);

  return <div>VIEW MENTORS</div>;
};

export default ProgramPage;

ProgramPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);
