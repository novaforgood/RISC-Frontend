import { Text, Card } from "../../components/atomic";
import Page from "../../types/Page";
import { BackArrow } from "../../components/icons";

//TODO: Actually connect it to program
const renderApplicationEntries = () => {
  return null;
};

const ApplicationsViewer: Page = () => {
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
          {renderApplicationEntries()}
        </Card>
      </div>
    </div>
  );
};

export default ApplicationsViewer;
