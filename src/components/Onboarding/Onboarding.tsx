import React, { ReactNode } from "react";
import { Card, Text } from "../atomic";
import { useOnboarding } from "./OnboardingContext";

type OnboardingLayoutProps = {
  currentPageChildren: ReactNode;
};

const OnboardingLayout = ({ currentPageChildren }: OnboardingLayoutProps) => {
  const { OnboardingComponent } = useOnboarding();

  return (
    <div className="flex flex-col h-full w-full bg-tertiary">
      <div className="h-3/4 w-full box-border">{currentPageChildren}</div>

      <div className="h-1/4 w-full z-10 px-6">
        <Card className="animate-border-pulse z-10 w-full p-4 space-y-4 box-border">
          <Text h2 b>
            Welcome to your new program!
          </Text>
          {OnboardingComponent}
        </Card>
      </div>
    </div>
  );
};

export default OnboardingLayout;
