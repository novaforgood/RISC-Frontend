import React, { useEffect, useRef } from "react";
import ToolBar from "./ToolBar";
import { blockRenderMap } from "./TextStyles";
import { useEditor } from "./EditorContext";
import Editor from "@draft-js-plugins/editor";
import { RichUtils, DraftHandleValue, EditorState } from "draft-js";

import "draft-js/dist/Draft.css";

const TextEditor = () => {
  const { editorState, setEditorState, plugins } = useEditor();
  const editor = useRef<HTMLDivElement | null>(null);
  const forwardRef = useRef<Editor | null>(null);

  const handleKeyCommand = (
    command: string,
    newEditorState: EditorState
  ): DraftHandleValue => {
    console.log(command);
    switch (command) {
      case "backspace":
        let selection = newEditorState.getSelection();
      default:
        let newState = RichUtils.handleKeyCommand(newEditorState, command);

        if (newState) {
          setEditorState(newState);
          return "handled";
        }

        return "not-handled";
    }
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

  // const getToolBar = () => {
  //   return document.getElementById("inline-toolbar");
  // };

  // const moveToolBar = (textBlock: HTMLElement) => {
  //   const toolBarNode = getToolBar();
  //   if (toolBarNode) {
  //     toolBarNode.classList.remove("hidden");
  //     textBlock.appendChild(toolBarNode);
  //   }
  // };

  // useEffect(() => {
  //   const textBlocks = document.querySelectorAll(
  //     "div.public-DraftStyleDefault-block.public-DraftStyleDefault-ltr"
  //   );
  //   for (let i = 0; i < textBlocks.length; i++) {
  //     const textBlock = textBlocks[i] as HTMLElement;
  //     textBlock.onclick = (_) => {
  //       moveToolBar(textBlock);
  //     };
  //   }
  // }, [contentState]);

  // const clickedOutside = (e: MouseEvent) => {
  //   if (!editor.current?.contains(e.target as Node)) {
  //     const toolBarNode = getToolBar();
  //     if (toolBarNode)
  //       if (!toolBarNode.contains(e.target as Node)) {
  //         toolBarNode.classList.add("hidden");
  //       }
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", clickedOutside);
  // }, [editor]);

  /**Receiving the following warning:
   * Expected server HTML to contain a matching <div> in <div>.
   */
  return typeof window !== "undefined" ? (
    <div onClick={focus} ref={editor} className="overflow-scroll">
      <ToolBar />
      <Editor
        editorKey="temp-key"
        plugins={plugins!}
        blockRenderMap={blockRenderMap}
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
        stripPastedStyles={true}
        placeholder="Edit here..."
        ref={forwardRef}
      />
    </div>
  ) : (
    <></>
  );
};
export default TextEditor;
