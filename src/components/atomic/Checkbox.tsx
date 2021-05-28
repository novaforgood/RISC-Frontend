import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  labelText?: string;
};

const Checkbox = ({ className = "", ...props }: CheckboxProps) => {
  const wrapperStyles = classNames({
    ["h-5 w-5 relative"]: true,
  });
  const checkboxStyles = classNames({
    ["h-5 w-5 border-2 border-primary rounded appearance-none \
      checked:bg-primary checked:fill-white -z-1 absolute"]:
      true,
  });
  const svgStyles = classNames({
    ["h-5 w-5 fill-none stroke-2 absolute"]: true,
  });

  return (
    <label className={wrapperStyles} htmlFor={props.id}>
      <svg className={svgStyles}>
        <path
          xmlns="http://www.w3.org/2000/svg"
          d="M 3,13 7,17 17,3"
          style={{ stroke: "#fff", height: 20, strokeWidth: 2, fill: "none" }}
        />
      </svg>
      <input
        type="checkbox"
        {...props}
        className={checkboxStyles}
        id={props.id}
      />
      <span style={{ marginLeft: "25px" }}>
        {props.labelText ? props.labelText : ""}
      </span>
    </label>
  );
};

export default Checkbox;
