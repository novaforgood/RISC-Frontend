import React from "react";
import { AdminTabLayout } from "../../../layouts/TabLayout";
import Page from "../../../types/Page";

interface TestPageProps {}
const TestPage: Page<TestPageProps> = ({}) => {
  return <div>Subpage 3.</div>;
};

TestPage.getLayout = (page) => <AdminTabLayout>{page}</AdminTabLayout>;

export default TestPage;
