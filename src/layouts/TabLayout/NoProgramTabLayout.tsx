import Dropdown from "../../components/Dropdown";
import { Home } from "../../components/icons";
import TabLayout, { BaseTabLayoutProps } from "./TabLayout";

const { PageItem } = TabLayout;

// TODO: Make this actually fetch picture from db
const getProfileImagePath = (): string => {
  return "http://zultimate.com/wp-content/uploads/2019/12/default-profile.png";
};

const NoProgramTabLayout: React.FC<BaseTabLayoutProps> = ({ children }) => {
  const footer = (
    <>
      <Dropdown
        button={
          <img
            className="h-10 w-10 object-contain border border-inactive rounded-full"
            src={getProfileImagePath()}
          />
        }
      />
    </>
  );

  return (
    <TabLayout currentPageChildren={children} footerChildren={footer}>
      <PageItem label="Create a Mentorship" Icon={Home} path={"/create"} />
    </TabLayout>
  );
};

export default NoProgramTabLayout;
