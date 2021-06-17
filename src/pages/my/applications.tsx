import { Text, Card } from "../../components/atomic";
import Page from "../../types/Page";
import { BackArrow } from "../../components/icons";

//TODO: Actually connect it to program
const renderApplicationEntries = () => {
  return null;
};

const ApplicationsViewer: Page = () => {
  return (
    <div className="flex justify-center min-w-screen h-screen bg-tertiary">
      <div>
        <BackArrow className="h-10 w-10"></BackArrow>
      </div>
      <div>
        <Text h2 b>
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
