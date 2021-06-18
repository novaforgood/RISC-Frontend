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
import { useUploadImageWithoutResizingMutation } from "../../generated/graphql";

const imagePlugin = createImagePlugin();

export interface EditorStateInterface {
  editorState: EditorState;
  setEditorState: (prop: EditorState) => void;
  uploadImagesAndPublishContent?: () => Promise<string>;
  disablePublish?: boolean;
  imagePlugin?: ImageEditorPlugin;
  plugins?: EditorPlugin[];
}

export const defaultContentState: RawDraftContentState = {
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
  entityMap: {},
};

const EditorContext =
  React.createContext<EditorStateInterface | undefined>(undefined);

//Works with publish only- will need to change for autosave
const useProvideEditor = (storedState = defaultContentState) => {
  const [uploadImageWithoutResizing] = useUploadImageWithoutResizingMutation();
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(storedState))
  );
  const [publishedContent, setPublishedContent] = useState(
    convertToRaw(editorState.getCurrentContent())
  );
  return {
    editorState,
    setEditorState,
    uploadImagesAndPublishContent: async () => {
      const contentState = editorState.getCurrentContent();
      for (const block of convertToRaw(contentState).blocks) {
        //if the block is an image, upload image and host
        if (block.type == "atomic") {
          console.log(block);
          let photoUrl = await uploadImageWithoutResizing({
            variables: {
              file: block.data!.file,
            },
          });
          contentState.mergeEntityData(block.key, { src: photoUrl });
        }
      }
      //contentState now has different properties
      setPublishedContent(convertToRaw(contentState));
      return JSON.stringify(contentState);
    },
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
