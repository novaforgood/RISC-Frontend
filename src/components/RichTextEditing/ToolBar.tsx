import React, { HTMLAttributes, ChangeEvent, ImgHTMLAttributes } from "react";
import { EditorStateInterface, useEditor } from "./EditorContext";
import { INLINE_STYLES, BLOCK_STYLES } from "./TextStyles";
import classNames from "classnames";

import { RichUtils } from "draft-js";

type UploadImageProps = {
  e: ChangeEvent<HTMLInputElement>;
} & EditorStateInterface;

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
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
    <button
      {...props}
      className={styles}
      onMouseDown={(e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, type));
      }}
    >
      {display}
    </button>
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
    <button
      {...props}
      className={styles}
      onMouseDown={(e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, type));
      }}
    >
      {display}
    </button>
  );
};

// const createLinkEntity = ({e, editorState, setEditorState, url}: ButtonProps) => {
//   const contentState = editorState.getCurrentContent()
//   const contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", {
//     url,
//   })
//   const selection = editorState?.getSelection();

//   const entityKey = contentStateWithEntity.getLastCreatedEntity();
//   const contentStateWithLink = Modifier.applyEntity(
//     contentStateWithEntity,
//     selectionState,
//     entityKey,
//   )

//   const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithLink,})
//   setEditorState(newEditorState);
// }

// const createLinkButton = () => {
//   const { editorState, setEditorState } = useEditor();

//   return (
//     <button
//       onClick={(e) => createLinkEntity({e, editorState, setEditorState})}
//     >
//       <img
//         className="hover:bg-inactive rounded-md cursor-pointer px-1 py-0.5" src="/static/Link.svg" />
//     </button>
//   )
// }

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
      alt: file.name,
    };
    setEditorState(imagePlugin!.addImage(editorState, url, data));

    //Upload the same image
    e.target.value = "";
  }
};

const UploadImageButton = (props: HTMLAttributes<HTMLButtonElement>) => {
  const { editorState, setEditorState, imagePlugin } = useEditor();
  return (
    <button {...props}>
      <label>
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
    </button>
  );
};

const ToolBar = (props: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      onFocus={() => false}
      {...props}
      contentEditable={false}
      className="bg-white rounded-md border border-inactive p-1 flex items-center justify-around space-x-2 text-center w-max"
    >
      {BLOCK_STYLES.map((option) => (
        <ToggleBlockButton
          key={option.type}
          display={option.display}
          type={option.type}
        />
      ))}
      <div className="h-4 w-0.25 bg-inactive" />
      {INLINE_STYLES.map((option) => (
        <ToggleStyleButton
          key={option.style}
          display={option.display}
          type={option.style}
        />
      ))}
      <div className="h-4 w-0.25 bg-inactive" />
      <UploadImageButton />
    </div>
  );
};
export default ToolBar;
