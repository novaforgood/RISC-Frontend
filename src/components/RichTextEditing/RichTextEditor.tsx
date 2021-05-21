import React, { HTMLAttributes, useState, useRef } from "react";
import classNames from "classnames";

import Immutable from "immutable";
import Draft, {
  Editor,
  EditorState,
  convertFromRaw,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  DraftHandleValue,
  EditorProps,
  ContentBlock,
} from "draft-js";
import "draft-js/dist/Draft.css";

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

const INLINE_STYLES = [
  {
    display: <b>B</b>,
    style: "BOLD",
  },
  {
    display: <i>I</i>,
    style: "ITALIC",
  },

  {
    display: <u>U</u>,
    style: "UNDERLINE",
  },

  //   {
  //     display: <p style={{ textDecoration: "line-through" }}>S</p>,
  //     style: "STRIKETHROUGH",
  //   },
];
const BLOCK_STYLES = [
  {
    display: "Heading One",
    type: "header-one",
  },

  {
    display: "Heading Two",
    type: "header-two",
  },
];

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

const TextEditor = () => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(emptyContentState)
  );
  const editor = useRef<Editor | null>(null);

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

  const ToggleStyleButton = ({
    display,
    type,
    className,
    ...props
  }: HTMLAttributes<HTMLDivElement> & {
    display: JSX.Element;
    type: string;
  }) => {
    const styles = classNames({
      "hover:bg-gray-light rounded-sm cursor-pointer w-6 h-6": true,
      "bg-gray-light": editorState.getCurrentInlineStyle().has(type),
      [`${className}`]: true,
    });
    return (
      <div
        {...props}
        className={styles}
        onMouseDown={(e) => {
          e.preventDefault();

          setEditorState(RichUtils.toggleInlineStyle(editorState, type));
        }}
      >
        {display}
      </div>
    );
  };

  const ToggleBlockButton = ({
    display,
    type,
    className,
    ...props
  }: HTMLAttributes<HTMLDivElement> & {
    display: string;
    type: string;
  }) => {
    const selection = editorState.getSelection();
    const styles = classNames({
      "hover:bg-gray-light rounded-sm cursor-pointer p-1": true,
      "bg-gray-light":
        editorState
          .getCurrentContent()
          .getBlockForKey(selection.getStartKey())
          .getType() === type,
      [`${className}`]: true,
    });
    return (
      <div
        {...props}
        className={styles}
        onMouseDown={(e) => {
          e.preventDefault();
          console.log(editorState.getCurrentContent());
          setEditorState(RichUtils.toggleBlockType(editorState, type));
        }}
      >
        <p>{display}</p>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-around text-center">
        {INLINE_STYLES.map((option) => (
          <ToggleStyleButton
            key={option.style}
            display={option.display}
            type={option.style}
          />
        ))}
        {BLOCK_STYLES.map((option) => (
          <ToggleBlockButton
            key={option.type}
            display={option.display}
            type={option.type}
          />
        ))}
      </div>
      <Editor
        blockRenderMap={extendedBlockRendererMap}
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
        placeholder="Edit here..."
        ref={editor}
      />
    </div>
  );
};

/* ====================================================================================================================== */
//  Style Control
/* ====================================================================================================================== */

/* ====================================================================================================================== */
//  Block Control
/* ====================================================================================================================== */

export default TextEditor;
