import React, { HTMLAttributes } from "react";
import classNames from "classnames";

type TextProps = HTMLAttributes<HTMLDivElement> & {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  b1?: boolean;
  b2?: boolean;
  caption?: boolean;
  b?: false;
  i?: false;
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
  /* Custom styles */
  className,
  /* Etc */
  children,
  ...args
}: TextProps) => {
  let styles = classNames(
    { "text-h1": h1 },
    { "text-h2": h2 },
    { "text-h3": h3 },
    { "text-body-1": b1 },
    { "text-body-2": b2 },
    { "text-caption": caption },
    { "font-bold": b },
    { italic: i }, // Styling needs to be polished
    { [`${className}`]: true }
  );

  return (
    <div {...args} className={styles}>
      {children}
    </div>
  );
};

export default Text;
