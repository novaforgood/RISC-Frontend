import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

//TODO: Implement color depending on theme
const Input = ({ className = "", ...props }: InputProps) => {
  const styles = classNames({
    "rounded-xl p-2 placeholder-secondary border-1.5 border-inactive \
     focus:border-primary focus:outline-none disabled:bg-white":
      true,
    [`${className}`]: true,
  });
  return <input {...props} className={styles} />;
};

export default Input;
