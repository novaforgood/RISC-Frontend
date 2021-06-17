import React from "react";
import {
  Text,
  TextArea,
  Button,
  Card,
  Input,
} from "../../../components/atomic";
import { ProfileType, useGetProfilesQuery } from "../../../generated/graphql";
import { useCurrentProgram } from "../../../hooks";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
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
  const { currentProgram } = useCurrentProgram();
  const { programId, name, description, slug } = currentProgram || {
    programId: "",
    name: "",
    description: "",
    iconUrl: "/static/DefaultLogo.svg",
    slug: "",
  };

  const { data, error } = useGetProfilesQuery({
    variables: {
      programId: programId,
      profileType: ProfileType.Mentor,
    },
  });
  console.log(programId);

  if (!currentProgram || error) return <div>Loading... </div>;

  return (
    <div className="bg-tertiary min-h-screen w-full">
      <div className="h-6" />
      <div className="w-3/4 mx-auto">
        <Text h1 b>
          Settings
        </Text>
      </div>
      <div className="h-4" />
      <Card className="w-3/4 h-3/4-screen m-auto flex flex-col p-8 space-y-4">
        <Text h3 b>
          Mentorship Details
        </Text>
        <div className="grid grid-cols-4 gap-4 justify-center items-center">
          <Text b secondary>
            Mentorship Name:
          </Text>
          <Input
            className="col-span-2 overflow-ellipsis"
            disabled
            readOnly
            value={name}
          />
          <button className="w-max">
            <img alt="EditIcon" src="/static/Edit.svg" />
          </button>
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
              console.log("clicked");
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
            defaultValue={description}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="inverted" size="small">
            Reset to Last Saved
          </Button>
          <Button size="small">Save</Button>
        </div>
        <Text h3 b>
          Mentorship Admins
        </Text>
        <div className="box-border h-40 grid grid-cols-2 gap-2 overflow-hidden overflow-y-auto">
          <AdminBox
            {...{
              userId: "uid",
              email: "email",
              firstName: "first",
              lastName: "last",
              profilePictureUrl: "/static/HappyBlobs.svg",
            }}
          />
          <AdminBox
            {...{
              userId: "uid",
              email: "email",
              firstName: "first",
              lastName: "last",
              profilePictureUrl: "/static/HappyBlobs.svg",
            }}
          />
          <AdminBox
            {...{
              userId: "uid",
              email: "email",
              firstName: "first",
              lastName: "last",
              profilePictureUrl: "/static/HappyBlobs.svg",
            }}
          />
          {data?.getProfiles.map((admin) => (
            <AdminBox key={admin.profileId} {...admin.user} />
          ))}
        </div>
        <Button size="small">+ add admin</Button>
      </Card>
    </div>
  );
};

SettingsPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default SettingsPage;
