import { useAuth } from "../utils/firebase/auth";
import { Text } from "./atomic";
import DropdownMenu from "./DropdownMenu";

// const { PageItem } = TabLayout;

// TODO: Make this actually fetch picture from db

const TabFooterMenu = () => {
  const { user } = useAuth();

  if (user == null) {
    return <div></div>;
  }

  const photoURL: string =
    user == null || user.photoURL == null || user.photoURL == ""
      ? "/static/DefaultProfilePicture.png"
      : user.photoURL;

  return (
    <div className="w-full absolute bottom-0 p-2 bg-white">
      <DropdownMenu
        button={
          <div className="inline-flex items-center">
            <img
              className="h-10 w-10 object-contain border border-inactive rounded-full"
              src={photoURL}
            />
            <Text className="ml-4">{user.displayName}</Text>
          </div>
        }
      />
    </div>
  );
};

export default TabFooterMenu;
