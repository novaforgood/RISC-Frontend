import React, { HTMLAttributes, ChangeEvent, ImgHTMLAttributes } from "react";
import { EditorStateInterface, useEditor } from "./EditorContext";
import { INLINE_STYLES, BLOCK_STYLES } from "./TextStyles";
import classNames from "classnames";

import { RichUtils } from "draft-js";

type UploadImageProps = {
  e: ChangeEvent<HTMLInputElement>;
} & EditorStateInterface;

type ButtonProps = HTMLAttributes<HTMLDivElement> & {
  display: JSX.Element | string;
  type: string;
};

const ToggleStyleButton = ({
  display,
  type,
  className,
  ...props
}: ButtonProps) => {
  const { editorState, setEditorState } = useEditor();
  const styles = classNames({
    "hover:bg-inactive rounded-md cursor-pointer px-1 py-0.5": true,
    "bg-inactive font-bold": editorState?.getCurrentInlineStyle().has(type),
    [`${className}`]: true,
  });
  return (
    <div
      {...props}
      className={styles}
      onMouseDown={(e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, type));
      }}
    >
      {display}
    </div>
  );
};

const ToggleBlockButton = ({
  display,
  type,
  className,
  ...props
}: ButtonProps) => {
  const { editorState, setEditorState } = useEditor();
  const selection = editorState?.getSelection();
  const styles = classNames({
    "hover:bg-inactive rounded-md cursor-pointer px-1 py-0.5": true,
    "bg-inactive font-bold":
      editorState
        ?.getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType() === type,
    [`${className}`]: true,
  });
  return (
    <div
      {...props}
      className={styles}
      onMouseDown={(e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, type));
      }}
    >
      {display}
    </div>
  );
};

const uploadImage = ({
  e,
  editorState,
  setEditorState,
  imagePlugin,
}: UploadImageProps) => {
  e.preventDefault();
  const files = e.target.files;
  const file: File | null = files![0];

  if (file && file.type.match("image.*")) {
    let url = URL.createObjectURL(file);
    const data: ImgHTMLAttributes<HTMLImageElement> = {
      className: "editor-image",
      alt: file.name,
    };
    setEditorState(imagePlugin!.addImage(editorState, url, data));

    e.target.value = "";
  }
};

const UploadImageButton = (props: HTMLAttributes<HTMLLabelElement>) => {
  const { editorState, setEditorState, imagePlugin } = useEditor();
  return (
    <label className="" {...props}>
      <input
        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          if (imagePlugin)
            uploadImage({
              e,
              editorState,
              setEditorState,
              imagePlugin,
              ...props,
            });
        }}
        className="hidden"
        type="file"
      />
      <img
        className="hover:bg-inactive rounded-md cursor-pointer px-1 py-0.5"
        src="/static/UploadImageIcon.svg"
      />
    </label>
  );
};

const ToolBar = (props: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      onFocus={() => false}
      {...props}
      contentEditable={false}
      className="bg-white z-10 rounded-md border border-inactive p-1 flex items-center justify-around space-x-2 text-center sticky top-0"
    >
      {BLOCK_STYLES.map((option) => (
        <ToggleBlockButton
          key={option.type}
          display={option.display}
          type={option.type}
        />
      ))}
      {INLINE_STYLES.map((option) => (
        <ToggleStyleButton
          key={option.style}
          display={option.display}
          type={option.style}
        />
      ))}
      <UploadImageButton />
    </span>
  );
};
export default ToolBar;
