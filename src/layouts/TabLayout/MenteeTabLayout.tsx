import { Home, Smile } from "../../components/icons";
import TabLayout, { BaseTabLayoutProps, joinPath } from "./TabLayout";

const { PageItem } = TabLayout;

const MenteeTabLayout: React.FC<BaseTabLayoutProps> = ({
  children,
  basePath,
}) => {
  return (
    <TabLayout currentPageChildren={children}>
      <PageItem
        label="View Mentors"
        Icon={Smile}
        path={joinPath(basePath, "mentors")}
      />
      <PageItem
        label="My Chats"
        Icon={Home}
        path={joinPath(basePath, "my-chats")}
      />
      <PageItem
        label="My Profile"
        Icon={Home}
        path={joinPath(basePath, "profile")}
      />
    </TabLayout>
  );
};

export default MenteeTabLayout;
