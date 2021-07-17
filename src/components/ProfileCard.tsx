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
    <Card className="grid grid-rows-10 p-6 place-items-center border-0 gap-2">
      <ProfilePictureImg
        src={profile.user.profilePictureUrl}
        className="h-40 w-40 rounded-full object-cover bg-tertiary border border-inactive row-span-3"
      />

      <Text b className="text-body-1 text-center row-span-1">
        {profile.user.firstName} {profile.user.lastName}
      </Text>
      <div className="flex flex-wrap gap-2 justify-center row-span-2">
        {tags.length > 0 ? (
          tags
        ) : (
          <Text i className="text-secondary">
            No tags
          </Text>
        )}
        {profile.profileTags.length > 3 ? moreTag : <div></div>}
      </div>
      <div className="h-24 w-full text-center break-words overflow-hidden overflow-ellipsis row-span-3">
        {profile.bio}
      </div>

      <Button
        className="row-span-1"
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
