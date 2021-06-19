import { Button } from "../atomic";
import { useEditor } from "./EditorContext";
import { useUpdateProgramMutation } from "../../generated/graphql";
import { HTMLAttributes, useState } from "react";

type PublishButtonProps = HTMLAttributes<HTMLButtonElement> & {
  programId: string;
};

//TODO: Error notice when content fails to publish
const PublishButton = ({ programId, ...props }: PublishButtonProps) => {
  const { uploadImagesAndGetHomepage, publishable, setPublishable } =
    useEditor();
  const [updateProgram] = useUpdateProgramMutation();
  const [loading, setLoading] = useState(false);

  const save = async () => {
    //TODO: Convert locally-hosted images to server-hosted images
    setLoading(true);
    const contentState = await uploadImagesAndGetHomepage!();
    updateProgram({
      variables: { data: { homepage: contentState }, programId },
    })
      .then(() => {
        setLoading(false);
        setPublishable!(false);
      })
      .catch((err) => {
        console.log("Fail: ", err);
        setLoading(false);
      });
  };

  return (
    <Button disabled={!publishable || loading} onClick={save} {...props}>
      Publish
    </Button>
  );
};

export default PublishButton;
