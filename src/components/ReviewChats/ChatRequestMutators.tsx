import { Fragment, useState } from "react";
import { useCancelChatRequestMutation } from "../../generated/graphql";
import { Button, Input, Modal, Text } from "../atomic";
import CatchUnsavedChangesModal from "../CatchUnsavedChangesModal";
import SelectOptionModal from "../SelectOptionModal";

type ChatMutatorsProps = {
  chatRequestId: string;
  chatCanceled: boolean;
};

const ChatMutators = ({ chatRequestId, chatCanceled }: ChatMutatorsProps) => {
  const [clicked, setClicked] = useState(false);
  const [action, setAction] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [modified, setModified] = useState(false);
  const [cancelChatRequestMutation] = useCancelChatRequestMutation();

  console.log(chatCanceled);
  return (
    <Fragment>
      {/* This catch is super incomplete bc it doesn't prevent users from closing the modal mid-editting */}
      <CatchUnsavedChangesModal unsavedChangesExist={modified === true} />
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
        title={`What is your reason for ${action}ing?`}
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
            setModified(true);
            setCancelReason(e.target.value);
          }}
          className="w-full"
        />
      </SelectOptionModal>
      {/* This is the vanilla Modal that I made before I knew of the SelectOptionModal */}
      {/* <Modal
        isOpen={clicked}
        onClose={() => {
          setClicked(false);
          setAction("");
        }}
      >
        <div className="p-2 flex flex-col space-y-2 box-border">
          <Text b>What is your reason for {action}ing?</Text>
          <Input
            placeholder={"Reason for " + action + "ing (optional)"}
            onChange={(e) => {
              setModified(true);
              setCancelReason(e.target.value);
            }}
            className=""
          />
          <div className="space-x-4">
            <Button
              variant="inverted"
              size="small"
              onClick={() => {
                if (action === "cancel")
                  cancelChatRequestMutation({
                    variables: {
                      chatRequestId: chatRequestId,
                      chatCancelMessage: cancelReason,
                    },
                  }); //Cancel query
                if (action === "reschedule")
                  console.log("Reschedule not ready yet"); //Reschedule query
                setClicked(false);
              }}
            >
              Submit
            </Button>
            <Button
              variant="solid"
              size="small"
              onClick={() => {
                setClicked(false);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal> */}
    </Fragment>
  );
};

export default ChatMutators;
