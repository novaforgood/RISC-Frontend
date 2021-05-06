import React from "react";
import classNames from "classnames";

const Text = (props) => {
  let {
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
    /* Etc */
    children,
    ...args
  } = props;

  let styles = classNames(
    { "text-h1": h1 },
    { "text-h2": h2 },
    { "text-h3": h3 },
    { "text-body-1": b1 },
    { "text-body-2": b2 },
    { "text-caption": caption },
    { "font-bold": b },
    { italic: i } // Styling needs to be pollished
  );

  return (
    <div {...args} className={styles}>
      {children}
    </div>
  );
};

export default Text;
