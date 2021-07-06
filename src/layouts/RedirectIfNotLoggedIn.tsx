import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { Button, Modal, Text } from "../components/atomic";
import { useAuth } from "../utils/firebase/auth";

interface RedirectIfNotLoggedInProps {
  pathAfterLoggingIn?: string;
}

const RedirectIfNotLoggedIn: React.FC<RedirectIfNotLoggedInProps> = ({
  children,
  pathAfterLoggingIn,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <Fragment>
      {children}
      <Modal isOpen={!user} onClose={() => {}}>
        <div className="flex flex-col items-center">
          <div>
            <Text h2>You're not logged in.</Text>
          </div>
          <div className="h-8" />
          <div className="flex">
            <Button
              size="small"
              onClick={() => {
                router.push(
                  `/login${
                    pathAfterLoggingIn ? "?to=" + pathAfterLoggingIn : ""
                  }`
                );
              }}
            >
              Log In
            </Button>
            <div className="w-2" />
            <Button
              size="small"
              variant="inverted"
              onClick={() => {
                router.push(
                  `/signup${
                    pathAfterLoggingIn ? "?to=" + pathAfterLoggingIn : ""
                  }`
                );
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};
export default RedirectIfNotLoggedIn;
