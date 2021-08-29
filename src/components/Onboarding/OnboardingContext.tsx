import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import {
  UpdateProfileInput,
  useUpdateProfileMutation,
} from "../../generated/graphql";
import {
  AuthorizationLevel,
  useAuthorizationLevel,
  useCurrentProfile,
} from "../../hooks";
import AdminOnboarding from "./AdminOnboarding";
import LocalStorage from "../../utils/localstorage";

export interface OnboardingProps {
  currentStep: number;
  setCurrentStep: (num: number) => void;
  MAX_STEPS: number;
  baseRoute: string;
  onFinish: () => void;
}

interface OnboardingContextProps {
  OnboardingComponent: JSX.Element;
}

const authorizationLevelToMaxSteps = (authLevel: AuthorizationLevel) => {
  switch (authLevel) {
    case AuthorizationLevel.Admin:
      return 5;
    case AuthorizationLevel.Mentor:
      return 2;
    case AuthorizationLevel.Mentee:
      return 2;
    default:
      return 0;
  }
};

const OnboardingContext = createContext<OnboardingContextProps | undefined>(
  undefined
);

const useOnboardingProvider = () => {
  const currentProfile = useCurrentProfile();
  const [updateProfileMutation] = useUpdateProfileMutation({
    refetchQueries: ["getMyUser"],
  });

  const authorizationLevel = useAuthorizationLevel();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const router = useRouter();

  const MAX_STEPS = authorizationLevelToMaxSteps(authorizationLevel);
  const baseRoute = `/program/${router.query.slug}/${router.query.profileRoute}/`;

  const onFinish = () => {
    const updateProfileInput: UpdateProfileInput = {
      ...currentProfile.currentProfile,
      showOnboarding: false,
    };
    updateProfileMutation({
      variables: {
        profileId: currentProfile.currentProfile!.profileId,
        data: updateProfileInput,
      },
    })
      .catch((err) => console.log(err))
      .then(() => {
        console.log("finished");
      });
    currentProfile.refetchCurrentProfile!();
    LocalStorage.delete("Onboarding Step");
  };

  useEffect(() => {
    const onboardingStep = LocalStorage.get("Onboarding Step");
    if (onboardingStep && typeof onboardingStep == "number")
      setCurrentStep(onboardingStep);
  }, []);

  const props = {
    currentStep,
    setCurrentStep: (num: number) => {
      setCurrentStep(num);
      LocalStorage.set("Onboarding Step", num);
    },
    MAX_STEPS,
    baseRoute,
    onFinish,
  };

  const getOnboardingFromAuthorizationLevel = () => {
    switch (authorizationLevel) {
      case AuthorizationLevel.Admin:
        return <AdminOnboarding {...props} />;
      case AuthorizationLevel.Mentor:
        return <></>;
      case AuthorizationLevel.Mentee:
        return <></>;
      default:
        return <></>;
    }
  };

  const OnboardingComponent = getOnboardingFromAuthorizationLevel();

  return {
    OnboardingComponent,
  };
};

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = useOnboardingProvider();
  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding() must be within OnboardingProvider");
  }
  return context;
};
