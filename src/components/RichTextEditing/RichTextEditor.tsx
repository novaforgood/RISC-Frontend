import React, { useEffect, useRef } from "react";
import { blockRenderMap } from "./TextStyles";
import { useEditor } from "./EditorContext";
import Editor from "@draft-js-plugins/editor";
import {
  RichUtils,
  DraftHandleValue,
  EditorState,
  // KeyBindingUtil,
  // getDefaultKeyBinding,
} from "draft-js";
import { BlockTypes } from ".";
import "draft-js/dist/Draft.css";

const TextEditor = () => {
  const { editorState, setEditorState, setPublishable, plugins } = useEditor();

  let forwardRef = useRef<any>(null);

  const handleKeyCommand = (
    command: string,
    newEditorState: EditorState
  ): DraftHandleValue => {
    if (command in BlockTypes) {
      setEditorState(RichUtils.toggleBlockType(editorState, command));
      return "handled";
    }
    let newState = RichUtils.handleKeyCommand(newEditorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  //TODO: Keyboard shortcuts for different block types
  // const keyBindingFn = (e: React.KeyboardEvent) => {
  //   if (
  //     e.key === "Digit1" /* `S` key */ &&
  //     KeyBindingUtil.hasCommandModifier(e) /* + `Ctrl` key */
  //   ) {
  //     e.preventDefault();
  //     return BlockTypes["header-one"];
  //   } else if (e.key === "Digit2" && KeyBindingUtil.hasCommandModifier(e)) {
  //     e.preventDefault();
  //     return BlockTypes["header-two"];
  //   }
  //   //else...
  //   return getDefaultKeyBinding(e);
  // };

  let contentState = editorState!.getCurrentContent();

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

  return (
    <div onClick={focus} className="max-h-3/4 box-border flex-grow m-1.5">
      <Editor
        editorKey="temp-key" //Necessary to prevent server from rendering a separate editor
        plugins={plugins!}
        blockRenderMap={blockRenderMap}
        editorState={editorState!}
        // keyBindingFn={keyBindingFn}
        handleKeyCommand={handleKeyCommand}
        preserveSelectionOnBlur={true}
        onChange={(es: EditorState) => {
          if (editorState.getCurrentContent() !== es.getCurrentContent()) {
            setPublishable!(true);
          }
          setEditorState(es);
        }}
        placeholder="Edit here..."
        ref={(el: any) => {
          forwardRef = el;
        }}
      />
    </div>
  );
};

export default TextEditor;
