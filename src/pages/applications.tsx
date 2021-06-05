import React, { useState } from "react";
import { Card, Text } from "../components/atomic";
import {
  ApplicationStatus,
  GetApplicationsQuery,
  useGetApplicationsQuery,
} from "../generated/graphql";

// Hardcoded values
const QUERY_PROGRAM_ID = "8e1a323d-fdba-4c8a-81bc-901de3d2b0a7";
const QUERY_PROFILE_TYPE = "mentor";

type ApplicationListItemProps = {
  application: GetApplicationsQuery["getApplications"][number];
};

const ApplicationListItem = ({ application }: ApplicationListItemProps) => {
  return (
    <div className="flex space-x-4">
      <input type="checkbox" />
      <Text>
        {application.profile.user.firstName} {application.profile.user.lastName}
      </Text>
      <div className="flex-1" />
      <Text>{application.createdAt}</Text>
      <div className="flex-1" />
      <Text>{application.applicationStatus}</Text>
    </div>
  );
};

type ApplicationListProps = {
  title: string;
  applications: GetApplicationsQuery["getApplications"];
};

const ApplicationList = ({ title, applications }: ApplicationListProps) => {
  return (
    <div className="flex flex-col px-4 py-4">
      <Text h2>{title}</Text>
      <input type="checkbox" />
      <div className="h-4" />
      {applications.map((x) => (
        <ApplicationListItem application={x} key={x.profile.profileId} />
      ))}
    </div>
  );
};

const ApplicationFilterer = () => {
  const filterOptions: {
    [key: string]: (
      applicationList: GetApplicationsQuery["getApplications"]
    ) => GetApplicationsQuery["getApplications"];
  } = {
    All: (x) => x,
    Pending: (x) =>
      x.filter((y) => y.applicationStatus === ApplicationStatus.Pending),
    Accepted: (x) =>
      x.filter((y) => y.applicationStatus === ApplicationStatus.Accepted),
    Rejected: (x) =>
      x.filter((y) => y.applicationStatus === ApplicationStatus.Rejected),
  };
  const [filterOption, setFilterOption] = useState("All");

  const { data } = useGetApplicationsQuery({
    variables: {
      programId: QUERY_PROGRAM_ID,
      profileType: QUERY_PROFILE_TYPE,
    },
  });

  const getFilterTab = (title: string) => {
    const selected = filterOption === title;
    return (
      <div key={title}>
        <button
          className="rounded-md focus:outline-none focus:ring-primary focus:ring-2"
          disabled={selected}
          onClick={() => setFilterOption(title)}
        >
          <Text b className={selected ? "text-primary" : "text-secondary"}>
            {title}
          </Text>
        </button>
        <div
          className={
            "h-1 w-full" +
            (selected ? "h-1 w-full bg-primary rounded-full" : "")
          }
        />
      </div>
    );
  };

  return (
    <>
      <div className="flex space-x-4">
        {Object.keys(filterOptions).map(getFilterTab)}
      </div>
      <div className="h-4" />
      <Card className="w-full h-5/6">
        {data && (
          <ApplicationList
            title={filterOption + " Applications"}
            applications={filterOptions[filterOption](data.getApplications)}
          />
        )}
      </Card>
    </>
  );
};

const ReviewApplicationsPage = () => {
  return (
    <div className="bg-tertiary h-screen">
      <div className="flex flex-col items-center w-5/6 mx-auto h-full">
        <div className="flex w-5/6 items-center">
          <Text h1 b>
            Applications
          </Text>
          <div className="flex-1" />
          <label className="space-x-4">
            <Text>Accepting Applications</Text>
            <input type="checkbox" />
          </label>
        </div>
        <div className="h-4" />
        <div className="w-4/5 flex-1">
          <ApplicationFilterer />
        </div>
      </div>
    </div>
  );
};

export default ReviewApplicationsPage;
