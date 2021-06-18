import React, { ChangeEvent, Fragment, useState } from "react";
import {
  Button,
  Card,
  Input,
  Text,
  TextArea,
} from "../../../components/atomic";
import UploadIconWithPreview from "../../../components/UploadIconWithPreview";
import {
  ProfileType,
  useGetProfilesQuery,
  useUpdateProgramMutation,
} from "../../../generated/graphql";
import { useCurrentProgram } from "../../../hooks";
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
        src={user.profilePictureUrl || "/static/HappyBlobs.svg"}
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
  const [updateProgram] = useUpdateProgramMutation();
  const [mentorshipName, setMentorshipName] = useState(name);
  const [mentorshipDescription, setMentorshipDescription] =
    useState(description);
  const [modified, setModified] = useState(false);
  const [programLogo, setProgramLogo] = useState<File | null>();
  const [err, setError] = useState("");

  const { data, error } = useGetProfilesQuery({
    variables: {
      programId: programId,
      profileType: ProfileType.Mentor,
    },
  });

  if (!currentProgram || error) return <div>Loading... </div>;

  return (
    <Fragment>
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
            onErrorOccured={setError}
            initialSrc={iconUrl}
          />
          <div />
          <div />
          <Text b secondary>
            Mentorship Name:
          </Text>
          <Input
            id="mentorship-name"
            className="col-span-2 overflow-ellipsis"
            value={mentorshipName}
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
            className="col-span-2 overflow-ellipsis"
            disabled
            readOnly
            value={`${window.location.host}/program/${slug}`}
          />
          <Button
            onClick={() => {
              const link = document.getElementById(
                "mentorship-link"
              ) as HTMLInputElement;

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
            value={mentorshipDescription}
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
            onClick={() => {
              //TODO: REMOVE THIS AND ACTUALLY UPDATE PROGRAM LOGO
              console.log(programLogo);
              updateProgram({
                variables: {
                  programId,
                  data: {
                    name: mentorshipName,
                    description: mentorshipDescription,
                  },
                },
              }).then(() => {
                refetchCurrentProgram();
                setModified(false);
              });
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
  <ChooseTabLayout {...pageProps}>
    <PageContainer>{page}</PageContainer>
  </ChooseTabLayout>
);

export default SettingsPage;
