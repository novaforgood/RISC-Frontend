import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  UpdateProfileInput,
  useUpdateProfileMutation,
} from "../../generated/graphql";
import {
  AuthorizationLevel,
  useAuthorizationLevel,
  useCurrentProfile,
} from "../../hooks";
import LocalStorage from "../../utils/localstorage";
import { Button, Text } from "../atomic";
import StepTracker from "../atomic/StepTracker";

const ONBOARDING_STEP = "Onboarding Step";

type OnboardingText = (baseRoute: string) => {
  [key: number]: { step: string; route: string };
};

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

const AdminOnboardingText: OnboardingText = (baseRoute: string) => ({
  1: {
    step: "Set up your program homepage",
    route: baseRoute,
  },
  2: {
    step: "Edit your mentor applications",
    route: baseRoute + "/applications/edit-mentor-app",
  },
  3: {
    step: "Edit your mentee applications",
    route: baseRoute + "/applications/edit-mentee-app",
  },
  4: {
    step: "Edit your mentor profile structure",
    route: baseRoute + "/mentors/edit-profile",
  },
  5: {
    step: "Edit your mentee profile structure",
    route: baseRoute + "/mentees/edit-profile",
  },
});

const MentorOnboardingText: OnboardingText = (baseRoute: string) => ({
  1: {
    step: "Fill out your profile",
    route: baseRoute + "/edit-profile",
  },
  2: {
    step: "Set your availability",
    route: baseRoute + "/availability",
  },
});

const MenteeOnboardingText: OnboardingText = (baseRoute: string) => ({
  1: {
    step: "Fill out your profile",
    route: baseRoute + "/edit-profile",
  },
  2: {
    step: "Browse through available mentors",
    route: baseRoute + "/mentors",
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

type OnboardingProps = {
  switchingRoutes: boolean;
  setSwitchingRoutes: (bool: boolean) => void;
};

const OnboardingContent = ({
  switchingRoutes,
  setSwitchingRoutes,
}: OnboardingProps) => {
  const currentProfile = useCurrentProfile();
  const [updateProfile] = useUpdateProfileMutation({
    refetchQueries: ["getMyUser"],
  });

  const authorizationLevel = useAuthorizationLevel();
  const router = useRouter();

  const MAX_STEPS = authorizationLevelToMaxSteps(authorizationLevel);
  const baseRoute = `/program/${router.query.slug}/${router.query.profileRoute}`;
  const onboardingText = authLevelToText(authorizationLevel)(baseRoute);

  const onFinish = () => {
    const updateProfileInput: UpdateProfileInput = {
      onboarded: true,
    };
    updateProfile({
      variables: {
        profileId: currentProfile.currentProfile!.profileId,
        data: updateProfileInput,
      },
    })
      .then(() => {
        currentProfile.refetchCurrentProfile!();
        LocalStorage.delete(ONBOARDING_STEP);
      })
      .catch((err) => console.error(err));
  };

  const storedStep = LocalStorage.get(ONBOARDING_STEP);
  const currentStep =
    storedStep && typeof storedStep == "number" ? storedStep : 1;

  //If the user tries to navigate to another route or if they land on a page that isn't the first step
  //Return them to the actual page of the current step
  if (
    router.asPath !== onboardingText[currentStep]["route"] &&
    !switchingRoutes
  ) {
    //Hide content if switching routes
    setSwitchingRoutes(true);
    router
      .push(onboardingText[currentStep]["route"])
      .then(() => setSwitchingRoutes(false));
  }

  const prevStep = Math.max(currentStep - 1, 1);
  const nextStep = Math.min(currentStep + 1, MAX_STEPS);

  //Use Links to switch between tabs so that you don't have to wait for router.push
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
          disabled={currentStep === 1}
          onClick={() => {
            LocalStorage.set(ONBOARDING_STEP, prevStep);
          }}
        >
          {currentStep !== 1 ? (
            <Link href={onboardingText[prevStep]["route"]}>Back</Link>
          ) : (
            "Back"
          )}
        </Button>
        <div className="w-4" />
        <Button
          size="small"
          onClick={() => {
            if (currentStep !== MAX_STEPS) {
              LocalStorage.set(ONBOARDING_STEP, nextStep);
            } else {
              onFinish();
            }
          }}
        >
          {currentStep !== MAX_STEPS ? (
            <Link href={onboardingText[nextStep]["route"]}>Next</Link>
          ) : (
            "Finish"
          )}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingContent;
