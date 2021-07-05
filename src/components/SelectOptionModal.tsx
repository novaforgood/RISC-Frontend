import { ReactNode } from "react";
import { Button, Modal, Text } from "./atomic";

export interface SelectOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onPrimaryButtonClick: () => void;
  primaryButtonText: string;
  onSecondaryButtonClick: () => void;
  secondaryButtonText: string;
}
function SelectOptionModal({
  isOpen,
  onClose,
  title,
  children,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  primaryButtonText,
  secondaryButtonText,
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
        <div>{children}</div>
        <div className="h-8"></div>
        <div className="flex">
          <Button
            size="small"
            variant="inverted"
            onClick={onSecondaryButtonClick}
          >
            {secondaryButtonText}
          </Button>
          <div className="w-2"></div>
          <Button size="small" onClick={onPrimaryButtonClick}>
            {primaryButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default SelectOptionModal;
