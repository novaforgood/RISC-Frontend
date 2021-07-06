import classNames from "classnames";
import React, { HTMLProps } from "react";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

type TextAreaProps = TextareaAutosizeProps &
  Omit<HTMLProps<HTMLTextAreaElement>, "style" | "ref">;

//TODO: Implement color depending on theme
const TextArea = ({ className = "", ...props }: TextAreaProps) => {
  const styles = classNames({
    "rounded-xl p-2 placeholder-secondary border-1.5 border-inactive focus:border-primary focus:outline-none":
      true,
    [`${className}`]: true,
  });
  return <TextareaAutosize minRows={2} {...props} className={styles} />;
};

export default TextArea;
