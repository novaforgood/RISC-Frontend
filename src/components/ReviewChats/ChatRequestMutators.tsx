import { Fragment, useState } from "react";
import { useCancelChatRequestMutation } from "../../generated/graphql";
import { Input, Text } from "../atomic";
import SelectOptionModal from "../SelectOptionModal";

type ChatMutatorsProps = {
  chatRequestId: string;
  chatCanceled: boolean;
};

/**
 * @summary buttons for canceling and (coming soon) rescheduling chats
 */
const ModifyChatRequestModal = ({
  chatRequestId,
  chatCanceled,
}: ChatMutatorsProps) => {
  const [clicked, setClicked] = useState(false);
  const [action, setAction] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelChatRequestMutation] = useCancelChatRequestMutation({
    refetchQueries: ["getChatRequests"],
  });

  return (
    <Fragment>
      {/* This catch is super incomplete bc it doesn't prevent users from closing the modal mid-editting */}
      {!chatCanceled && (
        <button
          onClick={() => {
            setClicked(true);
            setAction("cancel");
          }}
        >
          <Text error u>
            Cancel
          </Text>
        </button>
      )}
      <SelectOptionModal
        isOpen={clicked}
        onClose={() => {
          setClicked(false);
          setAction("");
        }}
        title={`Let the mentor know your reason for ${action}ing`}
        onPrimaryButtonClick={() => {
          if (action === "cancel")
            cancelChatRequestMutation({
              variables: {
                chatRequestId: chatRequestId,
                chatCancelMessage: cancelReason,
              },
            }); //Cancel query
          if (action === "reschedule") console.log("Reschedule not ready yet"); //Reschedule query
          setClicked(false);
        }}
        onSecondaryButtonClick={() => {
          setClicked(false);
        }}
        primaryButtonText="Submit"
        secondaryButtonText="Close"
      >
        <Input
          placeholder={"Reason for " + action + "ing (optional)"}
          onChange={(e) => {
            setCancelReason(e.target.value);
          }}
          className="w-full"
        />
      </SelectOptionModal>
    </Fragment>
  );
};

export default ModifyChatRequestModal;
