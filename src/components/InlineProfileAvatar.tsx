import React from "react";
import { User } from "../generated/graphql";
import { Text } from "./atomic";

type UserPartial = Pick<User, "firstName" | "lastName" | "profilePictureUrl">;

type InlineProfileAvatarProps<T extends UserPartial> = {
  user: T;
};

const InlineProfileAvatar = <T extends UserPartial>({
  user,
}: InlineProfileAvatarProps<T>) => {
  return (
    <div className="flex items-center">
      <div className="h-10 w-10 rounded-full object-cover bg-tertiary border border-inactive">
        <img
          className="h-full w-full rounded-full"
          src={user.profilePictureUrl}
        ></img>
      </div>
      <div className="w-4"></div>
      <Text>
        {user.firstName} {user.lastName}
      </Text>
    </div>
  );
};

export default InlineProfileAvatar;
