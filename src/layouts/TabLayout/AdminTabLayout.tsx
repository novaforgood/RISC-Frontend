import { Clipboard, Home, Smile } from "../../components/icons";
import TabLayout, { BaseTabLayoutProps, joinPath } from "./TabLayout";

const { PageItem, Dropdown, Separator } = TabLayout;

const AdminTabLayout: React.FC<BaseTabLayoutProps> = ({
  children,
  basePath,
}) => {
  return (
    <TabLayout currentPageChildren={children}>
      <PageItem label="Homepage" Icon={Home} path={joinPath(basePath)} />
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
      </Dropdown>
      <Separator />
      <Dropdown label="Mentees" id="admin-mentees">
        <PageItem
          label="Mentee Applications"
          Icon={Clipboard}
          path={joinPath(basePath, "mentees", "applications")}
        />
      </Dropdown>
    </TabLayout>
  );
};

export default AdminTabLayout;
