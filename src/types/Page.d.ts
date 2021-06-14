import { NextPage } from "next";
import { ReactElement } from "react";

type PageProps = any & { error?: Error; apollo?: any };

type Page<P = {}> = NextPage<PageProps & P> & {
  getLayout?: (
    page: ReactElement<PageProps>,
    pageProps: PageProps
  ) => ReactNode;
};

export default Page;
