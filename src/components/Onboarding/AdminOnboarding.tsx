import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Text } from "../atomic";
import StepTracker from "../atomic/StepTracker";

type AdminOnboardingProps = {
  onClose: () => void;
};

const ADMIN_STEPS = 6;

const AdminOnboarding = ({ onClose }: AdminOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const baseRoute = `/program/${router.query.slug}/${router.query.profileRoute}/`;
  useEffect(() => {
    if (currentStep === 1 && router.asPath !== baseRoute) {
      router.push(baseRoute);
    }
  }, []);

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
      <StepTracker steps={ADMIN_STEPS} currentStep={currentStep} />
      <div className="flex w-full justify-between box-border">
        <Button
          size="small"
          variant="inverted"
          className="self-start"
          onClick={() => {
            setCurrentStep(1);
            onClose();
          }}
        >
          Skip
        </Button>
        <div className="flex flex-end">
          <Button
            size="small"
            variant="inverted"
            disabled={
              currentStep === 1 &&
              router.asPath !==
                `/program/${router.query.slug}/${router.query.profileRoute}`
            }
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
              if (currentStep !== ADMIN_STEPS - 1) {
                const nextStep = Math.min(currentStep + 1, ADMIN_STEPS);
                router
                  .push(getStepRoute(nextStep))
                  .then(() => setCurrentStep(nextStep));
              } else {
                setCurrentStep(1);
                onClose();
              }
            }}
          >
            {currentStep !== ADMIN_STEPS - 1 ? "Next" : "Finish"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminOnboarding;
