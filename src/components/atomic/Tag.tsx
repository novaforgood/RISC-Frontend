import classNames from "classnames";
import React, { HTMLAttributes } from "react";

type TagProps = HTMLAttributes<HTMLElement> & {
  variant?: "solid" | "outline";
};

const Tag = ({ variant = "solid", className, onClick, ...props }: TagProps) => {
  const styles = classNames({
    "inline-block rounded-xl border-2 px-1.5": true, // hover:cursor-pointer should only be true if there is an onClick behavior
    "hover:cursor-pointer": onClick,
    "hover:cursor-default": !onClick,
    "bg-tertiary border-tertiary": variant === "solid",
    "inline-block bg-white border-primary": variant === "outline",
    [`${className}`]: true,
  });
  return <div {...props} onClick={onClick} className={styles}></div>; // There should also be an option to have the 'X'
};

export default Tag;
