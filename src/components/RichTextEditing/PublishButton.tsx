import { Button } from "../atomic";
import { useEditor } from "./EditorContext";

const PublishButton = () => {
  const { getStringEditorState } = useEditor();

  const save = () => {
    const editorState = getStringEditorState!();
  };
  return <Button onClick={save}>Publish</Button>;
};

export default PublishButton;
