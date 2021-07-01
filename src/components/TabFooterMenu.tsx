import { useGetMyUserQuery } from "../generated/graphql";
import { Text } from "./atomic";
import DropdownMenu from "./DropdownMenu";

// const { PageItem } = TabLayout;

// TODO: Make this actually fetch picture from db

const TabFooterMenu = () => {
  const { data } = useGetMyUserQuery();

  if (data == null) {
    return <div></div>;
  }

  const myData = data.getMyUser;

  const profilePictureUrl: string =
    myData.profilePictureUrl == null || myData.profilePictureUrl == ""
      ? "/static/HappyBlobs.svg"
      : myData.profilePictureUrl;

  return (
    <div className="w-full absolute bottom-0 p-2 bg-white">
      <DropdownMenu
        button={
          <div className="inline-flex items-center">
            <img
              className="h-10 w-10 object-contain border border-inactive rounded-full"
              src={profilePictureUrl}
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
