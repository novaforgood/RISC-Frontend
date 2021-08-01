import { Calendar, Home, Smile, User, Users } from "../../components/icons";
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
        label="View Mentors"
        Icon={Users}
        path={joinPath(basePath, "mentors")}
      />
      <PageItem
        label="My Availabilities"
        Icon={Calendar}
        path={joinPath(basePath, "availabilities")}
      />
      <PageItem
        label="Chat Requests"
        Icon={Smile}
        path={joinPath(basePath, "chat-requests")}
      />
      <PageItem
        label="Edit My Profile"
        Icon={User}
        path={joinPath(basePath, "edit-profile")}
      />
    </TabLayout>
  );
};

export default MentorTabLayout;
