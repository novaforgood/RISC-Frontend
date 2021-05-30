import TabLayout from "./TabLayout";
import {
  Home,
  Clipboard,
  Settings,
  Smile,
  Users,
} from "../../components/icons";

const AdminTabLayout: React.FC = ({ children }) => {
  return (
    <TabLayout currentPageChildren={children}>
      <TabLayout.PageItem
        label="Homepage"
        Icon={Home}
        path="/test/testtablayout"
      />
      <TabLayout.Separator />
      <TabLayout.Dropdown label="Dropdown 1">
        <TabLayout.PageItem
          label="Subpage 1"
          Icon={Settings}
          path="/test/testtablayout/subpage1"
        />
        <TabLayout.PageItem
          label="Subpage 2"
          Icon={Clipboard}
          path="/test/testtablayout/subpage2"
        />
      </TabLayout.Dropdown>
      <TabLayout.Separator />
      <TabLayout.Dropdown label="Dropdown 2">
        <TabLayout.PageItem
          label="Subpage 3"
          Icon={Smile}
          path="/test/testtablayout/subpage3"
        />
        <TabLayout.PageItem
          label="Subpage 4"
          Icon={Users}
          path="/test/testtablayout/subpage4"
        />
      </TabLayout.Dropdown>
    </TabLayout>
  );
};

export default AdminTabLayout;
