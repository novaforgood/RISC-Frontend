import { Home, Smile, User, Users } from "../../components/icons";
import TabLayout, { BaseTabLayoutProps, joinPath } from "./TabLayout";

const { PageItem } = TabLayout;

const MenteeTabLayout: React.FC<BaseTabLayoutProps> = ({
  children,
  onboarded,
  basePath,
}) => {
  return (
    <TabLayout onboarded={onboarded} currentPageChildren={children}>
      <PageItem label="Homepage" Icon={Home} path={joinPath(basePath)} />
      <PageItem
        label="View Mentors"
        Icon={Users}
        path={joinPath(basePath, "mentors")}
      />
      <PageItem
        label="My Chats"
        Icon={Smile}
        path={joinPath(basePath, "my-chats")}
      />
      <PageItem
        label="Edit My Profile"
        Icon={User}
        path={joinPath(basePath, "edit-profile")}
      />
    </TabLayout>
  );
};

export default MenteeTabLayout;
