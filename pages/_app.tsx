import { AppProps } from "next/app";
import { AuthProvider } from "../utils/firebase/auth";

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
