import React, { useState, useContext, HTMLAttributes, useEffect } from "react";
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
  uploadImagesAndGetHomepage?: () => Promise<string>;
  publishable?: boolean;
  setPublishable?: (bool: boolean) => void;
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

const EditorContext = React.createContext<EditorStateInterface | undefined>(
  undefined
);

//Works with publish only- will need to change for autosave
const useProvideEditor = (storedState = defaultContentState) => {
  const [uploadImageWithoutResizing] = useUploadImageWithoutResizingMutation();
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(storedState))
  );
  const [publishable, setPublishable] = useState(false);

  useEffect(() => {
    setEditorState(EditorState.createWithContent(convertFromRaw(storedState)));
  }, [storedState]);

  return {
    editorState,
    setEditorState,
    uploadImagesAndGetHomepage: async () => {
      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);
      const entityKeys = Object.keys(rawContentState.entityMap);
      for (const key of entityKeys) {
        const entityData = rawContentState.entityMap[key].data;
        console.log(entityData);
        if (entityData.file) {
          let photoUrl = await uploadImageWithoutResizing({
            variables: {
              file: entityData.file,
            },
          });
          delete entityData.file;

          contentState.replaceEntityData(entityData.entityKey, {
            ...entityData,
            src: photoUrl.data?.uploadImage,
          });
        }
      }

      //contentState now has different properties
      const newRawContentState = convertToRaw(contentState);
      return JSON.stringify(newRawContentState);
    },
    publishable,
    setPublishable,
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
