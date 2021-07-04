import Link from "next/link";
import { Text } from "../components/atomic";

function NotFoundPage() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <img src="/static/DarkTextLogo.svg" />
      <div className="h-8"></div>
      <div>
        <Text>Page not found. </Text>
        <Link href="/">
          <Text u className="cursor-pointer">
            Go back to home.
          </Text>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
