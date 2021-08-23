import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Card, Text } from "../../components/atomic";
import CatchUnsavedChangesModal from "../../components/CatchUnsavedChangesModal";
import { BackArrow } from "../../components/icons";
import TitledInput from "../../components/TitledInput";
import UploadIconWithPreview from "../../components/UploadIconWithPreview";
import {
  refetchGetMyUserQuery,
  useGetMyUserQuery,
  useUpdateUserMutation,
  useUploadImageAndResizeMutation,
} from "../../generated/graphql";
import AuthorizationWrapper from "../../layouts/AuthorizationWrapper";
import { useSnackbar } from "../../notifications/SnackbarContext";
import Page from "../../types/Page";

const GeneralProfile: Page = () => {
  const { data } = useGetMyUserQuery();
  const [updateUser] = useUpdateUserMutation({
    refetchQueries: [refetchGetMyUserQuery()],
  });
  const [uploadImageAndResizeMutation] = useUploadImageAndResizeMutation();
  const [modified, setModified] = useState(false);
  const [firstName, setFirstName] = useState(data?.getMyUser.firstName);
  const [lastName, setLastName] = useState(data?.getMyUser.lastName);
  const [location, setLocation] = useState(data?.getMyUser.defaultLocation);
  const [videoChatLink, setVideoChatLink] = useState(
    data?.getMyUser.videoChatLink
  );
  const { setSnackbarMessage } = useSnackbar();

  const [profilePicture, setProfilePicture] = useState<File | null>();
  const [src, setSrc] = useState(data?.getMyUser.profilePictureUrl);
  const [error, setError] = useState<String | null>(null);
  const router = useRouter();

  useEffect(() => {
    //reset the data on data change
    if (data) {
      setModified(false);
      setFirstName(data.getMyUser.firstName);
      setLastName(data.getMyUser.lastName);
      setSrc(data.getMyUser.profilePictureUrl);
      setProfilePicture(null);
      setError(null);
    }
  }, [data?.getMyUser]);

  return (
    <div className="h-screen bg-tertiary flex flex-col items-center py-10 overflow-y-auto">
      <CatchUnsavedChangesModal unsavedChangesExist={modified === true} />

      <div className="w-3/4 grid grid-cols-10 gap-4">
        <button
          className="cursor-pointer w-max col-span-1"
          onClick={() => router.back()}
        >
          <BackArrow className="w-6" />
        </button>
        <div className="flex justify-between items-center col-span-9">
          <Text h2 b>
            General Profile
          </Text>
          <Button
            disabled={!modified}
            size="small"
            onClick={async () => {
              let url = data?.getMyUser.profilePictureUrl;
              if (profilePicture) {
                let imageUrl = await uploadImageAndResizeMutation({
                  variables: {
                    file: profilePicture,
                    resizeWidth: 256,
                    resizeHeight: 256,
                  },
                });
                if (imageUrl.data) {
                  url = imageUrl.data.uploadImage;
                }
              }
              updateUser({
                variables: {
                  data: {
                    firstName: firstName,
                    lastName: lastName,
                    profilePictureUrl: url,
                    defaultLocation: location,
                    videoChatLink: videoChatLink,
                  },
                },
              });
              setModified(false);
              setSnackbarMessage({ text: "Saved general profile!" });
            }}
          >
            Save
          </Button>
        </div>
        <div className="h-4" />
        {data?.getMyUser ? (
          <Card className="p-10 space-y-4 col-span-9">
            <Text className="text-error">{error}</Text>
            <div />
            <Text h3 b>
              Profile Picture
            </Text>
            <UploadIconWithPreview
              onFileChanged={(file) => {
                setProfilePicture(file);
                setModified(true);
              }}
              src={src || "/static/HappyBlobs.svg"}
              onSrcChange={setSrc}
            />
            <div className="h-4" />
            <Text h3 b>
              About You
            </Text>
            <div className="flex space-x-12">
              <TitledInput
                title="First Name"
                placeholder="First Name"
                value={firstName || ""}
                onChange={(e) => {
                  setModified(true);
                  setFirstName(e.target.value);
                }}
              />
              <TitledInput
                title="Last Name"
                placeholder="Last Name"
                value={lastName || ""}
                onChange={(e) => {
                  setModified(true);
                  setLastName(e.target.value);
                }}
              />
            </div>
            <div className="h-4" />
            <Text h3 b>
              Default Locations
            </Text>
            <TitledInput
              title="Default Location for In-Person Chats"
              placeholder="Office address, favorite coffee shop, etc."
              value={location}
              onChange={(e) => {
                setModified(true);
                setLocation(e.target.value);
              }}
            />
            <TitledInput
              title="Default Link for Online Chats"
              placeholder="Permanent Zoom link, Google Meets link, etc."
              value={videoChatLink}
              onChange={(e) => {
                setModified(true);
                setVideoChatLink(e.target.value);
              }}
            />
          </Card>
        ) : (
          <div>Loading</div>
        )}
      </div>
    </div>
  );
};

GeneralProfile.getLayout = (page) => (
  <AuthorizationWrapper>{page}</AuthorizationWrapper>
);

export default GeneralProfile;
