import classNames from "classnames";
import React, { HTMLAttributes } from "react";

type TextProps = HTMLAttributes<HTMLDivElement> & {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  b1?: boolean;
  b2?: boolean;
  caption?: boolean;
  secondary?: boolean;
  error?: boolean;
  b?: boolean;
  i?: boolean;
  u?: boolean;
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
  secondary = false,
  error = false,
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
    { "text-h1 leading-tight": h1 },
    { "text-h2 leading-tight": h2 },
    { "text-h3 leading-tight": h3 },
    { "text-body-1": b1 },
    { "text-body-2": b2 },
    { "text-caption": caption },
    { "text-secondary": secondary },
    { "text-error": error },
    { "font-bold": b },
    { italic: i }, // Styling needs to be polished
    { underline: u },
    { [`${className}`]: true }
  );

  return <span {...props} className={styles}></span>;
};

export default Text;
