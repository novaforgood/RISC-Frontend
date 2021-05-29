import React, { HTMLAttributes, ChangeEvent, ImgHTMLAttributes } from "react";
import { EditorStateInterface, useEditor } from "./EditorContext";
import { INLINE_STYLES, BLOCK_STYLES } from "./TextStyles";
import classNames from "classnames";

import { RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import "@draft-js-plugins/image/lib/plugin.css";
import { useEffect } from "react";
import { useState } from "react";

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
    "hover:bg-gray-light rounded-sm cursor-pointer w-6 h-6": true,
    "bg-gray-light": editorState.getCurrentInlineStyle().has(type),
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
  const selection = editorState.getSelection();
  const styles = classNames({
    "hover:bg-gray-light rounded-sm cursor-pointer p-1": true,
    "bg-gray-light":
      editorState
        .getCurrentContent()
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
  setShowImageTools,
  ...props
}: {
  setShowImageTools(bool: boolean): void;
} & HTMLAttributes<HTMLLabelElement>) => {
  const { editorState, setEditorState, imagePlugin } = useEditor();
  return (
    <label className="" {...props}>
      <input
        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          await uploadImage({
            e,
            editorState,
            setEditorState,
            imagePlugin,
          });
          const imgElements = document.getElementsByClassName(
            "editor-image"
          ) as HTMLCollectionOf<HTMLElement>;
          for (let i = 0; i < imgElements.length; i++) {
            const firstClick = () => {
              imgElements[i].focus();
              imgElements[i].style.border = "1px solid #707070";
              setShowImageTools(true);
              imgElements[i].onclick = secondClick;
            };
            const secondClick = () => {
              imgElements[i].style.border = "none";
              setShowImageTools(false);
              imgElements[i].onclick = firstClick;
            };
            imgElements[i].onclick = firstClick;
          }
        }}
        className="hidden"
        type="file"
      />
      <img
        className="hover:bg-gray-light rounded-sm cursor-pointer"
        src="/static/UploadImageIcon.svg"
      />
    </label>
  );
};

const ToolBar = () => {
  const [showImageTools, setShowImageTools] = useState(false);
  useEffect(() => {
    const imgElements = document.getElementsByClassName(
      "editor-image"
    ) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < imgElements.length; i++) {
      const firstClick = () => {
        imgElements[i].focus();
        imgElements[i].style.border = "1px solid #707070";
        setShowImageTools(true);
        imgElements[i].onclick = secondClick;
      };
      const secondClick = () => {
        imgElements[i].style.border = "none";
        setShowImageTools(false);
        imgElements[i].onclick = firstClick;
      };
      imgElements[i].onclick = firstClick;
    }
  }, []);
  return (
    <div>
      {showImageTools ? (
        <div>Align Image, Resize</div>
      ) : (
        <div className="flex items-center justify-around text-center">
          {INLINE_STYLES.map((option) => (
            <ToggleStyleButton
              key={option.style}
              display={option.display}
              type={option.style}
            />
          ))}
          {BLOCK_STYLES.map((option) => (
            <ToggleBlockButton
              key={option.type}
              display={option.display}
              type={option.type}
            />
          ))}
          <UploadImageButton setShowImageTools={setShowImageTools} />
        </div>
      )}
    </div>
  );
};

export default ToolBar;
