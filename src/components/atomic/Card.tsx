import React, { HTMLAttributes } from "react";
import classNames from "classnames";

type CardProps = HTMLAttributes<HTMLDivElement>;

//TODO: Implement color for background depending on themes?
const Card = ({ children, className, ...props }: CardProps) => {
  //You can override width, height, and padding like this.
  const styles = classNames({
    "bg-white shadow-md rounded-md border border-secondary": true,
    [`${className}`]: true,
  });
  return (
    <div {...props} className={styles}>
      {children}
    </div>
  );
};

export default Card;
