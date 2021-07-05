import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Text } from "./atomic";
import SelectOptionModal, { SelectOptionModalProps } from "./SelectOptionModal";

function DefaultModalChildren() {
  return (
    <div>
      <Text>Changes you made may not be saved.</Text>
    </div>
  );
}

interface CatchUnsavedChangesModalProps {
  unsavedChangesExist: boolean;
  onRouteChangePrevented?: (futureURL: string) => void;
}
function CatchUnsavedChangesModal({
  unsavedChangesExist,
  onRouteChangePrevented = () => {},
  title = "Leave page?",
  secondaryButtonText = "Cancel",
  primaryButtonText = "Leave",
  children = <DefaultModalChildren />,
}: Omit<
  Partial<SelectOptionModalProps>,
  "isOpen" | "onSecondaryButtonClick" | "onPrimaryButtonClick" | "onClose"
> &
  CatchUnsavedChangesModalProps) {
  const [open, setOpen] = useState(false);
  const [futureURL, setFutureURL] = useState("");

  const router = useRouter();

  useEffect(() => {
    // https://github.com/vercel/next.js/issues/2476#issuecomment-604679740

    const routeChangeStart = (url: string) => {
      if (router.asPath !== url && unsavedChangesExist === true && !open) {
        router.events.emit("routeChangeError");
        setFutureURL(url);
        setOpen(true);
        onRouteChangePrevented && onRouteChangePrevented(url);
        // Following is a hack-ish solution to abort a Next.js route change
        // as there's currently no official API to do so
        // See https://github.com/zeit/next.js/issues/2476#issuecomment-573460710
        // eslint-disable-next-line no-throw-literal
        throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
      }
    };

    /**
     * Returning a string in this function causes there to be a popup when
     * the user tries to unload the page. We only want the popup to show
     * when there are unsaved changes.
     */
    window.onbeforeunload = () => {
      if (unsavedChangesExist === true) return "Some string";
    };

    router.events.on("routeChangeStart", routeChangeStart);

    return () => {
      router.events.off("routeChangeStart", routeChangeStart);
    };
  }, [
    onRouteChangePrevented,
    router.asPath,
    router.events,
    unsavedChangesExist,
  ]);

  return (
    <SelectOptionModal
      isOpen={open}
      title={title}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      onPrimaryButtonClick={() => {
        router.push(futureURL);
      }}
      onSecondaryButtonClick={() => {
        setOpen(false);
      }}
      onClose={() => {
        setOpen(false);
      }}
    >
      {children}
    </SelectOptionModal>
  );
}

export default CatchUnsavedChangesModal;
