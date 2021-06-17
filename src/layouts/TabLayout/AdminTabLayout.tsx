import { Clipboard, Home, Settings, Smile } from "../../components/icons";
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
          Icon={Smile}
          path={joinPath(basePath, "mentors")}
        />
        <PageItem
          label="Mentor Applications"
          Icon={Clipboard}
          path={joinPath(basePath, "mentors", "applications")}
        />
        <PageItem
          label="Edit Mentor Application"
          Icon={Clipboard}
          path={joinPath(basePath, "mentors", "edit-application")}
        />
        <PageItem
          label="Edit Mentor Profile"
          Icon={Clipboard}
          path={joinPath(basePath, "mentors", "edit-profile")}
        />
      </Dropdown>
      <Separator />
      <Dropdown label="Mentees" id="admin-mentees">
        <PageItem
          label="View Mentees"
          Icon={Smile}
          path={joinPath(basePath, "mentees")}
        />
        <PageItem
          label="Mentee Applications"
          Icon={Clipboard}
          path={joinPath(basePath, "mentees", "applications")}
        />
        <PageItem
          label="Edit Mentee Application"
          Icon={Clipboard}
          path={joinPath(basePath, "mentees", "edit-application")}
        />
        <PageItem
          label="Edit Mentee Profile"
          Icon={Clipboard}
          path={joinPath(basePath, "mentees", "edit-profile")}
        />
      </Dropdown>
      <Separator />
    </TabLayout>
  );
};

export default AdminTabLayout;
