import React, { HTMLAttributes } from "react";
import classNames from "classnames";

type TagProps = HTMLAttributes<HTMLElement> & {
  variant?: "solid" | "outline";
};

const Tag = ({ variant = "solid", className, ...props }: TagProps) => {
  const styles = classNames({
    "inline-block rounded-md border-2 p-1 m-1 hover:cursor-pointer": true,
    "bg-tertiary border-tertiary": variant === "solid",
    "inline-block bg-white border-primary": variant === "outline",
    [`${className}`]: true,
  });
  return <div {...props} className={styles}></div>;
};

export default Tag;
