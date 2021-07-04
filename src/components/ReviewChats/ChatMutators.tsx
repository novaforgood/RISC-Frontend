import { Fragment, useState } from "react";
import { useCancelChatRequestMutation } from "../../generated/graphql";
import { Button, Input, Modal, Text } from "../atomic";

type ChatMutatorsProps = {
  chatRequestId: string;
  chatCanceled: boolean;
};

const ChatMutators = ({ chatRequestId, chatCanceled }: ChatMutatorsProps) => {
  const [clicked, setClicked] = useState(false);
  const [action, setAction] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelChatRequestMutation] = useCancelChatRequestMutation();

  console.log(chatCanceled);
  return (
    <Fragment>
      {chatCanceled ? (
        <div />
      ) : (
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
      <Modal
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
      </Modal>
    </Fragment>
  );
};

export default ChatMutators;
