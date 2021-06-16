import router from "next/router";
import React from "react";
import {
  Text,
  TextArea,
  Button,
  Card,
  Input,
} from "../../../components/atomic";
import { User } from "../../../generated/graphql";
import { useCurrentProgram } from "../../../hooks";
import ChooseTabLayout from "../../../layouts/ChooseTabLayout";
import Page from "../../../types/Page";
import { parseParam } from "../../../utils";

const AdminBox = (user: User) => {
  return (
    <div className="rounded-md w-1/2 flex justify-center">
      <img
        src={user.profilePictureUrl}
        alt={`Picture of ${user.firstName} ${user.lastName}`}
      />
      <Text>
        {user.firstName} {user.lastName}
      </Text>
      <button className="hover:bg-inactive h-max w-max self-end">
        <img src="/static/DeleteIcon.svg" />
      </button>
    </div>
  );
};

const SettingsPage: Page = () => {
  const { currentProgram } = useCurrentProgram();
  const { name, description } = currentProgram;
  const { data } = getProfilesByProgramIdAndProfileType();
  const slug = parseParam(router.query?.slug);

  return (
    <div className="bg-tertiary min-h-screen w-full">
      <div className="h-4" />
      <div className="w-3/4 mx-auto">
        <Text h1 b>
          Settings
        </Text>
      </div>
      <div className="h-4" />
      <Card className="w-3/4 h-3/4 m-auto flex flex-col p-8 space-y-6">
        <Text h2 b>
          Mentorship Information
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
          <button>
            <img alt="EditIcon" src="/static/Edit.svg" />
          </button>
          <Text b secondary>
            Mentorship Link:
          </Text>
          <Input
            className="col-span-2 overflow-ellipsis"
            disabled
            readOnly
            value={`${window.location}/program/${slug}`}
          />
          <Button size="small">copy</Button>
        </div>
        <div className="w-full">
          <Text b secondary>
            Mentorship Description:
          </Text>
          <div className="h-4" />
          <TextArea
            className="resize-none w-full h-36"
            defaultValue={description}
          />
        </div>
        <Text h1 b>
          Mentorship Admins
        </Text>
        <div className="grid grid-col-2">{/* Get Admins Query */}</div>
        <Button size="small">+ add admin</Button>
      </Card>
    </div>
  );
};

SettingsPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default SettingsPage;
