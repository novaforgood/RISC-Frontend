import React from "react";
import { Profile, User } from "../generated/graphql";
import { Text } from "./atomic";

type ProfileWithUser = Pick<Profile, "profileId"> & {
  user: Pick<User, "firstName" | "lastName" | "profilePictureUrl">;
};

type InlineProfileAvatarProps<T extends ProfileWithUser> = {
  profile: T;
};

const InlineProfileAvatar = <T extends ProfileWithUser>({
  profile,
}: InlineProfileAvatarProps<T>) => {
  return (
    <>
      {profile.user.profilePictureUrl && (
        <img src={profile.user.profilePictureUrl} alt="" />
      )}
      <Text>
        {profile.user.firstName} {profile.user.lastName}
      </Text>
    </>
  );
};

export default InlineProfileAvatar;
