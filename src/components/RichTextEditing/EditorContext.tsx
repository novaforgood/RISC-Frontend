import React, { useState, useContext, HTMLAttributes } from "react";
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  RawDraftContentState,
} from "draft-js";
import _ from "lodash";

import createImagePlugin, { ImageEditorPlugin } from "./CustomImagePlugin";
import { EditorPlugin } from "@draft-js-plugins/editor";

const imagePlugin = createImagePlugin();

export interface EditorStateInterface {
  editorState: EditorState;
  setEditorState: (prop: EditorState) => void;
  getStringContentState?: () => string;
  setPublishedContent?: () => void;
  disablePublish?: boolean;
  imagePlugin?: ImageEditorPlugin;
  plugins?: EditorPlugin[];
}

export const defaultContentState: RawDraftContentState = {
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
};

const EditorContext =
  React.createContext<EditorStateInterface | undefined>(undefined);

//Works with publish only- will need to change for autosave
const useProvideEditor = (storedState = defaultContentState) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(storedState))
  );
  const [publishedContent, setPublishedContent] = useState(storedState);

  const getStringContentState = () => {
    return JSON.stringify(convertToRaw(editorState.getCurrentContent()));
  };

  return {
    editorState,
    setEditorState,
    getStringContentState,
    setPublishedContent: () =>
      setPublishedContent(convertToRaw(editorState.getCurrentContent())),
    disablePublish: _.isEqual(
      convertToRaw(editorState.getCurrentContent()),
      publishedContent
    ),
    imagePlugin,
    plugins: [imagePlugin],
  };
};

type ContextProps = HTMLAttributes<HTMLDivElement> & {
  currentHomepage?: RawDraftContentState;
};

export const EditorProvider = ({
  currentHomepage = undefined,
  ...props
}: ContextProps) => {
  const editor = useProvideEditor(currentHomepage);
  return <EditorContext.Provider {...props} value={editor} />;
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor() must be within EditorProvider");
  }
  return context;
};
