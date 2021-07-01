import React, { useState } from "react";
import { GetProfilesQuery } from "../generated/graphql";
import { Button, Card, Text } from "./atomic";
import ProfileModal from "./ProfileModal";

type Profile = GetProfilesQuery["getProfiles"][number];

interface ProfileCardProps {
  // TODO: Remove "any" and replace with proper fields
  profile: Profile;
}
const ProfileCard = ({ profile }: ProfileCardProps) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const tags = profile.profileTags.slice(0, 3).map((tag, index: number) => (
    <div className="rounded-md bg-tertiary m-1 p-1" key={index}>
      {tag.name}
    </div>
  ));
  const moreTag = (
    <div className="rounded-md border-primary border m-1 p-1">
      + {profile.profileTags.length - 3} more
    </div>
  );

  return (
    <Card className="flex flex-col p-6 place-items-center border-0">
      <div className="h-40 w-40 rounded-full bg-tertiary">
        <img src={profile.user.profilePictureUrl}></img>
      </div>
      <div className="h-4"></div>

      <Text b className="text-body-1 text-center">
        {profile.user.firstName} {profile.user.lastName}
      </Text>
      <div className="h-4"></div>
      <div className="flex flex-wrap justify-center">
        {tags}
        {profile.profileTags.length > 3 ? moreTag : <div></div>}
      </div>
      <div className="h-4"></div>
      <div className="h-24 w-full text-center break-words overflow-hidden overflow-ellipsis">
        {profile.bio}
      </div>
      <div className="h-4"></div>

      <Button
        onClick={() => {
          setProfileModalOpen(true);
        }}
      >
        View Profile
      </Button>

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => {
          setProfileModalOpen(false);
        }}
        profile={profile}
      />
    </Card>
  );
};

export default ProfileCard;
