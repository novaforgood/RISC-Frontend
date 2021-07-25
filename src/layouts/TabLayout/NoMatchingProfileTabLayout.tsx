import classNames from "classnames";
import { useRouter } from "next/router";
import { Text } from "../../components/atomic";
import { Home } from "../../components/icons";
import RedirectIfNotLoggedIn from "../../layouts/RedirectIfNotLoggedIn";
import { useAuth } from "../../utils/firebase/auth";
import LocalStorage from "../../utils/localstorage";
import TabLayout, { BaseTabLayoutProps } from "./TabLayout";

// TODO: Make this actually fetch picture from db

const NoMatchingProfileLayout: React.FC<BaseTabLayoutProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const router = useRouter();

  if (user == null) {
    router.push("/login");
    return (
      <RedirectIfNotLoggedIn pathAfterLoggingIn={"/"}></RedirectIfNotLoggedIn>
    );
  }

  const active = false;
  const pageItemStyles = classNames({
    "w-full pr-6 pl-8 py-1.5 flex items-center text-secondary cursor-pointer duration-150 select-none":
      true,
    "hover:bg-tertiary": !active,
    "text-white bg-primary hover:bg-primary": active,
  });

  return (
    <TabLayout currentPageChildren={children}>
      <div
        className={pageItemStyles}
        onClick={() => {
          LocalStorage.delete("cachedProfileSlug");
          router.push("/");
        }}
      >
        <Home
          color={active ? "white" : "#737373"}
          className="p-2 h-9 w-9 duration-150 flex-none"
        />
        <div className="w-1 flex-none" />
        <Text className="whitespace-nowrap overflow-ellipsis">
          Go to my homepage
        </Text>
      </div>
    </TabLayout>
  );
};

export default NoMatchingProfileLayout;
