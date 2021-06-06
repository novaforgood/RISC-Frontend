import React from "react";
import { AdminTabLayout } from "../../../layouts/TabLayout";
import Link from "next/link";
import Page from "../../../types/Page";

interface TestPageProps {}
const TestPage: Page<TestPageProps> = ({}) => {
  return (
    <div>
      Subpage 1.{" "}
      <Link href="/test/testtablayout/subpage2">Go to subpage 2</Link>
    </div>
  );
};

TestPage.getLayout = (page) => <AdminTabLayout>{page}</AdminTabLayout>;

export default TestPage;
