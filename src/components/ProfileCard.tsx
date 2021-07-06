import React, { useState } from "react";
import { GetProfilesQuery } from "../generated/graphql";
import { Button, Card, Tag, Text } from "./atomic";
import ProfileModal from "./ProfileModal";
import ProfilePictureImg from "./ProfilePictureImg";

type Profile = GetProfilesQuery["getProfiles"][number];

interface ProfileCardProps {
  // TODO: Remove "any" and replace with proper fields
  profile: Profile;
}
const ProfileCard = ({ profile }: ProfileCardProps) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const tags = profile.profileTags
    .slice(0, 3)
    .map((tag, index: number) => <Tag key={index}>{tag.name}</Tag>);
  const moreTag = (
    <Tag variant="outline">+ {profile.profileTags.length - 3} more</Tag>
  );

  return (
    <Card className="flex flex-col p-6 place-items-center border-0">
      <ProfilePictureImg
        src={profile.user.profilePictureUrl}
        className="h-40 w-40 rounded-full object-cover bg-tertiary border border-inactive"
      />
      <div className="h-4"></div>

      <Text b className="text-body-1 text-center">
        {profile.user.firstName} {profile.user.lastName}
      </Text>
      <div className="h-4"></div>
      <div className="flex flex-wrap gap-2 justify-center">
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
