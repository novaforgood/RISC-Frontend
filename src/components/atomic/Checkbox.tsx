import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";
import { Text } from "../../components/atomic";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  labeltext?: string;
};

const Checkbox = ({ className = "", ...props }: CheckboxProps) => {
  const checkboxStyles = classNames({
    ["h-5 w-5 border-2 border-primary rounded appearance-none \
      hover:bg-darkblue active:border-darkblue active:border-3\
      checked:bg-primary checked:fill-white -z-1 absolute"]:
      true,
  });

  return (
    <label
      className="relative cursor-pointer inline-block align-middle"
      htmlFor={props.id}
    >
      <svg className="h-5 w-5 fill-none stroke-white stroke-2 strokeLinecap-round absolute">
        <path xmlns="http://www.w3.org/2000/svg" d="M 4,11 8,14.5 16,5" />
      </svg>
      <input type="checkbox" {...props} className={checkboxStyles} />
      <Text className="ml-6">{props.labeltext}</Text>
    </label>
  );
};

export default Checkbox;
