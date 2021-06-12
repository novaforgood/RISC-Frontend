import { unix } from "moment";
import React from "react";
import { Text } from "../components/atomic";
import InlineProfileAvatar from "../components/InlineProfileAvatar";
import ListFilterer from "../components/ListFilterer";
import {
  ApplicationStatus,
  ApplicationType,
  GetApplicationsQuery,
  useGetApplicationsQuery,
} from "../generated/graphql";

// Hardcoded values
const QUERY_PROGRAM_ID = "0fe10c0f-3367-4b9e-9e8d-7a1f54d8f3d9";
const QUERY_APPLICATION_TYPE = ApplicationType.Mentor;

type ApplicationPartial = GetApplicationsQuery["getApplications"][number];

type ApplicationReviewListItem = {
  application: ApplicationPartial;
};

const ApplicationReviewListItem = ({
  application,
}: ApplicationReviewListItem) => {
  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PendingReview:
        return <Text i>Pending</Text>;
      case ApplicationStatus.Accepted:
        return <Text>Accepted</Text>;
      case ApplicationStatus.Rejected:
        return <Text>Rejected</Text>;
    }
  };

  return (
    <div className="flex space-x-4">
      <input type="checkbox" />
      <div className="w-8" />
      <InlineProfileAvatar user={application.user} />
      <div className="md:flex-1" />
      <Text className="hidden lg:inline">
        {unix(application.createdAt / 1000).format("MMM D, YYYY | h:mma")}
      </Text>
      <div className="flex-1" />
      {getStatusIcon(application.applicationStatus)}
      <div className="md:w-8 lg:w-12" />
    </div>
  );
};

type ApplicationReviewListProps = {
  title: string;
  applications: ApplicationPartial[];
};

const ApplicationReviewList = ({
  title,
  applications,
}: ApplicationReviewListProps) => {
  return (
    <div className="flex flex-col px-8 py-6">
      <Text h2>{title}</Text>
      <div className="h-4" />
      {applications.map((app) => (
        <ApplicationReviewListItem key={app.user.userId} application={app} />
      ))}
    </div>
  );
};

const ApplicationFilterer = () => {
  const { data } = useGetApplicationsQuery({
    variables: {
      programId: QUERY_PROGRAM_ID,
      applicationType: QUERY_APPLICATION_TYPE,
    },
  });

  const filterOptions: {
    [key: string]: (
      applicationList: ApplicationPartial[]
    ) => ApplicationPartial[];
  } = {
    All: (x) => x,
    Pending: (x) =>
      x.filter((y) => y.applicationStatus === ApplicationStatus.PendingReview),
    Accepted: (x) =>
      x.filter((y) => y.applicationStatus === ApplicationStatus.Accepted),
    Rejected: (x) =>
      x.filter((y) => y.applicationStatus === ApplicationStatus.Rejected),
  };

  return (
    <ListFilterer
      listToFilter={data ? data.getApplications : []}
      filterOptions={filterOptions}
      defaultFilterOption={"All"}
      listComponent={(filterOption, filteredList) => (
        <ApplicationReviewList
          title={`${filterOption} Applications`}
          applications={filteredList}
        />
      )}
    />
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
