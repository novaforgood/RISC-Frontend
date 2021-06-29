import React, { useState } from "react";
import { Button, Card, Text } from "../components/atomic";
import {
  useGetMyUserQuery,
  useUpdateUserMutation,
  useUploadImageAndResizeMutation,
} from "../generated/graphql";
import UploadIconWithPreview from "../components/UploadIconWithPreview";
import TitledInput from "../components/TitledInput";

const GeneralProfile = () => {
  const { data } = useGetMyUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const [uploadImageAndResize] = useUploadImageAndResizeMutation();
  const [modified, setModified] = useState(false);
  const [firstName, setFirstName] = useState(data?.getMyUser.firstName);
  const [lastName, setLastName] = useState(data?.getMyUser.lastName);
  const [initialSrc, setInitialSrc] = useState(
    data?.getMyUser.profilePictureUrl
  );
  const [profilePicture, setProfilePicture] = useState<File | null>();
  const [error, setError] = useState("");
  // const pictureRef = useRef()

  if (!data) return <div>Loading...</div>;

  const reset = () => {
    setModified(false);
    setFirstName(data.getMyUser.firstName);
    setLastName(data.getMyUser.lastName);
    setInitialSrc(data.getMyUser.profilePictureUrl);
    setError("");
  };

  return (
    <div className="h-screen bg-tertiary flex flex-col items-center py-10 overflow-y-auto">
      <div className="w-3/4">
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
                let url = data.getMyUser.profilePictureUrl;
                if (profilePicture) {
                  let response = await uploadImageAndResize({
                    variables: {
                      file: profilePicture,
                      resizeWidth: 256,
                      resizeHeight: 256,
                    },
                  }).catch((err) => setError(err));
                  if (response.data) {
                    url = response.data.uploadImage;
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
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="h-4" />
        <Card className="p-10 space-y-4">
          <Text h3 b>
            Profile Picture
          </Text>
          <UploadIconWithPreview
            onFileChanged={(file) => {
              setProfilePicture(file);
              setInitialSrc("");
              setModified(true);
            }}
            onErrorOccured={setError}
            initialSrc={initialSrc}
          />
          <div className="h-4" />
          <Text h3 b>
            About You
          </Text>
          <div className="flex space-x-12">
            <TitledInput
              title="First Name"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TitledInput
              title="Last Name"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <Text className="text-error">{error}</Text>
        </Card>
      </div>
    </div>
  );
};

export default GeneralProfile;
