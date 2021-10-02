import { useGetMyUserQuery } from "../generated/graphql";
import { Text } from "./atomic";
import DropdownMenu from "./DropdownMenu";
import ProfilePictureImg from "./ProfilePictureImg";

// const { PageItem } = TabLayout;

// TODO: Make this actually fetch picture from db

const TabFooterMenu = () => {
  const { data } = useGetMyUserQuery();

  if (data == null) {
    return <div></div>;
  }

  const myData = data.getMyUser;

  return (
    <div className="w-full p-2 bg-white flex-shrink-0 border-t border-tertiary">
      <DropdownMenu
        button={
          <div className="inline-flex items-center">
            <ProfilePictureImg
              className="h-10 w-10 object-contain border border-inactive rounded-full"
              src={myData.profilePictureUrl}
            />

            <Text className="ml-4">
              {myData.firstName} {myData.lastName}
            </Text>
          </div>
        }
      />
    </div>
  );
};

export default TabFooterMenu;
