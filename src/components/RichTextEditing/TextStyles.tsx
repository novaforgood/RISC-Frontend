import Immutable from "immutable";
import ToolBar from "./ToolBar";
import { Text } from "../atomic";
import React, { HTMLAttributes, useRef, useState } from "react";
import { useEffect } from "react";
import { RefObject } from "react";

export const INLINE_STYLES = [
  {
    display: <Text b>B</Text>,
    style: "BOLD",
  },
  {
    display: <Text i>I</Text>,
    style: "ITALIC",
  },
  {
    display: <Text u>U</Text>,
    style: "UNDERLINE",
  },
];
export const BLOCK_STYLES = [
  {
    display: "Heading One",
    type: "header-one",
  },
  {
    display: "Heading Two",
    type: "header-two",
  },
  {
    display: "Paragraph",
    type: "unstyled",
  },
];

type TextComponentProps = HTMLAttributes<HTMLDivElement> & {
  type: string;
};

type ChildObject = {
  key: string;
  props: {
    children: ChildObject;
    className: string;
    "data-block": boolean;
    "data-editor": string;
    "data-offset-key": string;
  };
  type: string;
};

const TextWrapper = ({ type, ...props }: TextComponentProps) => {
  switch (type) {
    case "header-one":
      return <Text h1 {...props} />;
    case "header-two":
      return <Text h2 {...props} />;
    default:
      return <Text b2 {...props} />;
  }
};

const TextComponent = ({ type, children, ...props }: TextComponentProps) => {
  // const [focus, setFocus] = useState(false);
  // const blockRef = useRef<HTMLDivElement | null>(null);

  // const clickedOutside = (e: MouseEvent) => {
  //   if (!blockRef.current?.contains(e.target as Node)) {
  //     setFocus(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", clickedOutside);
  // }, [blockRef]);

  return (
    <div /*ref={blockRef}*/>
      {/* {focus ? <ToolBar /> : <></>} */}
      <TextWrapper
        // onClick={() => {
        //   setFocus(true);
        // }}
        type={type}
        {...props}
      >
        {children ? children : "Type to add text"}
      </TextWrapper>
    </div>
  );
};

export const blockRenderMap = Immutable.Map({
  "header-one": {
    element: "div",
    wrapper: <TextComponent type={"header-one"} />,
  },
  "header-two": {
    element: "div",
    wrapper: <TextComponent type={"header-two"} />,
  },
  unstyled: {
    element: "div",
    wrapper: <TextComponent type={"unstyled"} />,
  },
});
