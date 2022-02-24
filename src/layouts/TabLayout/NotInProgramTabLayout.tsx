import { Home, Users } from "../../components/icons";
import { useCurrentProgram } from "../../hooks";
import TabLayout, { BaseTabLayoutProps, joinPath } from "./TabLayout";

const { PageItem } = TabLayout;

const NotInProgramTabLayout: React.FC<BaseTabLayoutProps> = ({
  children,
  basePath,
}) => {
  const { currentProgram } = useCurrentProgram();
  const { public: programIsPublic } = currentProgram || {
    public: false,
  };

  return (
    <TabLayout currentPageChildren={children}>
      <PageItem label="Homepage" Icon={Home} path={joinPath(basePath)} />
      {programIsPublic ? (
        <PageItem
          label="All Mentors"
          Icon={Users}
          path={joinPath(basePath, "mentors")}
        />
      ) : (
        <></>
      )}
    </TabLayout>
  );
};

export default NotInProgramTabLayout;
