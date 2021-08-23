import React from "react";
import { Modal, Text } from "../atomic";

type OnboardingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-144 space-y-4">
        <Text h1 b>
          Let's get started with Mentor Center!
        </Text>
      </div>
    </Modal>
  );
};

export default OnboardingModal;
