import {
  ApolloClient,
  from,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ApolloProvider } from "@apollo/client/react";
import { createUploadLink } from "apollo-upload-client";
import { AppProps } from "next/app";
import { ReactElement } from "react";
import "../styles/tailwind.css";
import Page from "../types/Page";
import "tailwindcss/tailwind.css";
import { AuthProvider } from "../utils/firebase/auth";
import firebase from "../utils/firebase/firebase";

const uploadLink = createUploadLink({ uri: process.env.NEXT_PUBLIC_API_URL });

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

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions)
        switch (err.extensions.code) {
          case "UNAUTHENTICATED":
            if (response) response.errors = undefined;
            break;
        }
    }
  }

  // To retry on network errors, we recommend the RetryLink
  // instead of the onError link. This just logs the error.
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

export const client = new ApolloClient({
  link: from([authLink, errorLink, uploadLink]),
  cache: new InMemoryCache(),
});

export const getApolloClient = (
  _: any,
  initialState?: NormalizedCacheObject
) => {
  const cache = new InMemoryCache().restore(initialState || {});
  return new ApolloClient({
    link: from([authLink, errorLink, uploadLink]),
    cache,
  });
};

type CustomAppProps = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: CustomAppProps) {
  const getLayout = Component.getLayout || ((page: ReactElement) => page);

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {getLayout(<Component {...pageProps} />, pageProps)}
      </AuthProvider>
      <script> </script>
    </ApolloProvider>
  );
}

export default MyApp;
