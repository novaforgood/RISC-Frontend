import { Card, Text } from "../../components/atomic";
import { BackArrow } from "../../components/icons";
import { useGetMyUserApplicationsQuery } from "../../generated/graphql";
import Page from "../../types/Page";

const ApplicationsViewer: Page = () => {
  const applications = useGetMyUserApplicationsQuery().data?.getMyUser
    .applications;

  return (
    <div className=" min-w-screen h-screen bg-tertiary">
      <div></div>
      <div className="max-w-4xl mx-auto p-10">
        {/* TODO: My Applications text should be aligned with the Card below it */}
        <BackArrow className="h-10 w-10 inline"></BackArrow>
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
            applications.map((app) => {
              return (
                <div className="flex">
                  {/* TODO: Need to fetch profile */}
                  <div className="flex-1"></div>
                  <div className="flex-1">{app.createdAt}</div>
                  <div className="flex-1">{app.applicationStatus}</div>
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
