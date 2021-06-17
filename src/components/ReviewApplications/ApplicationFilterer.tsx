import { format } from "date-fns";
import React, { useState } from "react";
import { Modal, Text } from "../../components/atomic";
import {
  ApplicationStatus,
  ApplicationType,
  GetApplicationsQuery,
  refetchGetApplicationsQuery,
  useAcceptApplicationMutation,
  useGetApplicationsQuery,
  useRejectApplicationMutation,
} from "../../generated/graphql";
import { useCurrentProgram } from "../../hooks";
import { Question } from "../../types/Form";
import Form from "../Form";
import InlineProfileAvatar from "../InlineProfileAvatar";
import ListFilterer from "../ListFilterer";

type ApplicationPartial = GetApplicationsQuery["getApplications"][number];

function getApplicationSchemaFromJson(json: string): Question[] {
  try {
    return JSON.parse(json) as Question[];
  } catch (_) {
    return [];
  }
}

type DetailsModalButtonProps = {
  application: ApplicationPartial;
};

const DetailsModalButton = ({ application }: DetailsModalButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { currentProgram } = useCurrentProgram();

  if (!currentProgram) {
    return <></>;
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <Text u>Details</Text>
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="w-200">
          <div className="flex">
            <Text b h2>
              Application for{" "}
              {application.user.firstName + " " + application.user.lastName}
            </Text>
            <div className="flex-1" />
            <button onClick={() => setIsOpen(false)}>
              <Text u>close</Text>
            </button>
          </div>
          <Form
            questions={getApplicationSchemaFromJson(
              application.applicationType == ApplicationType.Mentor
                ? currentProgram.mentorApplicationSchemaJson
                : currentProgram.menteeApplicationSchemaJson
            )}
            readonly
            responses={JSON.parse(application.applicationJson)}
          ></Form>
        </div>
      </Modal>
    </>
  );
};

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
        return (
          <div className="flex space-x-4">
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
          </div>
        );
      case ApplicationStatus.Accepted:
        return <Text>Accepted</Text>;
      case ApplicationStatus.Rejected:
        return <Text>Rejected</Text>;
    }
  };

  return (
    <div className="flex space-x-4">
      <div className="w-40">{getStatusIcon(application)}</div>
      <InlineProfileAvatar user={application.user} />
      <div className="md:flex-1" />
      <Text className="hidden lg:inline">
        {format(new Date(application.createdAt), "MMM d, yyyy | h:mma")}
      </Text>
      <div className="flex-1" />
      <DetailsModalButton application={application} />
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
