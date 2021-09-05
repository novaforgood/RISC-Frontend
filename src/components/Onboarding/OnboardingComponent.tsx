import { useRouter } from "next/router";
import { Button, Text } from "../atomic";
import StepTracker from "../atomic/StepTracker";
import { OnboardingProps } from "./OnboardingContext";

const Onboarding = ({
  onFinish,
  currentStep,
  setCurrentStep,
  loading,
  setLoading,
  onboardingText,
  MAX_STEPS,
}: OnboardingProps) => {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-center space-y-2 z-10">
      <Text h3 className="w-full">
        {currentStep}) {onboardingText[currentStep]["step"]}
      </Text>
      <div className="h-2" />
      <div className="flex w-full justify-end items-center box-border">
        <div className="w-full">
          <StepTracker steps={MAX_STEPS} currentStep={currentStep} />
        </div>
        <Button
          size="small"
          variant="inverted"
          disabled={currentStep === 1 || loading}
          onClick={() => {
            setLoading(true);
            const prevStep = Math.max(currentStep - 1, 1);
            router.push(onboardingText[prevStep]["route"]).then(() => {
              setCurrentStep(prevStep);
              setLoading(false);
            });
          }}
        >
          Back
        </Button>
        <div className="w-4" />
        <Button
          size="small"
          disabled={loading}
          onClick={() => {
            if (currentStep !== MAX_STEPS) {
              setLoading(true);
              const nextStep = Math.min(currentStep + 1, MAX_STEPS);
              router.push(onboardingText[nextStep]["route"]).then(() => {
                setCurrentStep(nextStep);
                setLoading(false);
              });
            } else {
              setLoading(true);
              onFinish();
              setLoading(false);
            }
          }}
        >
          {currentStep !== MAX_STEPS ? "Next" : "Finish"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
