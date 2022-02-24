import React from "react";
import { Switch } from "@headlessui/react";

interface ToggleProps {
  enabled: boolean;
  onClick(checked: boolean): void;
}

const Toggle = (props: ToggleProps) => {
  const { enabled, onClick } = props;

  return (
    <Switch
      checked={enabled}
      onChange={onClick}
      className={`${
        enabled ? "bg-primary" : "bg-secondary"
      } relative inline-flex items-center h-6 rounded-full w-11`}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block w-4 h-4 transform bg-white rounded-full`}
      />
    </Switch>
  );
};

export default Toggle;
