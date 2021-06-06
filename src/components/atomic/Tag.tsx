import React, { HTMLAttributes } from "react";
import classNames from "classnames";

type TagProps = HTMLAttributes<HTMLDivElement>;

const Tag = ({ className, ...props }: TagProps) => {
  const styles = classNames({
    "inline-block bg-skyblue rounded-lg border-2 border-skyblue \
     p-1 m-1 text-white text-center hover:cursor-pointer":
      true,
    [`${className}`]: true,
  });
  return <div {...props} className={styles}></div>;
};

export default Tag;
