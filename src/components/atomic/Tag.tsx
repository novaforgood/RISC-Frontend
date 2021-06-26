import React, { HTMLAttributes } from "react";
import classNames from "classnames";

type TagProps = HTMLAttributes<HTMLElement> & {
  variant?: "solid" | "outline";
};

const Tag = ({ variant = "solid", className, ...props }: TagProps) => {
  const styles = classNames({
    "inline-block rounded-xl border-2 px-1.5 m-1": true, // hover:cursor-pointer should only be true if there is an onClick behavior
    "hover:cursor-pointer": onclick,
    "hover:cursor-default": !onclick,
    "bg-tertiary border-tertiary": variant === "solid",
    "inline-block bg-white border-primary": variant === "outline",
    [`${className}`]: true,
  });
  return <div {...props} className={styles}></div>; // There should also be an option to have the 'X'
};

export default Tag;
