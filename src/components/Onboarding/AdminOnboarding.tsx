import { useRouter } from "next/router";
import { Button, Text } from "../atomic";
import StepTracker from "../atomic/StepTracker";
import { OnboardingProps } from "./OnboardingContext";

const AdminOnboarding = ({
  onFinish,
  currentStep,
  setCurrentStep,
  MAX_STEPS,
  baseRoute,
}: OnboardingProps) => {
  const router = useRouter();

  const getCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return "Set up your program homepage";
      case 2:
        return "Edit your mentor applications";
      case 3:
        return "Edit your mentee applications";
      case 4:
        return "Edit your mentor profile structure";
      case 5:
        return "Edit your mentee profile structure";
      case 6:
        return "All Done!";
    }
  };

  const getStepRoute = (step: number) => {
    switch (step) {
      case 2:
        return baseRoute + "applications/edit-mentor-app";
      case 3:
        return baseRoute + "applications/edit-mentee-app";
      case 4:
        return baseRoute + "mentors/edit-profile";
      case 5:
        return baseRoute + "mentees/edit-profile";
    }
    return baseRoute;
  };

  return (
    <div className="w-full flex flex-col items-center space-y-2 z-10">
      <Text h3 className="w-full">
        {currentStep}) {getCurrentStep()}
      </Text>
      <div className="h-2" />
      <div className="flex w-full justify-end items-center box-border">
        <div className="w-full">
          <StepTracker steps={MAX_STEPS} currentStep={currentStep} />
        </div>
        <Button
          size="small"
          variant="inverted"
          disabled={currentStep === 1}
          onClick={() => {
            const prevStep = Math.max(currentStep - 1, 1);
            router
              .push(getStepRoute(prevStep))
              .then(() => setCurrentStep(prevStep));
          }}
        >
          Back
        </Button>
        <div className="w-4" />
        <Button
          size="small"
          onClick={() => {
            if (currentStep !== MAX_STEPS - 1) {
              const nextStep = Math.min(currentStep + 1, MAX_STEPS);
              router
                .push(getStepRoute(nextStep))
                .then(() => setCurrentStep(nextStep));
            } else {
              onFinish();
            }
          }}
        >
          {currentStep !== MAX_STEPS - 1 ? "Next" : "Finish"}
        </Button>
      </div>
    </div>
  );
};

export default AdminOnboarding;
