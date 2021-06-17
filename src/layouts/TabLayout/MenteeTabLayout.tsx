import { Smile } from "../../components/icons";
import TabLayout, { BaseTabLayoutProps, joinPath } from "./TabLayout";

const { PageItem } = TabLayout;

const MenteeTabLayout: React.FC<BaseTabLayoutProps> = ({
  children,
  basePath,
}) => {
  return (
    <TabLayout currentPageChildren={children}>
      <PageItem
        label="View Mentors"
        Icon={Smile}
        path={joinPath(basePath, "mentors")}
      />
    </TabLayout>
  );
};

export default MenteeTabLayout;
