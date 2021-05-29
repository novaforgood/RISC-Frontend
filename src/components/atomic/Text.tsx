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
<<<<<<< HEAD
  u?: boolean;
=======
  className?: string;
>>>>>>> caf4566 (Picture Upload and Focus)
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
  ...props
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

  return <span {...props} className={styles}></span>;
};

export default Text;
