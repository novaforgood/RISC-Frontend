import { Transition } from "@headlessui/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Text } from "../components/atomic";
import { CircledCheck } from "../components/icons";
import { sleep } from "../utils";

interface SnackbarMessage {
  text: string;
  durationInMs?: number;
}

interface SnackBarContext {
  setSnackbarMessage: (options: SnackbarMessage) => void;
}
export const SnackBarContext = createContext<SnackBarContext | undefined>(
  undefined
);

const DEFAULT_DURATION = 5000;

interface SnackbarProviderProps {
  children: ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [message, setMessage] = useState<SnackbarMessage | null>();
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(async () => {
        setShowing(false);
        await sleep(200);
        setMessage(null);
      }, message.durationInMs || DEFAULT_DURATION);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const setSnackbarMessage = async (msg: SnackbarMessage) => {
    setShowing(false);
    if (message) await sleep(200);
    setShowing(true);
    setMessage(msg);
  };

  const value = { setSnackbarMessage };

  return (
    <SnackBarContext.Provider value={value}>
      {children}

      <div>
        <Transition
          show={showing}
          className="fixed w-full flex justify-center pointer-events-none"
          enter="ease-out duration-200"
          enterFrom="-top-10"
          enterTo="top-0"
          entered="top-0"
          leave="ease-in duration-200"
          leaveFrom="top-0"
          leaveTo="-top-10"
        >
          <div className="bg-success px-3 p-2 border-2 border-success text-white flex gap-2 items-center rounded-md">
            <div className="bg-white rounded-full h-5 w-5">
              <CircledCheck className="h-full w-full" />
            </div>
            <Text b2>{message?.text}</Text>
          </div>
        </Transition>
      </div>
    </SnackBarContext.Provider>
  );
}

export const useSnackbar = () => {
  const context = useContext(SnackBarContext);
  if (context === undefined) {
    throw new Error("useSnackbar() must be within SnackbarProvider");
  }
  return context;
};
