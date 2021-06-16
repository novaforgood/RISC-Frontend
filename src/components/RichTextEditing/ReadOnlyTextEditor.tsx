import createImagePlugin from "./CustomImagePlugin";
import Editor from "@draft-js-plugins/editor";
import { convertFromRaw, EditorState, RawDraftContentState } from "draft-js";
import { blockRenderMap } from "./TextStyles";

const imagePlugin = createImagePlugin({ readonly: true });

const ReadOnlyTextEditor = (JSONHomepage: RawDraftContentState) => {
  return (
    <Editor
      readOnly
      editorState={EditorState.createWithContent(convertFromRaw(JSONHomepage))}
      blockRenderMap={blockRenderMap}
      plugins={[imagePlugin]}
      onChange={() => false}
    />
  );
};

export default ReadOnlyTextEditor;
