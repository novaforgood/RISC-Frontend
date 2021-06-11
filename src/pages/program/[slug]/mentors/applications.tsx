import React, { Fragment } from "react";
import { Button } from "../../../../components/atomic";
import {
  ApplicationType,
  useAcceptApplicationMutation,
  useGetApplicationsQuery,
  useRejectApplicationMutation,
} from "../../../../generated/graphql";
import { useCurrentProgram } from "../../../../hooks";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import Page from "../../../../types/Page";
import { useAuth } from "../../../../utils/firebase/auth";

const MentorApplicationsPage: Page = (_) => {
  const { loading, user } = useAuth();
  const { currentProgram } = useCurrentProgram();
  const [acceptApplication] = useAcceptApplicationMutation();
  const [rejectApplication] = useRejectApplicationMutation();
  const { data } = useGetApplicationsQuery({
    skip: !user || !currentProgram,
    variables: {
      programId: currentProgram?.programId!,
      applicationType: ApplicationType.Mentor,
    },
  });
  const applications = data?.getApplications;

  if (loading) return <Fragment />;

  return (
    <div>
      {applications?.map((application) => {
        return (
          <div>
            <div>App JSON</div>
            <div>{application.applicationJson}</div>
            <div>STATUS: {application.applicationStatus}</div>
            <div className="flex">
              <Button
                size="small"
                onClick={() => {
                  if (!user) return;

                  // TODO: Either update client-side UI to show "accepted"
                  //       or add a subscriber / poller to update UI.
                  acceptApplication({
                    variables: { applicationId: application.applicationId },
                  });
                }}
              >
                Accept
              </Button>
              <Button
                size="small"
                onClick={() => {
                  if (!user) return;

                  // TODO: Either update client-side UI to show "rejected"
                  //       or add a subscriber / poller to update UI.
                  rejectApplication({
                    variables: { applicationId: application.applicationId },
                  });
                }}
              >
                Reject
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

MentorApplicationsPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default MentorApplicationsPage;
