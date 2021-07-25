import classNames from "classnames";
import { HTMLAttributes, useState } from "react";

type ArrowProps = HTMLAttributes<HTMLButtonElement> & {
  direction: "left" | "right";
  className?: string;
  color?: string;
  hoveredColor?: string;
};
export const Arrow = ({
  direction,
  className,
  color = "black",
  hoveredColor = "black",
  ...props
}: ArrowProps) => {
  const [hovered, setHovered] = useState(false);
  const styles = classNames({
    [`hover:bg-tertiary rounded`]: true,
    "transform rotate-180": direction === "left",
    [`${className}`]: true,
  });
  return (
    <button
      {...props}
      className={styles}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="100%"
        height="100%"
        viewBox="0 0 256 256"
        xmlSpace="preserve"
      >
        <polygon
          fill={hovered ? hoveredColor : color}
          points="79.093,0 48.907,30.187 146.72,128 48.907,225.813 79.093,256 207.093,128   "
        />
      </svg>
    </button>
  );
};
