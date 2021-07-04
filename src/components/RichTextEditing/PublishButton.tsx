import { HTMLAttributes, useState } from "react";
import { useUpdateProgramMutation } from "../../generated/graphql";
import { Button } from "../atomic";
import { useEditor } from "./EditorContext";

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
    <Button
      size="small"
      disabled={!publishable || loading}
      onClick={save}
      {...props}
    >
      Publish
    </Button>
  );
};

export default PublishButton;
