import React from "react";

export const Text = (props) => {
  let {
    /* Size */
    h1 = false,
    h2 = false,
    h3 = false,
    b1 = false,
    b2 = false,
    caption = false,
    /* Color */
    placeholder = false,
    /* Style */
    b = false,
    i = false,
    /* Etc */
    children,
    ...args
  } = props;

  let classNames = "";

  classNames += h1 ? "text-h1 " : "";
  classNames += h2 ? "text-h2 " : "";
  classNames += h3 ? "text-h3 " : "";
  classNames += b1 ? "text-body-1 " : "";
  classNames += b2 ? "text-body-2 " : "";
  classNames += caption ? "text-caption " : "";

  classNames += placeholder ? "text-gray " : "text-black ";

  classNames += b ? "font-bold " : "";
  classNames += i ? "italic " : "";

  return (
    <div {...args} className={classNames}>
      {children}
    </div>
  );
};
