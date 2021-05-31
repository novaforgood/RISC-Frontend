import React, { HTMLAttributes, ChangeEvent, ImgHTMLAttributes } from "react";
import { EditorStateInterface } from "./EditorContext";
import { INLINE_STYLES, BLOCK_STYLES } from "./TextStyles";
import classNames from "classnames";

import { RichUtils } from "draft-js";

type UploadImageProps = {
  e: ChangeEvent<HTMLInputElement>;
} & EditorStateInterface;

type ButtonProps = HTMLAttributes<HTMLDivElement> &
  EditorStateInterface & {
    display: JSX.Element | string;
    type: string;
  };

const ToggleStyleButton = ({
  editorState,
  setEditorState,
  display,
  type,
  className,
  ...props
}: ButtonProps) => {
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
  editorState,
  setEditorState,
  display,
  type,
  className,
  ...props
}: ButtonProps) => {
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

const UploadImageButton = ({
  ...props
}: HTMLAttributes<HTMLLabelElement> & EditorStateInterface) => {
  return (
    <label className="" {...props}>
      <input
        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          uploadImage({
            e,
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

const ToolBar = ({
  editorState,
  setEditorState,
  imagePlugin,
  ...props
}: EditorStateInterface & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      onFocus={() => false}
      {...props}
      contentEditable={false}
      className="transform -translate-y-8 z-10 bg-white rounded-md border border-inactive p-1 flex items-center justify-around space-x-2 text-center text-body-2 absolute"
    >
      {BLOCK_STYLES.map((option) => (
        <ToggleBlockButton
          editorState={editorState}
          setEditorState={setEditorState}
          key={option.type}
          display={option.display}
          type={option.type}
        />
      ))}
      {INLINE_STYLES.map((option) => (
        <ToggleStyleButton
          editorState={editorState}
          setEditorState={setEditorState}
          key={option.style}
          display={option.display}
          type={option.style}
        />
      ))}
      <UploadImageButton
        editorState={editorState}
        setEditorState={setEditorState}
        imagePlugin={imagePlugin}
      />
    </div>
  );
};
export default ToolBar;
