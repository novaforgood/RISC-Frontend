import { range } from "lodash";
import React, { HTMLAttributes } from "react";

type StepTrackerProps = HTMLAttributes<HTMLDivElement> & {
  steps: number;
  currentStep: number;
};

const StepTracker = ({ steps, currentStep }: StepTrackerProps) => (
  <div className="flex space-x-4">
    {range(1, steps).map((i: number) => {
      return (
        <div
          className={`rounded-full ${
            i == currentStep ? "bg-primary" : "bg-secondary"
          }`}
        />
      );
    })}
  </div>
);

export default StepTracker;
