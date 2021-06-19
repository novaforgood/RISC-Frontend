import { ImgHTMLAttributes } from "react";
import { EditorState, AtomicBlockUtils } from "draft-js";

const AddImage = (
  editorState: EditorState,
  url: string,
  extraData: ImgHTMLAttributes<HTMLImageElement>
): EditorState => {
  const urlType = "IMAGE";
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    urlType,
    "IMMUTABLE",
    { src: url, ...extraData }
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    " "
  );

  // newEditorState.getCurrentContent().mergeEntityData(entityKey, { entityKey });

  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter()
  );
};

export default AddImage;
