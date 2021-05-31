import React, { useState, useContext, HTMLAttributes } from "react";
import { EditorState, convertFromRaw } from "draft-js";

import createImagePlugin, { ImageEditorPlugin } from "./CustomImagePlugin";
import { EditorPlugin } from "@draft-js-plugins/editor";

const imagePlugin = createImagePlugin();

export interface EditorStateInterface {
  editorState: EditorState;
  setEditorState: (prop: EditorState) => void;
  imagePlugin?: ImageEditorPlugin;
  plugins?: EditorPlugin[];
}

const emptyContentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      text: "",
      depth: 0,
      inlineStyleRanges: [],
      key: "foo",
      type: "unstyled",
      entityRanges: [],
    },
  ],
});

const EditorContext =
  React.createContext<EditorStateInterface | undefined>(undefined);

const useProvideEditor = () => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(emptyContentState)
  );

  return {
    editorState,
    setEditorState,
    imagePlugin,
    plugins: [imagePlugin],
  };
};

type ContextProps = HTMLAttributes<HTMLDivElement>;

export const EditorProvider = (props: ContextProps) => {
  const editor = useProvideEditor();
  return <EditorContext.Provider {...props} value={editor} />;
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor() must be within EditorProvider");
  }
  return context;
};
