import Immutable from "immutable";
import { Text } from "../atomic";
import React from "react";

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

export const blockRenderMap = Immutable.Map({
  "header-one": {
    element: "div",
    wrapper: <Text h1 />,
  },
  "header-two": {
    element: "div",
    wrapper: <Text h2 />,
  },
  unstyled: {
    element: "div",
    wrapper: <Text b2 />,
  },
});
