import React from "react";
import { Card, Text } from "../atomic";
import AdminOnboarding from "./AdminOnboarding";

type OnboardingProps = {
  onClose: () => void;
};

const OnboardingScreen = ({ onClose }: OnboardingProps) => {
  return (
    <div className="h-max w-full bg-tertiary p-6 z-10 box-border">
      <Card className="w-full p-4 space-y-4 box-border">
        <Text h2 b>
          Welcome to your new program!
        </Text>
        <AdminOnboarding onClose={onClose} />
      </Card>
    </div>
  );
};

export default OnboardingScreen;
