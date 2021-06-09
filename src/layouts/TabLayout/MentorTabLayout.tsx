import { Home } from "../../components/icons";
import TabLayout, { BaseTabLayoutProps } from "./TabLayout";

const { PageItem } = TabLayout;

const MentorTabLayout: React.FC<BaseTabLayoutProps> = ({ children }) => {
  return (
    <TabLayout currentPageChildren={children}>
      <PageItem label="Mentor tab layout" Icon={Home} path="" />
    </TabLayout>
  );
};

export default MentorTabLayout;
