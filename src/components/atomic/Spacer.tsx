import React, { HTMLAttributes } from "react";
import classNames from "classnames";

type SpacerProps = HTMLAttributes<HTMLDivElement> & {
  x?: number;
  y?: number;
  // TODO: responsiveness
};

//TODO: Implement color for background depending on themes?
const Spacer = ({ x, y, className, ...props }: SpacerProps) => {
  //You can override width, height, and padding like this.
  const styles = classNames({
    [`w-${x}`]: x,
    [`h-${y}`]: y,
    [`${className}`]: true,
  });
  return <div {...props} className={styles}></div>;
};

export default Spacer;
