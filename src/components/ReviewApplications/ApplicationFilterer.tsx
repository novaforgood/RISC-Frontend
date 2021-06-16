import { format } from "date-fns";
import React from "react";
import { Text } from "../../components/atomic";
import {
  ApplicationStatus,
  ApplicationType,
  GetApplicationsQuery,
  refetchGetApplicationsQuery,
  useAcceptApplicationMutation,
  useGetApplicationsQuery,
  useRejectApplicationMutation,
} from "../../generated/graphql";
import InlineProfileAvatar from "../InlineProfileAvatar";
import ListFilterer from "../ListFilterer";

type ApplicationPartial = GetApplicationsQuery["getApplications"][number];

type ApplicationReviewListItem = {
  application: ApplicationPartial;
};

const ApplicationReviewListItem = ({
  application,
}: ApplicationReviewListItem) => {
  const [acceptApplicationMutation] = useAcceptApplicationMutation({
    variables: {
      applicationId: application.applicationId,
    },
    refetchQueries: [
      refetchGetApplicationsQuery({
        programId: application.programId,
        applicationType: application.applicationType,
      }),
    ],
  });

  const [rejectApplicationMutation] = useRejectApplicationMutation({
    variables: {
      applicationId: application.applicationId,
    },
    refetchQueries: [
      refetchGetApplicationsQuery({
        programId: application.programId,
        applicationType: application.applicationType,
      }),
    ],
  });

  const getStatusIcon = (app: ApplicationPartial) => {
    switch (app.applicationStatus) {
      case ApplicationStatus.PendingReview:
        // return <Text i>Pending</Text>;
        return (
          <>
            <button
              onClick={() => {
                acceptApplicationMutation();
              }}
            >
              accept
            </button>
            <button
              onClick={() => {
                rejectApplicationMutation();
              }}
            >
              reject
            </button>
          </>
        );
      case ApplicationStatus.Accepted:
        return <Text>Accepted</Text>;
      case ApplicationStatus.Rejected:
        return <Text>Rejected</Text>;
    }
  };

  return (
    <div className="flex space-x-4">
      <div className="w-8" />
      <InlineProfileAvatar user={application.user} />
      <div className="md:flex-1" />
      <Text className="hidden lg:inline">
        {format(new Date(application.createdAt), "MMM d, yyyy | h:mma")}
      </Text>
      <div className="flex-1" />
      {getStatusIcon(application)}
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
    <div className="flex flex-col px-8 py-6 space-y-4">
      <Text h2>{title}</Text>
      {applications.map((app) => (
        <ApplicationReviewListItem key={app.user.userId} application={app} />
      ))}
    </div>
  );
};

type ApplicationFiltererProps = {
  programId: string;
  applicationType: ApplicationType;
};

export const ApplicationFilterer = ({
  programId,
  applicationType,
}: ApplicationFiltererProps) => {
  const { data } = useGetApplicationsQuery({
    variables: {
      programId,
      applicationType,
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
