import classNames from "classnames";
import React, { ReactNode, useState } from "react";
import { Card, Text } from "../atomic";
import OnboardingContent from "./OnboardingContent";

type OnboardingProps = {
  currentPageChildren: ReactNode;
};

const OnboardingComponent = ({ currentPageChildren }: OnboardingProps) => {
  const [switchingRoutes, setSwitchingRoutes] = useState(false);

  const onboardingStyles = classNames({
    "flex flex-col h-full w-full bg-tertiary": true,
    hidden: switchingRoutes,
  });

  return (
    <div className={onboardingStyles}>
      <div className="h-3/4 w-full box-border">{currentPageChildren}</div>

      <div className="h-1/4 w-full z-10 px-6">
        <Card className="animate-border-pulse z-10 w-full p-4 space-y-4 box-border">
          <Text h2 b>
            Welcome to your new program!
          </Text>
          <OnboardingContent
            switchingRoutes={switchingRoutes}
            setSwitchingRoutes={setSwitchingRoutes}
          />
        </Card>
      </div>
    </div>
  );
};

export default OnboardingComponent;
