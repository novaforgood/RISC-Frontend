import { Home } from "../../components/icons";
import TabLayout, { BaseTabLayoutProps, joinPath } from "./TabLayout";

const { PageItem } = TabLayout;

const MentorTabLayout: React.FC<BaseTabLayoutProps> = ({
  children,
  basePath,
}) => {
  return (
    <TabLayout currentPageChildren={children}>
      <PageItem label="Homepage" Icon={Home} path={joinPath(basePath)} />
      <PageItem
        label="My Availabilities"
        Icon={Home}
        path={joinPath(basePath, "availabilities")}
      />
      <PageItem
        label="Chat Requests"
        Icon={Home}
        path={joinPath(basePath, "chat-requests")}
      />
      <PageItem
        label="Edit My Profile"
        Icon={Home}
        path={joinPath(basePath, "edit-profile")}
      />
    </TabLayout>
  );
};

export default MentorTabLayout;
