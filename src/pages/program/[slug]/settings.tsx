import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  Text,
  TextArea,
} from "../../../components/atomic";
import CatchUnsavedChangesModal from "../../../components/CatchUnsavedChangesModal";
import UploadIconWithPreview from "../../../components/UploadIconWithPreview";
import {
  ProfileType,
  refetchGetMyUserQuery,
  useGetProfilesQuery,
  useUpdateProgramMutation,
  useUploadImageAndResizeMutation,
} from "../../../generated/graphql";
import { AuthorizationLevel, useCurrentProgram } from "../../../hooks";
import AuthorizationWrapper from "../../../layouts/AuthorizationWrapper";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import PageContainer from "../../../layouts/PageContainer";
import Page from "../../../types/Page";

type User = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
};
const AdminBox = (user: User) => {
  return (
    <div className="box-border border-1.5 border-inactive rounded-md w-full flex items-center justify-start p-3">
      <img
        className="w-8 h-8 rounded-full"
        src={user.profilePictureUrl}
        alt={`Picture of ${user.firstName} ${user.lastName}`}
      />
      <div className="w-4" />
      <Text className="w-1/2" b>
        {user.firstName} {user.lastName}
      </Text>
      <div className="flex-grow flex items-center justify-end">
        <button className="hover:bg-tertiary rounded-sm w-6 h-6 flex items-center justify-center">
          <img
            className="w-4 h-4"
            alt={`Remove admin ${user.firstName} ${user.lastName}`}
            src="/static/DeleteIcon.svg"
          />
        </button>
      </div>
    </div>
  );
};

const SettingsPage: Page = () => {
  const { currentProgram, refetchCurrentProgram } = useCurrentProgram();
  const { programId, name, description, iconUrl, slug } = currentProgram || {
    programId: "",
    name: "",
    description: "",
    iconUrl: "/static/DefaultLogo.svg",
    slug: "",
  };

  //TODO: Image Upload and Resize => URL save
  const [uploadImageAndResizeMutation] = useUploadImageAndResizeMutation();
  const [updateProgram] = useUpdateProgramMutation({
    refetchQueries: [refetchGetMyUserQuery()],
  });
  const [mentorshipName, setMentorshipName] = useState(name);
  const [mentorshipDescription, setMentorshipDescription] =
    useState(description);
  const [modified, setModified] = useState(false);
  const [programLogo, setProgramLogo] = useState<File | null>();
  const [programLogoURL, setProgramLogoURL] = useState(iconUrl);
  const [err, setError] = useState("");

  const { data, error } = useGetProfilesQuery({
    variables: {
      programId: programId,
      profileType: ProfileType.Admin,
    },
  });

  useEffect(() => {
    setMentorshipName(name);
    setMentorshipDescription(description);
  }, []);

  if (!currentProgram || error) return <Fragment />;

  return (
    <Fragment>
      <CatchUnsavedChangesModal unsavedChangesExist={modified === true} />
      <Text h2 b>
        Settings
      </Text>
      <Card className="flex flex-col p-12 space-y-6 overflow-y-auto">
        <Text h3 b>
          Mentorship Details
        </Text>
        <Text className="text-error">{err}</Text>

        <div className="grid grid-cols-4 gap-4 justify-center items-center">
          <Text className="col-span-1" b secondary>
            Mentorship Icon:
          </Text>
          <UploadIconWithPreview
            onFileChanged={(file) => {
              setProgramLogo(file);
              setModified(true);
            }}
            src={programLogoURL}
            onSrcChange={setProgramLogoURL}
          />
          <div />
          <div />
          <Text b secondary>
            Mentorship Name:
          </Text>
          <Input
            id="mentorship-name"
            className="col-span-2 overflow-ellipsis"
            placeholder="Organization Name"
            value={mentorshipName || name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setMentorshipName(e.target.value);
              setModified(true);
            }}
          />
          <div></div>
          <Text b secondary>
            Mentorship Link:
          </Text>
          <Input
            id="mentorship-link"
            type="text"
            className="col-span-2"
            disabled
            readOnly
            value={`${window.location.host}/program/${slug}`}
          />
          <Button
            onClick={() => {
              const link = document.getElementById(
                "mentorship-link"
              ) as HTMLInputElement;

              //TODO: ExecCommand has been deprecated although copy command is still supported on most browsers
              link.focus();
              link.disabled = false;
              link.select();
              link.disabled = true;
              document.execCommand("copy");
              document.getSelection()?.removeAllRanges();
            }}
            size="small"
          >
            copy
          </Button>
        </div>
        <div className="w-full">
          <Text b secondary>
            Mentorship Description:
          </Text>
          <div className="h-4" />
          <TextArea
            className="resize-none w-full h-32"
            placeholder="Organization Description"
            value={mentorshipDescription || description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setMentorshipDescription(e.target.value);
              setModified(true);
            }}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            disabled={!modified}
            onClick={() => {
              setMentorshipName(name);
              setMentorshipDescription(description);
            }}
            variant="inverted"
            size="small"
          >
            Reset to Last Saved
          </Button>
          <Button
            onClick={async () => {
              let newIconUrl = iconUrl;
              if (programLogo) {
                let imageUrl = await uploadImageAndResizeMutation({
                  variables: {
                    file: programLogo,
                    resizeWidth: 256,
                    resizeHeight: 256,
                  },
                });
                if (imageUrl.data) {
                  newIconUrl = imageUrl.data.uploadImage;
                }
              }
              updateProgram({
                variables: {
                  programId,
                  data: {
                    iconUrl: newIconUrl,
                    name: mentorshipName,
                    description: mentorshipDescription,
                  },
                },
              })
                .then(() => {
                  refetchCurrentProgram();
                  setModified(false);
                })
                .catch((err) => setError(err));
            }}
            disabled={!modified}
            size="small"
          >
            Save
          </Button>
        </div>
        <Text h3 b>
          Mentorship Admins
        </Text>
        <div className="box-border grid grid-cols-2 gap-2">
          {data?.getProfiles.map((admin) => (
            <AdminBox key={admin.profileId} {...admin.user} />
          ))}
        </div>
        <Button disabled size="small">
          + add admin
        </Button>
      </Card>
    </Fragment>
  );
};

SettingsPage.getLayout = (page, pageProps) => (
  <AuthorizationWrapper canView={[AuthorizationLevel.Admin]}>
    <ChooseTabLayout {...pageProps}>
      <PageContainer>{page}</PageContainer>
    </ChooseTabLayout>
  </AuthorizationWrapper>
);

export default SettingsPage;
