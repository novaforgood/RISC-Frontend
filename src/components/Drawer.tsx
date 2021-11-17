import { Transition } from "@headlessui/react";
import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function getAppRoot() {
  if (typeof document === "undefined") return null;
  return document.getElementById("__next");
}

interface DrawerProps {
  isOpen: boolean;
  children: ReactNode;
  widthClassName?: string;
  closedClassName?: string;
  openClassName?: string;
  onRequestClose: () => void;
}
const Drawer = ({
  isOpen = false,
  widthClassName = "w-96",
  closedClassName = "-left-96",
  openClassName = "left-0",
  children,
  onRequestClose,
}: DrawerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current!.contains(event.target as Node)) {
      onRequestClose();
    }
  };
  useEffect(() => {
    window.addEventListener("click", handleClickOutside, false);
    return () => {
      window.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const appRoot = getAppRoot();

  if (!appRoot) return <></>;

  return createPortal(
    <Transition
      show={isOpen}
      className={`fixed h-screen top-0 bg-white shadow-md overflow-y-auto z-10 ${widthClassName} ${closedClassName}`}
      enter="ease-out duration-200"
      enterFrom={closedClassName}
      enterTo={openClassName}
      entered={openClassName}
      leave="ease-in duration-200"
      leaveFrom={openClassName}
      leaveTo={closedClassName}
    >
      <div ref={ref} className="w-full h-full bg-white">
        <div className="w-full h-full bg-white">{children}</div>
      </div>
    </Transition>,
    appRoot
  );
};

export default Drawer;
