import { ApolloClient, concat, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { ReactElement } from "react";
import Page from "../types/Page";
import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import firebase from "../utils/firebase/firebase";
import { AuthProvider } from "../utils/firebase/auth";

const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_API_URL });

const authLink = setContext(async (_, { headers, ...context }) => {
  const token = await firebase
    .auth()
    .currentUser?.getIdToken(/* forceRefresh */ false);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
    ...context,
  };
});

const client = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

type CustomAppProps = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: CustomAppProps) {
  const getLayout = Component.getLayout || ((page: ReactElement) => page);

  return (
    <ApolloProvider client={client}>
      <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;
