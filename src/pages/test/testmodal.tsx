import React, { useState } from "react";
import { Modal } from "../../components/atomic";

const TestPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <button
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        OPEN MODAL
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <Modal.Title>Hello</Modal.Title>
        <div className="h-4"></div>
        <button
          onClick={() => {
            setIsSecondModalOpen(true);
          }}
        >
          open anotha one
        </button>
        <div className="h-4"></div>
        <button
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          close me
        </button>
        <Modal
          isOpen={isSecondModalOpen}
          onClose={() => {
            setIsSecondModalOpen(false);
          }}
        >
          <button
            onClick={() => {
              setIsSecondModalOpen(false);
            }}
          >
            close me
          </button>
        </Modal>
      </Modal>
    </div>
  );
};

export default TestPage;
