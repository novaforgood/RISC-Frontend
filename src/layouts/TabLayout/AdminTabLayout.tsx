import { Home, Settings } from "../../components/icons";
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
      <Dropdown label="Mentors" id="dropdown1">
        <PageItem
          label="View Mentors"
          Icon={Settings}
          path={joinPath(basePath, "mentors")}
        />
      </Dropdown>
      <Separator />
    </TabLayout>
  );
};

export default AdminTabLayout;
