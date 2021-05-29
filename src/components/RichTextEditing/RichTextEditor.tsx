import React, { useEffect } from "react";
import ToolBar from "./ToolBar";
import { Text } from "../atomic";
import Immutable from "immutable";
import { useEditor } from "./EditorContext";
import Editor from "@draft-js-plugins/editor";
import Draft, { RichUtils, DraftHandleValue } from "draft-js";
// import createAlignmentPlugin from "@draft-js-plugins/alignment";
// import createBlockDndPlugin from "@draft-js-plugins/drag-n-drop";
// import createDragNDropUploadPlugin from "@draft-js-plugins/drag-n-drop-upload";
import "draft-js/dist/Draft.css";
import "@draft-js-plugins/image/lib/plugin.css";
import { useRef } from "react";

export const myBlockRenderer = Immutable.Map({
  "header-one": {
    element: "div",
    wrapper: <Text h1 b />,
  },
  "header-two": {
    element: "div",
    wrapper: <Text h2 b />,
  },
  unstyled: {
    element: "div",
  },
});
//TO-DO: CREATE EDITOR CONTEXT so that it doesn't need to be sent into every child as a prop

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

// const resizeablePlugin = createResizeablePlugin({});
// const blockDndPlugin = createBlockDndPlugin();
// const alignmentPlugin = createAlignmentPlugin();
// const { AlignmentTool } = alignmentPlugin;
// const decorator = composeDecorators(
//   resizeablePlugin.decorator
//   // alignmentPlugin.decorator,
//   // blockDndPlugin.decorator
// );

const extendedBlockRenderMap =
  Draft.DefaultDraftBlockRenderMap.merge(myBlockRenderer);

const TextEditor = () => {
  const { editorState, setEditorState, plugins } = useEditor();
  let editor = useRef<Editor>(null);
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
        blockRenderMap={extendedBlockRenderMap}
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
