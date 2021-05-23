import React, { HTMLAttributes, ChangeEvent } from "react";
import { INLINE_STYLES, BLOCK_STYLES } from "./TextStyles";
import classNames from "classnames";

import { EditorState, RichUtils, AtomicBlockUtils } from "draft-js";

import "draft-js/dist/Draft.css";
import "@draft-js-plugins/image/lib/plugin.css";

type EditState = {
  editorState: EditorState;
  setEditorState: (arg: EditorState) => void;
};

type UploadImageProps = {
  e: ChangeEvent<HTMLInputElement>;
} & EditState;

type ButtonProps = HTMLAttributes<HTMLDivElement> &
  EditState & {
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
  editorState,
  setEditorState,
  display,
  type,
  className,
  ...props
}: ButtonProps) => {
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
        console.log(editorState.getCurrentContent());
        setEditorState(RichUtils.toggleBlockType(editorState, type));
      }}
    >
      {display}
    </div>
  );
};

// const uploadImage = ({ e, editorState, setEditorState }: UploadImageProps) => {
//   e.preventDefault();
//   const files = e.target.files;
//   const file: File | null = files![0];
//   const reader = new FileReader();

//   let base64: String | ArrayBuffer | null = "";
//   reader.onloadend = () => {
//     base64 = reader.result as string;
//     console.log(base64);

//     const contentState = editorState.getCurrentContent();
//     const contentStateWithEntity = contentState.createEntity(
//       "image",
//       "IMMUTABLE",
//       { src: base64 }
//     );
//     const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
//     const newEditorState = EditorState.set(editorState, {
//       currentContent: contentStateWithEntity,
//     });
//     setEditorState(
//       AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
//     );
//   };
//   reader.readAsDataURL(file);
// };

// const UploadImageButton = ({
//   editorState,
//   setEditorState,
//   ...props
// }: EditState & HTMLAttributes<HTMLLabelElement>) => {
//   return (
//     <label className="" {...props}>
//       <input
//         onChange={(e: ChangeEvent<HTMLInputElement>) => {
//           uploadImage({ e, editorState, setEditorState });
//         }}
//         className="hidden"
//         type="file"
//       />
//       <img
//         className="hover:bg-gray-light rounded-sm cursor-pointer"
//         src="/static/UploadImageIcon.svg"
//       />
//     </label>
//   );
// };

const ToolBar = ({ editorState, setEditorState }: EditState) => {
  return (
    <div className="flex items-center justify-around text-center">
      {INLINE_STYLES.map((option) => (
        <ToggleStyleButton
          editorState={editorState}
          setEditorState={setEditorState}
          key={option.style}
          display={option.display}
          type={option.style}
        />
      ))}
      {BLOCK_STYLES.map((option) => (
        <ToggleBlockButton
          editorState={editorState}
          setEditorState={setEditorState}
          key={option.type}
          display={option.display}
          type={option.type}
        />
      ))}
      {/* <UploadImageButton
        editorState={editorState}
        setEditorState={setEditorState}
      /> */}
    </div>
  );
};

export default ToolBar;
