import { Home } from "../../components/icons";
import TabLayout, { BaseTabLayoutProps } from "./TabLayout";

const { PageItem } = TabLayout;

const MenteeTabLayout: React.FC<BaseTabLayoutProps> = ({ children }) => {
  return (
    <TabLayout currentPageChildren={children}>
      <PageItem label="Mentee tab layout" Icon={Home} path="/" />
    </TabLayout>
  );
};

export default MenteeTabLayout;
