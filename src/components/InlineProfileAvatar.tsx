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
    <>
      {user.profilePictureUrl && <img src={user.profilePictureUrl} alt="" />}
      <Text>
        {user.firstName} {user.lastName}
      </Text>
    </>
  );
};

export default InlineProfileAvatar;
