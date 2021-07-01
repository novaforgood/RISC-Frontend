import {
  Clipboard,
  Edit,
  Home,
  Settings,
  User,
  Users,
} from "../../components/icons";
import TabLayout, { BaseTabLayoutProps, joinPath } from "./TabLayout";

const { PageItem, Dropdown, Separator } = TabLayout;

const AdminTabLayout: React.FC<BaseTabLayoutProps> = ({
  children,
  basePath,
}) => {
  return (
    <TabLayout currentPageChildren={children}>
      <PageItem label="Homepage" Icon={Home} path={joinPath(basePath)} />
      <PageItem
        label="Settings"
        Icon={Settings}
        path={joinPath(basePath, "settings")}
      />
      <Separator />
      <Dropdown label="Mentors" id="admin-mentors">
        <PageItem
          label="View Mentors"
          Icon={Users}
          path={joinPath(basePath, "mentors")}
        />
        <PageItem
          label="Edit Mentor Profile"
          Icon={User}
          path={joinPath(basePath, "mentors", "edit-profile")}
        />
        <PageItem
          label="Mentor Applications"
          Icon={Clipboard}
          path={joinPath(basePath, "mentors", "applications")}
        />
        <PageItem
          label="Edit Mentor Application"
          Icon={Edit}
          path={joinPath(basePath, "mentors", "edit-application")}
        />
      </Dropdown>
      <Separator />
      <Dropdown label="Mentees" id="admin-mentees">
        <PageItem
          label="View Mentees"
          Icon={Users}
          path={joinPath(basePath, "mentees")}
        />
        <PageItem
          label="Edit Mentee Profile"
          Icon={User}
          path={joinPath(basePath, "mentees", "edit-profile")}
        />
        <PageItem
          label="Mentee Applications"
          Icon={Clipboard}
          path={joinPath(basePath, "mentees", "applications")}
        />
        <PageItem
          label="Edit Mentee Application"
          Icon={Edit}
          path={joinPath(basePath, "mentees", "edit-application")}
        />
      </Dropdown>
      <Separator />
    </TabLayout>
  );
};

export default AdminTabLayout;
