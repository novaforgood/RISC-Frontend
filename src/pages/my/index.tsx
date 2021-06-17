import Page from "../../types/Page";
import { Button, Text } from "../../components/atomic";
import NoProgramTabLayout from "../../layouts/TabLayout/NoProgramTabLayout";
import Link from "next/link";

// type NoMentorshipHomeParams = {

// }

const NoMentorshipHome: Page = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div>
        <Text h3>You are currently not a part of any mentorship programs</Text>
      </div>
      <Button className="w-96 m-9">
        <Link href="/my/applications">
          <a>
            <Text h3>Check Application Statuses</Text>
          </a>
        </Link>
      </Button>
    </div>
  );
};

NoMentorshipHome.getLayout = (page, pageProps) => (
  <NoProgramTabLayout {...pageProps}>{page}</NoProgramTabLayout>
);

export default NoMentorshipHome;
