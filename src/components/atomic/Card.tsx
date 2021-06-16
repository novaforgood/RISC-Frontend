import classNames from "classnames";
import React, { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

//TODO: Implement color for background depending on themes?
const Card = ({ className, ...props }: CardProps) => {
  //You can override width, height, and padding like this.
  const styles = classNames({
    "bg-white shadow-md rounded-md border border-tertiary": true,
    [`${className}`]: true,
  });
  return <div {...props} className={styles}></div>;
};

export default Card;
