import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";
import { Text } from "../../components/atomic";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  checked: boolean;
  onCheck: (checked: boolean) => void;
};

const Checkbox = ({
  className = "",
  checked,
  onCheck = () => {},
  ...props
}: CheckboxProps) => {
  const checkboxStyles = classNames({
    ["h-5 w-5 border-1.5 border-secondary hover:border-primary rounded appearance-none \
      cursor-pointer absolute duration-75"]:
      true,
    ["border-3 bg-primary fill-white"]: checked,
  });
  console.log(checked);
  return (
    <div className="relative flex items-center">
      <svg className="h-5 w-5 fill-none stroke-white stroke-2 strokeLinecap-round absolute z-10 pointer-events-none">
        <path xmlns="http://www.w3.org/2000/svg" d="M 4,11 8,14.5 16,5" />
      </svg>
      <input
        type="checkbox"
        {...props}
        className={checkboxStyles}
        checked={checked}
        onChange={() => onCheck(!checked)}
      />
      <Text className="pl-7 select-none">{props.label}</Text>
    </div>
  );
};

export default Checkbox;
