import Link from "next/link";
import React from "react";
import LocalStorage from "../utils/localstorage";
import { Text } from "./atomic";

export enum ErrorScreenType {
  PageNotFound = "PAGE_NOT_FOUND",
  Unauthenticated = "UNAUTHENTICATED",
  AlreadyInProgram = "ALREADY_IN_PROGRAM",
}

const ERROR_SCREEN_INFO = {
  [ErrorScreenType.PageNotFound]: {
    message: "Page not found.",
  },
  [ErrorScreenType.Unauthenticated]: {
    message: "You're not authenticated.",
  },
  [ErrorScreenType.AlreadyInProgram]: {
    message: "You're already in this program.",
  },
};

interface ErrorScreenProps {
  type: ErrorScreenType;
}

function ErrorScreen({ type }: ErrorScreenProps) {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <img src="/static/DarkTextLogo.svg" />
      <div className="h-8"></div>
      <div>
        <Text>{ERROR_SCREEN_INFO[type].message} </Text>

        <Link href="/">
          <button
            onClick={() => {
              LocalStorage.delete("cachedProfileSlug");
            }}
          >
            <Text u className="cursor-pointer">
              Go back to home.
            </Text>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ErrorScreen;
