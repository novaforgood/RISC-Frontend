import { Button } from "../atomic";
import { useEditor } from "./EditorContext";
import { useUpdateProgramMutation } from "../../generated/graphql";
import { HTMLAttributes, useState } from "react";

type PublishButtonProps = HTMLAttributes<HTMLButtonElement> & {
  programId: string;
};

//TODO: Error notice when content fails to publish
const PublishButton = ({ programId, ...props }: PublishButtonProps) => {
  const { getStringContentState, setPublishedContent, disablePublish } =
    useEditor();
  const [updateProgram] = useUpdateProgramMutation();
  const [publishing, setPublishing] = useState(false);

  const save = () => {
    //TODO: Convert locally-hosted images to server-hosted images
    setPublishing(true);
    const contentState = getStringContentState!();
    setPublishedContent!();
    updateProgram({
      variables: { data: { homepage: contentState }, programId },
    })
      .then(() => {
        setPublishing(false);
      })
      .catch((err) => {
        console.log("Fail: ", err);
        setPublishing(false);
      });
  };

  return (
    <Button disabled={disablePublish! || publishing} onClick={save} {...props}>
      Publish
    </Button>
  );
};

export default PublishButton;
