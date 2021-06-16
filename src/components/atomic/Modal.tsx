import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";
import React, {
  Fragment,
  HTMLAttributes,
  MutableRefObject,
  ReactNode,
} from "react";
type ModalProps = HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  initialFocus?: MutableRefObject<HTMLElement | null>;
  backgroundColor?: string | undefined;
};

const Modal = ({
  children,
  isOpen,
  onClose = () => {},
  initialFocus,
  backgroundColor,
}: ModalProps) => {
  const overlayStyles = classNames({
    "fixed inset-0 bg-black": true,
    "opacity-20": isOpen,
  });
  return (
    <Fragment>
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={onClose}
          initialFocus={initialFocus}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="transition-opacity duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-10"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-10"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className={overlayStyles} />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={`inline-block p-6 my-8 overflow-hidden
                text-left align-middle transform bg-${
                  backgroundColor || "white"
                } shadow-xl rounded-2xl`}
              >
                {children}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  );
};

type ModalTitleProps = HTMLAttributes<HTMLDivElement>;
Modal.Title = ({ children }: ModalTitleProps) => {
  return <Dialog.Title>{children}</Dialog.Title>;
};

type ModalDescriptionProps = HTMLAttributes<HTMLDivElement>;
Modal.Description = ({ children }: ModalDescriptionProps) => {
  return <Dialog.Description>{children}</Dialog.Description>;
};

export default Modal;
