import React, { useEffect, useRef } from "react";
import ToolBar from "./ToolBar";
import { blockRenderMap } from "./TextStyles";
import { useEditor } from "./EditorContext";
import Editor from "@draft-js-plugins/editor";
import { RichUtils, DraftHandleValue } from "draft-js";

import "draft-js/dist/Draft.css";
import ReactDOM from "react-dom";

const TextEditor = () => {
  const { editorState, setEditorState, imagePlugin, plugins } = useEditor();
  const editor = useRef<HTMLDivElement | null>(null);
  const forwardRef = useRef<Editor | null>(null);
  const handleKeyCommand = (command: string): DraftHandleValue => {
    var newState = RichUtils.handleKeyCommand(editorState, command);

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

  const getToolBar = () => {
    const toolBarNode = document.getElementById("inline-toolbar");
    if (toolBarNode) {
      return toolBarNode;
    } else {
      const newToolBarNode = document.createElement("div");
      newToolBarNode.setAttribute("id", "inline-toolbar");
      editor.current?.appendChild(newToolBarNode);
      return newToolBarNode;
    }
  };

  useEffect(() => {
    const textBlocks = document.querySelectorAll(
      "#__next > div > div > div > div > div > div > span > div"
    );
    for (let i = 0; i < textBlocks.length; i++) {
      const textBlock = textBlocks[i] as HTMLElement;
      textBlock.onclick = () => {
        const toolBarNode = getToolBar();
        textBlock.parentNode?.insertBefore(toolBarNode, textBlock);

        ReactDOM.render(
          <ToolBar
            editorState={editorState}
            setEditorState={setEditorState}
            imagePlugin={imagePlugin}
          />,
          document.getElementById("inline-toolbar")
        );
      };
      textBlock.onfocus = () => {
        console.log("focus");
      };
      textBlock.onkeypress = () => {
        console.log("key pressed");
      };
    }
  }, [contentState]);

  const clickedOutside = (e: MouseEvent) => {
    if (!editor.current?.contains(e.target as Node)) {
      const toolBarNode = getToolBar();
      if (!toolBarNode.contains(e.target as Node)) {
        toolBarNode.remove();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", clickedOutside);
  }, [editor]);

  /**Receiving the following warning:
   * Expected server HTML to contain a matching <div> in <div>.
   */
  return typeof window !== "undefined" ? (
    <div onClick={focus} ref={editor}>
      <div id="inline-toolbar" />
      <Editor
        plugins={plugins}
        blockRenderMap={blockRenderMap}
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
        placeholder="Edit here..."
        ref={forwardRef}
      />
    </div>
  ) : (
    <></>
  );
};
export default TextEditor;
