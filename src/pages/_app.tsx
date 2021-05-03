import { AppProps } from "next/app";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import "tailwindcss/tailwind.css";

import Page from "../types/Page";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

type CustomAppProps = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: CustomAppProps) {
  const getLayout = Component.getLayout || ((page: any) => page);

  return (
    <ApolloProvider client={client}>
      {getLayout(<Component {...pageProps} />)}
    </ApolloProvider>
  );
}

export default MyApp;
