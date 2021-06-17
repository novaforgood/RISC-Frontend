import { Text } from "../../components/atomic";
import Dropdown from "../../components/Dropdown";
import { Home } from "../../components/icons";
import TabLayout, { BaseTabLayoutProps } from "./TabLayout";
import { useAuth } from "../../utils/firebase/auth";
import { useRouter } from "next/router";
import RedirectIfNotLoggedIn from "../../layouts/RedirectIfNotLoggedIn";

const { PageItem } = TabLayout;

// TODO: Make this actually fetch picture from db
const getProfileImagePath = (): string => {
  return "http://zultimate.com/wp-content/uploads/2019/12/default-profile.png";
};

const NoProgramTabLayout: React.FC<BaseTabLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  if (user == null) {
    router.push("/login");
    return (
      <RedirectIfNotLoggedIn pathAfterLoggingIn={"/"}></RedirectIfNotLoggedIn>
    );
  }

  const footer = (
    <Dropdown
      button={
        <div className="inline-flex items-center">
          <img
            className="h-10 w-10 object-contain border border-inactive rounded-full"
            src={getProfileImagePath()}
          />
          <Text className="ml-4">{user.displayName}</Text>
        </div>
      }
    />
  );

  return (
    <TabLayout currentPageChildren={children} footerChildren={footer}>
      <PageItem label="Create a Mentorship" Icon={Home} path={"/create"} />
    </TabLayout>
  );
};

export default NoProgramTabLayout;
