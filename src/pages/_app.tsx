import { ApolloClient, concat, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { createUploadLink } from "apollo-upload-client";
import { AppProps } from "next/app";
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

const client = new ApolloClient({
  link: concat(authLink, uploadLink),
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;
