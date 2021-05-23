import React from "react";
import { Text } from "../atomic";
import Immutable from "immutable";

export const INLINE_STYLES = [
  {
    display: <b>B</b>,
    style: "BOLD",
  },
  {
    display: <i>I</i>,
    style: "ITALIC",
  },
  {
    display: <u>U</u>,
    style: "UNDERLINE",
  },
  //   {
  //     display: <p style={{ textDecoration: "line-through" }}>S</p>,
  //     style: "STRIKETHROUGH",
  //   },
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

export const myBlockRenderer = Immutable.Map({
  "header-one": {
    element: "section",
    wrapper: <Text h1 />,
  },
  "header-two": {
    element: "section",
    wrapper: <Text h2 />,
  },
  unstyled: {
    element: "div",
  },
});
