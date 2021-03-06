import { format } from "date-fns";
import React, { useState } from "react";
import { Button, Modal, Text } from "../../components/atomic";
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
import { CircledCheck, CircledCross } from "../icons";
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

  const { currentProgram } = useCurrentProgram();

  if (!currentProgram) {
    return <></>;
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <Text u>View Application</Text>
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center">
            <Text b h2>
              Application for{" "}
              {application.user.firstName + " " + application.user.lastName}
            </Text>
            <div className="w-40 flex-1"></div>
            {application.applicationStatus === ApplicationStatus.Rejected && (
              <>
                <Text>Rejected by mistake? Accept</Text>
                <div className="w-2" />
                <button
                  onClick={() => {
                    acceptApplicationMutation();
                    setIsOpen(false);
                  }}
                >
                  <CircledCheck />
                </button>
              </>
            )}
          </div>
          <Form
            questions={getApplicationSchemaFromJson(
              application.applicationType == ApplicationType.Mentor
                ? currentProgram.mentorApplicationSchemaJson
                : currentProgram.menteeApplicationSchemaJson
            )}
            readonly
            responses={JSON.parse(application.applicationJson)}
            showDescriptions={false}
          ></Form>
          <div className="flex">
            <div className="flex-1"></div>
            <Button size={"small"} onClick={() => setIsOpen(false)}>
              close
            </Button>
          </div>
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
          <div className="flex justify-center">
            <button
              className="hover:bg-inactive p-1 rounded"
              title="Accept Application"
              onClick={() => {
                acceptApplicationMutation();
              }}
            >
              <CircledCheck className="h-8 w-8" />
            </button>
            <button
              className="hover:bg-inactive p-1 rounded"
              title="Reject Application"
              onClick={() => {
                rejectApplicationMutation();
              }}
            >
              <CircledCross className="h-8 w-8" />
            </button>
          </div>
        );
      case ApplicationStatus.Accepted:
        return <Text b>Accepted</Text>;
      case ApplicationStatus.Rejected:
        return <Text b>Rejected</Text>;
    }
  };

  return (
    <div className="flex md:grid md:grid-cols-5 items-center gap-4 p-2 hover:bg-tertiary duration-150 rounded">
      <div className="col-span-1 justify-start flex flex-shrink-0">
        {getStatusIcon(application)}
      </div>
      <div className="col-span-2 flex-shrink-0">
        <InlineProfileAvatar user={application.user} />
      </div>
      <Text className="hidden xl:inline col-span-1 flex-shrink-0">
        {format(new Date(application.createdAt), "MMM d, yyyy | h:mma")}
      </Text>
      <div className="col-span-1 flex-shrink-0">
        <DetailsModalButton application={application} />
      </div>
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
    <div className="flex flex-col px-2 md:px-8 py-6 overflow-x-scroll">
      <Text h3>{title}</Text>
      <div className="h-4"></div>
      {applications.length > 0 ? (
        applications.map((app) => (
          <ApplicationReviewListItem key={app.user.userId} application={app} />
        ))
      ) : (
        <Text>None</Text>
      )}
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
