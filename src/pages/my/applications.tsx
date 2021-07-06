import dateFormat from "dateformat";
import router from "next/router";
import { Card, Text } from "../../components/atomic";
import { BackArrow, CircledCheckSolid } from "../../components/icons";
import {
  ApplicationStatus,
  useGetMyUserApplicationsQuery,
} from "../../generated/graphql";
import AuthorizationWrapper from "../../layouts/AuthorizationWrapper";
import Page from "../../types/Page";

const ApplicationsViewer: Page = () => {
  const applications =
    useGetMyUserApplicationsQuery().data?.getMyUser.applications;

  return (
    <div className="h-screen bg-tertiary flex flex-col items-center py-10 overflow-y-auto">
      <div className="w-3/4 grid grid-cols-8 gap-4 items-center">
        {/* TODO: My Applications text should be aligned with the Card below it */}
        <button
          className="focus:border-0 col-span-1"
          onClick={() => {
            router.back();
          }}
        >
          <BackArrow className="hover:cursor-pointer" />
        </button>
        <Text h2 b className="col-span-7">
          My Applications
        </Text>
        <div className="col-span-1" />
        <Card className="p-8 col-span-7">
          <Text h3>My Applications</Text>
          {applications === undefined || applications!.length < 1 ? (
            <>
              <div className="h-4" />
              <Text>No active applications</Text>
            </>
          ) : (
            applications!.map((app, i) => {
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

ApplicationsViewer.getLayout = (page) => (
  <AuthorizationWrapper>{page}</AuthorizationWrapper>
);

export default ApplicationsViewer;
