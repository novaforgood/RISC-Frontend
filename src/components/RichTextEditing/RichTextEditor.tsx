import React, { useState, useEffect } from "react";
import ToolBar from "./ToolBar";
import { myBlockRenderer } from "./TextStyles";
import Editor from "@draft-js-plugins/editor";
import {
  EditorState,
  convertFromRaw,
  RichUtils,
  DraftHandleValue,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "@draft-js-plugins/image/lib/plugin.css";

//NextJS server & client side renders so it's necessary to create an empty content state outside of the exported component
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

//TO-DO: CREATE EDITOR CONTEXT so that it doesn't need to be sent into every child as a prop

const TextEditor = () => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(emptyContentState)
  );

  const handleKeyCommand = (command: string): DraftHandleValue => {
    var newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  let contentState = editorState.getCurrentContent();

  useEffect(() => {
    if (!contentState.hasText()) {
      const placeholder = document.getElementsByClassName(
        "public-DraftEditorPlaceholder-inner"
      );
      switch (contentState.getFirstBlock().getType()) {
        case "header-one":
          for (let i = 0; i < placeholder.length; i++) {
            placeholder[i].classList.remove("text-h2");
            placeholder[i].classList.add("text-h1");
          }
          break;
        case "header-two":
          for (let i = 0; i < placeholder.length; i++) {
            placeholder[i].classList.remove("text-h1");
            placeholder[i].classList.add("text-h2");
          }
          break;
        default:
          for (let i = 0; i < placeholder.length; i++) {
            placeholder[i].classList.remove("text-h1");
            placeholder[i].classList.remove("text-h2");
          }
          break;
      }
    }
  }, [contentState.getFirstBlock()]);

  return (
    <div>
      <ToolBar editorState={editorState} setEditorState={setEditorState} />
      <Editor
        blockRenderMap={myBlockRenderer}
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
        placeholder="Edit here..."
      />
    </div>
  );
};

export default TextEditor;
