import React from "react";
import { useRouter } from "next/router";
import { Home } from "../../components/icons";
import { useAuth } from "../../utils/firebase/auth";
import TabLayout, { BaseTabLayoutProps } from "./TabLayout";

const { PageItem } = TabLayout;

// TODO: Make this actually fetch picture from db

const NoProgramTabLayout: React.FC<BaseTabLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  if (user == null) {
    router.push("/login");
    return <></>;
  }

  return (
    <TabLayout onboarded={true} currentPageChildren={children}>
      <PageItem label="My Dashboard" Icon={Home} path="/" />
    </TabLayout>
  );
};

export default NoProgramTabLayout;
