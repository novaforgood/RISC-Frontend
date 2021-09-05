import { range } from "lodash";
import React, { HTMLAttributes } from "react";

type StepTrackerProps = HTMLAttributes<HTMLDivElement> & {
  steps: number;
  currentStep: number;
};

const StepTracker = ({ steps, currentStep }: StepTrackerProps) => (
  <div className="flex space-x-4">
    {range(1, steps + 1).map((i: number) => {
      return (
        <div
          key={i}
          className={`h-4 w-4 rounded-full ${
            i == currentStep ? "bg-secondary" : "bg-inactive"
          }`}
        />
      );
    })}
  </div>
);

export default StepTracker;
