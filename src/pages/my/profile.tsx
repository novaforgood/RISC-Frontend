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

  const [profilePicture, setProfilePicture] = useState<File | null>();
  const [src, setSrc] = useState(data?.getMyUser.profilePictureUrl);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    reset();
  }, [data?.getMyUser]);

  const reset = () => {
    if (data) {
      setModified(false);
      setFirstName(data.getMyUser.firstName);
      setLastName(data.getMyUser.lastName);
      setSrc(data.getMyUser.profilePictureUrl);
      setProfilePicture(null);
      setError("");
    }
  };

  return (
    <div className="h-screen bg-tertiary flex flex-col items-center py-10 overflow-y-auto">
      <CatchUnsavedChangesModal unsavedChangesExist={modified === true} />

      <div className="w-3/4">
        <button
          className="cursor-pointer h-max w-max"
          onClick={() => router.back()}
        >
          <BackArrow />
        </button>
        <div className="flex justify-between items-center">
          <Text h1 b>
            General Profile
          </Text>
          <div className="flex">
            <Button
              disabled={!modified}
              size="small"
              variant="inverted"
              onClick={reset}
            >
              Reset
            </Button>
            <div className="w-4" />
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
                    },
                  },
                });
                setModified(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="h-4" />
        {data?.getMyUser ? (
          <Card className="p-10 space-y-4">
            <Text h3 b>
              Profile Picture
            </Text>
            <UploadIconWithPreview
              onFileChanged={(file) => {
                setProfilePicture(file);
                setModified(true);
              }}
              src={src || data.getMyUser.profilePictureUrl}
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
            <Text className="text-error">{error}</Text>
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
