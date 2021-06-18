import { Text } from "../../components/atomic";
import Dropdown from "../../components/Dropdown";
import { Home } from "../../components/icons";
import TabLayout, { BaseTabLayoutProps } from "./TabLayout";
import { useAuth } from "../../utils/firebase/auth";
import { useRouter } from "next/router";
import RedirectIfNotLoggedIn from "../../layouts/RedirectIfNotLoggedIn";

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

  const photoURL: string =
    user == null || user.photoURL == null || user.photoURL == ""
      ? "/static/DefaultProfilePicture.png"
      : user.photoURL;

  const footer = (
    <Dropdown
      button={
        <div className="inline-flex items-center">
          <img
            className="h-10 w-10 object-contain border border-inactive rounded-full"
            src={photoURL}
          />
          <Text className="ml-4">{user.displayName}</Text>
        </div>
      }
    />
  );

  return (
    <TabLayout
      currentPageChildren={children}
      footerChildren={footer}
    ></TabLayout>
  );
};

export default NoProgramTabLayout;
