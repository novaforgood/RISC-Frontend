import { useRouter } from "next/router";
import { Home } from "../../components/icons";
import RedirectIfNotLoggedIn from "../../layouts/RedirectIfNotLoggedIn";
import { useAuth } from "../../utils/firebase/auth";
import TabLayout, { BaseTabLayoutProps } from "./TabLayout";

const { PageItem } = TabLayout;

// TODO: Make this actually fetch picture from db

const NoProgramTabLayout: React.FC<BaseTabLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  if (user == null) {
    router.push("/login");
    return (
      <RedirectIfNotLoggedIn pathAfterLoggingIn={"/"}></RedirectIfNotLoggedIn>
    );
  }

  return (
    <TabLayout currentPageChildren={children}>
      <PageItem label="Home" Icon={Home} path="/" />
    </TabLayout>
  );
};

export default NoProgramTabLayout;
