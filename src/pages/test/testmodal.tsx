import React, { useState } from "react";
import { Modal } from "../../components/atomic";

const TestPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <button
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        OPEN MODAL
      </button>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <Modal.Title>Hello</Modal.Title>
        <div className="h-4"></div>
        <button
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          close me
        </button>
      </Modal>
    </div>
  );
};

export default TestPage;
