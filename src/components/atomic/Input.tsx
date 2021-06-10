import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

//TODO: Implement color depending on theme
const Input = ({ className = "", ...props }: InputProps) => {
  const styles = classNames({
    "rounded-md p-3 placeholder-secondary border-1.5 border-inactive focus:border-primary focus:outline-none focus:shadow-border":
      true,
    [`${className}`]: true,
  });
  return <input {...props} className={styles} />;
};

export default Input;
