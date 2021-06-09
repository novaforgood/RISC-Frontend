import {
  ApolloClient,
  from,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { createUploadLink } from "apollo-upload-client";
import { AppProps } from "next/app";
import { ReactElement } from "react";
import "tailwindcss/tailwind.css";
import GuaranteeMyUserData from "../layouts/GuaranteeMyUserData";
import Page from "../types/Page";
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

export const client = new ApolloClient({
  link: from([authLink, uploadLink]),
  cache: new InMemoryCache(),
});

export const getApolloClient = (
  _: any,
  initialState?: NormalizedCacheObject
) => {
  const cache = new InMemoryCache().restore(initialState || {});
  return new ApolloClient({
    link: from([authLink, uploadLink]),
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
        <GuaranteeMyUserData>
          {getLayout(<Component {...pageProps} />, pageProps)}
        </GuaranteeMyUserData>
      </AuthProvider>
      <script> </script>
    </ApolloProvider>
  );
}

export default MyApp;
