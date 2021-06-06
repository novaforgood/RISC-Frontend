import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default Page;
