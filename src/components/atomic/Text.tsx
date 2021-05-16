import React, { HTMLAttributes } from "react";
import classNames from "classnames";

type TextProps = HTMLAttributes<HTMLDivElement> & {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  b1?: boolean;
  b2?: boolean;
  caption?: boolean;
  b?: boolean;
  i?: boolean;
  u?: boolean;
  className?: string;
};

const Text = ({
  /* Size */
  h1 = false,
  h2 = false,
  h3 = false,
  b1 = false,
  b2 = false,
  caption = false,
  /* Style */
  b = false,
  i = false,
  u = false,
  /* Custom styles */
  className,
  /* Etc */
  children,
  ...args
}: TextProps) => {
  let styles = classNames(
    "font-sans",
    { "text-h1": h1 },
    { "text-h2": h2 },
    { "text-h3": h3 },
    { "text-body-1": b1 },
    { "text-body-2": b2 },
    { "text-caption": caption },
    { "font-bold": b },
    { italic: i }, // Styling needs to be polished
    { underline: u },
    { [`${className}`]: true }
  );

  return (
    <span {...args} className={styles}>
      {children}
    </span>
  );
};

export default Text;
