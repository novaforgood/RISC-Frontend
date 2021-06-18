import classNames from "classnames";
import React, { ButtonHTMLAttributes } from "react";
import { CircledCheck } from "../icons";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {};

const Button = ({ className, ...props }: ButtonProps) => {
  const styles = classNames({
    // Override styles
    [`${className}`]: true,
  });

  return (
    <button className={styles} {...props}>
      <CircledCheck />
    </button>
  );
};

export default Button;
