import classNames from "classnames";
import React, { HTMLAttributes } from "react";

type TextAreaProps = HTMLAttributes<HTMLTextAreaElement>;

//TODO: Implement color depending on theme
const TextArea = ({ className = "", ...props }: TextAreaProps) => {
  const styles = classNames({
    "rounded-xl p-2 placeholder-secondary border-1.5 border-inactive focus:border-primary focus:outline-none focus:shadow-border":
      true,
    [`${className}`]: true,
  });
  return <textarea {...props} className={styles} />;
};

export default TextArea;
