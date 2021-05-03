import React, { useEffect, useState } from "react";
import SampleLayout from "../layouts/SampleLayout";
import Link from "next/link";

import Page from "../types/Page";

interface HomePageProps {}
const HomePage: Page<HomePageProps> = ({}) => {
  return (
    <div>
      Home page. <Link href="/mentors">Go to mentors.</Link>
    </div>
  );
};

HomePage.getLayout = (page) => <SampleLayout>{page}</SampleLayout>;

export default HomePage;
