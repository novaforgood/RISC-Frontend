import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  UpdateProfileInput,
  useUpdateProfileMutation,
} from "../../generated/graphql";
import {
  AuthorizationLevel,
  useAuthorizationLevel,
  useCurrentProfile,
} from "../../hooks";
import OnboardingComponent from "./OnboardingComponent";
import LocalStorage from "../../utils/localstorage";

interface OnboardingText {
  [key: number]: { step: string; route: string };
}

export interface OnboardingProps {
  currentStep: number;
  setCurrentStep: (num: number) => void;
  loading: boolean;
  setLoading: (bool: boolean) => void;
  onboardingText: OnboardingText;
  MAX_STEPS: number;
  onFinish: () => void;
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

const AdminOnboardingText = (baseRoute: string) => ({
  1: {
    step: "Set up your program homepage",
    route: baseRoute,
  },
  2: {
    step: "Edit your mentor applications",
    route: baseRoute + "applications/edit-mentor-app",
  },
  3: {
    step: "Edit your mentee applications",
    route: baseRoute + "applications/edit-mentee-app",
  },
  4: {
    step: "Edit your mentor profile structure",
    route: baseRoute + "mentors/edit-profile",
  },
  5: {
    step: "Edit your mentee profile structure",
    route: baseRoute + "mentees/edit-profile",
  },
});

const MentorOnboardingText = (baseRoute: string) => ({
  1: {
    step: "Fill out your profile",
    route: baseRoute + "edit-profile",
  },
  2: {
    step: "Set your availability",
    route: baseRoute + "availability",
  },
});

const MenteeOnboardingText = (baseRoute: string) => ({
  1: {
    step: "Fill out your profile",
    route: baseRoute + "edit-profile",
  },
  2: {
    step: "Browse through available mentors",
    route: baseRoute + "mentors",
  },
});

const authLevelToText = (authLevel: AuthorizationLevel) => {
  switch (authLevel) {
    case AuthorizationLevel.Admin:
      return AdminOnboardingText;
    case AuthorizationLevel.Mentor:
      return MentorOnboardingText;
    default:
      return MenteeOnboardingText;
  }
};

interface OnboardingContextType {
  switchingRoutes: boolean;
  OnboardingComponent: JSX.Element;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

const useOnboardingProvider = () => {
  const currentProfile = useCurrentProfile();
  const [updateProfile] = useUpdateProfileMutation({
    refetchQueries: ["getMyUser"],
  });

  const authorizationLevel = useAuthorizationLevel();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const router = useRouter();

  const MAX_STEPS = authorizationLevelToMaxSteps(authorizationLevel);
  const baseRoute = `/program/${router.query.slug}/${router.query.profileRoute}/`;

  const onFinish = () => {
    const updateProfileInput: UpdateProfileInput = {
      ...currentProfile.currentProfile,
      showOnboarding: false,
    };
    updateProfile({
      variables: {
        profileId: currentProfile.currentProfile!.profileId,
        data: updateProfileInput,
      },
    })
      .then(() => {
        currentProfile.refetchCurrentProfile!();
        LocalStorage.delete("Onboarding Step");
      })
      .catch((err) => console.error(err));
  };

  const props: OnboardingProps = {
    currentStep,
    setCurrentStep: (num: number) => {
      LocalStorage.set("Onboarding Step", num);
      setCurrentStep(num);
    },
    loading,
    setLoading,
    onboardingText: authLevelToText(authorizationLevel)(baseRoute),
    MAX_STEPS,
    onFinish,
  };

  const onboardingStep = LocalStorage.get("Onboarding Step");
  useEffect(() => {
    if (onboardingStep && typeof onboardingStep == "number") {
      setCurrentStep(onboardingStep);
    }
  }, []);

  if (
    authorizationLevel !== AuthorizationLevel.Admin &&
    router.asPath !== props.onboardingText[currentStep]["route"] &&
    onboardingStep &&
    typeof onboardingStep == "number"
  ) {
    router.push(props.onboardingText[onboardingStep]["route"]);
    return {
      switchingRoutes: true,
      OnboardingComponent: <OnboardingComponent {...props} />,
    };
  }

  return {
    switchingRoutes: false,
    OnboardingComponent: <OnboardingComponent {...props} />,
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
