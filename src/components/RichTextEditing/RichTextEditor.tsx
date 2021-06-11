import React, { RefObject, useEffect, useRef } from "react";
import { blockRenderMap } from "./TextStyles";
import { useEditor } from "./EditorContext";
import Editor from "@draft-js-plugins/editor";
import { RichUtils, DraftHandleValue, EditorState } from "draft-js";

import "draft-js/dist/Draft.css";

const TextEditor = () => {
  const { editorState, setEditorState, plugins } = useEditor();
  const editor = useRef<HTMLDivElement | null>(null);
  let forwardRef = useRef<HTMLDivElement>(null);

  const handleKeyCommand = (
    command: string,
    newEditorState: EditorState
  ): DraftHandleValue => {
    // console.log(command);
    // switch (command) {
    //   case "backspace":
    //     let selection = newEditorState.getSelection();
    //   default:
    let newState = RichUtils.handleKeyCommand(newEditorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
    // }
  };

  let contentState = editorState.getCurrentContent();

  const focus = () => {
    if (forwardRef.current) forwardRef.current.focus();
  };

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

  /**Receiving the following warning:
   * Expected server HTML to contain a matching <div> in <div>.
   */
  return (
    <div
      onClick={focus}
      ref={editor}
      className="max-h-3/4 box-border flex-grow m-1.5"
    >
      <Editor
        editorKey="temp-key" //Necessary to prevent server from rendering a separate editor
        plugins={plugins!}
        blockRenderMap={blockRenderMap}
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
        stripPastedStyles={true}
        placeholder="Edit here..."
        ref={(el: RefObject<any>) => {
          forwardRef = el;
        }}
      />
    </div>
  );
};
export default TextEditor;
