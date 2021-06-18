import dateFormat from "dateformat";
import router from "next/router";
import { Card, Text } from "../../components/atomic";
import { BackArrow, CircledCheckSolid } from "../../components/icons";
import {
  ApplicationStatus,
  useGetMyUserApplicationsQuery,
} from "../../generated/graphql";
import Page from "../../types/Page";

const ApplicationsViewer: Page = () => {
  const applications =
    useGetMyUserApplicationsQuery().data?.getMyUser.applications;

  return (
    <div className=" min-w-screen h-screen bg-tertiary">
      <div></div>
      <div className="max-w-4xl mx-auto p-10">
        {/* TODO: My Applications text should be aligned with the Card below it */}
        <button
          className="focus:border-0"
          onClick={() => {
            router.back();
          }}
        >
          <BackArrow className="h-10 w-10 inline hover:cursor-pointer" />
        </button>
        <Text h2 b className="inline">
          My Applications
        </Text>
        <Card className="flex-shrink mt-10 p-8">
          <Text h3>My Applications</Text>
          {applications == null ? (
            <>
              <br />
              <Text>No active applications</Text>
            </>
          ) : (
            applications.map((app, i) => {
              const status = () => {
                switch (app.applicationStatus) {
                  case ApplicationStatus.Accepted:
                    return <CircledCheckSolid />;
                  case ApplicationStatus.Rejected:
                    return "Rejected";
                  case ApplicationStatus.PendingReview:
                    return "Submitted";
                }
              };

              return (
                <div className="flex mt-4" key={i}>
                  {/* TODO: Need to fetch profile */}
                  <div className="flex-1">{app.program.name}</div>
                  <div className="flex-1 text-center">
                    {dateFormat(app.createdAt, "mmm d, yyyy | h:MMtt")}
                  </div>
                  <div className="flex-1 flex justify-center">{status()}</div>
                </div>
              );
            })
          )}
        </Card>
      </div>
    </div>
  );
};

export default ApplicationsViewer;
