import React, { useEffect, useRef } from "react";
import ToolBar from "./ToolBar";
import Immutable from "immutable";
import { useEditor } from "./EditorContext";
import Editor from "@draft-js-plugins/editor";
import Draft, { RichUtils, DraftHandleValue } from "draft-js";

import "draft-js/dist/Draft.css";

// const keyBindingFn = (e: React.KeyboardEvent<{}>) => {
//     if(KeyBindingUtil.hasCommandModifier(e) && e.shiftKey) {
//         if(e.key === 'x')
//             return 'strikethrough';
//         if(e.key === '7')
//             return 'ordered-list';
//         if(e.key === '8')
//             return 'unordered-list';
//         if(e.key === '9')
//             return 'blockquote';

//         return getDefaultKeyBinding(e);
//     }
// }
const myBlockRenderer = Immutable.Map({
  "header-one": {
    element: "h1",
  },
  "header-two": {
    element: "h2",
  },
  unstyled: {
    element: "p",
  },
});
const extendedBlockRendererMap =
  Draft.DefaultDraftBlockRenderMap.merge(myBlockRenderer);

// const keyBindingFn = (e: React.KeyboardEvent<{}>) => {
//     if(KeyBindingUtil.hasCommandModifier(e) && e.shiftKey) {
//         if(e.key === 'x')
//             return 'strikethrough';
//         if(e.key === '7')
//             return 'ordered-list';
//         if(e.key === '8')
//             return 'unordered-list';
//         if(e.key === '9')
//             return 'blockquote';

//         return getDefaultKeyBinding(e);
//     }
// }

const TextEditor = () => {
  const { editorState, setEditorState, plugins } = useEditor();
  let editor = useRef<Editor>(null);
  const handleKeyCommand = (command: string): DraftHandleValue => {
    var newState = RichUtils.handleKeyCommand(editorState, command);

    // if(!editorState){
    //     if(command === 'strikethrough'){
    //         newState = RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH');
    //     }
    //     else if (command === 'blockquote'){
    //         newState = RichUtils.toggleBlockType(editorState, 'blockquote');
    //     }
    //     else if (command === 'ordered-list'){
    //         newState = RichUtils.toggleBlockType(editorState, 'ordered-list-item');
    //     }
    //     else if (command === 'unordered-list'){
    //         newState = RichUtils.toggleBlockType(editorState, 'unordered-list-item');
    //     }
    // }
    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  let contentState = editorState.getCurrentContent();
  const focus = () => {
    if (editor.current) editor.current.focus();
  };
  useEffect(() => {
    console.log(editorState);
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

  return typeof window !== "undefined" ? (
    <div onClick={focus}>
      <ToolBar />
      <Editor
        plugins={plugins}
        blockRenderMap={extendedBlockRendererMap}
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
        placeholder="Edit here..."
        ref={editor}
      />
    </div>
  ) : (
    <></>
  );
};
export default TextEditor;
