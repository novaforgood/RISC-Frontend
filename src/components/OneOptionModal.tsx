import { ReactNode } from "react";
import { Button, Modal, Text } from "./atomic";

export interface SelectOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onButtonClick: () => void;
  buttonText: string;
}
function OneOptionModal({
  isOpen,
  onClose,
  title,
  children,
  onButtonClick,
  buttonText,
}: SelectOptionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center max-w-xl">
        <div className="h-2"></div>
        <div>
          <Text h3 b>
            {title}
          </Text>
        </div>
        <div className="h-2"></div>
        {children}
        <div className="h-8"></div>
        <Button size="small" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
}

export default OneOptionModal;
