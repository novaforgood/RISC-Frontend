import { useState } from "react";
import { Button, Checkbox } from "../atomic";
import StepTracker from "../atomic/StepTracker";

const AdminOnboarding = () => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  return (
    <div>
      <StepTracker steps={5} currentStep={currentStep} />
      <div>
        <Checkbox
          checked={dontShowAgain}
          onCheck={() => setDontShowAgain(true)}
          label="Do not show this popup again for this program."
        />
        <div>
          <Button>Close</Button>
          <Button>Next</Button>
        </div>
      </div>
    </div>
  );
};
